import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkGate, estimateCredits } from '@/lib/credits';
import { extractDocument, isSupportedDocument } from '@/lib/extract/document';
import { extractPdf } from '@/lib/extract/pdf';
import { ExtractError, totalChars, type ExtractedDoc, type InputKind } from '@/lib/extract/types';
import { extractWeb } from '@/lib/extract/web';
import { isYoutubeUrl } from '@/lib/extract/youtube';
import { getCurrentProfile } from '@/lib/auth/session';
import { refundCredits, reserveCredits } from '@/lib/db/repositories/profiles';
import { record as recordJob } from '@/lib/db/repositories/jobs';
import { resolveLanguage } from '@/lib/mindmap/detect-language';
import { generateMindMap, type ModelTier } from '@/lib/mindmap/generate';
import { DEPTHS, PURPOSES, type Depth, type Purpose } from '@/lib/mindmap/schema';
import { rateLimitRequest } from '@/lib/rate-limit';
import { RequestBodyTooLargeError, readBodyBytesLimited, readJsonLimited } from '@/lib/http/body-limit';

// map-reduce 长文档可能跑到几分钟，Fluid Compute 默认 300s 够用，不引入队列
export const maxDuration = 300;
export const runtime = 'nodejs';

const paramsSchema = z.object({
  text: z.string().optional(),
  url: z.string().optional(),
  // 'auto' = 跟随原文语种。默认值必须是 auto：默认英文时中文文档会被整篇翻译，
  // 而绝大多数人只是想要一张和原文同语言的图。
  language: z.string().default('auto'),
  depth: z.enum(DEPTHS).default('standard'),
  purpose: z.enum(PURPOSES).default('general'),
  tier: z.enum(['fast', 'quality']).default('fast'),
});

export async function POST(req: Request) {
  const started = Date.now();
  let doc: ExtractedDoc | null = null;
  let kind: InputKind = 'text';
  let reserved: { userId: string; amount: number } | null = null;
  let jobUserId: string | null = null;

  try {
    // 生成必须登录。页面层的重定向挡不住直接打接口，真正的闸门在这里。
    const session = await getCurrentProfile();
    const user = session?.user ?? null;
    const profile = session?.profile ?? null;
    if (!user) return fail(401, 'login_required', 'Please sign in to generate a mind map');
    jobUserId = user.id;

    const burst = await rateLimitRequest(req, {
      scope: 'generate:user:minute',
      subject: user.id,
      limit: 10,
      windowSeconds: 60,
    });
    if (!burst.allowed) return rateLimited(burst.resetAt);

    // 鉴权和限流都通过后才读取请求体，避免匿名请求用大文件消耗 Worker 内存。
    const { params, file, filename, mimeType } = await readRequest(req);

    // ── 提取 ──
    if (file) {
      const isPdf = filename?.toLowerCase().endsWith('.pdf') || mimeType === 'application/pdf';
      if (isPdf) {
        kind = 'pdf';
        doc = await extractPdf({ data: file, ...(filename ? { filename } : {}) });
      } else if (isSupportedDocument(filename, mimeType)) {
        // 通用文档沿用文本配额和数据库类型；提取器内部仍保留章节/页码溯源。
        kind = 'text';
        doc = await extractDocument({ data: file, ...(filename ? { filename } : {}), ...(mimeType ? { mimeType } : {}) });
      } else {
        throw new ExtractError('unsupported', 'That file format is not supported. Please upload a PDF, DOCX, EPUB, PPTX, TXT or Markdown file.');
      }
    } else if (params.url?.trim()) {
      const url = params.url.trim();
      if (isYoutubeUrl(url)) {
        throw new ExtractError('unsupported', 'YouTube video summarisation is not available yet. Paste the captions or transcript instead.');
      }
      kind = 'web';
      doc = await extractWeb(url);
    } else if (params.text?.trim()) {
      kind = 'text';
      doc = {
        kind: 'text',
        title: params.text.trim().split('\n')[0].slice(0, 80) || 'Untitled content',
        blocks: params.text
          .split(/\n{2,}/)
          .map((t) => ({ text: t.trim() }))
          .filter((b) => b.text),
        notes: [],
      };
    } else {
      return fail(400, 'bad_request', 'Please provide text, a link, or a supported file');
    }

    const chars = totalChars(doc);
    if (!chars) return fail(422, 'empty', 'No usable content could be extracted');

    // 语言必须在提取之后才能定：链接和文件在这一步之前，服务端根本没见过正文。
    // 标题一并计入 —— 纯数据的表格类文档，标题往往是唯一的自然语言线索。
    const language = resolveLanguage(
      params.language,
      [doc.title ?? '', ...doc.blocks.map((b) => b.text)].join('\n'),
    );

    // ── 配额校验 ──
    const tier = params.tier as ModelTier;

    if (profile) {
      const gate = checkGate({
        plan: profile.plan,
        credits: profile.credits,
        kind,
        tier,
        depth: params.depth as Depth,
        chars,
      });
      if (!gate.ok) return fail(402, gate.code ?? 'forbidden', gate.reason ?? 'Quota exceeded');
    }

    const effectiveTier: ModelTier = tier;
    const cost = profile?.plan !== 'unlimited'
      ? estimateCredits({ kind, tier: effectiveTier, depth: params.depth as Depth, chars })
      : 0;
    if (profile && profile.plan !== 'unlimited' && cost > 0) {
      if (!(await reserveCredits(user.id, cost))) {
        return fail(402, 'insufficient_credits', `Not enough credits — this run needs ${cost}`);
      }
      reserved = { userId: user.id, amount: cost };
    }

    // ── 生成 ──
    const { map, warnings, usage } = await generateMindMap({
      doc,
      language,
      depth: params.depth as Depth,
      purpose: params.purpose as Purpose,
      tier: effectiveTier,
      signal: req.signal,
    });

    // ── 记账 ──
    reserved = null;
    await recordJobSafely({
      userId: user?.id ?? null,
      status: 'succeeded',
      sourceKind: kind,
      sourceUrl: doc.url ?? null,
      sourceChars: chars,
      modelTier: effectiveTier,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      creditsCharged: cost,
      warnings,
      durationMs: Date.now() - started,
    });

    return NextResponse.json({ map, warnings, notes: doc.notes, usage, creditsCharged: cost });
  } catch (err) {
    const { status, code, message } = describeError(err);
    if (reserved) await refundCredits(reserved.userId, reserved.amount).catch(() => undefined);
    await recordJobSafely({
      userId: jobUserId,
      status: 'failed',
      sourceKind: kind,
      sourceUrl: doc?.url ?? null,
      sourceChars: doc ? totalChars(doc) : null,
      durationMs: Date.now() - started,
      errorCode: code,
      errorMessage: message,
    });
    return fail(status, code, message);
  }
}

