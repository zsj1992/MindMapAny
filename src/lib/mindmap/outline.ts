import {
  DEPTH_BUDGET,
  MAX_SUMMARY_LEN,
  MAX_TITLE_LEN,
  type Depth,
  type MindMap,
  type MindMapNode,
  type Purpose,
  type SourceRef,
  toTree,
  type MindMapTreeNode,
} from './schema';

/**
 * 模型输出的中间格式是 Markdown 缩进大纲，不是 JSON：
 *   # 根标题
 *   - 一级主题 ^c3
 *     > 一句话补充
 *     - 二级主题 ^c7
 *
 * 这样做的原因：长文档下 LLM 直出深层嵌套 JSON 容易截断/自相矛盾，
 * 且无法边生成边渲染。大纲可以流式解析，坏行可以单行丢弃而不炸整棵树。
 */

export interface ParseOptions {
  depth: Depth;
  /** 缺省标题：模型没给 # 标题时用 */
  fallbackTitle?: string;
  /** chunkId -> 溯源位置。模型只回引 chunkId，页码/时间戳从这里查表还原。 */
  chunkIndex?: Map<string, SourceRef>;
}

export interface ParseResult {
  nodes: MindMapNode[];
  title: string;
  /** 解析过程中被丢弃/修正的情况，用于监控生成质量 */
  warnings: string[];
}

export interface HierarchyQuality {
  /** 0-100；只衡量信息架构，不衡量事实正确性。 */
  score: number;
  needsRepair: boolean;
  rootChildren: number;
  maxDepth: number;
  directLeafRatio: number;
  reasons: string[];
}

export interface HierarchyPlanResult {
  map: MindMap;
  groups: number;
  coverage: number;
}

