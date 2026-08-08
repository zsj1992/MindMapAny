import { toNextJsHandler } from 'better-auth/next-js';
import { getAuth } from '@/lib/auth/server';

export const runtime = 'nodejs';

/**
 * Better Auth 的全部端点（OAuth 跳转、回调、session、登出）都挂在这里。
 * 实例必须在请求内创建 —— D1 binding 只在请求上下文里存在。
 */
export async function GET(req: Request) {
  return toNextJsHandler(getAuth()).GET(req);
}

export async function POST(req: Request) {
  return toNextJsHandler(getAuth()).POST(req);
}
