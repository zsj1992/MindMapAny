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
