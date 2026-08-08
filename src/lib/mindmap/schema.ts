import { z } from 'zod';

/**
 * 脑图的唯一数据源。存 DB、前端编辑、导出都以此为准。
 * 模型不直接产出这个结构 —— 模型产出带 chunk 标记的 Markdown 大纲，
 * 由 outline.ts 确定性解析成这里的 MindMap。
 */

export const DEPTHS = ['concise', 'standard', 'detailed'] as const;
export type Depth = (typeof DEPTHS)[number];

export const PURPOSES = ['study', 'structure', 'meeting', 'general'] as const;
export type Purpose = (typeof PURPOSES)[number];

/** 每档深度对应的层级与节点数预算，同时用于 prompt 和解析后的裁剪 */
export const DEPTH_BUDGET: Record<Depth, { maxLevel: number; minNodes: number; maxNodes: number }> = {
  concise: { maxLevel: 3, minNodes: 10, maxNodes: 25 },
  standard: { maxLevel: 4, minNodes: 20, maxNodes: 55 },
  detailed: { maxLevel: 5, minNodes: 45, maxNodes: 110 },
};

// 叶子节点是「标签：一句说明」，比纯标题长，上限相应放宽
export const MAX_TITLE_LEN = 160;
export const MAX_SUMMARY_LEN = 400;

/**
 * 溯源引用。切块阶段就把 chunkId -> 位置 锚定好，
 * 模型只负责回引 chunkId，页码/时间戳一律查表还原，绝不让模型自己写。
 */
export const sourceRefSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('text'), chunkId: z.string() }),
  z.object({ type: z.literal('pdf'), chunkId: z.string(), page: z.number().int().positive() }),
  z.object({ type: z.literal('web'), chunkId: z.string(), url: z.string().url(), anchor: z.string().optional() }),
  z.object({ type: z.literal('youtube'), chunkId: z.string(), startSec: z.number().int().nonnegative() }),
]);
export type SourceRef = z.infer<typeof sourceRefSchema>;

export const mindMapNodeSchema = z.object({
  id: z.string().min(1),
  /** null 表示根节点，一张图有且只有一个 */
  parentId: z.string().min(1).nullable(),
  title: z.string().min(1).max(MAX_TITLE_LEN),
  summary: z.string().max(MAX_SUMMARY_LEN).optional(),
  source: sourceRefSchema.optional(),
  /** 同一父节点下的展示顺序 */
  order: z.number().int().nonnegative(),
  collapsed: z.boolean().optional(),
});
export type MindMapNode = z.infer<typeof mindMapNodeSchema>;

export const mindMapSchema = z.object({
  version: z.literal(1),
  title: z.string().min(1).max(MAX_TITLE_LEN),
  /** BCP-47，如 zh-CN / en */
  language: z.string().min(2),
  depth: z.enum(DEPTHS),
  purpose: z.enum(PURPOSES),
  /** 扁平存储：编辑、局部更新、DB 查询都比嵌套树方便 */
  nodes: z.array(mindMapNodeSchema),
  createdAt: z.string().datetime(),
});
export type MindMap = z.infer<typeof mindMapSchema>;

/** 渲染层用的嵌套形态，由 toTree() 从扁平数组临时构建，不落库 */
export type MindMapTreeNode = MindMapNode & { children: MindMapTreeNode[] };

export function toTree(map: MindMap): MindMapTreeNode | null {
  const byId = new Map<string, MindMapTreeNode>();
  for (const n of map.nodes) byId.set(n.id, { ...n, children: [] });

  let root: MindMapTreeNode | null = null;
  for (const n of map.nodes) {
    const node = byId.get(n.id)!;
    if (n.parentId === null) {
      // 多个根时只认第一个，其余丢弃（解析阶段已保证唯一，这里是防御）
      root ??= node;
      continue;
    }
    const parent = byId.get(n.parentId);
    if (parent) parent.children.push(node);
  }

  const sort = (n: MindMapTreeNode) => {
    n.children.sort((a, b) => a.order - b.order);
    n.children.forEach(sort);
  };
  if (root) sort(root);
  return root;
}

/** 节点在树中的层级，根为 0。用于布局和深度裁剪。 */
export function levelOf(map: MindMap, nodeId: string): number {
  const byId = new Map(map.nodes.map((n) => [n.id, n]));
  let level = 0;
  let cur = byId.get(nodeId);
  while (cur?.parentId) {
    cur = byId.get(cur.parentId);
    level++;
    if (level > 64) break; // 防御环
  }
  return level;
}
