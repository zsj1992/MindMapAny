'use client';

import { ReactFlowProvider } from '@xyflow/react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MindMapCanvas } from '@/components/canvas/MindMapCanvas';
import type { Plan } from '@/lib/credits';
import { InputPanel, type GenerateParams, type InputMode, type InputPanelCopy } from '@/components/InputPanel';
import { GeneratingState } from '@/components/GeneratingState';
import { FormatPanel } from '@/components/FormatPanel';
import { Toolbar } from '@/components/Toolbar';
import { trackEvent } from '@/lib/analytics';
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
  /** 未登录传 null；用于在生成前显示本次预估积分 */
  plan?: Plan | null;
}

export function Workspace({ initialMap, mapId, mode = 'all', title, subtitle, copy, plan = null }: WorkspaceProps) {
  const router = useRouter();
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
  const [formatOpen, setFormatOpen] = useState(false);
  const [sourceKind, setSourceKind] = useState<'text' | 'pdf' | 'web' | 'youtube'>('text');
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMap) load(initialMap);
  }, [initialMap, load]);

  /**
   * 兜底：路由变了但组件没重新挂载时，把画布退回输入态。
   *
   * 侧栏导航已经在 NavLink 里主动清空了（那里还能弹未保存确认），
   * 这里覆盖的是浏览器前进/后退这类拿不到点击事件的入口。
   * 只在「输入页」生效 —— /app/map/[id] 带着 initialMap，清了就白开了。
   */
  const pathname = usePathname();
  const mountedPath = useRef(pathname);
  useEffect(() => {
    if (initialMap) return;
    if (pathname === mountedPath.current) return;
    mountedPath.current = pathname;
    useEditor.setState({ map: null, dirty: false, selectedId: null, editingId: null });
  }, [pathname, initialMap]);

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
      const inputType = params.file
        ? (params.file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'document')
        : params.url
          ? (isYoutube(params.url) ? 'youtube' : 'web')
          : 'text';
      trackEvent('mindmap_generation_started', {
        input_type: inputType,
        depth: params.depth,
        language: params.language,
      });
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
          trackEvent('mindmap_generation_failed', { input_type: inputType, error_code: body?.error?.code ?? 'request_failed' });
          setError(body?.error?.message ?? 'Generation failed. Please try again.');
          return;
        }
        const data = body as GenerateResponse;
        trackEvent('mindmap_generation_completed', {
          input_type: inputType,
          depth: params.depth,
          language: params.language,
          credits_charged: data.creditsCharged,
          node_count: data.map.nodes.length,
        });
        load(data.map);
        setFormatOpen(false);
        router.refresh();
        setNotes([...data.notes, ...data.warnings.slice(0, 2)]);
        setSourceKind(inputType === 'document' ? 'text' : inputType);
        setSavedId(null);
        setShareUrl(null);
      } catch {
        trackEvent('mindmap_generation_failed', { input_type: inputType, error_code: 'network_error' });
        setError('Network error. Please try again.');
      } finally {
        setBusy(false);
      }
    },
    [load, router],
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
        setError(body?.error?.code === 'login_required' ? 'Please sign in before saving' : 'Could not save');
        return null;
      }
      if (body.id) setSavedId(body.id);
      markSaved();
      return body.id ?? savedId;
    } catch {
      setError('Could not save. Check your connection and try again.');
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
      else setError('Could not create a share link');
    } catch {
      setError('Sharing failed. Check your connection and try again.');
    }
  }, [savedId, save]);

  if (!map) {
    return (
      <div className="workspace-stage h-full min-h-0 overflow-y-auto px-4 py-8 sm:px-7 lg:overflow-hidden lg:px-10 lg:py-6">
        <div className="mx-auto grid min-h-full w-full max-w-6xl items-center gap-9 lg:grid-cols-[minmax(15rem,0.72fr)_minmax(32rem,1.45fr)] lg:gap-12 xl:gap-16">
          {title && (
            <section className="max-w-xl lg:max-w-sm">
              <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.14em] text-brand-600 dark:text-brand-300">
                <span className="h-px w-8 bg-brand-500" />
                MINDMAPANY / CREATE
              </p>
              <h1 className="mt-5 text-balance text-[2.35rem] font-semibold leading-[1.04] tracking-[-0.055em] sm:text-5xl lg:text-[3.35rem]">
                {title}
              </h1>
              {subtitle && <p className="mt-5 max-w-md text-pretty text-sm leading-7 text-text-muted sm:text-[15px]">{subtitle}</p>}

              <div className="mt-8 hidden space-y-4 lg:block" aria-label="How generation works">
                {[
                  ['01', 'Add content', 'Text, a file or a link'],
                  ['02', 'Find the structure', 'Topics and hierarchy extracted'],
                  ['03', 'Edit and export', 'Sources kept, ready to export'],
                ].map(([step, label, detail], index) => (
                  <div key={step} className="group relative flex items-center gap-3.5">
                    {index < 2 && <span className="absolute left-[0.45rem] top-5 h-5 w-px bg-border-base" aria-hidden="true" />}
                    <span className="relative z-10 h-2.5 w-2.5 rounded-sm border-2 border-brand-500 bg-bg transition-transform duration-200 group-hover:scale-125" />
                    <span className="w-5 font-mono text-[10px] text-text-subtle">{step}</span>
                    <span className="text-xs font-semibold text-text">{label}</span>
                    <span className="text-xs text-text-subtle">{detail}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="min-w-0">
            {busy ? (
              <GeneratingState />
            ) : (
              <InputPanel onGenerate={generate} busy={busy} error={error} mode={mode} copy={copy} plan={plan} />
            )}
          </div>
        </div>
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
            if (dirty && !confirm('This map has not been saved. Start a new one anyway?')) return;
            setFormatOpen(false);
            useEditor.setState({ map: null, dirty: false, selectedId: null, editingId: null });
          }}
          saving={saving}
          shareUrl={shareUrl}
          formatOpen={formatOpen}
          onToggleFormat={() => setFormatOpen((open) => !open)}
        />
        {(notes.length > 0 || error) && (
          <div className="border-b border-amber-200/60 bg-amber-50 px-4 py-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
            {error ?? notes.join(' · ')}
          </div>
        )}
        <div className="relative min-h-0 flex-1">
          <MindMapCanvas />
          {formatOpen && <FormatPanel onClose={() => setFormatOpen(false)} />}
        </div>
        <p
          className="border-t px-4 py-2 text-[11px] text-text-subtle"
          style={{ borderColor: 'var(--border)' }}
        >
          <kbd className="font-sans">Two fingers / scroll</kbd> pan · <kbd className="font-sans">Double-click</kbd> edit · <kbd className="font-sans">Tab</kbd> child ·{' '}
          <kbd className="font-sans">Enter</kbd> sibling · <kbd className="font-sans">Space</kbd> collapse ·{' '}
          <kbd className="font-sans">Delete</kbd> remove
        </p>
      </div>
    </ReactFlowProvider>
  );
}

function isYoutube(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}
