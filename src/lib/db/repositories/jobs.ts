import { getDb, nowSec } from '@/lib/db/client';
import type { InputKind } from '@/lib/extract/types';

/** 生成任务流水。只写不读（读只在排障时直接查库），失败不能影响主流程。 */

export interface JobRecord {
  userId: string | null;
  status: 'succeeded' | 'failed';
  sourceKind: InputKind;
  sourceUrl?: string | null;
  sourceChars?: number | null;
  modelTier?: string | null;
  inputTokens?: number;
  outputTokens?: number;
  creditsCharged?: number;
  durationMs: number;
  errorCode?: string | null;
  errorMessage?: string | null;
  warnings?: string[];
}

export async function record(job: JobRecord): Promise<void> {
  try {
    await getDb()
      .prepare(
        `insert into jobs (id, user_id, status, source_kind, source_url, source_chars, model_tier,
                           input_tokens, output_tokens, credits_charged, duration_ms,
                           error_code, error_message, warnings, created_at)
         values (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15)`,
      )
      .bind(
        crypto.randomUUID(),
        job.userId,
        job.status,
        job.sourceKind,
        job.sourceUrl ?? null,
        job.sourceChars ?? null,
        job.modelTier ?? null,
        job.inputTokens ?? 0,
        job.outputTokens ?? 0,
        job.creditsCharged ?? 0,
        job.durationMs,
        job.errorCode ?? null,
        job.errorMessage ?? null,
        JSON.stringify(job.warnings ?? []),
        nowSec(),
      )
      .run();
  } catch (e) {
    // 用户已经拿到脑图了，记账失败不能反过来让请求失败
    console.error('[jobs] record failed', e);
  }
}
