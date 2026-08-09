import { formatOf, type MapTheme, type MindMap } from '@/lib/mindmap/schema';

/**
 * 一级分支各占一个颜色，整条子树继承。
 *
 * 这不只是好看：脑图节点多了以后，颜色是唯一能让人一眼分清
 * "这两个节点属不属于同一个主题" 的线索，比缩进和连线都快。
 */

/** 冷暖交替排列，相邻分支色差足够大；在深浅两套主题下都够对比度 */
export const BRANCH_COLORS = [
  '#5b45d6', // 靛紫（品牌色）
  '#e06c2b', // 橙
  '#0d9488', // 青绿
  '#c0397a', // 玫红
  '#2f7fd1', // 蓝
  '#7a8b1f', // 橄榄
  '#8b5cf6', // 紫
  '#b45309', // 琥珀
] as const;

export const THEME_COLORS: Record<MapTheme, readonly string[]> = {
  indigo: BRANCH_COLORS,
  ocean: ['#0f766e', '#0891b2', '#2563eb', '#0d9488', '#0284c7', '#4f46e5'],
  coral: ['#ea580c', '#e11d48', '#f59e0b', '#c2410c', '#db2777', '#d97706'],
  forest: ['#047857', '#4d7c0f', '#0f766e', '#15803d', '#65a30d', '#0369a1'],
  violet: ['#7c3aed', '#c026d3', '#4f46e5', '#9333ea', '#db2777', '#6d28d9'],
  mono: ['#1f2937', '#475569', '#64748b', '#334155', '#6b7280', '#0f172a'],
};

/** nodeId → 颜色。根节点用品牌色，其余继承所属一级分支。 */
export function branchColorMap(map: MindMap): Map<string, string> {
  const colors = new Map<string, string>();
  const root = map.nodes.find((n) => n.parentId === null);
  if (!root) return colors;

  const childrenOf = new Map<string, string[]>();
  for (const n of map.nodes) {
    if (!n.parentId) continue;
    const list = childrenOf.get(n.parentId) ?? [];
    list.push(n.id);
    childrenOf.set(n.parentId, list);
  }

  const palette = THEME_COLORS[formatOf(map).theme];
  colors.set(root.id, palette[0]);

  const topLevel = (map.nodes.filter((n) => n.parentId === root.id) ?? []).sort((a, b) => a.order - b.order);
  topLevel.forEach((branch, i) => {
    const color = palette[i % palette.length];
    // 迭代而非递归：脑图深度有限，但防一手异常数据造成的深链
    const stack = [branch.id];
    while (stack.length) {
      const id = stack.pop()!;
      colors.set(id, color);
      for (const child of childrenOf.get(id) ?? []) stack.push(child);
    }
  });

  return colors;
}
