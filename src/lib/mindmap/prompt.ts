import { DEPTH_BUDGET, type Depth, type MindMap, type Purpose } from './schema';

/** 送进模型的内容块。chunkId 在切块阶段生成，模型只负责回引它。 */
export interface PromptChunk {
  chunkId: string;
  text: string;
  /** 给模型看的位置提示，如 "p.3" / "12:40"，仅辅助判断顺序，不用于最终溯源 */
  hint?: string;
}

const PURPOSE_GUIDE: Record<Purpose, string> = {
  study: 'Optimise for study and revision: foreground definitions, causal links and easily confused points, and make leaf nodes memorable takeaways.',
  structure: 'Optimise for structural analysis: reconstruct the section skeleton and line of argument, keeping the order the author used.',
  meeting: 'Optimise for meeting notes: separate topics, conclusions, action items and owners. Every decision and action item gets its own node.',
  general: 'Optimise for general understanding: cover the main information evenly, without favouring any particular use.',
};

export function buildSystemPrompt(opts: { language: string; depth: Depth; purpose: Purpose }): string {
  const { maxLevel, minNodes, maxNodes } = DEPTH_BUDGET[opts.depth];
  return [
    'You convert long content into a hierarchical mind map. Output an indented Markdown outline only — no explanation, no preamble, no code fences.',
    '',
    'Output format (follow exactly):',
    '# Root title',
    '- Top-level topic (a semantic category)',
    '  - Label: one complete sentence of explanation ^chunkId',
    '',
    'Rules:',
    `1. [HIGHEST PRIORITY] Every word of the output must be in ${opts.language}. If the source is in any other language, translate it fully —`,
    '   do not leave any of it in its original form. Paraphrase rather than copy the source wording.',
    `2. At most ${maxLevel} levels (the root title counts as level 1), and ${minNodes}-${maxNodes} nodes in total.`,
    '3. Indent each level by 2 spaces and use "-" as the only bullet character.',
    '4. [CATEGORISE FIRST, THEN FILE THE FACTS] Read everything first, derive 4-8 non-overlapping top-level topics that between them cover the content, then place specific facts under the right topic.',
    '   Top-level topics must sit at the same level of abstraction — for example "Scope / Application process / Conduct / Fees and liability" — and must never be a date, an amount or a single fact.',
    '   When the content yields more than 10 nodes, never hang specific facts directly off the root title. As a rule each top-level topic should have at least 2 children.',
    '5. [WRITE LEAF NODES AS "Label: explanation"] The label is a noun phrase of 1-4 words; after the colon comes one complete sentence that can be read on its own.',
    '   Good: "Noise limits: quiet hours run from 23:00 to 08:00, and 24 hours a day during exam periods"',
    '   Bad: "Noise limits" / "23:00" / "Quiet hours" (three fragments the reader has to reassemble)',
    '6. [FEWER, DENSER NODES BEATS MORE, THINNER ONES] If something fits in one sentence of explanation, do not split it across nodes.',
    '   Non-leaf nodes carry only a label and no explanation, because their children carry the information.',
    '7. Non-leaf node titles run 1-5 words; a leaf node including its label stays under about 25 words.',
    '8. The root title is at most 8 words. It names the content rather than summarising it, and is not a full sentence.',
    '9. Every leaf node must end with ^chunkId. Use only the chunkIds supplied below; never invent one.',
    '10. Never output page numbers, timestamps or section numbers — the system restores those from the chunkId.',
    '11. No semantically duplicated siblings under the same parent. Merge rather than pad.',
    '12. Stay faithful to the source. Add nothing it does not contain, and pass no judgement.',
    '',
    'Bad structure (forbidden): a dozen application dates, prices and rules listed straight under the root title.',
    'Good structure: the root title splits into topics such as "Eligibility and application, Room allocation, Fees, Conduct, Moving out", and the facts sit under those.',
    '',
    PURPOSE_GUIDE[opts.purpose],
  ].join('\n');
}

