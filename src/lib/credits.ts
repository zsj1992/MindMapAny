import type { Depth } from '@/lib/mindmap/schema';
import type { InputKind } from '@/lib/extract/types';
import type { ModelTier } from '@/lib/mindmap/generate';

/**
 * 积分。定价逻辑集中在这一个文件，别散到各处 —— 改价时只动这里。
 *
 * 设计取向和 Mapify 一致：用「输入类型 + 模型档位」做付费墙，而不是单纯限次数。
 * 免费用户能完整体验文本/网页，但拿不到强模型和大文件。
 */

export const PLAN_CREDITS = {
  free: 30,
  basic: 1000,
  pro: 2000,
  unlimited: Number.POSITIVE_INFINITY,
} as const;
export type Plan = keyof typeof PLAN_CREDITS;

/**
 * 验证阶段的取舍：免费档放开当前已计费的来源类型。
 * 通用文档解析沿用 text 配额，避免在支付和数据层引入没有必要的新枚举。
 *
 * 真正防成本的两道闸门保留：单次内容长度、积分总量。等有了付费数据再决定卡哪里。
 */
export const PLAN_LIMITS: Record<Plan, { kinds: InputKind[]; tiers: ModelTier[]; maxChars: number; maxPdfPages: number }> = {
  // 免费版不含 youtube：字幕走的是按次计费的第三方 API，成本是真金白银，
  // 和其它输入不同——那些只花模型钱。要放开就把 'youtube' 加回这一行。
  free: { kinds: ['text', 'web', 'pdf'], tiers: ['fast'], maxChars: 60_000, maxPdfPages: 30 },
  basic: { kinds: ['text', 'web', 'pdf', 'youtube'], tiers: ['fast'], maxChars: 150_000, maxPdfPages: 60 },
  pro: { kinds: ['text', 'web', 'pdf', 'youtube'], tiers: ['fast', 'quality'], maxChars: 800_000, maxPdfPages: 200 },
  unlimited: { kinds: ['text', 'web', 'pdf', 'youtube'], tiers: ['fast', 'quality'], maxChars: 2_000_000, maxPdfPages: 200 },
};

const BASE_COST: Record<InputKind, number> = { text: 1, web: 1, pdf: 2, youtube: 2 };
const TIER_MULTIPLIER: Record<ModelTier, number> = { fast: 1, quality: 3 };
const DEPTH_MULTIPLIER: Record<Depth, number> = { concise: 1, standard: 1, detailed: 2 };

/** 生成前预估扣费。按内容长度分段加价，防止一份 500 页 PDF 只扣 2 分。 */
export function estimateCredits(opts: { kind: InputKind; tier: ModelTier; depth: Depth; chars: number }): number {
  const sizeFactor = 1 + Math.floor(opts.chars / 50_000);
  return Math.max(
    1,
    Math.round(BASE_COST[opts.kind] * TIER_MULTIPLIER[opts.tier] * DEPTH_MULTIPLIER[opts.depth] * sizeFactor),
  );
}

/** AI 展开/精简单个节点，单独计费 */
export const NODE_ACTION_CREDITS = 1;

export interface GateResult {
  ok: boolean;
  reason?: string;
  code?: 'plan_kind' | 'plan_tier' | 'too_large' | 'insufficient_credits';
}

export function checkGate(opts: {
  plan: Plan;
  credits: number;
  kind: InputKind;
  tier: ModelTier;
  depth: Depth;
  chars: number;
}): GateResult {
  const limits = PLAN_LIMITS[opts.plan];

  if (!limits.kinds.includes(opts.kind)) {
    return { ok: false, code: 'plan_kind', reason: `Your current plan does not support ${kindLabel(opts.kind)} input — please upgrade` };
  }
  if (!limits.tiers.includes(opts.tier)) {
    return { ok: false, code: 'plan_tier', reason: 'The high-quality model requires the Pro plan' };
  }
  if (opts.chars > limits.maxChars) {
    return { ok: false, code: 'too_large', reason: `Content exceeds your plan limit of ${limits.maxChars.toLocaleString()} characters` };
  }

  const cost = estimateCredits(opts);
  if (opts.credits < cost) {
    return { ok: false, code: 'insufficient_credits', reason: `Not enough credits — this run needs ${cost}` };
  }
  return { ok: true };
}

export function kindLabel(kind: InputKind): string {
  return { text: 'text', pdf: 'PDF', web: 'web page', youtube: 'YouTube' }[kind];
}

