'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useEffect, useRef } from 'react';
import { formatTimestamp } from '@/lib/chunk';
import type { NodeSide } from '@/lib/layout';
import type { MindMapFormat, SourceRef } from '@/lib/mindmap/schema';
import { useEditor } from '@/store/editor';

export interface MindMapNodeData extends Record<string, unknown> {
  title: string;
  summary?: string;
  source?: SourceRef;
  level: number;
  childCount: number;
  collapsed: boolean;
  side: NodeSide;
  color: string;
  format: MindMapFormat;
  numberPrefix?: string;
  /** 逐个揭示时该节点的入场延迟（毫秒）；不在揭示阶段时不存在 */
  revealDelay?: number;
}

function sourceLabel(source: SourceRef): string {
  switch (source.type) {
    case 'pdf':
      return `p.${source.page}`;
    case 'youtube':
      return formatTimestamp(source.startSec);
    case 'web':
      // 没抓到章节锚点时不显示徽标 —— 每个节点都挂个"原文"是纯噪音，零信息量
      return source.anchor ? source.anchor.slice(0, 16) : '';
    case 'document':
      return source.location?.slice(0, 16) ?? '';
    default:
      return '';
  }
}

/** 能跳回原始位置的地址；目前只有视频有这种东西 */
function sourceDeepLink(source: SourceRef): string | null {
  if (source.type === 'youtube' && source.url) {
    // t 参数用 YouTube 自己的秒数写法；30 秒窗口取的是起点，
    // 落在这一段开头而不是中间，听到的正好是这个要点被说出来的地方
    return `${source.url}${source.url.includes('?') ? '&' : '?'}t=${source.startSec}s`;
  }
  return null;
}