export function buildUserPrompt(chunks: PromptChunk[], sourceTitle?: string): string {
  const head = sourceTitle ? `Content title: ${sourceTitle}\n\n` : '';
  const body = chunks
    .map((c) => `<chunk id="${c.chunkId}"${c.hint ? ` at="${c.hint}"` : ''}>\n${c.text}\n</chunk>`)
    .join('\n\n');
  return `${head}Available chunkIds: ${chunks.map((c) => c.chunkId).join(', ')}\n\n${body}\n\nNow output the mind map outline.`;
}

/**
 * map-reduce 的 reduce 阶段：把各分块产出的局部大纲合并成一棵最终树。
 * 长文档不一次性塞给模型，靠这一步保证层级稳定、去重。
 */
export function buildReducePrompt(opts: { language: string; depth: Depth; purpose: Purpose }): string {
  const { maxLevel, minNodes, maxNodes } = DEPTH_BUDGET[opts.depth];
  return [
    'Below are partial mind map outlines, each generated from a different section of the same content. Merge them into one complete map with a consistent hierarchy and no duplication.',
    '',
    'Requirements:',
    '- Merge semantically duplicated topics, keeping whichever wording carries more information.',
    '- [CATEGORISE FIRST, THEN FILE THE FACTS] Derive 4-8 categories at the same level of abstraction under the root title, and place every specific fact beneath a category.',
    '- Never lay a dozen specific facts flat under the root title. As a rule each top-level topic should have at least 2 children.',
    '- Preserve the overall order of the source. Do not re-sort alphabetically or by importance.',
    `- The result must stay within ${maxLevel} levels and ${minNodes}-${maxNodes} nodes.`,
    '- [HARD REQUIREMENT] Every leaf node line must end with ^chunkId, copied verbatim — never altered, never dropped.',
    '  When merging two points, keep the ^chunkId of the one carrying more information. A line that loses its ^chunkId is invalid output.',
    '- Keep leaf nodes in the "Label: one complete sentence" form, merging fragmentary short nodes into full sentences.',
    `- [HIGHEST PRIORITY] The entire output must be in ${opts.language}; translate the source fully whatever language it is in. Output the Markdown outline only.`,
    '',
    PURPOSE_GUIDE[opts.purpose],
  ].join('\n');
}

/**
 * 对扁平图只生成“分类计划”，节点重挂由代码确定性执行。
 * 这比要求模型再次输出带缩进的大纲稳定，也不会改写或丢失事实节点。
 */
export function buildHierarchyPlanPrompt(opts: { language: string; purpose: Purpose }): string {
  return [
    'You are an information architect for mind maps. Group the top-level nodes you are given into clear semantic groups. Classify only — do not rewrite the nodes.',
    '',
    'Hard requirements:',
    '- Create 4-8 groups at the same level of abstraction, non-overlapping, between them covering essentially every node.',
    '- Where an existing node is itself a suitable category heading (for example "Cleaning and facility use"), promote it with parentNodeId instead of inventing a near-synonym group name.',
    '- parentNodeId is the category node; nodeIds are the specific items beneath it. Use null for parentNodeId when there is no existing node to reuse.',
    '- Every input nodeId must appear exactly once, in either parentNodeId or nodeIds. Never invent, alter or omit a nodeId.',
    '- As a rule each group holds at least 2 specific items; a group reusing an existing category node may hold just 1 clear child.',
    '- Group names are noun phrases of 1-5 words, never a date, an amount or a single fact.',
    `- Group names must be in ${opts.language}.`,
    '- Output a single JSON object only — no Markdown, no explanation, no code fences.',
    '- Exact shape: {"groups":[{"title":"Cleaning and facility use","parentNodeId":"n2","nodeIds":["n3"]},{"title":"Eligibility and application","parentNodeId":null,"nodeIds":["n4","n5"]}]}',
    '',
    PURPOSE_GUIDE[opts.purpose],
  ].join('\n');
}

export function buildHierarchyPlanUserPrompt(map: MindMap): string {
  const root = map.nodes.find((node) => node.parentId === null);
  const children = root ? map.nodes.filter((node) => node.parentId === root.id) : [];
  return [
    `Root title: ${map.title}`,
    '',
    'Top-level nodes to classify:',
    ...children.map((node) => `[${node.id}] ${node.title}`),
    '',
    'Now output the classification JSON.',
  ].join('\n');
}
