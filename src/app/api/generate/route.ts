import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ANON_TRIAL_LIMITS, checkGate, estimateCredits, type Plan } from '@/lib/credits';
import { extractPdf } from '@/lib/extract/pdf';
import { ExtractError, totalChars, type ExtractedDoc, type InputKind } from '@/lib/extract/types';
import { extractWeb } from '@/lib/extract/web';
import { extractYoutube, isYoutubeUrl } from '@/lib/extract/youtube';
import { getCurrentUser, getSupabaseAdmin, isSupabaseConfigured } from '@/lib/db/server';
import { generateMindMap, type ModelTier } from '@/lib/mindmap/generate';
import { DEPTHS, PURPOSES, type Depth, type Purpose } from '@/lib/mindmap/schema';

// map-reduce 长文档可能跑到几分钟，Fluid Compute 默认 300s 够用，不引入队列
export const maxDuration = 300;
export const runtime = 'nodejs';

const paramsSchema = z.object({
  text: z.string().optional(),
  url: z.string().optional(),
  language: z.string().default('zh-CN'),
  depth: z.enum(DEPTHS).default('standard'),
  purpose: z.enum(PURPOSES).default('general'),
  tier: z.enum(['fast', 'quality']).default('fast'),
});

export async function POST(req: Request) {
  const started = Date.now();
  let doc: ExtractedDoc | null = null;
  let kind: InputKind = 'text';

  try {
    const { params, file, filename } = await readRequest(req);

    // ── 提取 ──
    if (file) {
      kind = 'pdf';
      doc = await extractPdf({ data: file, ...(filename ? { filename } : {}) });
    } else if (params.url?.trim()) {
      const url = params.url.trim();
      kind = isYoutubeUrl(url) ? 'youtube' : 'web';
      doc =
        kind === 'youtube'
          ? await extractYoutube(url, params.language.split('-')[0])
          : await extractWeb(url);
    } else if (params.text?.trim()) {
      kind = 'text';
      doc = {
        kind: 'text',
        title: params.text.trim().split('\n')[0].slice(0, 80) || '未命名内容',
        blocks: params.text
          .split(/\n{2,}/)
          .map((t) => ({ text: t.trim() }))
          .filter((b) => b.text),
        notes: [],
      };
    } else {
      return fail(400, 'bad_request', '请提供文本、链接或 PDF 文件');
    }

    const chars = totalChars(doc);
    if (!chars) return fail(422, 'empty', '未提取到可用内容');

    // ── 配额校验 ──
    const user = await getCurrentUser();
    const profile = user ? await loadProfile(user.id) : null;
    const tier = params.tier as ModelTier;

    if (!user) {
      if (!ANON_TRIAL_LIMITS.kinds.includes(kind)) {
        return fail(401, 'login_required', '该输入类型需要登录后使用');
      }
      if (chars > ANON_TRIAL_LIMITS.maxChars) {
        return fail(401, 'login_required', '试用仅支持较短内容，登录后可处理更长文档');
      }
    } else if (profile) {
      const gate = checkGate({
        plan: profile.plan,
        credits: profile.credits,
        kind,
        tier,
        depth: params.depth as Depth,
        chars,
      });
      if (!gate.ok) return fail(402, gate.code ?? 'forbidden', gate.reason ?? '配额不足');
    }

    // ── 生成 ──
    const effectiveTier: ModelTier = user ? tier : ANON_TRIAL_LIMITS.tier;
    const { map, warnings, usage } = await generateMindMap({
      doc,
      language: params.language,
      depth: params.depth as Depth,
      purpose: params.purpose as Purpose,
      tier: effectiveTier,
      signal: req.signal,
    });

    // ── 扣费与记账 ──
    const cost = user
      ? estimateCredits({ kind, tier: effectiveTier, depth: params.depth as Depth, chars })
      : 0;
    if (user && profile && profile.plan !== 'unlimited' && cost > 0) {
      await chargeCredits(user.id, cost);
    }
    await recordJob({
      userId: user?.id ?? null,
      status: 'succeeded',
      kind,
      url: doc.url ?? null,
      chars,
      tier: effectiveTier,
      usage,
      cost,
      warnings,
      durationMs: Date.now() - started,
    });

    return NextResponse.json({ map, warnings, notes: doc.notes, usage, creditsCharged: cost });
  } catch (err) {
    const { status, code, message } = describeError(err);
    await recordJob({
      userId: null,
      status: 'failed',
      kind,
      url: doc?.url ?? null,
      chars: doc ? totalChars(doc) : null,
      tier: null,
      usage: null,
      cost: 0,
      warnings: [],
      durationMs: Date.now() - started,
      errorCode: code,
      errorMessage: message,
    });
    return fail(status, code, message);
  }
}

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