export function MindMapNodeCard({ id, data, selected }: NodeProps & { data: MindMapNodeData }) {
  const editingId = useEditor((s) => s.editingId);
  const renameNode = useEditor((s) => s.renameNode);
  const beginEdit = useEditor((s) => s.beginEdit);
  const toggleCollapse = useEditor((s) => s.toggleCollapse);

  const isEditing = editingId === id;
  // 非受控输入：草稿只存在 DOM 里，不进 React state。
  // 受控写法要在 effect 里把 title 同步进 state，多一轮渲染且容易和外部改动不同步。
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isEditing) return;
    // 进入编辑立刻全选，用户通常是要整句重写而不是改一个字
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [isEditing]);

  const commit = () => {
    const draft = inputRef.current?.value ?? '';
    if (draft.trim() && draft !== data.title) renameNode(id, draft);
    beginEdit(null);
  };

  const isRoot = data.level === 0;
  const isBranch = data.level === 1;
  const label = data.source ? sourceLabel(data.source) : '';
  const deepLink = data.source ? sourceDeepLink(data.source) : null;
  // 左侧子树的父节点在右边，折叠按钮跟着换边，否则会压在连线上
  const collapseOnLeft = data.side === 'left';

  /**
   * 三种视觉层级：
   *   根    实心品牌色胶囊
   *   一级  描边卡片，边框取分支色
   *   其余  无边框，只在靠父节点那侧压一条分支色的线 —— 和竞品一样轻，
   *         节点多的时候方框会把画面切得很碎
   */
  const base = 'group relative text-sm transition-all duration-150';
  const shell = isRoot
    ? 'rounded-2xl px-5 py-3.5 font-semibold text-white shadow-lg'
    : isBranch
      ? 'rounded-xl border bg-surface px-4 py-3 font-semibold shadow-md hover:-translate-y-px hover:shadow-lg'
      : 'border bg-surface/95 px-3.5 py-2.5 leading-snug shadow-sm backdrop-blur-[2px] hover:shadow-md';

  const style: React.CSSProperties = {
    width: 240,
    fontFamily:
      data.format.font === 'serif'
        ? 'ui-serif, Georgia, Cambria, "Times New Roman", serif'
        : data.format.font === 'mono'
          ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
          : 'var(--font-sans)',
    fontSize: data.format.fontSize,
    fontWeight: data.format.fontWeight,
    fontStyle: data.format.italic ? 'italic' : 'normal',
    textDecoration: [data.format.underline ? 'underline' : '', data.format.strikethrough ? 'line-through' : ''].filter(Boolean).join(' ') || 'none',
    textAlign: data.format.alignTopics && data.side === 'left' && !isRoot ? 'right' : 'left',
    ...(isRoot ? { background: data.color } : {}),
    ...(isBranch ? { borderColor: data.color } : {}),
    ...(!isRoot && !isBranch
      ? {
          [collapseOnLeft ? 'borderRight' : 'borderLeft']: `2.5px solid ${data.color}`,
          borderRadius: '9px',
        }
      : {}),
  };

  return (
    <div
      className={`${base} ${shell} ${selected ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-subtle)]' : ''} ${
        data.revealDelay !== undefined ? 'mm-reveal-node' : ''
      }`}
      style={{
        ...style,
        ...(data.revealDelay !== undefined ? { animationDelay: `${data.revealDelay}ms` } : {}),
        ...(selected ? { ['--tw-ring-color' as string]: data.color } : {}),
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        beginEdit(id);
      }}
    >
      {/* 两侧都挂 handle，由边的 sourceHandle/targetHandle 决定用哪一个 */}
      <Handle id="l" type="target" position={Position.Left} className="!h-0 !w-0 !border-0 !bg-transparent" />
      <Handle id="l" type="source" position={Position.Left} className="!h-0 !w-0 !border-0 !bg-transparent" />
      <Handle id="r" type="target" position={Position.Right} className="!h-0 !w-0 !border-0 !bg-transparent" />
      <Handle id="r" type="source" position={Position.Right} className="!h-0 !w-0 !border-0 !bg-transparent" />

      {isEditing ? (
        <textarea
          ref={inputRef}
          key={data.title}
          defaultValue={data.title}
          onBlur={commit}
          onKeyDown={(e) => {
            e.stopPropagation(); // 别让画布快捷键吃掉输入
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              commit();
            }
            if (e.key === 'Escape') beginEdit(null);
          }}
          rows={Math.max(1, Math.ceil(data.title.length / 15))}
          className="w-full resize-none bg-transparent leading-snug outline-none"
        />
      ) : (
        <div className="whitespace-pre-wrap break-words leading-snug">
          {data.numberPrefix && <span className="mr-1.5 opacity-55">{data.numberPrefix}</span>}
          {data.title}
        </div>
      )}

      {data.summary && !isEditing && (
        <div className="mt-1 text-xs leading-snug text-text-muted line-clamp-3">{data.summary}</div>
      )}

      {label &&
        /*
         * 视频溯源是唯一一种点一下就能当场验证的：跳到那一秒，看到的是视频本身，
         * 不是字幕。所以这里必须是链接，做成不可点的徽标等于把这个功能最有说服力的
         * 一下浪费掉。其余来源（页码、章节）没有可跳的地址，保持静态徽标。
         */
        (deepLink ? (
          <a
            href={deepLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            title={`Open the video at ${label}`}
            className="mt-1.5 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium tabular-nums underline-offset-2 hover:underline"
            style={{ color: data.color, background: `${data.color}14` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" className="h-2.5 w-2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5v14l11-7z" />
            </svg>
            {label}
          </a>
        ) : (
          <div
            className="mt-1.5 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium tabular-nums"
            style={{ color: data.color, background: `${data.color}14` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" className="h-2.5 w-2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
            </svg>
            {label}
          </div>
        ))}

      {data.childCount > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleCollapse(id);
          }}
          className={`absolute top-1/2 z-10 flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-full border bg-surface px-1 text-[10px] leading-none tabular-nums shadow-sm transition-colors ${
            collapseOnLeft ? '-left-2.5' : '-right-2.5'
          }`}
          style={{ borderColor: data.color, color: data.color }}
          aria-label={data.collapsed ? 'Expand' : 'Collapse'}
        >
          {data.collapsed ? data.childCount : '−'}
        </button>
      )}
    </div>
  );
}
