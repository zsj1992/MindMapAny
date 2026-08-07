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

/** 各档位允许的输入类型与模型 */
export const PLAN_LIMITS: Record<Plan, { kinds: InputKind[]; tiers: ModelTier[]; maxChars: number; maxPdfPages: number }> = {
  free: { kinds: ['text', 'web'], tiers: ['fast'], maxChars: 20_000, maxPdfPages: 10 },
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
    return { ok: false, code: 'plan_kind', reason: `当前套餐不支持${kindLabel(opts.kind)}输入，请升级` };
  }
  if (!limits.tiers.includes(opts.tier)) {
    return { ok: false, code: 'plan_tier', reason: '高质量模型需要 Pro 套餐' };
  }
  if (opts.chars > limits.maxChars) {
    return { ok: false, code: 'too_large', reason: `内容长度超出当前套餐上限（${limits.maxChars.toLocaleString()} 字符）` };
  }

  const cost = estimateCredits(opts);
  if (opts.credits < cost) {
    return { ok: false, code: 'insufficient_credits', reason: `积分不足，本次需要 ${cost} 积分` };
  }
  return { ok: true };
}

export function kindLabel(kind: InputKind): string {
  return { text: '文本', pdf: 'PDF', web: '网页', youtube: 'YouTube' }[kind];
}

/**
 * 未登录用户的免费试用：按 IP + 指纹给一次机会，只走最便宜的路径。
 * 真正的防滥用要靠内容哈希缓存 + 速率限制，这里只是第一道门。
 */
export const ANON_TRIAL_LIMITS = { kinds: ['text', 'web'] as InputKind[], tier: 'fast' as ModelTier, maxChars: 8_000 };
