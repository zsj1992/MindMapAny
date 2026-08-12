import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ASK_CREDITS, runAskAnything } from '@/lib/ask';
import { getCurrentProfile } from '@/lib/auth/session';
import { record as recordJob } from '@/lib/db/repositories/jobs';
import { refundCredits, reserveCredits } from '@/lib/db/repositories/profiles';
import { autoSaveMap } from '@/lib/maps/autosave';
import { resolveLanguage } from '@/lib/mindmap/detect-language';
import { DEPTHS, type Depth } from '@/lib/mindmap/schema';
import { rateLimitRequest } from '@/lib/rate-limit';
import { ResearchError } from '@/lib/research';

export const maxDuration = 300;
export const runtime = 'nodejs';

const bodySchema = z.object({
  question: z.string().trim().min(4).max(500),
  language: z.string().default('auto'),
  depth: z.enum(DEPTHS).default('standard'),
});

export async function POST(req: Request) {
  const started = Date.now();
  const session = await getCurrentProfile();
  if (!session?.user || !session.profile) return fail(401, 'login_required', 'Please sign in to use Ask Anything');

  const limited = await rateLimitRequest(req, {
    scope: 'ask:user:minute',
    subject: session.user.id,
    limit: 8,
    windowSeconds: 60,
  });
  if (!limited.allowed) return fail(429, 'rate_limited', 'Too many requests right now. Please try again shortly.');

  let params: z.infer<typeof bodySchema>;
  try {
    params = bodySchema.parse(await req.json());
  } catch {
    return fail(400, 'bad_request', 'Please enter a question or topic');
  }

  const cost = session.profile.plan === 'unlimited' ? 0 : ASK_CREDITS;
  if (cost && !(await reserveCredits(session.user.id, cost))) {
    return fail(402, 'insufficient_credits', `Ask Anything costs ${ASK_CREDITS} credits`);
  }

  try {
    const result = await runAskAnything({
      question: params.question,
      // 问题本身就是语言线索，和深度研究一致
      language: resolveLanguage(params.language, params.question),
      depth: params.depth as Depth,
      signal: req.signal,
    });
    await recordJobSafely({
      userId: session.user.id,
      status: 'succeeded',
      sourceKind: 'web',
      sourceChars: params.question.length,
      modelTier: 'fast',
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      creditsCharged: cost,
      warnings: [],
      durationMs: Date.now() - started,
    });
    const saved = await autoSaveMap(session.user.id, { map: result.map, sourceKind: 'web' });
    return NextResponse.json({
      map: result.map,
      brief: result.brief,
      sources: result.sources,
      creditsCharged: cost,
      ...(saved.saved ? { savedId: saved.id } : { saveFailed: saved.reason }),
    });
  } catch (error) {
    // 失败必须退积分：用户没拿到图，钱不能扣
    if (cost) await refundCredits(session.user.id, cost).catch(() => undefined);
    const code = error instanceof ResearchError ? error.code : 'generation_failed';
    const message = error instanceof ResearchError ? error.message : 'Could not build a mind map for that question. Please try again.';
    await recordJobSafely({
      userId: session.user.id,
      status: 'failed',
      sourceKind: 'web',
      sourceChars: params.question.length,
      durationMs: Date.now() - started,
      errorCode: code,
      errorMessage: message,
    });
    return fail(502, code, message);
  }
}

type JobInput = Parameters<typeof recordJob>[0];

async function recordJobSafely(job: JobInput): Promise<void> {
  try {
    await recordJob(job);
  } catch (error) {
    console.error('[ask] failed_to_record', error);
  }
}

function fail(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}
