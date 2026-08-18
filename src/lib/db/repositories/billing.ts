import { getDb, nowSec } from '@/lib/db/client';
import { PLAN_CREDITS, type Plan } from '@/lib/credits';

export interface SubscriptionUpdate {
  userId?: string | null;
  plan: Exclude<Plan, 'free'>;
  customerId?: string | null;
  subscriptionId?: string | null;
  status: string;
}

export async function claimBillingEvent(id: string, eventType: string): Promise<boolean> {
  const result = await getDb()
    .prepare(`insert into billing_events (id, event_type, received_at) values (?1, ?2, ?3) on conflict(id) do nothing`)
    .bind(id, eventType, nowSec())
    .run();
  return (result.meta.changes ?? 0) > 0;
}

export async function releaseBillingEvent(id: string): Promise<void> {
  await getDb().prepare(`delete from billing_events where id = ?1`).bind(id).run();
}

export interface GrantResult {
  ok: boolean;
  /**
   * 被顶替掉的旧订阅号。用户换套餐时是「开一笔新的」而不是「改一笔旧的」，
   * 旧那笔不主动取消就会继续每月扣钱 —— 而它的号在这次 update 之后
   * 就从库里消失了，事后再也查不回来。所以必须在覆盖前读出来交给调用方。
   *
   * 续费事件带的是同一个订单号，这时为 null，不会误伤。
   */
  supersededSubscriptionId: string | null;
}

/**
 * 这次发货是否顶替掉了另一笔还在扣钱的订阅。
 *
 * 抽成纯函数是为了能测 —— 判断错的两个方向代价都很实：
 *   · 该返回订单号却返回 null：旧订阅继续每月扣款，用户被双扣。
 *   · 不该返回却返回了：把用户正在用的那笔订阅取消掉。
 *
 * 续费事件带的是同一个订单号，必须落在第二类里。
 */
export function supersededSubscriptionId(previous: string | null, incoming: string | null): string | null {
  if (!previous || !incoming) return null;
  return previous === incoming ? null : previous;
}

export async function grantSubscription(update: SubscriptionUpdate): Promise<GrantResult> {
  // 首次付款靠签名后的 metadata.userId 建联；之后始终优先使用持久化的 Creem 标识。
  const profileId = await resolveProfileId(update.userId, update.customerId, update.subscriptionId);
  if (!profileId) return { ok: false, supersededSubscriptionId: null };
  const db = getDb();

  const previous = await db
    .prepare(`select creem_subscription_id as subscriptionId from profiles where id = ?1`)
    .bind(profileId)
    .first<{ subscriptionId: string | null }>();
  const superseded = supersededSubscriptionId(previous?.subscriptionId ?? null, update.subscriptionId ?? null);

  const credits = PLAN_CREDITS[update.plan];
  const storedCredits = Number.isFinite(credits) ? credits : 0;
  const result = await db
    .prepare(
      `update profiles
          set plan = ?1, credits = ?2, credits_reset_at = ?3,
              creem_customer_id = coalesce(?4, creem_customer_id),
              creem_subscription_id = coalesce(?5, creem_subscription_id),
              subscription_status = ?6, plan_updated_at = ?3
        where id = ?7`,
    )
    .bind(update.plan, storedCredits, nowSec(), update.customerId ?? null, update.subscriptionId ?? null, update.status, profileId)
    .run();
  const ok = (result.meta.changes ?? 0) > 0;
  return { ok, supersededSubscriptionId: ok ? superseded : null };
}

export async function revokeSubscription(input: {
  userId?: string | null;
  customerId?: string | null;
  subscriptionId?: string | null;
  status: string;
}): Promise<boolean> {
  const profileId = await resolveProfileId(input.userId, input.customerId, input.subscriptionId);
  if (!profileId) return false;
  const result = await getDb()
    .prepare(
      `update profiles
          set plan = 'free', credits = min(credits, ?1), subscription_status = ?2, plan_updated_at = ?3
        where id = ?4`,
    )
    .bind(PLAN_CREDITS.free, input.status, nowSec(), profileId)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

async function resolveProfileId(
  userId?: string | null,
  customerId?: string | null,
  subscriptionId?: string | null,
): Promise<string | null> {
  const db = getDb();
  // 已经落库的 Creem 标识是后续续费、退款、取消事件的最高可信来源。
  if (subscriptionId) {
    const found = await db
      .prepare(`select id from profiles where creem_subscription_id = ?1`)
      .bind(subscriptionId)
      .first<{ id: string }>();
    if (found) return found.id;
  }
  if (customerId) {
    const found = await db
      .prepare(`select id from profiles where creem_customer_id = ?1`)
      .bind(customerId)
      .first<{ id: string }>();
    if (found) return found.id;
  }
  // 只有通过 Webhook 层 HMAC 校验的 metadata.userId 才会传到这里，供首次付款建联。
  if (userId) {
    const found = await db.prepare(`select id from profiles where id = ?1`).bind(userId).first<{ id: string }>();
    if (found) return found.id;
  }
  return null;
}

export interface SubscriptionInfo {
  plan: Plan;
  status: string | null;
  subscriptionId: string | null;
  planUpdatedAt: number | null;
}

/** 订阅管理页要展示的信息。Profile 只带套餐和积分，取消按钮还需要订单号和状态。 */
export async function getSubscriptionInfo(userId: string): Promise<SubscriptionInfo | null> {
  const row = await getDb()
    .prepare(
      `select plan, subscription_status as status, creem_subscription_id as subscriptionId,
              plan_updated_at as planUpdatedAt
         from profiles where id = ?1`,
    )
    .bind(userId)
    .first<{ plan: Plan; status: string | null; subscriptionId: string | null; planUpdatedAt: number | null }>();
  return row ?? null;
}

/**
 * 记下「用户已申请取消」。
 *
 * 不动 plan 和 credits —— 已经付掉的这个周期照常可用，真正的降级等
 * subscription.canceled 事件到达时由 revokeSubscription 完成。
 */
export async function markCanceling(userId: string): Promise<boolean> {
  const result = await getDb()
    .prepare(`update profiles set subscription_status = 'subscription.canceling' where id = ?1 and plan != 'free'`)
    .bind(userId)
    .run();
  return (result.meta.changes ?? 0) > 0;
}
