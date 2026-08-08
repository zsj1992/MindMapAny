import { generateText, streamText } from 'ai';
import { resolveModelConfig, type ModelTier } from '@/lib/ai/model';

export type { ModelTier };
import { chunkDocument, groupChunks, needsMapReduce } from '@/lib/chunk';
import type { ExtractedDoc } from '@/lib/extract/types';
import { applyHierarchyPlan, buildMindMap, inspectHierarchy } from './outline';
import {
  buildHierarchyPlanPrompt,
  buildHierarchyPlanUserPrompt,
  buildReducePrompt,
  buildSystemPrompt,
  buildUserPrompt,
} from './prompt';
import { DEPTH_BUDGET, type Depth, type MindMap, type Purpose, type SourceRef } from './schema';

/**
 * 生成分两条路径：
 * - 短内容：一次调用，流式输出大纲，前端边收边渲染。
 * - 长内容：map-reduce。每组分块各出局部大纲（可并发），再合并成最终树。
 *
 * 模型档位由 lib/ai/model.ts 按环境变量解析：免费档走快模型、付费档走强模型，
 * 这既是成本闸门也是付费墙。
 */


export interface GenerateOptions {
  doc: ExtractedDoc;
  language: string;
  depth: Depth;
  purpose: Purpose;
  tier: ModelTier;
  signal?: AbortSignal;
}

export interface GenerateResult {
  map: MindMap;
  warnings: string[];
  /** 便于成本核算和积分扣费 */
  usage: { inputTokens: number; outputTokens: number; calls: number };
}

/** 单次调用的最大输出：一行大纲约 40 token。思维链已关闭，不再需要额外预留 */
function maxOutputTokens(depth: Depth): number {
  return Math.min(8000, DEPTH_BUDGET[depth].maxNodes * 40 + 500);
}

