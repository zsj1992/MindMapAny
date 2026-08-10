import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/session';
import type { Plan } from '@/lib/credits';

/**
 * /app 下每个页面的登录守卫。
 *
 * 为什么放在页面而不是 layout：layout 拿不到当前路径，只能一律跳 /app/new，
 * 从「PDF 转脑图」工具页点进来的人登录后会落到通用页，意图就丢了。
 * 页面自己知道该回哪儿，所以守卫下沉到页面。
 *
 * 本来更适合用 proxy（原 middleware）统一拦，但 Next 16 的 proxy 只能跑
 * Node.js 运行时，而 OpenNext on Cloudflare 不支持 Node.js middleware，
 * 构建直接失败。这是被运行时逼出来的写法，不是偏好。
 *
 * 注意：这只是体验层。真正的鉴权闸门在各 API 路由里 —— 页面守卫挡不住
 * 直接打接口的人。新增 /app 下的页面时记得调用它。
 */
export async function requireUser(next: string): Promise<{
  user: { id: string; name?: string | null; email?: string | null };
  plan: Plan | null;
}> {
  const session = await getCurrentProfile();
  if (!session?.user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return { user: session.user, plan: session.profile?.plan ?? null };
}
