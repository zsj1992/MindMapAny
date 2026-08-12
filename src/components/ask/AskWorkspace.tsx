'use client';

import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { MindMapCanvas } from '@/components/canvas/MindMapCanvas';
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

export function AskWorkspace({ unlimited }: { unlimited: boolean }) {
  const t = useT();
  const load = useEditor((state) => state.load);
  const map = useEditor((state) => state.map);
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<'searching' | 'mapping'>('searching');
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);

  const submit = async () => {
    if (question.trim().length < 4 || busy) return;
    setBusy(true);
    setError(null);
    setSources([]);
    setStage('searching');
    trackEvent('ask_started', {});
    // 检索通常十几秒，之后才轮到生成图。服务端没有回调，按经验值切文案，
    // 让等待有进展感 —— 空转的按钮会让人以为卡死。
    const toMapping = window.setTimeout(() => setStage('mapping'), 14_000);
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: question.trim() }),
      });
      const body = (await res.json()) as { map?: MindMap; sources?: Source[]; error?: { message?: string } };
      if (!res.ok || !body.map) {
        trackEvent('ask_failed', {});
        setError(body.error?.message ?? t('error.generic'));
        return;
      }
      trackEvent('ask_completed', {});
      load(body.map);
      setSources(body.sources ?? []);
    } catch {
      trackEvent('ask_failed', {});
      setError(t('error.network'));
    } finally {
      window.clearTimeout(toMapping);
      setBusy(false);
    }
  };

  if (map) {
    return (
      <ReactFlowProvider>
        <div className="flex h-full min-h-0 flex-col">
          <Toolbar onReset={() => useEditor.setState({ map: null, dirty: false })} />
          <div className="min-h-0 flex-1">
            <MindMapCanvas />
          </div>
          <RefineBar />
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
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-text-subtle">
            {unlimited ? t('input.costUnlimited') : t('ask.cost', { n: ASK_CREDITS })}
          </p>
          <button
            type="button"
            onClick={() => void submit()}
            disabled={busy || question.trim().length < 4}
            className="btn btn-primary h-11 px-6"
          >
            {busy ? (stage === 'searching' ? t('ask.searching') : t('ask.mapping')) : t('ask.submit')}
            {!busy && <span aria-hidden="true">→</span>}
          </button>
        </div>
        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>
        )}
      </div>

      <p className="mt-4 text-center text-[11px] leading-5 text-text-subtle">{t('ask.grounded')}</p>

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
