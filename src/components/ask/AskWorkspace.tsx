'use client';

import { useRef, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { MindMapCanvas } from '@/components/canvas/MindMapCanvas';
import { MapSkeleton } from '@/components/ask/MapSkeleton';
import { Spinner } from '@/components/Spinner';
import { RefineBar } from '@/components/RefineBar';
import { Toolbar } from '@/components/Toolbar';
import { trackEvent } from '@/lib/analytics';
import { useT } from '@/lib/i18n/context';
import type { MessageKey } from '@/lib/i18n/messages';
import type { MindMap } from '@/lib/mindmap/schema';
import { useEditor } from '@/store/editor';

/**
 * Ask Anything：不需要素材，一个问题直接出图。
 *
 * 与深度研究共用「问题 → 图」的形态，但只做一次检索、不产出长报告，
 * 所以这里没有多阶段进度条，只在两句状态文案之间切换。
 */

interface Source {
  id: number;
  title: string;
  url: string;
}

const EXAMPLE_KEYS: MessageKey[] = ['ask.example1', 'ask.example2', 'ask.example3'];
const ASK_CREDITS = 3;
const TOPIC_CREDITS = 1;

export function AskWorkspace({ unlimited }: { unlimited: boolean }) {
  const t = useT();
  const load = useEditor((state) => state.load);
  const map = useEditor((state) => state.map);
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<'searching' | 'mapping'>('searching');
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [grounded, setGrounded] = useState(true);
  /** 当前这张图是不是带来源的。和 grounded 分开存：用户可以在看图时把开关拨回去 */
  const [mapGrounded, setMapGrounded] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  const stop = () => abortRef.current?.abort();

  const submit = async (withSources = grounded) => {
    if (question.trim().length < 4 || busy) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setBusy(true);
    setError(null);
    setSources([]);
    setStage('searching');
    trackEvent('ask_started', { grounded: withSources });
    // 检索通常十几秒，之后才轮到生成图。服务端没有回调，按经验值切文案，
    // 让等待有进展感 —— 空转的按钮会让人以为卡死。
    // 不检索时只有一次生成，没有「检索 → 出图」这段落差，直接显示出图文案
    const toMapping = withSources ? window.setTimeout(() => setStage('mapping'), 14_000) : null;
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: question.trim(), grounded: withSources }),
        signal: controller.signal,
      });
      const body = (await res.json()) as {
        map?: MindMap;
        sources?: Source[];
        saveFailed?: 'limit_reached' | 'failed';
        error?: { message?: string };
      };
      if (!res.ok || !body.map) {
        trackEvent('ask_failed', { grounded: withSources });
        setError(body.error?.message ?? t('error.generic'));
        return;
      }
      trackEvent('ask_completed', { grounded: withSources });
      load(body.map);
      setSources(body.sources ?? []);
      setMapGrounded(withSources);
      if (body.saveFailed === 'limit_reached') setError(t('error.saveLimit', { n: 100 }));
    } catch (thrown) {
      // 用户主动中止不是错误，不能弹报错框。服务端会看到 request 被取消，
      // 在它自己的 catch 里把积分退回去 —— 这条路径和生成失败共用同一段逻辑。
      if ((thrown as { name?: string })?.name === 'AbortError') {
        trackEvent('ask_stopped', { grounded: withSources });
        return;
      }
      trackEvent('ask_failed', { grounded: withSources });
      setError(t('error.network'));
    } finally {
      if (toMapping !== null) window.clearTimeout(toMapping);
      abortRef.current = null;
      setBusy(false);
    }
  };

  if (map) {
    return (
      <ReactFlowProvider>
        <div className="flex h-full min-h-0 flex-col">
          <Toolbar onReset={() => useEditor.setState({ map: null, dirty: false })} />
          <div className="relative min-h-0 flex-1">
            <MindMapCanvas />
          </div>
          <RefineBar />
          {!mapGrounded && (
            /* 无来源的图必须自己说明这一点。用户几分钟后就不记得当初点的是哪个模式了，
               而这张图看起来和有来源的那张一模一样。 */
            <div className="flex shrink-0 flex-wrap items-center gap-3 border-t bg-amber-50 px-4 py-3 dark:bg-amber-950/30" style={{ borderColor: 'var(--border)' }}>
              <p className="min-w-0 flex-1 text-[11px] leading-5 text-amber-900 dark:text-amber-200">
                {/* 补来源失败时错误只能显示在这里 —— 出图之后整个界面再没有别的报错位置 */}
                {error ?? t('ask.quickWarning')}
              </p>
              {busy ? (
                <span className="flex shrink-0 items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
                  <Spinner />
                  {stage === 'searching' ? t('ask.searching') : t('ask.mapping')}
                  <button type="button" onClick={stop} className="btn btn-secondary h-8 px-3 text-xs">
                    {t('ask.stop')}
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => void submit(true)}
                  className="btn btn-secondary h-8 shrink-0 px-3 text-xs"
                >
                  {t('ask.addSources')}
                </button>
              )}
            </div>
          )}
          {sources.length > 0 && (
            <div className="shrink-0 border-t bg-surface px-4 py-3" style={{ borderColor: 'var(--border)' }}>
              <p className="mb-1.5 text-[11px] font-semibold text-text-subtle">{t('ask.sources')}</p>
              <ol className="flex flex-wrap gap-x-4 gap-y-1">
                {sources.map((source) => (
                  <li key={source.id} className="text-xs">
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700">
                      [{source.id}] {source.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </ReactFlowProvider>
    );
  }

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col justify-center overflow-y-auto px-4 py-6 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">{t('ask.title')}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-text-muted">{t('ask.lede')}</p>
      </div>

      <div className="app-panel mt-6 rounded-2xl border bg-surface p-3 sm:p-4">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) void submit();
          }}
          placeholder={t('ask.placeholder')}
          disabled={busy}
          className="field h-28 resize-none border-0 bg-bg-subtle p-4 text-base leading-7 shadow-inner"
          autoFocus
        />
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {([true, false] as const).map((value) => (
            <button
              key={String(value)}
              type="button"
              onClick={() => setGrounded(value)}
              disabled={busy}
              title={value ? t('ask.modeGroundedHint') : t('ask.modeQuickHint')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                grounded === value
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-200'
                  : 'text-text-subtle hover:bg-bg-subtle hover:text-text'
              }`}
            >
              {value ? t('ask.modeGrounded') : t('ask.modeQuick')}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-5 text-text-subtle">
          {grounded ? t('ask.modeGroundedHint') : t('ask.modeQuickHint')}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-text-subtle">
            {unlimited ? t('input.costUnlimited') : t('ask.cost', { n: grounded ? ASK_CREDITS : TOPIC_CREDITS })}
          </p>
          {busy ? (
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-2 text-sm text-text-muted">
                <Spinner />
                {!grounded ? t('ask.thinking') : stage === 'searching' ? t('ask.searching') : t('ask.mapping')}
              </span>
              <button type="button" onClick={stop} className="btn btn-secondary h-11 px-4 text-sm">
                {t('ask.stop')}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void submit()}
              disabled={question.trim().length < 4}
              className="btn btn-primary h-11 px-6"
            >
              {t('ask.submit')}
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
        {busy && (
          /* 不报百分比：真实进度拿不到，假的百分比比没有更糟。
             这条只表达「还在动」，用无限循环的滑块而不是会走到头的进度条。 */
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-bg-muted" aria-hidden="true">
            <div className="h-full w-1/3 animate-indeterminate rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
          </div>
        )}
        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>
        )}
      </div>

      {busy ? (
        <div className="mt-6">
          <MapSkeleton />
        </div>
      ) : (
        <p className="mt-4 text-center text-[11px] leading-5 text-text-subtle">
          {grounded ? t('ask.grounded') : t('ask.modeQuickHint')}
        </p>
      )}

      {!busy && (
        <div className="mt-5">
          <p className="mb-2 text-center text-[11px] font-medium text-text-subtle">{t('ask.examples')}</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {EXAMPLE_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setQuestion(t(key))}
                className="rounded-xl border bg-surface px-3 py-2.5 text-left text-xs leading-5 text-text-muted transition-colors hover:border-brand-300 hover:text-text"
              >
                {t(key)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