const BULLET = /^([-*+]|\d+[.)])\s+/;
const FENCE = /^\s*(```|~~~)/;
const HEADING = /^\s*#{1,6}\s+(.*\S)\s*$/;
const QUOTE = /^\s*>\s?(.*)$/;
const REF = /\s*\^([A-Za-z0-9_-]{1,32})\s*$/;

function clean(s: string, max: number): string {
  return s
    .replace(/\*\*|__|`/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/** 缩进宽度：tab 记 2 */
function indentWidth(line: string): number {
  let w = 0;
  for (const ch of line) {
    if (ch === ' ') w += 1;
    else if (ch === '\t') w += 2;
    else break;
  }
  return w;
}

/**
 * 不能直接拿缩进宽度比大小定层级：模型经常在同一层混用 tab / 2 空格 / 3 空格，
 * 差 1 个空格就会被误判成父子。先全文扫一遍收集所有缩进宽度，
 * 相邻宽度差 <= 1 的归为同一层，再把宽度映射成层号。
 */
function buildIndentLevels(lines: string[]): Map<number, number> {
  const widths = new Set<number>();
  let inFence = false;
  for (const raw of lines) {
    if (FENCE.test(raw)) {
      inFence = !inFence;
      continue;
    }
    if (inFence || !raw.trim()) continue;
    const body = raw.trimStart();
    if (BULLET.test(body)) widths.add(indentWidth(raw));
  }

  const sorted = [...widths].sort((a, b) => a - b);
  const levels = new Map<number, number>();
  let level = -1;
  let prev = Number.NEGATIVE_INFINITY;
  for (const w of sorted) {
    if (w - prev > 1) level++;
    levels.set(w, level);
    prev = w;
  }
  return levels;
}

export function parseOutline(outline: string, opts: ParseOptions): ParseResult {
  const { maxLevel, maxNodes } = DEPTH_BUDGET[opts.depth];
  const warnings: string[] = [];
  const nodes: MindMapNode[] = [];

  let title = '';
  let seq = 0;
  const nextId = () => `n${++seq}`;

  const lines = outline.split('\n');
  const indentLevels = buildIndentLevels(lines);

  const rootId = nextId();
  // 单调栈：level 由缩进聚类得出，根节点占 -1
  const stack: { level: number; id: string }[] = [{ level: -1, id: rootId }];
  const orderByParent = new Map<string, number>();
  const seenByParent = new Map<string, Set<string>>();
  let lastNode: MindMapNode | null = null;
  let inFence = false;
  let truncated = false;

  for (const raw of lines) {
    if (FENCE.test(raw)) {
      inFence = !inFence;
      continue;
    }
    if (inFence || !raw.trim()) continue;

    const heading = raw.match(HEADING);
    if (heading && !BULLET.test(raw.trimStart())) {
      // 首个标题当根标题；后续标题降级成一级节点，避免整段内容丢失
      if (!title) {
        title = clean(heading[1], MAX_TITLE_LEN);
        continue;
      }
    }

    const quote = raw.match(QUOTE);
    if (quote && lastNode) {
      const summary = clean(quote[1], MAX_SUMMARY_LEN);
      if (summary) lastNode.summary = lastNode.summary ? `${lastNode.summary} ${summary}` : summary;
      continue;
    }

    const body = raw.trimStart();
    if (!BULLET.test(body) && !heading) continue;

    if (nodes.length >= maxNodes) {
      truncated = true;
      continue;
    }

    const level = heading ? 0 : (indentLevels.get(indentWidth(raw)) ?? 0);
    let text = heading ? heading[1] : body.replace(BULLET, '');

    let source: SourceRef | undefined;
    const ref = text.match(REF);
    if (ref) {
      text = text.slice(0, ref.index);
      const resolved = opts.chunkIndex?.get(ref[1]);
      if (resolved) source = resolved;
      else if (opts.chunkIndex) warnings.push(`unknown chunk ref ^${ref[1]}`);
    }

    const nodeTitle = clean(text, MAX_TITLE_LEN);
    if (!nodeTitle) continue;

    while (stack.length > 1 && level <= stack[stack.length - 1].level) stack.pop();
    const parent = stack[stack.length - 1];

    // 根节点算第 1 层，栈里已有 stack.length 层，所以当前节点层级 = stack.length + 1
    if (stack.length + 1 > maxLevel) {
      warnings.push(`dropped node beyond depth ${maxLevel}: ${nodeTitle}`);
      continue;
    }

    const seen = seenByParent.get(parent.id) ?? new Set<string>();
    const key = nodeTitle.toLowerCase();
    if (seen.has(key)) {
      warnings.push(`duplicate sibling dropped: ${nodeTitle}`);
      continue;
    }
    seen.add(key);
    seenByParent.set(parent.id, seen);

    const order = orderByParent.get(parent.id) ?? 0;
    orderByParent.set(parent.id, order + 1);

    const node: MindMapNode = {
      id: nextId(),
      parentId: parent.id,
      title: nodeTitle,
      order,
      ...(source ? { source } : {}),
    };
    nodes.push(node);
    lastNode = node;
    stack.push({ level, id: node.id });
  }

  if (truncated) warnings.push(`node budget ${maxNodes} exceeded, output truncated`);

  // 模型没给 # 标题：用唯一一级节点提升为根，否则退回 fallback
  const topLevel = nodes.filter((n) => n.parentId === rootId);
  if (!title) {
    if (topLevel.length === 1) {
      title = topLevel[0].title;
      const promoted = topLevel[0];
      for (const n of nodes) if (n.parentId === promoted.id) n.parentId = rootId;
      nodes.splice(nodes.indexOf(promoted), 1);
    } else {
      title = clean(opts.fallbackTitle || 'Untitled', MAX_TITLE_LEN);
      warnings.push('no title in outline, used fallback');
    }
  }

  const root: MindMapNode = { id: rootId, parentId: null, title, order: 0 };
  return { nodes: [root, ...nodes], title, warnings };
}

export function buildMindMap(
  outline: string,
  meta: { language: string; depth: Depth; purpose: Purpose; fallbackTitle?: string; chunkIndex?: Map<string, SourceRef> },
): { map: MindMap; warnings: string[] } {
  const { nodes, title, warnings } = parseOutline(outline, {
    depth: meta.depth,
    fallbackTitle: meta.fallbackTitle,
    chunkIndex: meta.chunkIndex,
  });

  return {
    map: {
      version: 1,
      title,
      language: meta.language,
      depth: meta.depth,
      purpose: meta.purpose,
      nodes,
      createdAt: new Date().toISOString(),
    },
    warnings,
  };
}

/**
 * 识别“星爆型”脑图：大量具体事实直接挂在根节点下。
 * 这里只做质量判断，不在代码中猜测语义分类；分类交给模型修复阶段完成。
 */
export function inspectHierarchy(map: MindMap): HierarchyQuality {
  const root = map.nodes.find((node) => node.parentId === null);
  if (!root) {
    return { score: 0, needsRepair: true, rootChildren: 0, maxDepth: 0, directLeafRatio: 1, reasons: ['missing root'] };
  }

  const childrenByParent = new Map<string, MindMapNode[]>();
  for (const node of map.nodes) {
    if (!node.parentId) continue;
    const siblings = childrenByParent.get(node.parentId) ?? [];
    siblings.push(node);
    childrenByParent.set(node.parentId, siblings);
  }

  const rootNodes = childrenByParent.get(root.id) ?? [];
  const directLeaves = rootNodes.filter((node) => !(childrenByParent.get(node.id)?.length));
  const directLeafRatio = rootNodes.length ? directLeaves.length / rootNodes.length : 1;
  let maxDepth = 0;
  const walk = (nodeId: string, depth: number) => {
    maxDepth = Math.max(maxDepth, depth);
    for (const child of childrenByParent.get(nodeId) ?? []) walk(child.id, depth + 1);
  };
  walk(root.id, 0);

  const nonRootCount = Math.max(0, map.nodes.length - 1);
  const reasons: string[] = [];
  if (rootNodes.length > 8) reasons.push(`too many root branches (${rootNodes.length})`);
  if (rootNodes.length >= 6 && directLeafRatio > 0.6) reasons.push(`too many facts attached to root (${Math.round(directLeafRatio * 100)}%)`);
  if (nonRootCount >= 9 && maxDepth < 2) reasons.push('insufficient hierarchy depth');

  let score = 100;
  score -= Math.min(32, Math.max(0, rootNodes.length - 8) * 4);
  score -= Math.round(directLeafRatio * 35);
  if (maxDepth < 2 && nonRootCount >= 9) score -= 25;
  if (rootNodes.length > 0 && rootNodes.length < 3 && nonRootCount >= 9) score -= 10;

  return {
    score: Math.max(0, score),
    needsRepair: nonRootCount >= 9 && reasons.length > 0,
    rootChildren: rootNodes.length,
    maxDepth,
    directLeafRatio,
    reasons,
  };
}

/**
 * 把模型给出的 JSON 分类计划应用到现有一级节点。
 * 原节点仅改变 parentId/order，标题、子树和 source 全部原样保留。
 */
export function applyHierarchyPlan(map: MindMap, rawPlan: string): HierarchyPlanResult | null {
  const root = map.nodes.find((node) => node.parentId === null);
  if (!root) return null;
  const rootChildren = map.nodes.filter((node) => node.parentId === root.id).sort((a, b) => a.order - b.order);
  if (rootChildren.length < 6) return null;

  const start = rawPlan.indexOf('{');
  const end = rawPlan.lastIndexOf('}');
  if (start < 0 || end <= start) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawPlan.slice(start, end + 1));
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object' || !('groups' in parsed) || !Array.isArray(parsed.groups)) return null;

  const validIds = new Set(rootChildren.map((node) => node.id));
  const assigned = new Set<string>();
  const titles = new Set<string>();
  const groups: { title: string; parentNodeId: string | null; nodeIds: string[] }[] = [];
  for (const candidate of parsed.groups) {
    if (!candidate || typeof candidate !== 'object') continue;
    const value = candidate as { title?: unknown; parentNodeId?: unknown; nodeIds?: unknown };
    if (typeof value.title !== 'string' || !Array.isArray(value.nodeIds)) continue;
    const title = clean(value.title, 10);
    const titleKey = title.toLowerCase();
    if (title.length < 2 || titles.has(titleKey)) continue;
    const parentNodeId =
      typeof value.parentNodeId === 'string' && validIds.has(value.parentNodeId) && !assigned.has(value.parentNodeId)
        ? value.parentNodeId
        : null;
    if (parentNodeId) assigned.add(parentNodeId);
    const nodeIds = value.nodeIds.filter(
      (id): id is string => typeof id === 'string' && validIds.has(id) && !assigned.has(id),
    );
    if (nodeIds.length < (parentNodeId ? 1 : 2)) {
      if (parentNodeId) assigned.delete(parentNodeId);
      continue;
    }
    nodeIds.forEach((id) => assigned.add(id));
    titles.add(titleKey);
    groups.push({ title, parentNodeId, nodeIds });
  }
  if (groups.length < 3 || groups.length > 8) return null;

  const unassigned = rootChildren.filter((node) => !assigned.has(node.id)).map((node) => node.id);
  const coverage = assigned.size / rootChildren.length;
  if (coverage < 0.7) return null;
  if (unassigned.length) {
    if (groups.length < 8) groups.push({ title: 'Other points', parentNodeId: null, nodeIds: unassigned });
    else groups[groups.length - 1].nodeIds.push(...unassigned);
  }

  const existingIds = new Set(map.nodes.map((node) => node.id));
  const nextGroupId = (index: number) => {
    let id = `hg${index + 1}`;
    while (existingIds.has(id)) id = `h${id}`;
    existingIds.add(id);
    return id;
  };
  const byId = new Map(map.nodes.map((node) => [node.id, node]));
  const groupNodes: MindMapNode[] = groups.map((group, index) => {
    const existing = group.parentNodeId ? byId.get(group.parentNodeId) : null;
    return existing
      ? { ...existing, parentId: root.id, order: index }
      : { id: nextGroupId(index), parentId: root.id, title: group.title, order: index };
  });
  const placement = new Map<string, { parentId: string; order: number }>();
  groups.forEach((group, groupIndex) => {
    group.nodeIds.forEach((nodeId, order) => placement.set(nodeId, { parentId: groupNodes[groupIndex].id, order }));
  });

  const reusedGroupIds = new Set(groups.map((group) => group.parentNodeId).filter((id): id is string => Boolean(id)));
  const nodes = map.nodes.map((node) => {
    if (reusedGroupIds.has(node.id)) return groupNodes.find((group) => group.id === node.id)!;
    const target = placement.get(node.id);
    return target ? { ...node, ...target } : node;
  });
  const rootIndex = nodes.findIndex((node) => node.id === root.id);
  const newGroupNodes = groupNodes.filter((node) => !reusedGroupIds.has(node.id));
  nodes.splice(rootIndex + 1, 0, ...newGroupNodes);
  return { map: { ...map, nodes }, groups: groups.length, coverage };
}

/** 反向：脑图导出成 Markdown（导出功能 + prompt few-shot 复用同一份格式） */
export function toOutline(map: MindMap): string {
  const root = toTree(map);
  if (!root) return '';
  const lines = [`# ${root.title}`];
  const walk = (n: MindMapTreeNode, level: number) => {
    for (const child of n.children) {
      lines.push(`${'  '.repeat(level)}- ${child.title}`);
      if (child.summary) lines.push(`${'  '.repeat(level + 1)}> ${child.summary}`);
      walk(child, level + 1);
    }
  };
  walk(root, 0);
  return lines.join('\n');
}
