import { getDb, nowSec } from '@/lib/db/client';

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * D1-backed fixed-window limiter. The upsert is a single atomic statement, so
 * concurrent requests cannot all observe the same count and slip through.
 */
export async function consumeRateLimit(rateKey: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  const now = nowSec();
  const windowStart = Math.floor(now / windowSeconds) * windowSeconds;
  const resetAt = windowStart + windowSeconds;
  const row = await getDb()
    .prepare(
      `insert into rate_limits (rate_key, window_start, count, expires_at)
       values (?1, ?2, 1, ?3)
       on conflict(rate_key, window_start) do update set count = count + 1
       returning count`,
    )
    .bind(rateKey, windowStart, resetAt + windowSeconds)
    .first<{ count: number }>();

  const count = row?.count ?? limit + 1;
  return {
    allowed: count <= limit,
    limit,
    remaining: Math.max(0, limit - count),
    resetAt,
  };
}

/** Keep the table bounded without adding cleanup work to every request. */
export async function pruneExpiredRateLimits(): Promise<void> {
  await getDb().prepare(`delete from rate_limits where expires_at < ?1`).bind(nowSec()).run();
}
