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

        // Workers 的类型定义里 json() 返回 unknown，比浏览器的 any 严格，这里显式收窄
        const body = (await res.json()) as Partial<GenerateResponse> & { error?: { message?: string; code?: string } };
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

  const save = useCallback(async (): Promise<string | null> => {
    if (!map) return null;
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
      const body = (await res.json()) as { id?: string; error?: { code?: string } };
      if (!res.ok) {
        setError(body?.error?.code === 'login_required' ? '请先登录再保存' : '保存失败');
        return null;
      }
      if (body.id) setSavedId(body.id);
      markSaved();
      return body.id ?? savedId;
    } catch {
      setError('保存失败，请检查网络后重试');
      return null;
    } finally {
      setSaving(false);
    }
  }, [map, savedId, sourceKind, markSaved]);

  const share = useCallback(async () => {
    const id = savedId ?? (await save());
    if (!id) return;
    try {
      const res = await fetch(`/api/maps/${id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ isPublic: true }),
      });
      const body = (await res.json()) as { shareSlug?: string };
      if (res.ok && body.shareSlug) setShareUrl(`${location.origin}/m/${body.shareSlug}`);
      else setError('分享链接生成失败');
    } catch {
      setError('分享失败，请检查网络后重试');
    }
  }, [savedId, save]);

  if (!map) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
        {title && (
          <div className="mb-9 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border bg-surface px-3 py-1 text-[11px] font-semibold text-text-muted shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500" /> AI 内容理解工作台
            </span>
            <h1 className="text-3xl font-bold tracking-[-0.035em] sm:text-4xl">{title}</h1>
            {subtitle && <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-text-muted">{subtitle}</p>}
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
      <div ref={shellRef} className="flex h-full min-h-[calc(100vh-4rem)] scroll-mt-16 flex-col bg-bg">
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
          <kbd className="font-sans">双指 / 滚轮</kbd> 平移 · <kbd className="font-sans">双击</kbd> 编辑 · <kbd className="font-sans">Tab</kbd> 子节点 ·{' '}
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
