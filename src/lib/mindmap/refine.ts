import { generateText } from 'ai';
import { resolveModelConfig } from '@/lib/ai/model';
import { languageName } from './prompt';
import { parseOutline } from './outline';
import { toTree, type Depth, type MindMap, type MindMapTreeNode, type SourceRef } from './schema';

/**
 * 生成之后用一句话改图：「更精简」「补充 X 方面」「翻译成英文」。
 *
 * 做法是大纲往返 —— 把现有脑图还原成缩进大纲交给模型，改完再解析回脑图。
 *
 * 溯源必须活着穿过这一趟。toOutline 不输出溯源标记，直接拿它往返会把
 * 全部页码引用抹掉，而「每个节点都能回到原文」是整个产品的立身之本。
 *
 * 标记用 chunkId 而不是节点 id：chunkId 才是指向原文位置的那把钥匙，
 * 而且 parseOutline 本来就认识 ^chunkId，生成阶段的提示词也一直这么要求模型 ——
 * 沿用同一套记号，模型不需要学新规则，我们也不必写一套回填逻辑。
 * 新增的行没有 chunkId，也就没有 source —— 这是对的：凭空多出来的节点
 * 本来就没有出处，宁可空着也不能借用别人的页码。
 */

export type RefineAction = 'concise' | 'detail' | 'translate' | 'regenerate' | 'custom';

const ACTION_PROMPT: Record<Exclude<RefineAction, 'custom' | 'translate'>, string> = {
  concise: 'Make the map more concise: merge overlapping siblings and cut nodes that repeat what a sibling already says. Keep every distinct fact; do not drop a branch wholesale.',
  detail: 'Add depth where the map is thin: expand top-level topics that have fewer than two children, and turn one-word leaves into a "Label: one complete sentence" form. Do not invent facts that were not implied by the existing nodes.',
  regenerate: 'Reorganise the same material under a better set of top-level topics. Keep the facts; change how they are grouped.',
};

/** 带 ^chunkId 标记的大纲。只有有溯源的节点才带标记。 */
function toMarkedOutline(map: MindMap): string {
  const root = toTree(map);
  if (!root) return '';
  const lines = [`# ${root.title}`];
  const walk = (node: MindMapTreeNode, level: number) => {
    for (const child of node.children) {
      const mark = child.source ? ` ^${child.source.chunkId}` : '';
      lines.push(`${'  '.repeat(level)}- ${child.title}${mark}`);
      if (child.summary) lines.push(`${'  '.repeat(level + 1)}> ${child.summary}`);
      walk(child, level + 1);
    }
  };
  walk(root, 0);
  return lines.join('\n');
}

export interface RefineResult {
  map: MindMap;
  usage: { inputTokens: number; outputTokens: number };
}

export async function refineMindMap(opts: {
  map: MindMap;
  action: RefineAction;
  /** action 为 custom 时的用户指令；translate 时是目标语言码 */
  instruction?: string;
  signal?: AbortSignal;
}): Promise<RefineResult> {
  const { map, action } = opts;
  const targetLanguage = action === 'translate' ? (opts.instruction ?? map.language) : map.language;
  const { model, providerOptions } = resolveModelConfig('fast');

  const task =
    action === 'translate'
      ? `Translate every node into ${languageName(targetLanguage)}. Keep the structure exactly as it is — same nodes, same nesting, same order. Translate only the words.`
      : action === 'custom'
        ? `Apply this instruction from the reader: "${opts.instruction ?? ''}". Change only what the instruction asks for.`
        : ACTION_PROMPT[action];

  const system = [
    'You revise an existing mind map outline. Output only the revised indented Markdown outline — no explanation, no code fences.',
    '',
    'Format rules:',
    '1. Keep the "# Root title" first line, then "- " bullets indented by 2 spaces per level.',
    '2. A node that keeps its meaning MUST keep its "^chunkId" marker unchanged at the end of the line. Never invent one, never move one to a different node.',
    '3. A node you newly create has no marker — leave it off entirely.',
    '4. A node you delete simply does not appear. Its marker must not appear anywhere else.',
    '5. Explanations written as "> text" under a bullet stay in that form.',
    `6. Write in ${languageName(targetLanguage)}.`,
    '',
    'These markers are how the reader keeps the page citations that were verified against the original document. Moving or inventing one attaches a real citation to the wrong claim.',
    '',
    `Task: ${task}`,
  ].join('\n');

  const result = await generateText({
    model,
    system,
    prompt: toMarkedOutline(map),
    ...(providerOptions ? { providerOptions } : {}),
    ...(opts.signal ? { abortSignal: opts.signal } : {}),
  });

  // chunkIndex 从原图重建：模型回引哪个 chunkId，就还原成原来那条溯源
  const chunkIndex = new Map<string, SourceRef>();
  for (const node of map.nodes) if (node.source) chunkIndex.set(node.source.chunkId, node.source);

  const parsed = parseOutline(result.text, { depth: map.depth as Depth, fallbackTitle: map.title, chunkIndex });
  if (!parsed.nodes.length) throw new Error('refine produced an empty map');

  return {
    map: {
      ...map,
      title: parsed.title || map.title,
      language: targetLanguage,
      nodes: parsed.nodes,
      createdAt: new Date().toISOString(),
    },
    usage: { inputTokens: result.usage?.inputTokens ?? 0, outputTokens: result.usage?.outputTokens ?? 0 },
  };
}

