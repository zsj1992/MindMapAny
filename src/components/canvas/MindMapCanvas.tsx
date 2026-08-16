'use client';

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { layoutMindMap, visibleNodes } from '@/lib/layout';
import { branchColorMap } from '@/lib/branchColors';
import { formatOf, type MindMap } from '@/lib/mindmap/schema';
import { useEditor } from '@/store/editor';
import { MindMapNodeCard, type MindMapNodeData } from './MindMapNodeCard';

const nodeTypes = { mindmap: MindMapNodeCard };

function levelMap(map: MindMap): Map<string, number> {
  const byId = new Map(map.nodes.map((n) => [n.id, n]));
  const levels = new Map<string, number>();
  for (const n of map.nodes) {
    let d = 0;
    let cur = byId.get(n.id);
    while (cur?.parentId && d < 64) {
      cur = byId.get(cur.parentId);
      d++;
    }
    levels.set(n.id, d);
  }
  return levels;
}

function numberMap(map: MindMap): Map<string, string> {
  const children = new Map<string, typeof map.nodes>();
  const root = map.nodes.find((node) => node.parentId === null);
  if (!root) return new Map();
  for (const node of map.nodes) {
    if (!node.parentId) continue;
    const list = children.get(node.parentId) ?? [];
    list.push(node);
    children.set(node.parentId, list);
  }
  const out = new Map<string, string>();
  const walk = (parentId: string, prefix: number[]) => {
    (children.get(parentId) ?? []).sort((a, b) => a.order - b.order).forEach((node, index) => {
      const path = [...prefix, index + 1];
      out.set(node.id, path.join('.'));
      walk(node.id, path);
    });
  };
  walk(root.id, []);
  return out;
}

/** 注意：调用方需要自己包 <ReactFlowProvider>，因为 Toolbar 也要用同一个实例的 useReactFlow */

/**
 * 逐个揭示的节奏。
 *
 * 总时长固定在 1.4 秒左右，而不是「每个节点固定 40ms」——后者在 120 个节点的图上
 * 要放十几秒，用户只会觉得卡。节点越多，单个间隔越短，整体观感一致。
 *
 * 顺序按「层级 → 纵向位置」：先根、再一级分支、再往下，同层从上到下。
 * 这和人读一张脑图的顺序一致，也正好是它被生成出来的顺序。
 */
const REVEAL_BUDGET_MS = 1400;
const REVEAL_MAX_STEP = 45;
const REVEAL_MIN_STEP = 10;

function revealDelays(
  ids: { id: string; level: number; y: number }[],
): Map<string, number> {
  const step = Math.min(REVEAL_MAX_STEP, Math.max(REVEAL_MIN_STEP, REVEAL_BUDGET_MS / Math.max(1, ids.length)));
  const ordered = [...ids].sort((a, b) => a.level - b.level || a.y - b.y);
  return new Map(ordered.map((n, i) => [n.id, Math.round(i * step)]));
}

