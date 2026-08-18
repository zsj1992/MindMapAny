import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getSubscriptionInfo, markCanceling } from '@/lib/db/repositories/billing';
import { cancelWaffoSubscription } from '@/lib/billing/waffo';

export const runtime = 'nodejs';

/**
 * 用户自助取消订阅。
 *
 * 之前完全没有这条路：/billing 页写着「打开 Creem 客户门户」，而收钱的
 * 已经换成了 Waffo —— 在 Waffo 付费的人没有任何办法退订。能付钱不能退，
 * 是拒付和投诉的头号来源，也过不了支付渠道自己的风控要求。
 *
 * 订单号只从会话对应的档案里取，不接受请求体传入 —— 否则任何登录用户
 * 都能把别人的订阅取消掉。
 */
export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: { code: 'unauthorized' } }, { status: 401 });

  const info = await getSubscriptionInfo(user.id);
  if (!info || info.plan === 'free') {
    return NextResponse.json({ error: { code: 'no_subscription' } }, { status: 400 });
  }
  if (info.status === 'subscription.canceling') {
    // 重复点击不该报错：结果已经是他要的那个了
    return NextResponse.json({ ok: true, status: 'canceling', alreadyCanceling: true });
  }
  if (!info.subscriptionId) {
    console.error('[billing] cancel_without_order_id', { userId: user.id, plan: info.plan });
    return NextResponse.json({ error: { code: 'contact_support' } }, { status: 409 });
  }

  const outcome = await cancelWaffoSubscription(info.subscriptionId);
  if (!outcome) {
    // 可能是 Creem 时代的订阅号，也可能是 Waffo 接口临时故障。
    // 两种都只能转人工，但绝不能骗用户说已经取消了。
    console.error('[billing] cancel_unresolved', { userId: user.id, orderId: info.subscriptionId });
    return NextResponse.json({ error: { code: 'contact_support' } }, { status: 502 });
  }

  // 记状态但不降级：这个计费周期他已经付过钱了，服务要用到期末。
  // 真正改回 free 的是周期结束时那条 subscription.canceled 事件。
  await markCanceling(user.id);
  console.info('[billing] subscription_canceled_by_user', { userId: user.id, orderId: info.subscriptionId, outcome });
  return NextResponse.json({ ok: true, status: outcome });
}
