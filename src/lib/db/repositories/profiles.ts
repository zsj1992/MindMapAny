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
    .prepare(`select id, email, plan, credits from profiles where id = ?1`)
    .bind(userId)
    .first<Profile>();
  if (found) return found;

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
