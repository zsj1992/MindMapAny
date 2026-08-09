import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ANON_TRIAL_LIMITS, checkGate, estimateCredits } from '@/lib/credits';
import { extractDocument, isSupportedDocument } from '@/lib/extract/document';
import { extractPdf } from '@/lib/extract/pdf';
import { ExtractError, totalChars, type ExtractedDoc, type InputKind } from '@/lib/extract/types';
import { extractWeb } from '@/lib/extract/web';
import { isYoutubeUrl } from '@/lib/extract/youtube';
import { getCurrentProfile } from '@/lib/auth/session';
import { chargeCredits } from '@/lib/db/repositories/profiles';
import { record as recordJob } from '@/lib/db/repositories/jobs';
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
        throw new ExtractError('unsupported', '暂不支持该文件格式，请上传 PDF、DOCX、EPUB、PPTX、TXT 或 Markdown');
      }
    } else if (params.url?.trim()) {
      const url = params.url.trim();
      if (isYoutubeUrl(url)) {
        throw new ExtractError('unsupported', 'YouTube 视频总结暂未开放，请先粘贴视频字幕或文字稿');
      }
      kind = 'web';
      doc = await extractWeb(url);
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
      return fail(400, 'bad_request', '请提供文本、链接或受支持的文件');
    }

    const chars = totalChars(doc);
    if (!chars) return fail(422, 'empty', '未提取到可用内容');

    // ── 配额校验 ──
    const session = await getCurrentProfile();
    const user = session?.user ?? null;
    const profile = session?.profile ?? null;
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
    await recordJob({
      userId: null,
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
      return { params, file: await entry.arrayBuffer(), filename: entry.name, mimeType: entry.type };
    }
    return { params, file: null, filename: undefined, mimeType: undefined };
  }
  const params = paramsSchema.parse(await req.json());
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
