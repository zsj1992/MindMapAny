import { getDb, nowSec } from '@/lib/db/client';
import { PLAN_CREDITS, type Plan } from '@/lib/credits';

export interface SubscriptionUpdate {
  userId?: string | null;
  email?: string | null;
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

export async function grantSubscription(update: SubscriptionUpdate): Promise<boolean> {
  // customerId / subscriptionId 也要传进去，和 revokeSubscription 保持一致。
  // 少传这两个的后果不是「偶尔匹配不上」：续费事件里通常没有 metadata.userId，
  // 付款邮箱又可能和账号邮箱不同，于是每一次自动续费都会认不出人。
  const profileId = await resolveProfileId(update.userId, update.email, update.customerId, update.subscriptionId);
  if (!profileId) return false;
  const credits = PLAN_CREDITS[update.plan];
  const storedCredits = Number.isFinite(credits) ? credits : 0;
  const result = await getDb()
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
  return (result.meta.changes ?? 0) > 0;
}

export async function revokeSubscription(input: {
  userId?: string | null;
  email?: string | null;
  customerId?: string | null;
  subscriptionId?: string | null;
  status: string;
}): Promise<boolean> {
  const profileId = await resolveProfileId(input.userId, input.email, input.customerId, input.subscriptionId);
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
  email?: string | null,
  customerId?: string | null,
  subscriptionId?: string | null,
): Promise<string | null> {
  const db = getDb();
  // 支付链接上的 metadata 是用户可改的，所以最可信的是「userId 和付款邮箱都对得上」。
  if (userId && email) {
    const found = await db
      .prepare(`select id from profiles where id = ?1 and lower(email) = lower(?2)`)
      .bind(userId, email)
      .first<{ id: string }>();
    if (found) return found.id;
  }
  /*
   * 邮箱对不上时仍然认 userId。
   *
   * 这是这条链路上最容易出人命的一步：支付链接只带 userId，而 email 来自 Creem 的
   * 客户资料 —— 也就是「用哪个邮箱付的款」。用私人邮箱或 PayPal 邮箱付款完全正常，
   * 一旦两者不同，严格匹配就全线落空，钱收了、套餐没给。
   *
   * 放宽的风险是有人拿别人的 userId 去付款 —— 那是白送对方一个套餐，不是攻击。
   * 拿这点风险换「付错邮箱就丢单」，不划算。
   */
  if (userId) {
    const found = await db.prepare(`select id from profiles where id = ?1`).bind(userId).first<{ id: string }>();
    if (found) return found.id;
  }
  if (email) {
    const found = await db
      .prepare(`select id from profiles where lower(email) = lower(?1) limit 1`)
      .bind(email)
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
  if (subscriptionId) {
    const found = await db
      .prepare(`select id from profiles where creem_subscription_id = ?1`)
      .bind(subscriptionId)
      .first<{ id: string }>();
    if (found) return found.id;
  }
  return null;
}
