'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useEffect, useRef, useState } from 'react';
import { formatTimestamp } from '@/lib/chunk';
import type { SourceRef } from '@/lib/mindmap/schema';
import { useEditor } from '@/store/editor';

export interface MindMapNodeData extends Record<string, unknown> {
  title: string;
  summary?: string;
  source?: SourceRef;
  level: number;
  childCount: number;
  collapsed: boolean;
}

/** 层级越深视觉权重越低，用户扫一眼就能看出结构 */
const LEVEL_STYLES = [
  'text-white font-medium border-transparent',
  'bg-surface text-text border-[var(--border-strong)] font-medium',
  'bg-surface text-text border-[var(--border)]',
  'bg-bg-subtle text-text-muted border-[var(--border)]',
];

function sourceLabel(source: SourceRef): string {
  switch (source.type) {
    case 'pdf':
      return `p.${source.page}`;
    case 'youtube':
      return formatTimestamp(source.startSec);
    case 'web':
      return source.anchor ? source.anchor.slice(0, 18) : '原文';
    default:
      return '';
  }
}

export function MindMapNodeCard({ id, data, selected }: NodeProps & { data: MindMapNodeData }) {
  const editingId = useEditor((s) => s.editingId);
  const renameNode = useEditor((s) => s.renameNode);
  const beginEdit = useEditor((s) => s.beginEdit);
  const toggleCollapse = useEditor((s) => s.toggleCollapse);

  const isEditing = editingId === id;
  const [draft, setDraft] = useState(data.title);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      setDraft(data.title);
      // 进入编辑立刻全选，用户通常是要整句重写而不是改一个字
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [isEditing, data.title]);

  const commit = () => {
    if (draft.trim() && draft !== data.title) renameNode(id, draft);
    beginEdit(null);
  };

  const style = LEVEL_STYLES[Math.min(data.level, LEVEL_STYLES.length - 1)];
  const label = data.source ? sourceLabel(data.source) : '';

  return (
    <div
      className={`group relative rounded-xl border px-3.5 py-2.5 text-sm shadow-sm transition-shadow hover:shadow-md ${style} ${
        selected ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-[var(--bg)]' : ''
      }`}
      style={{
        width: 220,
        ...(data.level === 0 ? { background: 'var(--node-root-bg)', color: 'var(--node-root-text)' } : {}),
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        beginEdit(id);
      }}
    >
      <Handle type="target" position={Position.Left} className="!h-1.5 !w-1.5 !border-0 !bg-[var(--border-strong)]" />

      {isEditing ? (
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            e.stopPropagation(); // 别让画布快捷键吃掉输入
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              commit();
            }
            if (e.key === 'Escape') beginEdit(null);
          }}
          rows={Math.max(1, Math.ceil(draft.length / 16))}
          className="w-full resize-none bg-transparent leading-tight outline-none"
        />
      ) : (
        <div className="whitespace-pre-wrap break-words leading-tight">{data.title}</div>
      )}

      {data.summary && !isEditing && (
        <div className="mt-1 text-xs leading-snug opacity-65 line-clamp-3">{data.summary}</div>
      )}

      {label && (
        <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-accent-500/12 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-accent-600 dark:text-accent-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-2.5 w-2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
          </svg>
          {label}
        </div>
      )}

      {data.childCount > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleCollapse(id);
          }}
          className="absolute -right-3 top-1/2 z-10 h-6 w-6 -translate-y-1/2 rounded-full border bg-surface text-xs leading-none text-text-muted shadow-sm transition-colors hover:border-brand-400 hover:text-brand-600"
          style={{ borderColor: 'var(--border-strong)' }}
          aria-label={data.collapsed ? '展开' : '折叠'}
        >
          {data.collapsed ? data.childCount : '−'}
        </button>
      )}

      <Handle type="source" position={Position.Right} className="!h-1.5 !w-1.5 !border-0 !bg-[var(--border-strong)]" />
    </div>
  );
}
