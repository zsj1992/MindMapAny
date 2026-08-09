import { consumeRateLimit, pruneExpiredRateLimits, type RateLimitResult } from '@/lib/db/repositories/rate-limits';

const textEncoder = new TextEncoder();

export async function rateLimitRequest(
  req: Request,
  options: { scope: string; subject?: string; limit: number; windowSeconds: number },
): Promise<RateLimitResult> {
  const subject = options.subject ?? clientAddress(req);
  const secret = process.env.BETTER_AUTH_SECRET ?? 'mindmapany-rate-limit';
  const digest = await crypto.subtle.digest(
    'SHA-256',
    textEncoder.encode(`${options.scope}:${subject}:${secret}`),
  );
  const key = `${options.scope}:${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
  const result = await consumeRateLimit(key, options.limit, options.windowSeconds);

  // Roughly 1% of requests performs bounded housekeeping.
  if (crypto.getRandomValues(new Uint8Array(1))[0] < 3) {
    void pruneExpiredRateLimits().catch(() => undefined);
  }
  return result;
}

function clientAddress(req: Request): string {
  return (
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    `unknown:${req.headers.get('user-agent') ?? 'agent'}`
  );
}