export function MindMapCanvas({ readOnly = false }: { readOnly?: boolean }) {
  const map = useEditor((s) => s.map);
  const collapsed = useEditor((s) => s.collapsed);
  const selectedId = useEditor((s) => s.selectedId);
  const select = useEditor((s) => s.select);
  const beginEdit = useEditor((s) => s.beginEdit);
  const addChild = useEditor((s) => s.addChild);
  const addSibling = useEditor((s) => s.addSibling);
  const deleteNode = useEditor((s) => s.deleteNode);
  const toggleCollapse = useEditor((s) => s.toggleCollapse);

  const revealAt = useEditor((s) => s.revealAt);
  const streaming = useEditor((s) => s.streaming);

  // 揭示是一次性的：预算走完就关掉，之后的编辑/折叠都按静态渲染，不再重播。
  // 流式期间不计时 —— 那边的节点由服务端一帧帧送来，什么时候结束由流说了算
  useEffect(() => {
    if (revealAt === null || streaming) return;
    const timer = window.setTimeout(
      () => useEditor.setState({ revealAt: null }),
      REVEAL_BUDGET_MS + 600,
    );
    return () => window.clearTimeout(timer);
  }, [revealAt, streaming]);

  const { fitView } = useReactFlow();
  const fittedMapRef = useRef<string | null>(null);

  // 结构变化才重排；只改标题不动布局，避免打字时画布乱跳
  const structureKey = useMemo(() => {
    if (!map) return '';
    return `${map.nodes.map((n) => `${n.id}:${n.parentId}:${n.order}:${n.title.length}`).join('|')}#${[...collapsed].sort().join(',')}#${map.format?.layout ?? 'balanced'}:${map.format?.fontSize ?? 14}`;
  }, [map, collapsed]);

  // 布局是纯同步函数，随 structureKey 记忆化即可，不再有「先空白再跳一下」的闪烁
  const positions = useMemo(
    () => (map ? layoutMindMap(map, collapsed) : new Map()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [structureKey],
  );

  const { nodes, edges } = useMemo(() => {
    if (!map || !positions.size) return { nodes: [] as Node[], edges: [] as Edge[] };
    const levels = levelMap(map);
    const shown = visibleNodes(map, collapsed);
    const shownIds = new Set(shown.map((n) => n.id));
    const childCount = new Map<string, number>();
    for (const n of map.nodes) {
      if (n.parentId) childCount.set(n.parentId, (childCount.get(n.parentId) ?? 0) + 1);
    }

    const colors = branchColorMap(map);
    const format = formatOf(map);
    const levelsOf = (id: string) => levels.get(id) ?? 0;
    /*
     * 两种揭示：
     *   流式  —— 延迟一律 0。节点本来就是一帧帧到的，错开时间等于二次延迟；
     *            已经在画面上的节点不会重新挂载，所以不会重播。
     *   一次性 —— 整张图同时到达，靠计算出来的延迟排出先后。
     */
    const delays = streaming
      ? new Map(shown.map((n) => [n.id, 0] as const))
      : revealAt
        ? revealDelays(shown.flatMap((n) => {
            const pos = positions.get(n.id);
            return pos ? [{ id: n.id, level: levelsOf(n.id), y: pos.y }] : [];
          }))
        : null;
    const numbers = format.numbering ? numberMap(map) : new Map<string, string>();

    const rfNodes: Node[] = shown.flatMap((n) => {
      const pos = positions.get(n.id);
      if (!pos) return [];
      const data: MindMapNodeData = {
        title: n.title,
        level: levels.get(n.id) ?? 0,
        childCount: childCount.get(n.id) ?? 0,
        collapsed: collapsed.has(n.id),
        side: pos.side ?? 'right',
        color: colors.get(n.id) ?? '#5b45d6',
        format,
        ...(numbers.has(n.id) ? { numberPrefix: numbers.get(n.id) } : {}),
        ...(n.summary ? { summary: n.summary } : {}),
        ...(n.source ? { source: n.source } : {}),
        ...(delays ? { revealDelay: delays.get(n.id) ?? 0 } : {}),
      };
      return [
        {
          id: n.id,
          type: 'mindmap',
          position: { x: pos.x, y: pos.y },
          data,
          selected: n.id === selectedId,
          draggable: false,
        },
      ];
    });

    const rfEdges: Edge[] = shown
      .filter((n) => n.parentId && shownIds.has(n.parentId))
      .map((n) => {
        // 左侧子树的连线方向相反：从父节点左侧出，接到子节点右侧
        const side = positions.get(n.id)?.side ?? 'right';
        const level = levels.get(n.id) ?? 1;
        return {
          id: `e-${n.id}`,
          source: n.parentId!,
          target: n.id,
          sourceHandle: side === 'left' ? 'l' : 'r',
          targetHandle: side === 'left' ? 'r' : 'l',
          // 连线比它指向的节点稍早一点出现，线先到、节点落上去，像是被"画"出来的；
          // 反过来（节点先出现、线后补）看着像连接失败又重连
          ...(delays ? { className: 'mm-reveal-edge' } : {}),
          style: {
            ...(delays ? { animationDelay: `${Math.max(0, (delays.get(n.id) ?? 0) - 40)}ms` } : {}),
            stroke: colors.get(n.id) ?? 'var(--border-strong)',
            // 越靠近根越粗，视觉上自然形成主干与分枝
            strokeWidth: Math.max(1.2, 3.4 - level * 0.7),
            opacity: 0.75,
          },
        };
      });

    return { nodes: rfNodes, edges: rfEdges };
    // revealAt 必须在依赖里：揭示结束翻成 null 时要重算一遍，把动画 class 摘掉，
    // 否则之后展开折叠节点会带着过期的延迟重新入场
  }, [map, positions, collapsed, selectedId, revealAt, streaming]);

  /*
   * 每张图只在首次打开时适配一次 —— 新增、删除、折叠节点都不该动用户当前视口。
   *
   * 但流式是例外：节点是一帧帧到的，只按第一帧适配的话，视口会停在那一两个
   * 节点的范围里，后面几十个铺到视口外，用户看到的是一片空白。所以流式期间
   * 每帧都重新适配，让画面跟着长出来的树走；流一结束就恢复「只适配一次」。
   *
   * 判据不能用 createdAt：它是毫秒精度，相邻帧常常相同，根节点 id 又恒为 n1，
   * 于是整条流的 identity 都不变 —— 这正是之前画布全白的原因。
   */
  const rootId = map?.nodes.find((node) => node.parentId === null)?.id ?? '';
  const mapIdentity = map ? `${map.createdAt}:${rootId}` : '';
  useEffect(() => {
    if (!nodes.length) return;
    if (!streaming && (!mapIdentity || fittedMapRef.current === mapIdentity)) return;
    if (!streaming) fittedMapRef.current = mapIdentity;
    const frame = requestAnimationFrame(() =>
      fitView({ padding: 0.15, duration: streaming ? 0 : 200 }),
    );
    return () => cancelAnimationFrame(frame);
  }, [fitView, mapIdentity, nodes.length, streaming]);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => select(node.id), [select]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (readOnly || !selectedId || useEditor.getState().editingId) return;
      if (e.key === 'Tab') {
        e.preventDefault();
        addChild(selectedId);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        addSibling(selectedId);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteNode(selectedId);
      } else if (e.key === ' ') {
        e.preventDefault();
        toggleCollapse(selectedId);
      } else if (e.key === 'F2') {
        e.preventDefault();
        beginEdit(selectedId);
      }
    },
    [readOnly, selectedId, addChild, addSibling, deleteNode, toggleCollapse, beginEdit],
  );

  return (
    <div className="surface-grid h-full w-full bg-bg-subtle/60 outline-none" tabIndex={0} onKeyDown={onKeyDown}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={() => {
          select(null);
          beginEdit(null);
        }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        // 触控板双指/鼠标滚轮直接平移；捏合仍然缩放。比“必须按住拖”更符合大画布习惯。
        panOnScroll
        panOnScrollSpeed={1}
        zoomOnScroll={false}
        zoomOnPinch
        minZoom={0.1}
        maxZoom={2.5}
        proOptions={{ hideAttribution: false }}
      >
        <Background gap={24} size={1} color="var(--border-strong)" />
        <Controls showInteractive={false} />
        {nodes.length > 40 && (
          <MiniMap pannable zoomable nodeColor="var(--border-strong)" maskColor="rgb(0 0 0 / 0.06)" />
        )}
      </ReactFlow>
    </div>
  );
}
