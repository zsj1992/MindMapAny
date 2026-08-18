import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getSubscriptionInfo } from '@/lib/db/repositories/billing';

export const runtime = 'nodejs';

/**
 * 订阅管理页要的状态。和 /api/account 分开：那个是「我是谁、还剩多少积分」，
 * 到处都在用；这个只服务管理页，会带上订单相关的字段。
 *
 * 订单号本身不外发 —— 页面上没有任何地方需要显示它，而取消接口是从会话
 * 反查的，前端根本不需要知道。少发一个标识就少一处可以被拿去试探的东西。
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ signedIn: false }, { headers: { 'cache-control': 'no-store' } });
  }
  const info = await getSubscriptionInfo(user.id);
  return NextResponse.json(
    {
      signedIn: true,
      plan: info?.plan ?? 'free',
      // canceling = 已申请取消、服务用到期末；这是页面上唯一需要特殊措辞的状态
      canceling: info?.status === 'subscription.canceling',
      hasOrder: Boolean(info?.subscriptionId),
      since: info?.planUpdatedAt ?? null,
    },
    { headers: { 'cache-control': 'no-store' } },
  );
}
