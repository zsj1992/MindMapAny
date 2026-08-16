import { getDb, nowSec } from '@/lib/db/client';

/**
 * 「点了购买、跳去 Creem」的流水。
 *
 * 和 jobs 一样只写不读：读只发生在排障和对账时，直接查库。
 *
 * 为什么需要它：webhook 只在**付款成功**时才来。卡被拒、3DS 没过、
 * 到了收银台又反悔——这些在库里全无痕迹，于是「有多少人想付钱却没付成」
 * 这个问题根本无法回答。而这正是支付环节唯一值得盯的数字。
 *
 * 写入失败绝不能挡住跳转：用户是来付钱的，不能因为我们记不上账就不让他付。
 */
export async function recordAttempt(input: {
  userId: string;
  plan: string;
  period: string;
}): Promise<void> {
  try {
    await getDb()
      .prepare(
        `insert into checkout_attempts (id, user_id, plan, period, created_at)
         values (?1,?2,?3,?4,?5)`,
      )
      .bind(crypto.randomUUID(), input.userId, input.plan, input.period, nowSec())
      .run();
  } catch (error) {
    console.error('[checkout] failed_to_record_attempt', error);
  }
}
