import { toNextJsHandler } from 'better-auth/next-js';
import { getAuth } from '@/lib/auth/server';
import { rateLimitRequest } from '@/lib/rate-limit';

export const runtime = 'nodejs';

/**
 * Better Auth 的全部端点（OAuth 跳转、回调、session、登出）都挂在这里。
 * 实例必须在请求内创建 —— D1 binding 只在请求上下文里存在。
 */

/**
 * 按端点限流。Better Auth 自带的限流是内存计数，在 Workers 上每个 isolate 一份，
 * 等于没有；这里用项目已有的 D1 计数器，跨 isolate 才真的生效。
 *
 * 只卡注册和登录两条写路径：session 校验、OAuth 回调这些是正常高频调用，
 * 一并限流会把登录态刷没。
 */
const LIMITS: { match: (path: string) => boolean; scope: string; limit: number; windowSeconds: number }[] = [
  // 注册：真人一天注册不了几个号，脚本一分钟能刷几百个。这是免费额度被薅的主要入口。
  { match: (p) => p.endsWith('/sign-up/email'), scope: 'auth:signup:hour', limit: 5, windowSeconds: 3600 },
  { match: (p) => p.endsWith('/sign-up/email'), scope: 'auth:signup:day', limit: 15, windowSeconds: 86_400 },
  // 登录：防在线撞库。10 分钟 10 次对忘记密码的真人够用，对枚举密码远远不够。
  { match: (p) => p.endsWith('/sign-in/email'), scope: 'auth:signin', limit: 10, windowSeconds: 600 },
  // 发重置邮件：既防刷邮件配额，也防拿它当发信轰炸别人的工具。
  { match: (p) => p.endsWith('/request-password-reset') || p.endsWith('/forget-password'), scope: 'auth:reset', limit: 5, windowSeconds: 3600 },
];

async function enforceLimits(req: Request): Promise<Response | null> {
  const path = new URL(req.url).pathname;
  for (const rule of LIMITS) {
    if (!rule.match(path)) continue;
    const result = await rateLimitRequest(req, {
      scope: rule.scope,
      limit: rule.limit,
      windowSeconds: rule.windowSeconds,
    });
    if (!result.allowed) {
      const retryAfter = Math.max(1, result.resetAt - Math.floor(Date.now() / 1000));
      return Response.json(
        { message: 'Too many attempts. Please try again later.', code: 'RATE_LIMITED' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      );
    }
  }
  return null;
}

export async function GET(req: Request) {
  return toNextJsHandler(getAuth()).GET(req);
}

export async function POST(req: Request) {
  const limited = await enforceLimits(req);
  if (limited) return limited;
  return toNextJsHandler(getAuth()).POST(req);
}
