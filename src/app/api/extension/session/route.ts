import { NextResponse } from 'next/server';
import { getCurrentProfile } from '@/lib/auth/session';
import { PLAN_CREDITS } from '@/lib/credits';

export const runtime = 'nodejs';

/**
 * 插件用来判断「用户登录了没有、还剩多少积分」。
 *
 * 只回显账号自己的信息，不返回任何可用于代替登录的凭据 ——
 * 插件靠浏览器里已有的会话 cookie 调用，拿不到也伪造不了额外权限。
 *
 * 未登录返回 200 而不是 401：这不是一次失败的请求，
 * 「没登录」本身就是插件要显示的一种正常状态。
 */
export async function GET() {
  const session = await getCurrentProfile();
  if (!session?.user || !session.profile) {
    return NextResponse.json({ signedIn: false }, { headers: { 'cache-control': 'no-store' } });
  }
  const { user, profile } = session;
  const unlimited = !Number.isFinite(PLAN_CREDITS[profile.plan]);
  return NextResponse.json(
    {
      signedIn: true,
      name: user.name ?? user.email?.split('@')[0] ?? 'Account',
      plan: profile.plan,
      credits: unlimited ? null : profile.credits,
      creditsMax: unlimited ? null : PLAN_CREDITS[profile.plan],
    },
    { headers: { 'cache-control': 'no-store' } },
  );
}