type JobInput = Parameters<typeof recordJob>[0];

async function recordJobSafely(job: JobInput): Promise<void> {
  try {
    await recordJob(job);
  } catch (error) {
    console.error('[jobs] failed_to_record', error);
  }
}

function rateLimited(resetAt: number, message = 'Too many requests right now. Please try again shortly.') {
  return NextResponse.json(
    { error: { code: 'rate_limited', message } },
    { status: 429, headers: { 'retry-after': String(Math.max(1, resetAt - Math.floor(Date.now() / 1000))) } },
  );
}

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const MAX_MULTIPART_BYTES = MAX_UPLOAD_BYTES + 256 * 1024;
const MAX_JSON_REQUEST_BYTES = 2 * 1024 * 1024;

async function readRequest(req: Request) {
  const ctype = req.headers.get('content-type') ?? '';
  if (ctype.includes('multipart/form-data')) {
    const body = await readBodyBytesLimited(req, MAX_MULTIPART_BYTES);
    const buffered = new Request(req.url, { method: req.method, headers: req.headers, body: body.buffer });
    const form = await buffered.formData();
    const entry = form.get('file');
    const raw = Object.fromEntries(
      [...form.entries()].filter(([, v]) => typeof v === 'string'),
    ) as Record<string, string>;
    const params = paramsSchema.parse(raw);
    if (entry instanceof File) {
      if (entry.size > MAX_UPLOAD_BYTES) throw new ExtractError('too_large', 'The file exceeds the 20MB limit');
      return { params, file: await entry.arrayBuffer(), filename: entry.name, mimeType: entry.type };
    }
    return { params, file: null, filename: undefined, mimeType: undefined };
  }
  const params = paramsSchema.parse(await readJsonLimited(req, MAX_JSON_REQUEST_BYTES));
  return { params, file: null, filename: undefined, mimeType: undefined };
}

function fail(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function describeError(err: unknown): { status: number; code: string; message: string } {
  if (err instanceof ExtractError) {
    const status = err.code === 'blocked_url' ? 400 : err.code === 'too_large' ? 413 : 422;
    return { status, code: err.code, message: err.message };
  }
  if (err instanceof RequestBodyTooLargeError) {
    return { status: 413, code: 'too_large', message: 'The request body is too large' };
  }
  if (err instanceof SyntaxError) {
    return { status: 400, code: 'bad_request', message: 'Invalid JSON request body' };
  }
  if (err instanceof z.ZodError) {
    return { status: 400, code: 'bad_request', message: 'Invalid request parameters' };
  }
  const message = err instanceof Error ? err.message : String(err);
  const name = err instanceof Error ? err.name : '';
  // Gateway 的各种配置/计费问题都是运维问题，不是用户的错，给一致的 503
  if (/^Gateway/.test(name) || /AI_GATEWAY_API_KEY|ai-gateway/.test(message)) {
    console.error('[generate] gateway', message);
    return { status: 503, code: 'ai_unavailable', message: 'The AI service is unavailable right now. Please try again shortly.' };
  }
  if (/rate.?limit|429/i.test(message)) {
    return { status: 429, code: 'rate_limited', message: 'Too many requests right now. Please try again shortly.' };
  }
  if (/abort/i.test(`${name}${message}`)) {
    return { status: 499, code: 'aborted', message: 'Generation was cancelled' };
  }
  if (/no usable outline/.test(message)) {
    return { status: 502, code: 'generation_failed', message: 'Generation failed. Try again, or pick a different depth setting.' };
  }
  console.error('[generate]', err);
  return { status: 500, code: 'internal', message: 'Something went wrong. Please try again shortly.' };
}
