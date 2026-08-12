'use client';

import { useRef, useState } from 'react';
import { Spinner } from '@/components/Spinner';
import { useT } from '@/lib/i18n/context';
import { LOCALE_NAMES, LOCALES } from '@/lib/i18n/locales';
import type { MindMap } from '@/lib/mindmap/schema';
import { useEditor } from '@/store/editor';

/**
 * 生成之后继续改图：四个常用动作 + 一句自由指令。
 *
 * 每次修改都保留上一版并提供撤销 —— 改图是模型行为，结果不一定更好，
 * 没有退路的话用户不敢点第二次。
 */

type Action = 'concise' | 'detail' | 'translate' | 'regenerate' | 'custom';

export function RefineBar() {
  const t = useT();
  const map = useEditor((state) => state.map);
  const load = useEditor((state) => state.load);
  const [busy, setBusy] = useState<Action | null>(null);
  const [instruction, setInstruction] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [previous, setPrevious] = useState<MindMap | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  if (!map) return null;

  const run = async (action: Action, extra?: string) => {
    if (busy) return;
    setBusy(action);
    setError(null);
    setLangOpen(false);
    const before = map;
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ map: before, action, ...(extra ? { instruction: extra } : {}) }),
        signal: controller.signal,
      });
      const body = (await res.json()) as { map?: MindMap; error?: { message?: string } };
      if (!res.ok || !body.map) {
        setError(body.error?.message ?? t('refine.failed'));
        return;
      }
      setPrevious(before);
      load(body.map);
      if (action === 'custom') setInstruction('');
    } catch (thrown) {
      // 中止是用户的选择，不是故障：图保持原样，服务端退回积分
      if ((thrown as { name?: string })?.name !== 'AbortError') setError(t('error.network'));
    } finally {
      abortRef.current = null;
      setBusy(null);
    }
  };

  const quick: { action: Action; label: string }[] = [
    { action: 'concise', label: t('refine.concise') },
    { action: 'detail', label: t('refine.detail') },
    { action: 'regenerate', label: t('refine.regenerate') },
  ];

  return (
    <div className="shrink-0 border-t bg-surface px-3 py-2.5 sm:px-5" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {quick.map((item) => (
            <button
              key={item.action}
              type="button"
              disabled={!!busy}
              onClick={() => void run(item.action)}
              className="btn btn-secondary h-8 gap-1.5 px-3 text-xs"
            >
              {busy === item.action && <Spinner className="h-3 w-3" />}
              {busy === item.action ? t('refine.working') : item.label}
            </button>
          ))}

          <div className="relative">
            <button type="button" disabled={!!busy} onClick={() => setLangOpen((v) => !v)} className="btn btn-secondary h-8 gap-1.5 px-3 text-xs">
              {busy === 'translate' && <Spinner className="h-3 w-3" />}
              {busy === 'translate' ? t('refine.working') : t('refine.translate')}
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3 w-3" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m6.5 8 3.5 3.5L13.5 8" />
              </svg>
            </button>
            {langOpen && (
              <ul
                role="menu"
                className="absolute bottom-full left-0 z-40 mb-1.5 min-w-[9rem] overflow-hidden rounded-xl border bg-surface py-1 shadow-lg"
                style={{ borderColor: 'var(--border-strong)' }}
              >
                {LOCALES.filter((locale) => locale !== map.language).map((locale) => (
                  <li key={locale}>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => void run('translate', locale)}
                      className="w-full px-3.5 py-1.5 text-left text-xs text-text-muted transition-colors hover:bg-bg-subtle hover:text-text"
                    >
                      {LOCALE_NAMES[locale]}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {previous && (
            <button
              type="button"
              disabled={!!busy}
              onClick={() => {
                load(previous);
                setPrevious(null);
              }}
              className="btn btn-ghost h-8 px-3 text-xs"
            >
              ↩ {t('refine.undo')}
            </button>
          )}

          <span className="ml-auto hidden text-[10px] text-text-subtle sm:inline">{t('refine.cost')}</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={instruction}
            onChange={(event) => setInstruction(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && instruction.trim()) void run('custom', instruction.trim());
            }}
            placeholder={t('refine.placeholder')}
            disabled={!!busy}
            className="field h-10 flex-1 border-0 bg-bg-subtle px-3.5 text-sm shadow-inner"
          />
          <button
            type="button"
            disabled={!!busy || !instruction.trim()}
            onClick={() => void run('custom', instruction.trim())}
            className="btn btn-primary h-10 w-10 shrink-0 p-0"
            aria-label={busy === 'custom' ? t('refine.working') : t('refine.placeholder')}
          >
            {busy === 'custom' ? (
              <Spinner />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6" />
              </svg>
            )}
          </button>
        </div>

        {busy && (
          <div className="flex items-center gap-2">
            <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-bg-muted" aria-hidden="true">
              <div className="h-full w-1/4 animate-indeterminate rounded-full bg-brand-500" />
            </div>
            <span className="text-[10px] text-text-subtle">{t('refine.working')}</span>
            <button type="button" onClick={() => abortRef.current?.abort()} className="text-[10px] font-medium text-brand-600 hover:text-brand-700">
              {t('ask.stop')}
            </button>
          </div>
        )}
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    </div>
  );
}
