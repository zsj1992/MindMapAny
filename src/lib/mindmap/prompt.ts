import { DEPTH_BUDGET, type Depth, type MindMap, type Purpose } from './schema';

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
    '- 一级主题（语义类别）',
    '  - 二级标签：一句完整的说明 ^chunkId',
    '',
    '规则：',
    `1. 【最高优先级】全部输出必须是 ${opts.language}。原文是任何其他语言（含繁体中文、英文、日文）都必须完整转换，`,
    '   一个字都不能保留原文形态。宁可意译也不要照抄原文用词。',
    `2. 层级最多 ${maxLevel} 层（根标题算第 1 层），总节点数控制在 ${minNodes}-${maxNodes} 个。`,
    '3. 每层用 2 个空格缩进，只用 "-" 作为项目符号。',
    '4. 【先分类，再填条款】先通读全部内容，归纳 4-8 个互不重复、基本覆盖全文的一级主题，再把具体事实放到对应主题下。',
    '   一级主题必须处于相同抽象层次，例如“适用范围 / 申请流程 / 行为规范 / 费用与责任”，不能混入日期、金额或单条事实。',
    '   内容足够形成 10 个以上节点时，禁止把具体事实直接挂在根标题下；每个一级主题原则上至少有 2 个子节点。',
    '5. 【叶子节点写成「标签：说明」】标签是 2-8 字的名词短语，冒号后是一句完整、能独立读懂的说明。',
    '   示例：好 → "噪音限制：23:00 至 08:00 为安静时段，考试期间 24 小时安静"',
    '   示例：差 → "噪音限制" / "23:00" / "安静时段"（拆成三个碎节点，读者要自己拼）',
    '6. 【宁可少而密，不要多而稀】能写进一句说明的内容不要拆成多个节点。',
    '   非叶子节点只写标签，不写说明，因为它的信息由子节点承载。',
    '7. 非叶子节点标题 2-10 字；叶子节点连标签带说明不超过 60 字。',
    '8. 根标题不超过 20 字，是内容的名字而不是概括，不要写成完整句子。',
    '9. 每个叶子节点必须以 ^chunkId 结尾。只能用下方给出的 chunkId，禁止编造。',
    '10. 禁止输出页码、时间戳、章节号 —— 这些由系统根据 chunkId 自动还原。',
    '11. 同一父节点下不要出现语义重复的兄弟节点；宁可合并，也不要凑数。',
    '12. 忠于原文，不补充原文没有的信息，不做评价。',
    '',
    '结构反例（禁止）：根标题下连续罗列十几条申请日期、价格、规则等具体事实。',
    '结构正例：根标题下先分“申请与资格、住宿安排、费用支付、行为规范、退宿管理”等主题，再在主题下列事实。',
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
    '- 【先分类，再填条款】根标题下归纳 4-8 个同一抽象层次的语义类别，具体事实必须放在类别之下。',
    '- 禁止把十几条具体事实直接平铺在根标题下；每个一级主题原则上至少有 2 个子节点。',
    '- 保持原文的整体推进顺序，不要按字母或重要性重排。',
    `- 最终不超过 ${maxLevel} 层，总节点数 ${minNodes}-${maxNodes} 个。`,
    '- 【硬性要求】每个叶子节点行必须以 ^chunkId 结尾，原样照抄，不要改动也不要省略。',
    '  合并两条要点时，保留信息更完整那条的 ^chunkId。丢失 ^chunkId 的行视为无效输出。',
    '- 叶子节点保持「标签：一句完整说明」的形式；碎片化的短节点要合并成完整句子。',
    `- 【最高优先级】输出必须全部是 ${opts.language}，原文是繁体或外语都要完整转换。只输出 Markdown 大纲。`,
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
    '你是脑图信息架构编辑。请把给出的一级节点分成语义清晰的主题组。只做分类，不改写节点。',
    '',
    '硬性要求：',
    '- 建立 4-8 个同一抽象层次、互不重复且基本覆盖全部节点的主题组。',
    '- 如果现有节点本身就是合适的分类标题（例如“清洁卫生与设施使用”），必须用 parentNodeId 将它提升为父节点，不要另造近义组名。',
    '- parentNodeId 对应分类节点，nodeIds 是它下面的具体条款；没有可复用分类节点时 parentNodeId 写 null。',
    '- 每个输入 nodeId 必须在 parentNodeId 或 nodeIds 中出现且只能出现一次；禁止编造、修改或遗漏 nodeId。',
    '- 每组原则上至少包含 2 个具体条款；复用现有分类节点时允许只有 1 个明确子条款。',
    '- 组名是 2-10 字的名词短语，不能是日期、金额或单条事实。',
    `- 组名必须使用 ${opts.language}。`,
    '- 只输出一个 JSON 对象，禁止 Markdown、解释和代码块。',
    '- 严格格式：{"groups":[{"title":"清洁卫生与设施使用","parentNodeId":"n2","nodeIds":["n3"]},{"title":"申请与资格","parentNodeId":null,"nodeIds":["n4","n5"]}]}',
    '',
    PURPOSE_GUIDE[opts.purpose],
  ].join('\n');
}

export function buildHierarchyPlanUserPrompt(map: MindMap): string {
  const root = map.nodes.find((node) => node.parentId === null);
  const children = root ? map.nodes.filter((node) => node.parentId === root.id) : [];
  return [
    `根标题：${map.title}`,
    '',
    '待分类的一级节点：',
    ...children.map((node) => `[${node.id}] ${node.title}`),
    '',
    '现在输出分类 JSON。',
  ].join('\n');
}
