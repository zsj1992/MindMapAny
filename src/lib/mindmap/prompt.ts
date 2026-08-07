import { DEPTH_BUDGET, type Depth, type Purpose } from './schema';

/** 送进模型的内容块。chunkId 在切块阶段生成，模型只负责回引它。 */
export interface PromptChunk {
  chunkId: string;
  text: string;
  /** 给模型看的位置提示，如 "p.3" / "12:40"，仅辅助判断顺序，不用于最终溯源 */
  hint?: string;
}

const PURPOSE_GUIDE: Record<Purpose, string> = {
  study: '面向学习复习：突出概念定义、因果关系、易混点，叶子节点尽量是可被记忆的要点。',
  structure: '面向文章结构分析：还原原文的章节骨架与论证脉络，保持作者原有的组织顺序。',
  meeting: '面向会议整理：区分议题、结论、待办与负责人，决策和 action item 必须单独成节点。',
  general: '面向通用理解：均衡覆盖全文主要信息，不偏向任何特定用途。',
};

export function buildSystemPrompt(opts: { language: string; depth: Depth; purpose: Purpose }): string {
  const { maxLevel, minNodes, maxNodes } = DEPTH_BUDGET[opts.depth];
  return [
    '你是一个把长内容转换成层级脑图的分析器。只输出 Markdown 缩进大纲，不输出任何解释、前言或代码块围栏。',
    '',
    '输出格式（严格遵守）：',
    '# 根标题',
    '- 一级主题 ^chunkId',
    '  > 一句话补充说明（可选，最多一行）',
    '  - 二级主题 ^chunkId',
    '',
    '规则：',
    `1. 全部输出使用语言：${opts.language}。原文语言不同也要翻译成该语言。`,
    `2. 层级最多 ${maxLevel} 层（根标题算第 1 层），总节点数控制在 ${minNodes}-${maxNodes} 个。`,
    '3. 每层用 2 个空格缩进，只用 "-" 作为项目符号。',
    '4. 节点标题是名词短语或短句，不超过 30 字，不要以 "关于"、"介绍" 开头，不要编号。',
    '4b. 根标题不超过 20 字，是内容的名字而不是内容的概括，不要写成完整句子。',
    '5. 每个叶子节点必须以 ^chunkId 结尾，标注该内容来自哪个输入块。只能使用下方给出的 chunkId，禁止编造。',
    '6. 禁止输出页码、时间戳、章节号等位置信息 —— 这些由系统根据 chunkId 自动还原。',
    '7. 同一父节点下不要出现语义重复的兄弟节点；宁可合并，也不要凑数。',
    '8. 忠于原文，不补充原文没有的信息，不做评价。',
    '',
    PURPOSE_GUIDE[opts.purpose],
  ].join('\n');
}

export function buildUserPrompt(chunks: PromptChunk[], sourceTitle?: string): string {
  const head = sourceTitle ? `内容标题：${sourceTitle}\n\n` : '';
  const body = chunks
    .map((c) => `<chunk id="${c.chunkId}"${c.hint ? ` at="${c.hint}"` : ''}>\n${c.text}\n</chunk>`)
    .join('\n\n');
  return `${head}可用的 chunkId：${chunks.map((c) => c.chunkId).join(', ')}\n\n${body}\n\n现在输出脑图大纲。`;
}

/**
 * map-reduce 的 reduce 阶段：把各分块产出的局部大纲合并成一棵最终树。
 * 长文档不一次性塞给模型，靠这一步保证层级稳定、去重。
 */
export function buildReducePrompt(opts: { language: string; depth: Depth; purpose: Purpose }): string {
  const { maxLevel, minNodes, maxNodes } = DEPTH_BUDGET[opts.depth];
  return [
    '下面是同一份内容不同片段各自生成的局部脑图大纲。把它们合并成一棵完整、层级一致、无重复的脑图。',
    '',
    '要求：',
    '- 合并语义重复的主题，保留信息更完整的表述。',
    '- 保持原文的整体推进顺序，不要按字母或重要性重排。',
    `- 最终不超过 ${maxLevel} 层，总节点数 ${minNodes}-${maxNodes} 个。`,
    '- 原样保留每个节点末尾的 ^chunkId；合并节点时保留最具代表性的那一个。',
    `- 输出语言：${opts.language}。仍然只输出 Markdown 大纲，不要任何解释。`,
    '',
    PURPOSE_GUIDE[opts.purpose],
  ].join('\n');
}
