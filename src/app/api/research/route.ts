import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentProfile } from '@/lib/auth/session';
import { refundCredits, reserveCredits } from '@/lib/db/repositories/profiles';
import { record as recordJob } from '@/lib/db/repositories/jobs';
import { resolveLanguage } from '@/lib/mindmap/detect-language';
import { ResearchError, runDeepResearch } from '@/lib/research';
import { rateLimitRequest } from '@/lib/rate-limit';

export const maxDuration = 300;
export const runtime = 'nodejs';

const RESEARCH_CREDITS = 10;
const bodySchema = z.object({
  query: z.string().trim().min(6).max(500),
  // 'auto' = 跟随提问语言，见 detect-language.ts
  language: z.enum(['auto', 'zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'es']).default('auto'),
  depth: z.enum(['standard', 'detailed']).default('detailed'),
});

export async function POST(req: Request) {
  const started = Date.now();
  const session = await getCurrentProfile();
  if (!session?.user || !session.profile) return fail(401, 'login_required', 'Please sign in to use deep research');
  const limited = await rateLimitRequest(req, {
    scope: 'research:user:hour',
    subject: session.user.id,
    limit: 4,
    windowSeconds: 3_600,
  });
  if (!limited.allowed) return fail(429, 'rate_limited', 'Too many deep research requests. Please try again shortly.');

  let params: z.infer<typeof bodySchema>;
  try {
    params = bodySchema.parse(await req.json());
  } catch (error) {
    const described = describe(error);
    return fail(described.status, described.code, described.message);
  }

  const cost = session.profile.plan === 'unlimited' ? 0 : RESEARCH_CREDITS;
  if (cost && !(await reserveCredits(session.user.id, cost))) {
    return fail(402, 'insufficient_credits', `Deep research costs ${RESEARCH_CREDITS} credits`);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const send = (event: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        } catch {
          closed = true;
        }
      };
      try {
        const result = await runDeepResearch({
          ...params,
          // 报告语言跟着提问走：用中文问，不该收到一份英文报告
          language: resolveLanguage(params.language, params.query),
          signal: req.signal,
          onProgress: (progress) => send({ type: 'progress', ...progress }),
        });
        await recordJobSafely({
          userId: session.user.id,
          status: 'succeeded',
          sourceKind: 'web',
          sourceChars: params.query.length,
          modelTier: 'fast:research-web',
          inputTokens: result.usage.inputTokens,
          outputTokens: result.usage.outputTokens,
          creditsCharged: cost,
          durationMs: Date.now() - started,
          warnings: [`${result.plan.length} research tasks`, `${result.sources.length} research sources`, `${result.usage.webSearchRequests} web search requests`],
        });
        send({ type: 'result', data: { ...result, creditsCharged: cost } });
      } catch (error) {
        const described = describe(error);
        if (cost) await refundCredits(session.user.id, cost).catch(() => undefined);
        await recordJobSafely({
          userId: session.user.id,
          status: 'failed',
          sourceKind: 'web',
          modelTier: 'fast:research-web',
          durationMs: Date.now() - started,
          errorCode: described.code,
          errorMessage: described.message,
        });
        send({ type: 'error', error: { code: described.code, message: described.message } });
      } finally {
        if (!closed) controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'application/x-ndjson; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
    },
  });
}

type JobInput = Parameters<typeof recordJob>[0];

async function recordJobSafely(job: JobInput): Promise<void> {
  try {
    await recordJob(job);
  } catch (error) {
    console.error('[jobs] failed_to_record', error);
  }
}

function describe(error: unknown) {
  if (error instanceof z.ZodError) return { status: 400, code: 'bad_request', message: 'Please enter a research question of 6–500 characters' };
  if (error instanceof ResearchError) {
    const status = error.code === 'provider_unconfigured' ? 503 : error.code === 'rate_limited' ? 429 : 502;
    return { status, code: error.code, message: error.message };
  }
  const message = error instanceof Error ? error.message : String(error);
  if (/abort/i.test(message)) return { status: 499, code: 'aborted', message: 'The research run was cancelled' };
  if (/rate.?limit|429/i.test(message)) return { status: 429, code: 'rate_limited', message: 'Too many requests right now. Please try again shortly.' };
  console.error('[research]', error);
  return { status: 500, code: 'internal', message: 'Deep research failed for now. Please try again shortly.' };
}

function fail(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}
