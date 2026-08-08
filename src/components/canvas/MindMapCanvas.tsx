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
import { useCallback, useEffect, useMemo } from 'react';
import { layoutMindMap, visibleNodes } from '@/lib/layout';
import { BRANCH_COLORS, branchColorMap } from '@/lib/branchColors';
import type { MindMap } from '@/lib/mindmap/schema';
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

/** 注意：调用方需要自己包 <ReactFlowProvider>，因为 Toolbar 也要用同一个实例的 useReactFlow */
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

  const { fitView } = useReactFlow();

  // 结构变化才重排；只改标题不动布局，避免打字时画布乱跳
  const structureKey = useMemo(() => {
    if (!map) return '';
    return `${map.nodes.map((n) => `${n.id}:${n.parentId}:${n.order}:${n.title.length}`).join('|')}#${[...collapsed].sort().join(',')}`;
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

    const rfNodes: Node[] = shown.flatMap((n) => {
      const pos = positions.get(n.id);
      if (!pos) return [];
      const data: MindMapNodeData = {
        title: n.title,
        level: levels.get(n.id) ?? 0,
        childCount: childCount.get(n.id) ?? 0,
        collapsed: collapsed.has(n.id),
        side: pos.side ?? 'right',
        color: colors.get(n.id) ?? BRANCH_COLORS[0],
        ...(n.summary ? { summary: n.summary } : {}),
        ...(n.source ? { source: n.source } : {}),
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
          type: 'bezier',
          style: {
            stroke: colors.get(n.id) ?? 'var(--border-strong)',
            // 越靠近根越粗，视觉上自然形成主干与分枝
            strokeWidth: Math.max(1.2, 3.4 - level * 0.7),
            opacity: 0.75,
          },
        };
      });

    return { nodes: rfNodes, edges: rfEdges };
  }, [map, positions, collapsed, selectedId]);

  useEffect(() => {
    if (nodes.length) requestAnimationFrame(() => fitView({ padding: 0.15, duration: 200 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structureKey, positions.size]);

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
    <div className="h-full w-full outline-none" tabIndex={0} onKeyDown={onKeyDown}>
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
        minZoom={0.1}
        maxZoom={2.5}
        proOptions={{ hideAttribution: false }}
      >
        <Background gap={22} size={1} color="var(--border)" />
        <Controls showInteractive={false} />
        {nodes.length > 40 && (
          <MiniMap pannable zoomable nodeColor="var(--border-strong)" maskColor="rgb(0 0 0 / 0.06)" />
        )}
      </ReactFlow>
    </div>
  );
}
