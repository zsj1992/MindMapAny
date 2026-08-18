import { NextResponse } from 'next/server';
import { verifyWebhook } from '@waffo/pancake-ts';
import { claimBillingEvent, grantSubscription, releaseBillingEvent, revokeSubscription } from '@/lib/db/repositories/billing';
import { cancelWaffoSubscription, waffoTestMode } from '@/lib/billing/waffo';
import type { Plan } from '@/lib/credits';

export const runtime = 'nodejs';

/**
 * Waffo Pancake 的支付回调。
 *
 * 和 Creem 那个处理器共用同一套发货逻辑（去重、发放、失败重试），
 * 只是签名验证和事件名不同。发货的正确性已经在 Creem 上被真实事故验证过一轮，
 * 不该为第二个渠道再写一套。
 *
 * 与 Creem 的一个关键差异：那边的 userId 来自用户可编辑的结账 URL，所以必须
 * 用 HMAC 绑定校验。这里的 metadata 是我们在服务端创建会话时传进去、由 Waffo
 * 原样带回来的，用户改不了，签名校验通过就说明整个载荷可信。
 */

const GRANT_EVENTS = new Set(['order.completed', 'subscription.activated', 'subscription.payment_succeeded', 'subscription.uncanceled']);
const REVOKE_EVENTS = new Set(['subscription.canceled', 'subscription.past_due', 'refund.succeeded']);

interface WaffoWebhookEvent {
  id: string;
  eventType: string;
  storeId?: string;
  mode?: 'test' | 'prod';
  data?: {
    orderId?: string;
    buyerEmail?: string;
    productName?: string;
    /**
     * 实际投递里叫 orderMetadata，不是文档写的 metadata。
     * 两个都读：文档和实现哪天对齐了也不会再坏一次。
     */
    orderMetadata?: Record<string, string>;
    metadata?: Record<string, string>;
    orderMerchantExternalId?: string;
    merchantProvidedBuyerIdentity?: string;
  };
  metadata?: Record<string, string>;
}

export async function POST(req: Request) {
  // 必须读原始文本：先 json() 再序列化回去，字节顺序一变签名就对不上
  const rawBody = await req.text();
  const signature = req.headers.get('x-waffo-signature');
  if (!signature) return NextResponse.json({ error: 'missing_signature' }, { status: 401 });

  let event: WaffoWebhookEvent;
  try {
    event = verifyWebhook(rawBody, signature, {
      environment: waffoTestMode() ? 'test' : 'prod',
    }) as unknown as WaffoWebhookEvent;
  } catch {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 });
  }

  if (!event.id || !event.eventType) {
    return NextResponse.json({ error: 'invalid_event' }, { status: 400 });
  }

  /*
   * 测试事件不能碰生产数据。沙箱和生产共用同一个回调地址，只有 mode 能区分，
   * 漏判的话一次测试付款就会真的给某个账号发套餐。
   */
  const expectTest = waffoTestMode();
  if (event.mode && (event.mode === 'test') !== expectTest) {
    console.warn('[billing] waffo_mode_mismatch', { eventId: event.id, mode: event.mode, expectTest });
    return NextResponse.json({ ok: true, ignored: 'mode_mismatch' });
  }

  // 去重表两个渠道共用：事件 id 前缀不同，不会互相碰撞
  if (!(await claimBillingEvent(event.id, event.eventType))) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  try {
    const meta = event.data?.orderMetadata ?? event.data?.metadata ?? event.metadata ?? {};
    // 创建会话时两条线索都写了；metadata 丢了还有订单侧的 external id
    const userId = meta.userId ?? event.data?.orderMerchantExternalId ?? null;
    const plan = normalisePlan(meta.plan);
    const details = {
      userId,
      email: event.data?.buyerEmail ?? event.data?.merchantProvidedBuyerIdentity ?? null,
      customerId: null,
      subscriptionId: event.data?.orderId ?? null,
      productId: null,
    };

    const action = GRANT_EVENTS.has(event.eventType)
      ? 'grant'
      : REVOKE_EVENTS.has(event.eventType)
        ? 'revoke'
        : 'ignore';

    if (action === 'grant') {
      if (!plan) return await unresolved(event.id, event.eventType, 'unknown_plan', details);
      const granted = await grantSubscription({ ...details, plan, status: event.eventType });
      if (!granted.ok) return await unresolved(event.id, event.eventType, 'profile_not_found', details);
      /*
       * 换套餐时 Waffo 是「开一笔新订阅」，旧那笔不管它就会一直扣下去。
       * 必须在发货之后取消旧的：顺序反过来的话，取消成功而发货失败，
       * 用户就既没了旧套餐也没拿到新套餐。
       *
       * 取消失败不回滚这次发货，也不返回 500 —— 钱已经收了，套餐必须给到；
       * 重投这条事件也修不好一个第三方接口的失败。只能记下来人工处理，
       * 所以这行日志的措辞要能直接搜到。
       */
      if (granted.supersededSubscriptionId) {
        const outcome = await cancelWaffoSubscription(granted.supersededSubscriptionId);
        if (outcome) {
          console.info('[billing] superseded_subscription_canceled', {
            orderId: granted.supersededSubscriptionId, outcome, replacedBy: details.subscriptionId,
          });
        } else {
          console.error('[billing] superseded_subscription_cancel_failed', {
            orderId: granted.supersededSubscriptionId, replacedBy: details.subscriptionId, userId,
          });
        }
      }
    } else if (action === 'revoke') {
      const revoked = await revokeSubscription({ ...details, status: event.eventType });
      if (!revoked) {
        console.warn('[billing] webhook_ignored', { eventId: event.id, eventType: event.eventType, reason: 'profile_not_found' });
        return NextResponse.json({ ok: true, ignored: 'profile_not_found' });
      }
    }

    console.info('[billing] waffo_webhook_processed', { eventId: event.id, eventType: event.eventType, action });
    return NextResponse.json({ ok: true });
  } catch (error) {
    await releaseBillingEvent(event.id).catch(() => undefined);
    console.error('[billing] waffo_webhook_failed', { eventId: event.id, eventType: event.eventType, error });
    return NextResponse.json({ error: 'processing_failed' }, { status: 500 });
  }
}

function normalisePlan(value: string | undefined): Exclude<Plan, 'free'> | null {
  return value === 'basic' || value === 'pro' || value === 'unlimited' ? value : null;
}

/**
 * 收到了钱但没能发出套餐。释放去重记录并返回 500，让 Waffo 重试 ——
 * 保留记录并返回 200 会让这一笔永远补不回来。发放是幂等的，重投不会重复发。
 * 详见 Creem 那个处理器里同名函数的说明，那是真实事故的产物。
 */
async function unresolved(
  eventId: string,
  eventType: string,
  reason: 'unknown_plan' | 'profile_not_found',
  details: Record<string, unknown>,
) {
  await releaseBillingEvent(eventId).catch(() => undefined);
  console.error('[billing] grant_unresolved', { eventId, eventType, reason, provider: 'waffo', ...details });
  return NextResponse.json({ error: reason }, { status: 500 });
}
