'use client';

import { useReactFlow } from '@xyflow/react';
import { useState, type ReactNode } from 'react';
import { exportMarkdown, exportPng, exportSvg, safeName } from '@/lib/export';
import { useT } from '@/lib/i18n/context';
import { useEditor } from '@/store/editor';

// L2/L3/L4 是层级记号，不翻译；只有「全部」是词
const LEVELS = [2, 3, 4, 99];

export function Toolbar({
  onSave,
  onShare,
  onReset,
  saving,
  shareUrl,
  formatOpen = false,
  onToggleFormat,
  readOnly = false,
}: {
  onSave?: () => void;
  onShare?: () => void;
  onReset?: () => void;
  saving?: boolean;
  shareUrl?: string | null;
  formatOpen?: boolean;
  onToggleFormat?: () => void;
  readOnly?: boolean;
}) {
  const map = useEditor((s) => s.map);
  const dirty = useEditor((s) => s.dirty);
  const levelLimit = useEditor((s) => s.levelLimit);
  const collapseToLevel = useEditor((s) => s.collapseToLevel);
  // getNodesBounds 必须取自 useReactFlow：它会带上 nodeLookup。
  // 顶层导入的同名函数只能读 node.measured，而我们的节点每次都是 useMemo 新建的对象，
  // 量出来的尺寸只写进 nodeLookup，从不回写到这些对象 —— 那条路径下每个节点宽高都是 0。
  const { getNodes, getNodesBounds } = useReactFlow();
  const t = useT();
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
        {t('toolbar.nodes', { n: map.nodes.length })}
      </span>

      <div className="ml-1 hidden items-center gap-0.5 rounded-lg border bg-bg-subtle p-0.5 md:flex">
        {LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => collapseToLevel(level)}
            aria-pressed={levelLimit === level}
            className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
              levelLimit === level
                ? 'bg-surface text-brand-700 shadow-sm dark:text-brand-300'
                : 'text-text-muted hover:bg-surface hover:text-text hover:shadow-sm'
            }`}
            title={level === 99 ? t('toolbar.expandAll') : t('toolbar.expandToLevel', { n: level })}
          >
            {level === 99 ? t('toolbar.levelAll') : `L${level}`}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {!readOnly && onToggleFormat && (
          <button
            type="button"
            onClick={onToggleFormat}
            aria-pressed={formatOpen}
            className={`btn h-9 gap-1.5 px-3 text-xs ${formatOpen ? 'btn-primary' : 'btn-secondary'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M7 14v6" /></svg>
            {t('toolbar.format')}
          </button>
        )}
        <ExportButton busy={exporting === 'png'} onClick={() => run('png', () => exportPng(getNodesBounds(getNodes()), safeName(map.title)))}>
          PNG
        </ExportButton>
        <ExportButton busy={exporting === 'svg'} onClick={() => run('svg', () => exportSvg(getNodesBounds(getNodes()), safeName(map.title)))}>
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
            {copied ? t('toolbar.copied') : shareUrl ? t('toolbar.copyLink') : t('toolbar.share')}
          </button>
        )}

        {!readOnly && onSave && (
          <button type="button" onClick={onSave} disabled={saving} className="btn btn-primary h-9 px-4 text-xs">
            {saving ? t('toolbar.saving') : dirty ? `${t('toolbar.save')} ·` : t('toolbar.saved')}
          </button>
        )}

        {onReset && (
          <button type="button" onClick={onReset} className="btn btn-ghost h-9 px-2 text-xs">
            {t('toolbar.new')}
          </button>
        )}
      </div>
    </div>
  );
}

function ExportButton({ children, onClick, busy }: { children: ReactNode; onClick: () => void; busy: boolean }) {
  const t = useT();
  return (
    <button type="button" onClick={onClick} disabled={busy} className="btn btn-secondary hidden h-9 px-2.5 text-xs sm:inline-flex">
      {busy ? t('toolbar.exporting') : children}
    </button>
  );
}
