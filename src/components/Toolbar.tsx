'use client';

import { useReactFlow } from '@xyflow/react';
import { useState, type ReactNode } from 'react';
import { exportMarkdown, exportPng, exportSvg, safeName } from '@/lib/export';
import { useEditor } from '@/store/editor';

const LEVELS = [
  { level: 2, label: 'L2' },
  { level: 3, label: 'L3' },
  { level: 4, label: 'L4' },
  { level: 99, label: '全展开' },
];

export function Toolbar({
  onSave,
  onShare,
  onReset,
  saving,
  shareUrl,
  readOnly = false,
}: {
  onSave?: () => void;
  onShare?: () => void;
  onReset?: () => void;
  saving?: boolean;
  shareUrl?: string | null;
  readOnly?: boolean;
}) {
  const map = useEditor((s) => s.map);
  const dirty = useEditor((s) => s.dirty);
  const levelLimit = useEditor((s) => s.levelLimit);
  const collapseToLevel = useEditor((s) => s.collapseToLevel);
  const { getNodes } = useReactFlow();
  const [exporting, setExporting] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!map) return null;

  const run = async (name: string, fn: () => Promise<void> | void) => {
    setExporting(name);
    try {
      await fn();
    } finally {
      setExporting(null);
    }
  };

  return (
    <div
      className="flex flex-wrap items-center gap-2 border-b bg-surface px-4 py-3 sm:px-5"
      style={{ borderColor: 'var(--border)' }}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path d="M5 7h5v4H5zM14 13h5v4h-5zM10 9h2a2 2 0 012 2v4" /></svg>
      </span>
      <h1 className="mr-1 max-w-[26ch] truncate text-sm font-semibold" title={map.title}>
        {map.title}
      </h1>
      <span className="hidden rounded-md bg-bg-muted px-1.5 py-0.5 text-[11px] tabular-nums text-text-subtle sm:inline">
        {map.nodes.length} 节点
      </span>

      <div className="ml-1 hidden items-center gap-0.5 rounded-lg border bg-bg-subtle p-0.5 md:flex">
        {LEVELS.map((l) => (
          <button
            key={l.level}
            type="button"
            onClick={() => collapseToLevel(l.level)}
            aria-pressed={levelLimit === l.level}
            className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
              levelLimit === l.level
                ? 'bg-surface text-brand-700 shadow-sm dark:text-brand-300'
                : 'text-text-muted hover:bg-surface hover:text-text hover:shadow-sm'
            }`}
            title={l.level === 99 ? '全部展开' : `只展开到第 ${l.level} 层`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <ExportButton busy={exporting === 'png'} onClick={() => run('png', () => exportPng(getNodes(), safeName(map.title)))}>
          PNG
        </ExportButton>
        <ExportButton busy={exporting === 'svg'} onClick={() => run('svg', () => exportSvg(getNodes(), safeName(map.title)))}>
          SVG
        </ExportButton>
        <ExportButton busy={false} onClick={() => exportMarkdown(map)}>
          MD
        </ExportButton>

        {!readOnly && onShare && (
          <button
            type="button"
            onClick={() => {
              if (shareUrl) {
                navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              } else {
                onShare();
              }
            }}
            className="btn btn-secondary h-9 px-3 text-xs"
          >
            {copied ? '已复制' : shareUrl ? '复制链接' : '分享'}
          </button>
        )}

        {!readOnly && onSave && (
          <button type="button" onClick={onSave} disabled={saving} className="btn btn-primary h-9 px-4 text-xs">
            {saving ? '保存中…' : dirty ? '保存 ·' : '保存'}
          </button>
        )}

        {onReset && (
          <button type="button" onClick={onReset} className="btn btn-ghost h-9 px-2 text-xs">
            新建
          </button>
        )}
      </div>
    </div>
  );
}

function ExportButton({ children, onClick, busy }: { children: ReactNode; onClick: () => void; busy: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={busy} className="btn btn-secondary hidden h-9 px-2.5 text-xs sm:inline-flex">
      {busy ? '导出中' : children}
    </button>
  );
}
