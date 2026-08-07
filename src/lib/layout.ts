import ELK, { type ElkNode } from 'elkjs/lib/elk.bundled.js';
import type { MindMap, MindMapNode } from '@/lib/mindmap/schema';

/**
 * 自动布局。用 ELK 的 layered 算法从左往右铺，比手写树布局更能处理
 * 子树高度不均的情况（脑图最常见的丑法就是节点重叠和连线交叉）。
 */

const elk = new ELK();

export const NODE_WIDTH = 220;
export const NODE_MIN_HEIGHT = 44;
const CHAR_PER_LINE = 16;
const LINE_HEIGHT = 20;

export interface PositionedNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 节点高度按标题字数估算，布局前必须给准，否则 ELK 会算出重叠 */
export function estimateNodeSize(node: MindMapNode): { width: number; height: number } {
  const lines = Math.max(1, Math.ceil(node.title.length / CHAR_PER_LINE));
  const summaryLines = node.summary ? Math.ceil(node.summary.length / CHAR_PER_LINE) : 0;
  return {
    width: NODE_WIDTH,
    height: Math.max(NODE_MIN_HEIGHT, lines * LINE_HEIGHT + summaryLines * 16 + 20),
  };
}

/** 折叠节点的所有后代都不参与布局 */
export function visibleNodes(map: MindMap, collapsed: ReadonlySet<string>): MindMapNode[] {
  const childrenOf = new Map<string, MindMapNode[]>();
  let root: MindMapNode | undefined;
  for (const n of map.nodes) {
    if (n.parentId === null) {
      root ??= n;
      continue;
    }
    const list = childrenOf.get(n.parentId) ?? [];
    list.push(n);
    childrenOf.set(n.parentId, list);
  }
  if (!root) return [];

  const out: MindMapNode[] = [];
  const walk = (node: MindMapNode) => {
    out.push(node);
    if (collapsed.has(node.id)) return;
    const kids = (childrenOf.get(node.id) ?? []).sort((a, b) => a.order - b.order);
    kids.forEach(walk);
  };
  walk(root);
  return out;
}

export function hasChildren(map: MindMap, nodeId: string): boolean {
  return map.nodes.some((n) => n.parentId === nodeId);
}

export async function layoutMindMap(
  map: MindMap,
  collapsed: ReadonlySet<string>,
): Promise<Map<string, PositionedNode>> {
  const nodes = visibleNodes(map, collapsed);
  const visible = new Set(nodes.map((n) => n.id));

  const graph: ElkNode = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.layered.spacing.nodeNodeBetweenLayers': '64',
      'elk.spacing.nodeNode': '16',
      'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
      // 保持兄弟节点按 order 排列，不让算法为了少交叉而重排
      'elk.layered.crossingMinimization.strategy': 'INTERACTIVE',
      'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
    },
    children: nodes.map((n) => ({ id: n.id, ...estimateNodeSize(n) })),
    edges: nodes
      .filter((n) => n.parentId && visible.has(n.parentId))
      .map((n) => ({ id: `e-${n.id}`, sources: [n.parentId!], targets: [n.id] })),
  };

  const laid = await elk.layout(graph);
  const positions = new Map<string, PositionedNode>();
  for (const child of laid.children ?? []) {
    positions.set(child.id, {
      id: child.id,
      x: child.x ?? 0,
      y: child.y ?? 0,
      width: child.width ?? NODE_WIDTH,
      height: child.height ?? NODE_MIN_HEIGHT,
    });
  }
  return positions;
}
