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
      className="flex flex-wrap items-center gap-2 border-b bg-surface px-4 py-2.5"
      style={{ borderColor: 'var(--border)' }}
    >
      <h1 className="mr-1 max-w-[26ch] truncate text-sm font-medium" title={map.title}>
        {map.title}
      </h1>
      <span className="hidden rounded-md bg-bg-muted px-1.5 py-0.5 text-[11px] tabular-nums text-text-subtle sm:inline">
        {map.nodes.length} 节点
      </span>

      <div className="ml-1 flex items-center gap-0.5 rounded-lg bg-bg-muted p-0.5">
        {LEVELS.map((l) => (
          <button
            key={l.level}
            type="button"
            onClick={() => collapseToLevel(l.level)}
            className="rounded-md px-2 py-1 text-xs text-text-muted transition-colors hover:bg-surface hover:text-text"
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
            className="btn btn-secondary h-8 px-3 text-xs"
          >
            {copied ? '已复制' : shareUrl ? '复制链接' : '分享'}
          </button>
        )}

        {!readOnly && onSave && (
          <button type="button" onClick={onSave} disabled={saving} className="btn btn-primary h-8 px-3.5 text-xs">
            {saving ? '保存中…' : dirty ? '保存 ·' : '保存'}
          </button>
        )}

        {onReset && (
          <button type="button" onClick={onReset} className="btn btn-ghost h-8 px-2 text-xs">
            新建
          </button>
        )}
      </div>
    </div>
  );
}

function ExportButton({ children, onClick, busy }: { children: ReactNode; onClick: () => void; busy: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={busy} className="btn btn-secondary h-8 px-2.5 text-xs">
      {busy ? '导出中' : children}
    </button>
  );
}