export async function generateMindMap(opts: GenerateOptions): Promise<GenerateResult> {
  const { doc, language, depth, purpose, tier, signal } = opts;
  const { chunks, chunkIndex } = chunkDocument(doc);
  if (!chunks.length) throw new Error('no content to summarize');

  const { model, providerOptions } = resolveModelConfig(tier);
  const system = buildSystemPrompt({ language, depth, purpose });
  const usage = { inputTokens: 0, outputTokens: 0, calls: 0 };

  let outline: string;
  /** 标签 → chunkId，仅 map-reduce 路径需要 */
  let refByLabel = new Map<string, string>();

  if (!needsMapReduce(chunks)) {
    const res = await generateText({
      model,
      system,
      prompt: buildUserPrompt(chunks, doc.title),
      maxOutputTokens: maxOutputTokens(depth),
      abortSignal: signal,
      ...(providerOptions ? { providerOptions } : {}),
    });
    outline = res.text;
    if (res.finishReason === 'length' && !outline.trim()) {
      throw new Error('output budget exhausted before any text was produced');
    }
    usage.calls = 1;
    usage.inputTokens += res.usage?.inputTokens ?? 0;
    usage.outputTokens += res.usage?.outputTokens ?? 0;
  } else {
    const groups = groupChunks(chunks);
    // map 阶段并发：长文档的墙钟时间几乎全在这里
    const partials = await Promise.all(
      groups.map(async (group, i) => {
        const res = await generateText({
          model,
          system: buildSystemPrompt({ language, depth: 'standard', purpose }),
          prompt: buildUserPrompt(group, `${doc.title}（第 ${i + 1}/${groups.length} 部分）`),
          maxOutputTokens: 3000,
          abortSignal: signal,
          ...(providerOptions ? { providerOptions } : {}),
        });
        usage.calls++;
        usage.inputTokens += res.usage?.inputTokens ?? 0;
        usage.outputTokens += res.usage?.outputTokens ?? 0;
        return res.text;
      }),
    );

    // reduce 阶段模型经常在改写节点时把 ^chunkId 丢掉，光靠 prompt 求它求不住。
    // 先把 map 阶段每条要点的 chunkId 记下来，合并后按标签找回，属于确定性兜底。
    refByLabel = collectRefs(partials);

    const reduce = await generateText({
      model,
      system: buildReducePrompt({ language, depth, purpose }),
      prompt: partials.map((p, i) => `<part index="${i + 1}">\n${p}\n</part>`).join('\n\n'),
      maxOutputTokens: maxOutputTokens(depth),
      abortSignal: signal,
      ...(providerOptions ? { providerOptions } : {}),
    });
    outline = reduce.text;
    usage.calls++;
    usage.inputTokens += reduce.usage?.inputTokens ?? 0;
    usage.outputTokens += reduce.usage?.outputTokens ?? 0;
  }

  const built = buildMindMap(outline, {
    language,
    depth,
    purpose,
    fallbackTitle: doc.title,
    chunkIndex,
  });

  const initialQuality = inspectHierarchy(built.map);
  if (initialQuality.needsRepair) {
    try {
      const planned = await generateText({
        model,
        system: buildHierarchyPlanPrompt({ language, purpose }),
        prompt: buildHierarchyPlanUserPrompt(built.map),
        maxOutputTokens: 1600,
        abortSignal: signal,
        ...(providerOptions ? { providerOptions } : {}),
      });
      usage.calls++;
      usage.inputTokens += planned.usage?.inputTokens ?? 0;
      usage.outputTokens += planned.usage?.outputTokens ?? 0;

      const applied = applyHierarchyPlan(built.map, planned.text);
      const plannedQuality = applied ? inspectHierarchy(applied.map) : null;
      if (applied && plannedQuality && plannedQuality.score > initialQuality.score) {
        built.map = applied.map;
        built.warnings.push(
          `hierarchy grouped (${initialQuality.score} -> ${plannedQuality.score}; ${applied.groups} groups; ${Math.round(applied.coverage * 100)}% planned)`,
        );
      } else {
        built.warnings.push(`hierarchy plan rejected (${initialQuality.score} -> ${plannedQuality?.score ?? 0})`);
      }
    } catch (error) {
      if (signal?.aborted) throw error;
      // 初次生成仍是一张可用导图；修复失败不应把整个请求变成 500。
      built.warnings.push(`hierarchy repair failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const { map, warnings } = built;

  const recovered = recoverSources(map, refByLabel, chunkIndex);
  if (recovered) warnings.push(`recovered ${recovered} source refs dropped during reduce`);

  // 只剩根节点说明模型没按格式输出，宁可报错也不要给用户一张空图
  if (map.nodes.length <= 1) {
    throw new Error('model returned no usable outline');
  }
  return { map, warnings, usage };
}

/**
 * 流式版本：短内容专用，边生成边把大纲片段推给前端。
 * 前端每收到一段就重新解析整份大纲重绘 —— 解析器是纯函数且很快，
 * 这比维护增量状态简单得多，也不怕中途格式错乱。
 */
export function streamOutline(opts: GenerateOptions) {
  const { doc, language, depth, purpose, tier, signal } = opts;
  const { chunks, chunkIndex } = chunkDocument(doc);

  const streamCfg = resolveModelConfig(tier);
  const result = streamText({
    model: streamCfg.model,
    ...(streamCfg.providerOptions ? { providerOptions: streamCfg.providerOptions } : {}),
    system: buildSystemPrompt({ language, depth, purpose }),
    prompt: buildUserPrompt(chunks, doc.title),
    maxOutputTokens: maxOutputTokens(depth),
    abortSignal: signal,
  });

  return { result, chunkIndex };
}

/** 叶子节点写成「标签：说明」，标签是稳定的锚点，用它做跨阶段匹配 */
function labelOf(title: string): string {
  const head = title.split(/[：:]/)[0];
  return head.replace(/\s+/g, '').toLowerCase().slice(0, 24);
}

/** 从 map 阶段的局部大纲里收集 标签 → chunkId */
function collectRefs(partials: string[]): Map<string, string> {
  const refs = new Map<string, string>();
  for (const part of partials) {
    for (const raw of part.split('\n')) {
      const m = raw.match(/^\s*[-*+]\s+(.*?)\s*\^([A-Za-z0-9_-]{1,32})\s*$/);
      if (!m) continue;
      const key = labelOf(m[1]);
      // 同名标签取第一次出现的，避免后面的覆盖掉更贴切的那个
      if (key && !refs.has(key)) refs.set(key, m[2]);
    }
  }
  return refs;
}

/** 给合并后丢了溯源的叶子节点补回 chunkId，返回补回的条数 */
function recoverSources(
  map: MindMap,
  refByLabel: Map<string, string>,
  chunkIndex: Map<string, SourceRef>,
): number {
  if (!refByLabel.size) return 0;
  const parents = new Set(map.nodes.map((n) => n.parentId).filter(Boolean));
  let count = 0;
  for (const node of map.nodes) {
    if (node.source || !node.parentId || parents.has(node.id)) continue;
    const chunkId = refByLabel.get(labelOf(node.title));
    const ref = chunkId ? chunkIndex.get(chunkId) : undefined;
    if (ref) {
      node.source = ref;
      count++;
    }
  }
  return count;
}
