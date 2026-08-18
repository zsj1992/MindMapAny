'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { marketingCopy } from '@/lib/i18n/marketing';
import { localizedPath } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/locales';
import type { Plan } from '@/lib/credits';
import { trackEvent } from '@/lib/analytics';

/**
 * 订阅管理页上真正能操作的那一块。
 *
 * 这个页面原先只是一张说明书 —— 「打开 Creem 客户门户，输入购买邮箱」。
 * 换成 Waffo 收款之后那条路对新用户是死的，等于能付钱不能退订。
 *
 * 页面本身仍然是 7 个语言的静态页（要被搜索引擎收录），所以状态在加载后
 * 客户端问一次：游客看到的还是原来那份静态说明，登录的人才会看到自己的套餐
 * 和取消按钮。children 就是那份静态说明，由这里决定还要不要显示。
 */

interface State {
  signedIn: boolean;
  plan: Plan;
  canceling: boolean;
}

type Outcome = { kind: 'done' | 'failed'; text: string } | null;

export function SubscriptionPanel({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const copy = marketingCopy(locale).billing;
  const t = copy.manage;
  const [state, setState] = useState<State | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>(null);

  useEffect(() => {
    let alive = true;
    fetch('/api/subscription', { credentials: 'same-origin' })
      .then((res) => (res.ok ? (res.json() as Promise<State | null>) : null))
      .then((data) => {
        if (alive && data) setState(data);
      })
      // 问不到就退回静态说明，页面不能因为一个接口打不开就空白
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const cancel = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/subscription/cancel', { method: 'POST', credentials: 'same-origin' });
      if (!res.ok) throw new Error(String(res.status));
      trackEvent('subscription_canceled', { plan: state?.plan ?? 'unknown', locale });
      setState((prev) => (prev ? { ...prev, canceling: true } : prev));
      setOutcome({ kind: 'done', text: t.cancelDone });
    } catch {
      // 失败时绝不改本地状态：显示成「已取消」而实际没取消，是最坏的一种错
      setOutcome({ kind: 'failed', text: t.cancelFailed });
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  };

  // 还没问到结果：先什么都不显示，避免付费用户看到一眼「请登录」再跳成别的
  if (!state) return null;

  if (!state.signedIn) {
    return (
      <>
        {children}
        <div className="mt-7">
          <p className="text-sm leading-6 text-text-muted">{t.signedOutHint}</p>
          <Link href={`/login?next=${encodeURIComponent(localizedPath('/billing', locale))}`} className="btn btn-primary mt-4 h-11 px-6">
            {t.signInAction}
          </Link>
        </div>
      </>
    );
  }

  if (state.plan === 'free') {
    return (
      <div className="mt-7 rounded-2xl border bg-bg-subtle p-5">
        <p className="text-sm leading-6 text-text-muted">{t.freeState}</p>
        <Link href={localizedPath('/pricing', locale)} className="btn btn-secondary mt-4 h-11 px-6">
          {t.freeAction}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-7 rounded-2xl border p-5" style={{ borderColor: 'var(--border-strong)' }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-subtle">{t.planLabel}</p>
      <p className="mt-1 text-2xl font-bold capitalize tracking-tight">{state.plan}</p>
      <p className={`mt-3 text-sm leading-6 ${state.canceling ? 'text-amber-600 dark:text-amber-400' : 'text-text-muted'}`}>
        {state.canceling ? t.statusCanceling : t.statusActive}
      </p>

      {outcome && (
        <p
          role="status"
          className={`mt-4 rounded-lg px-3 py-2 text-xs leading-5 ${
            outcome.kind === 'done'
              ? 'bg-accent-500/10 text-accent-700 dark:text-accent-300'
              : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
          }`}
        >
          {outcome.text}
        </p>
      )}

      {/* 已经在取消流程里就不再给取消按钮 —— 重复点没有任何意义 */}
      {!state.canceling &&
        (confirming ? (
          <div className="mt-5 rounded-xl border bg-bg-subtle p-4" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm leading-6">{t.cancelConfirm}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {/* 主按钮是「保留」：确认框里最显眼的那个键不该是不可逆的那一个 */}
              <button type="button" className="btn btn-primary h-11 px-5" onClick={() => setConfirming(false)} disabled={busy}>
                {t.keepAction}
              </button>
              <button
                type="button"
                className="h-11 rounded-xl px-5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-wait disabled:opacity-60 dark:hover:bg-red-950/40"
                onClick={cancel}
                disabled={busy}
              >
                {busy ? t.cancelBusy : t.cancelAction}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="mt-5 text-sm font-semibold text-text-muted underline underline-offset-4 transition-colors hover:text-text"
            onClick={() => setConfirming(true)}
          >
            {t.cancelAction}
          </button>
        ))}
    </div>
  );
}
