import { NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimitRequest } from '@/lib/rate-limit';

const eventSchema = z.object({
  type: z.enum(['window_error', 'unhandled_rejection']),
  message: z.string().max(500),
  path: z.string().max(300),
  at: z.string().max(50),
});

export async function POST(req: Request) {
  const limited = await rateLimitRequest(req, { scope: 'client-events:minute', limit: 20, windowSeconds: 60 });
  if (!limited.allowed) return new Response(null, { status: 204 });
  const parsed = eventSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  console.error('[client-event]', parsed.data);
  return new Response(null, { status: 204 });
}
