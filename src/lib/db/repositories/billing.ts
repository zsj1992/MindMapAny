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

export async function grantSubscription(update: SubscriptionUpdate): Promise<boolean> {
  // 首次付款靠签名后的 metadata.userId 建联；之后始终优先使用持久化的 Creem 标识。
  const profileId = await resolveProfileId(update.userId, update.customerId, update.subscriptionId);
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
