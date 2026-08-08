import Hierarchy from '@antv/hierarchy';
import type { MindMap, MindMapNode } from '@/lib/mindmap/schema';

/**
 * 经典双侧脑图布局：根节点居中，子树自动往左右两侧分流。
 *
 * 原先用 ELK 的 layered 单向铺开，同样的节点数横向宽度是双侧布局的两倍，
 * 稍大一点的文档就一屏看不完 —— 而"一眼看到全局"正是脑图这个形态的全部价值。
 *
 * @antv/hierarchy 只做布局算法不做渲染，正好补上这一块，
 * React Flow、节点组件、编辑交互都不用动。
 */

export const NODE_WIDTH = 232;
export const NODE_MIN_HEIGHT = 44;
const CHAR_PER_LINE = 15;
const LINE_HEIGHT = 21;
const H_GAP = 44;
const V_GAP = 9;

export type NodeSide = 'left' | 'right';

export interface PositionedNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** 根节点没有 side；其余节点决定连线和 handle 挂在哪一边 */
  side?: NodeSide;
}

/** 节点高度按内容估算。布局前必须给准，否则会算出重叠。 */
export function estimateNodeSize(node: MindMapNode): { width: number; height: number } {
  const titleLines = Math.max(1, Math.ceil(node.title.length / CHAR_PER_LINE));
  const summaryLines = node.summary ? Math.ceil(node.summary.length / (CHAR_PER_LINE + 3)) : 0;
  const badge = node.source ? 22 : 0;
  return {
    width: NODE_WIDTH,
    height: Math.max(NODE_MIN_HEIGHT, titleLines * LINE_HEIGHT + summaryLines * 18 + badge + 20),
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

interface HierarchyInput {
  id: string;
  children: HierarchyInput[];
}

interface HierarchyOutput {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  side?: NodeSide;
  children?: HierarchyOutput[];
}

/**
 * 同步计算。ELK 那版是异步的（要起 worker），换成 antv 后是纯函数，
 * 顺带去掉了画布上「先渲染空白再跳一下」的闪烁。
 */
export function layoutMindMap(map: MindMap, collapsed: ReadonlySet<string>): Map<string, PositionedNode> {
  const nodes = visibleNodes(map, collapsed);
  if (!nodes.length) return new Map();

  const sizes = new Map(nodes.map((n) => [n.id, estimateNodeSize(n)]));
  const byParent = new Map<string, MindMapNode[]>();
  for (const n of nodes) {
    if (!n.parentId) continue;
    const list = byParent.get(n.parentId) ?? [];
    list.push(n);
    byParent.set(n.parentId, list);
  }

  const root = nodes.find((n) => n.parentId === null);
  if (!root) return new Map();

  const build = (node: MindMapNode): HierarchyInput => ({
    id: node.id,
    children: (byParent.get(node.id) ?? []).sort((a, b) => a.order - b.order).map(build),
  });

  // antv 默认按序号对半分左右，子树体量差距大时会一边挤爆一边空着。
  // 改成按累计高度贪心分配：每次把下一条主干放到当前较矮的那一侧。
  const topLevel = (byParent.get(root.id) ?? []).sort((a, b) => a.order - b.order);
  const subtreeHeight = (node: MindMapNode): number => {
    const kids = byParent.get(node.id) ?? [];
    const own = sizes.get(node.id)?.height ?? NODE_MIN_HEIGHT;
    if (!kids.length) return own + V_GAP * 2;
    return Math.max(own + V_GAP * 2, kids.reduce((sum, k) => sum + subtreeHeight(k), 0));
  };

  const sideOf = new Map<string, NodeSide>();
  let rightWeight = 0;
  let leftWeight = 0;
  for (const branch of topLevel) {
    const w = subtreeHeight(branch);
    const side: NodeSide = rightWeight <= leftWeight ? 'right' : 'left';
    if (side === 'right') rightWeight += w;
    else leftWeight += w;
    sideOf.set(branch.id, side);
  }

  const laid = Hierarchy.mindmap(build(root), {
    direction: 'H',
    getSide: (d: { id: string }) => sideOf.get(d.id) ?? 'right',
    getWidth: (d: HierarchyInput) => sizes.get(d.id)?.width ?? NODE_WIDTH,
    getHeight: (d: HierarchyInput) => sizes.get(d.id)?.height ?? NODE_MIN_HEIGHT,
    getHGap: () => H_GAP,
    getVGap: () => V_GAP,
  }) as HierarchyOutput;

  const positions = new Map<string, PositionedNode>();
  const walk = (n: HierarchyOutput) => {
    const size = sizes.get(n.id) ?? { width: NODE_WIDTH, height: NODE_MIN_HEIGHT };
    positions.set(n.id, {
      id: n.id,
      x: n.x,
      y: n.y,
      width: size.width,
      height: size.height,
      ...(n.side ? { side: n.side } : {}),
    });
    n.children?.forEach(walk);
  };
  walk(laid);
  return positions;
}