async function readRequest(req: Request) {
  const ctype = req.headers.get('content-type') ?? '';
  if (ctype.includes('multipart/form-data')) {
    const form = await req.formData();
    const entry = form.get('file');
    const raw = Object.fromEntries(
      [...form.entries()].filter(([, v]) => typeof v === 'string'),
    ) as Record<string, string>;
    const params = paramsSchema.parse(raw);
    if (entry instanceof File) {
      if (entry.size > MAX_UPLOAD_BYTES) throw new ExtractError('too_large', '文件超过 20MB 限制');
      return { params, file: await entry.arrayBuffer(), filename: entry.name };
    }
    return { params, file: null, filename: undefined };
  }
  const params = paramsSchema.parse(await req.json());
  return { params, file: null, filename: undefined };
}

function fail(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function describeError(err: unknown): { status: number; code: string; message: string } {
  if (err instanceof ExtractError) {
    const status = err.code === 'blocked_url' ? 400 : err.code === 'too_large' ? 413 : 422;
    return { status, code: err.code, message: err.message };
  }
  if (err instanceof z.ZodError) {
    return { status: 400, code: 'bad_request', message: '请求参数不合法' };
  }
  const message = err instanceof Error ? err.message : String(err);
  const name = err instanceof Error ? err.name : '';
  // Gateway 的各种配置/计费问题都是运维问题，不是用户的错，给一致的 503
  if (/^Gateway/.test(name) || /AI_GATEWAY_API_KEY|ai-gateway/.test(message)) {
    console.error('[generate] gateway', message);
    return { status: 503, code: 'ai_unavailable', message: 'AI 服务暂不可用，请稍后重试' };
  }
  if (/rate.?limit|429/i.test(message)) {
    return { status: 429, code: 'rate_limited', message: '当前请求过多，请稍后重试' };
  }
  if (/abort/i.test(`${name}${message}`)) {
    return { status: 499, code: 'aborted', message: '生成已取消' };
  }
  if (/no usable outline/.test(message)) {
    return { status: 502, code: 'generation_failed', message: '生成失败，请重试或换一种深度设置' };
  }
  console.error('[generate]', err);
  return { status: 500, code: 'internal', message: '服务异常，请稍后重试' };
}

async function loadProfile(userId: string): Promise<{ plan: Plan; credits: number } | null> {
  if (!isSupabaseConfigured()) return null;
  const { data } = await getSupabaseAdmin()
    .from('profiles')
    .select('plan, credits')
    .eq('id', userId)
    .single();
  return data ? { plan: data.plan as Plan, credits: data.credits } : null;
}

async function chargeCredits(userId: string, amount: number) {
  // 生成成功后才扣，失败不收费；并发下多扣一次好过漏扣，MVP 不上分布式锁
  const admin = getSupabaseAdmin();
  const { data } = await admin.from('profiles').select('credits').eq('id', userId).single();
  if (!data) return;
  await admin
    .from('profiles')
    .update({ credits: Math.max(0, data.credits - amount) })
    .eq('id', userId);
}

interface JobRecord {
  userId: string | null;
  status: 'succeeded' | 'failed';
  kind: InputKind;
  url: string | null;
  chars: number | null;
  tier: ModelTier | null;
  usage: { inputTokens: number; outputTokens: number } | null;
  cost: number;
  warnings: string[];
  durationMs: number;
  errorCode?: string;
  errorMessage?: string;
}

/** 记账失败不能影响主流程 —— 用户已经拿到脑图了 */
async function recordJob(job: JobRecord) {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  try {
    await getSupabaseAdmin().from('jobs').insert({
      user_id: job.userId,
      status: job.status,
      source_kind: job.kind,
      source_url: job.url,
      source_chars: job.chars,
      model_tier: job.tier,
      input_tokens: job.usage?.inputTokens ?? 0,
      output_tokens: job.usage?.outputTokens ?? 0,
      credits_charged: job.cost,
      duration_ms: job.durationMs,
      error_code: job.errorCode ?? null,
      error_message: job.errorMessage ?? null,
      warnings: job.warnings,
    });
  } catch (e) {
    console.error('[jobs] record failed', e);
  }
}
