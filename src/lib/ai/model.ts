import { createDeepSeek } from '@ai-sdk/deepseek';
import type { JSONValue, LanguageModel } from 'ai';

/**
 * 模型解析。按环境变量自动选后端，代码里只认 fast / quality 两个档位：
 *   1. DEEPSEEK_API_KEY  → DeepSeek（成本最低，中文最好，首选）
 *   2. 都没有            → Vercel AI Gateway 的 "provider/model" 字符串
 *
 * 换供应商只改 env，业务代码一行不动。
 */

export type ModelTier = 'fast' | 'quality';

export interface ModelConfig {
  model: LanguageModel;
  providerOptions?: Record<string, Record<string, JSONValue>>;
}

const GATEWAY_DEFAULTS: Record<ModelTier, string> = {
  fast: process.env.MODEL_FAST ?? 'google/gemini-2.5-flash',
  quality: process.env.MODEL_QUALITY ?? 'anthropic/claude-sonnet-4.5',
};

// 注意：deepseek-chat / deepseek-reasoner 已于 2026-07-24 停用，必须用 v4 系列
const DEEPSEEK_MODELS: Record<ModelTier, string> = {
  fast: process.env.DEEPSEEK_MODEL_FAST ?? 'deepseek-v4-flash',
  quality: process.env.DEEPSEEK_MODEL_QUALITY ?? 'deepseek-v4-pro',
};

/**
 * DeepSeek V4 默认开启思维链且 reasoning_effort=high，实测代价极大：
 * 同一份维基页面，开着要 63–129 秒、烧掉 6000–14500 个 reasoning token，
 * 而且长度不可控 —— 经常在产出任何正文之前就把预算耗光，表现为「接口成功但内容为空」。
 * 关掉后 7.6 秒、0 reasoning、正文照常。
 *
 * 我们这个任务是抽取和归纳结构，不是解数学题，思维链带不来质量，只带来延迟和成本。
 * reasoning_effort='low' 试过，无效 —— 只有彻底 disabled 才行。
 */
const DEEPSEEK_NO_THINKING: Record<string, JSONValue> = { thinking: { type: 'disabled' } };

export function resolveModelConfig(tier: ModelTier): ModelConfig {
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  if (deepseekKey) {
    const deepseek = createDeepSeek({ apiKey: deepseekKey });
    return {
      model: deepseek(DEEPSEEK_MODELS[tier]),
      providerOptions: { deepseek: DEEPSEEK_NO_THINKING },
    };
  }
  return { model: GATEWAY_DEFAULTS[tier] };
}

/** 供排障和日志使用，别把 key 本身打出来 */
export function activeProvider(): string {
  if (process.env.DEEPSEEK_API_KEY) return `deepseek:${DEEPSEEK_MODELS.fast}(no-thinking)`;
  return `gateway:${GATEWAY_DEFAULTS.fast}`;
}
