'use client';

import { ReactFlowProvider } from '@xyflow/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MindMapCanvas } from '@/components/canvas/MindMapCanvas';
import { InputPanel, type GenerateParams, type InputMode, type InputPanelCopy } from '@/components/InputPanel';
import { GeneratingState } from '@/components/GeneratingState';
import { Toolbar } from '@/components/Toolbar';
import type { MindMap } from '@/lib/mindmap/schema';
import { useEditor } from '@/store/editor';

interface GenerateResponse {
  map: MindMap;
  warnings: string[];
  notes: string[];
  creditsCharged: number;
}

export interface WorkspaceProps {
  initialMap?: MindMap;
  mapId?: string;
  /** 来源页只放一种输入；不传则是「快速开始」的三合一面板 */
  mode?: InputMode;
  title?: string;
  subtitle?: string;
  copy?: InputPanelCopy;
}

export function Workspace({ initialMap, mapId, mode = 'all', title, subtitle, copy }: WorkspaceProps) {
  const map = useEditor((s) => s.map);
  const dirty = useEditor((s) => s.dirty);
  const load = useEditor((s) => s.load);
  const markSaved = useEditor((s) => s.markSaved);

  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const [savedId, setSavedId] = useState<string | null>(mapId ?? null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sourceKind, setSourceKind] = useState<'text' | 'pdf' | 'web' | 'youtube'>('text');
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMap) load(initialMap);
  }, [initialMap, load]);

  // 生成完成后编辑器接管整屏。落地页很长，不滚过去的话工具栏会留在视口外，
  // 用户会以为只是原地多了一张图。
  useEffect(() => {
    if (map) shellRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [map?.createdAt]); // eslint-disable-line react-hooks/exhaustive-deps

  // 未保存就关页面会丢内容，这类工具最容易被投诉的点
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const generate = useCallback(
    async (params: GenerateParams) => {
      setBusy(true);
      setError(null);
      setNotes([]);
      try {
        let res: Response;
        if (params.file) {
          const form = new FormData();
          form.set('file', params.file);
          for (const [k, v] of Object.entries(params)) {
            if (k !== 'file' && typeof v === 'string') form.set(k, v);
          }
          res = await fetch('/api/generate', { method: 'POST', body: form });
        } else {
          res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(params),
          });
        }

        const body = await res.json();
        if (!res.ok) {
          setError(body?.error?.message ?? '生成失败，请重试');
          return;
        }
        const data = body as GenerateResponse;
        load(data.map);
        setNotes([...data.notes, ...data.warnings.slice(0, 2)]);
        setSourceKind(params.file ? 'pdf' : params.url ? (isYoutube(params.url) ? 'youtube' : 'web') : 'text');
        setSavedId(null);
        setShareUrl(null);
      } catch {
        setError('网络异常，请重试');
      } finally {
        setBusy(false);
      }
    },
    [load],
  );

  const save = useCallback(async () => {
    if (!map) return;
    setSaving(true);
    try {
      const res = savedId
        ? await fetch(`/api/maps/${savedId}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ map }),
          })
        : await fetch('/api/maps', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ map, sourceKind }),
          });
      const body = await res.json();
      if (!res.ok) {
        setError(body?.error?.code === 'login_required' ? '请先登录再保存' : '保存失败');
        return;
      }
      if (body.id) setSavedId(body.id);
      markSaved();
    } finally {
      setSaving(false);
    }
  }, [map, savedId, sourceKind, markSaved]);

  const share = useCallback(async () => {
    let id = savedId;
    if (!id) {
      await save();
      id = useEditor.getState().dirty ? null : savedId;
    }
    if (!id) return;
    const res = await fetch(`/api/maps/${id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ isPublic: true }),
    });
    const body = await res.json();
    if (res.ok && body.shareSlug) setShareUrl(`${location.origin}/m/${body.shareSlug}`);
  }, [savedId, save]);

  if (!map) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
        {title && (
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-2.5 text-sm text-text-muted">{subtitle}</p>}
          </div>
        )}
        {busy ? (
          <GeneratingState />
        ) : (
          <InputPanel onGenerate={generate} busy={busy} error={error} mode={mode} copy={copy} />
        )}
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div ref={shellRef} className="flex h-full min-h-[calc(100vh-3.5rem)] scroll-mt-14 flex-col bg-bg">
        <Toolbar
          onSave={save}
          onShare={share}
          onReset={() => {
            if (dirty && !confirm('当前脑图尚未保存，确定要新建吗？')) return;
            useEditor.setState({ map: null, dirty: false, selectedId: null, editingId: null });
          }}
          saving={saving}
          shareUrl={shareUrl}
        />
        {(notes.length > 0 || error) && (
          <div className="border-b border-amber-200/60 bg-amber-50 px-4 py-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
            {error ?? notes.join(' · ')}
          </div>
        )}
        <div className="min-h-0 flex-1">
          <MindMapCanvas />
        </div>
        <p
          className="border-t px-4 py-2 text-[11px] text-text-subtle"
          style={{ borderColor: 'var(--border)' }}
        >
          <kbd className="font-sans">双击</kbd> 编辑 · <kbd className="font-sans">Tab</kbd> 子节点 ·{' '}
          <kbd className="font-sans">Enter</kbd> 同级 · <kbd className="font-sans">空格</kbd> 折叠 ·{' '}
          <kbd className="font-sans">Delete</kbd> 删除
        </p>
      </div>
    </ReactFlowProvider>
  );
}

function isYoutube(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}
