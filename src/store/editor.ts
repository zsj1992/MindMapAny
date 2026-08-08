'use client';

import { nanoid } from 'nanoid';
import { create } from 'zustand';
import type { MindMap, MindMapNode } from '@/lib/mindmap/schema';

/**
 * 编辑器状态。脑图本体保持扁平数组不变形，
 * 折叠态和选中态是纯视图状态，不落库。
 */

interface EditorState {
  map: MindMap | null;
  collapsed: Set<string>;
  /** 工具栏层级筛选；null 表示用户做过单节点折叠，99 表示全展开。 */
  levelLimit: number | null;
  selectedId: string | null;
  editingId: string | null;
  dirty: boolean;

  load: (map: MindMap) => void;
  select: (id: string | null) => void;
  beginEdit: (id: string | null) => void;
  toggleCollapse: (id: string) => void;
  collapseToLevel: (level: number) => void;

  renameNode: (id: string, title: string) => void;
  setSummary: (id: string, summary: string) => void;
  addSibling: (id: string) => string | null;
  addChild: (id: string) => string;
  deleteNode: (id: string) => void;
  reparent: (id: string, newParentId: string) => void;
  markSaved: () => void;
}

function descendantsOf(nodes: MindMapNode[], id: string): Set<string> {
  const childrenOf = new Map<string, string[]>();
  for (const n of nodes) {
    if (!n.parentId) continue;
    const list = childrenOf.get(n.parentId) ?? [];
    list.push(n.id);
    childrenOf.set(n.parentId, list);
  }
  const out = new Set<string>();
  const stack = [id];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const child of childrenOf.get(cur) ?? []) {
      if (out.has(child)) continue;
      out.add(child);
      stack.push(child);
    }
  }
  return out;
}

function nextOrder(nodes: MindMapNode[], parentId: string): number {
  return nodes.filter((n) => n.parentId === parentId).reduce((m, n) => Math.max(m, n.order + 1), 0);
}

export const useEditor = create<EditorState>((set, get) => ({
  map: null,
  collapsed: new Set(),
  levelLimit: 99,
  selectedId: null,
  editingId: null,
  dirty: false,

  load: (map) => set({ map, collapsed: new Set(), levelLimit: 99, selectedId: null, editingId: null, dirty: false }),
  select: (id) => set({ selectedId: id }),
  beginEdit: (id) => set({ editingId: id, ...(id ? { selectedId: id } : {}) }),

  toggleCollapse: (id) =>
    set((s) => {
      const next = new Set(s.collapsed);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { collapsed: next, levelLimit: null };
    }),

  collapseToLevel: (level) =>
    set((s) => {
      if (!s.map) return {};
      const byId = new Map(s.map.nodes.map((n) => [n.id, n]));
      const depthOf = (id: string) => {
        let d = 0;
        let cur = byId.get(id);
        while (cur?.parentId) {
          cur = byId.get(cur.parentId);
          d++;
        }
        return d;
      };
      if (level === 99) return { collapsed: new Set<string>(), levelLimit: 99 };

      // UI 的 L1 是根节点，而内部根深度为 0，所以“显示到 L2”应从深度 1 的节点开始折叠。
      // 只折叠有孩子的节点；折叠叶子不会产生任何视觉变化。
      const parentIds = new Set(s.map.nodes.map((n) => n.parentId).filter((id): id is string => Boolean(id)));
      const collapsed = new Set<string>();
      for (const n of s.map.nodes) {
        if (parentIds.has(n.id) && depthOf(n.id) >= level - 1) collapsed.add(n.id);
      }
      return { collapsed, levelLimit: level };
    }),

  renameNode: (id, title) =>
    set((s) => {
      if (!s.map) return {};
      const t = title.trim().slice(0, 120);
      if (!t) return {};
      const isRoot = s.map.nodes.find((n) => n.id === id)?.parentId === null;
      return {
        map: {
          ...s.map,
          // 根节点标题即脑图标题，两者保持同步
          ...(isRoot ? { title: t } : {}),
          nodes: s.map.nodes.map((n) => (n.id === id ? { ...n, title: t } : n)),
        },
        dirty: true,
      };
    }),

  setSummary: (id, summary) =>
    set((s) =>
      s.map
        ? {
            map: {
              ...s.map,
              nodes: s.map.nodes.map((n) => (n.id === id ? { ...n, summary: summary.slice(0, 400) } : n)),
            },
            dirty: true,
          }
        : {},
    ),

  addChild: (id) => {
    const newId = nanoid(8);
    set((s) => {
      if (!s.map) return {};
      const node: MindMapNode = { id: newId, parentId: id, title: '新节点', order: nextOrder(s.map.nodes, id) };
      const collapsed = new Set(s.collapsed);
      collapsed.delete(id); // 加了子节点还折叠着会让用户以为没生效
      return {
        map: { ...s.map, nodes: [...s.map.nodes, node] },
        collapsed,
        levelLimit: null,
        selectedId: newId,
        editingId: newId,
        dirty: true,
      };
    });
    return newId;
  },

  addSibling: (id) => {
    const state = get();
    const target = state.map?.nodes.find((n) => n.id === id);
    if (!state.map || !target?.parentId) return null; // 根节点没有兄弟
    const newId = nanoid(8);
    const node: MindMapNode = { id: newId, parentId: target.parentId, title: '新节点', order: target.order + 0.5 };
    const nodes = [...state.map.nodes, node]
      .sort((a, b) => a.order - b.order)
      .map((n) => (n.parentId === target.parentId ? { ...n } : n));
    // 重排同级 order 为整数，避免 0.5 无限累积
    let i = 0;
    for (const n of nodes) if (n.parentId === target.parentId) n.order = i++;
    set({ map: { ...state.map, nodes }, selectedId: newId, editingId: newId, dirty: true });
    return newId;
  },

  deleteNode: (id) =>
    set((s) => {
      if (!s.map) return {};
      const target = s.map.nodes.find((n) => n.id === id);
      if (!target || target.parentId === null) return {}; // 根节点不可删
      const doomed = descendantsOf(s.map.nodes, id);
      doomed.add(id);
      return {
        map: { ...s.map, nodes: s.map.nodes.filter((n) => !doomed.has(n.id)) },
        selectedId: target.parentId,
        editingId: null,
        dirty: true,
      };
    }),

  reparent: (id, newParentId) =>
    set((s) => {
      if (!s.map || id === newParentId) return {};
      // 不能挂到自己的后代下，否则成环
      if (descendantsOf(s.map.nodes, id).has(newParentId)) return {};
      const target = s.map.nodes.find((n) => n.id === id);
      if (!target || target.parentId === null) return {};
      return {
        map: {
          ...s.map,
          nodes: s.map.nodes.map((n) =>
            n.id === id ? { ...n, parentId: newParentId, order: nextOrder(s.map!.nodes, newParentId) } : n,
          ),
        },
        dirty: true,
      };
    }),

  markSaved: () => set({ dirty: false }),
}));
