import { getDb, nowSec } from '@/lib/db/client';
import { PLAN_CREDITS, type Plan } from '@/lib/credits';

/** 用户档案与积分。同样只在这一层碰数据库。 */

export interface Profile {
  id: string;
  email: string | null;
  plan: Plan;
  credits: number;
}

/**
 * 取档案；不存在就建。
 *
 * Postgres 版是靠 auth.users 上的触发器自动建档，D1 没有触发器，
 * 改成读时补建 —— 反正每次需要档案时都会走这里，效果等价且少一处隐式魔法。
 */
export async function getOrCreate(userId: string, email: string | null): Promise<Profile> {
  const db = getDb();
  const found = await db
    .prepare(`select id, email, plan, credits, credits_reset_at from profiles where id = ?1`)
    .bind(userId)
    .first<Profile & { credits_reset_at: number }>();
  if (found) {
    const monthlyPlan = found.plan === 'basic' || found.plan === 'pro';
    const nextResetAt = found.credits_reset_at + 30 * 86_400;
    if (monthlyPlan && nowSec() >= nextResetAt) {
      const resetAt = nowSec();
      await db
        .prepare(`update profiles set credits = ?1, credits_reset_at = ?2 where id = ?3 and credits_reset_at = ?4`)
        .bind(PLAN_CREDITS[found.plan], resetAt, userId, found.credits_reset_at)
        .run();
      return { id: found.id, email: found.email, plan: found.plan, credits: PLAN_CREDITS[found.plan] };
    }
    return { id: found.id, email: found.email, plan: found.plan, credits: found.credits };
  }

  await db
    .prepare(
      `insert into profiles (id, email, plan, credits, credits_reset_at, created_at)
       values (?1, ?2, 'free', ?3, ?4, ?4)
       on conflict(id) do nothing`,
    )
    .bind(userId, email, PLAN_CREDITS.free, nowSec())
    .run();

  return { id: userId, email, plan: 'free', credits: PLAN_CREDITS.free };
}

/**
 * 扣积分。用 `credits = credits - ?` 而不是先读后写，
 * 让数据库做原子扣减，避免并发下两个请求读到同一个余额各扣一次。
 */
export async function chargeCredits(userId: string, amount: number): Promise<void> {
  if (amount <= 0) return;
  await getDb()
    .prepare(`update profiles set credits = max(0, credits - ?1) where id = ?2`)
    .bind(amount, userId)
    .run();
}

/**
 * Reserve credits before an expensive model call. The balance predicate and
 * decrement live in the same SQL statement, which closes the concurrent-request
 * gap left by a read-then-charge flow.
 */
export async function reserveCredits(userId: string, amount: number): Promise<boolean> {
  if (amount <= 0) return true;
  const result = await getDb()
    .prepare(`update profiles set credits = credits - ?1 where id = ?2 and credits >= ?1`)
    .bind(amount, userId)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

export async function refundCredits(userId: string, amount: number): Promise<void> {
  if (amount <= 0) return;
  await getDb().prepare(`update profiles set credits = credits + ?1 where id = ?2`).bind(amount, userId).run();
}
