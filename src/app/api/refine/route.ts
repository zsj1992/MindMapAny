import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentProfile } from '@/lib/auth/session';
import { refundCredits, reserveCredits } from '@/lib/db/repositories/profiles';
import { mindMapSchema } from '@/lib/mindmap/schema';
import { refineMindMap } from '@/lib/mindmap/refine';
import { rateLimitRequest } from '@/lib/rate-limit';

export const maxDuration = 300;
export const runtime = 'nodejs';

/** 改图比生成便宜得多：只有一次调用，输入是大纲而不是全文 */
const REFINE_CREDITS = 1;

const bodySchema = z.object({
  map: mindMapSchema,
  action: z.enum(['concise', 'detail', 'translate', 'regenerate', 'custom']),
  instruction: z.string().trim().max(300).optional(),
});

export async function POST(req: Request) {
  const session = await getCurrentProfile();
  if (!session?.user || !session.profile) return fail(401, 'login_required', 'Please sign in to edit this mind map');

  const limited = await rateLimitRequest(req, { scope: 'refine:user:minute', subject: session.user.id, limit: 15, windowSeconds: 60 });
  if (!limited.allowed) return fail(429, 'rate_limited', 'Too many requests right now. Please try again shortly.');

  let params: z.infer<typeof bodySchema>;
  try {
    params = bodySchema.parse(await req.json());
  } catch {
    return fail(400, 'bad_request', 'Could not read that mind map');
  }
  if (params.action === 'custom' && !params.instruction) {
    return fail(400, 'bad_request', 'Please describe the change you want');
  }

  const cost = session.profile.plan === 'unlimited' ? 0 : REFINE_CREDITS;
  if (cost && !(await reserveCredits(session.user.id, cost))) {
    return fail(402, 'insufficient_credits', `Editing costs ${REFINE_CREDITS} credit`);
  }

  try {
    const result = await refineMindMap({
      map: params.map,
      action: params.action,
      ...(params.instruction ? { instruction: params.instruction } : {}),
      signal: req.signal,
    });
    return NextResponse.json({ map: result.map, creditsCharged: cost });
  } catch (error) {
    // 改失败就退积分：用户的图没变，钱不能扣
    if (cost) await refundCredits(session.user.id, cost).catch(() => undefined);
    console.error('[refine] failed', error);
    return fail(502, 'generation_failed', 'Could not apply that change. Please try again.');
  }
}

function fail(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}
