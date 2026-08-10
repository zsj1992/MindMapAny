import Link from 'next/link';
import { PLAN_CREDITS, PLAN_LIMITS, type Plan } from '@/lib/credits';
import { fill, marketingCopy } from '@/lib/i18n/marketing';
import { localizedPath } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/locales';

/**
 * 定价页正文。中英两条路由共用这一个组件，只有 locale 不同 ——
 * 复制一份中文页面出来是最省事的写法，但从此每次调价都要改两处，迟早漏一处。
 */

const ORDER = ['free', 'basic', 'pro', 'unlimited'] as const;
const FEATURED: Plan = 'pro';

function creditsLabel(plan: Plan): string {
  const value = PLAN_CREDITS[plan];
  return Number.isFinite(value) ? value.toLocaleString() : '∞';
}

export function PricingContent({ locale }: { locale: Locale }) {
  const copy = marketingCopy(locale).pricing;

  const coreLimits = (plan: Plan): string[] => {
    const limits = PLAN_LIMITS[plan];
    return [
      limits.tiers.includes('quality') ? copy.limitBoth : copy.limitFastOnly,
      fill(copy.limitChars, { n: limits.maxChars.toLocaleString() }),
      fill(copy.limitPdfPages, { n: limits.maxPdfPages }),
    ];
  };

  return (
    <main>
      <section className="hero-glow relative overflow-hidden border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-5 py-16 text-center sm:py-20">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">{copy.heading}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-text-muted">{copy.intro}</p>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border bg-surface px-4 py-2 text-xs font-semibold text-text-muted shadow-sm">
            <span className="h-2 w-2 rounded-full bg-accent-500" />
            {copy.badge}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-8">
        <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
          {ORDER.map((planId) => {
            const plan = copy.plans[planId];
            const featured = planId === FEATURED;
            return (
              <article
                key={planId}
                className={`relative flex flex-col overflow-hidden rounded-2xl border bg-surface p-6 shadow-sm ${
                  featured ? 'border-brand-500 shadow-xl shadow-brand-900/10 ring-1 ring-brand-500' : ''
                }`}
              >
                {featured && (
                  <div className="-mx-6 -mt-6 mb-5 bg-brand-600 px-4 py-2 text-center text-[11px] font-bold tracking-wide text-white">
                    {copy.mostPopular}
                  </div>
                )}
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
                  {plan.eyebrow}
                </div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">{plan.name}</h2>
                <p className="mt-3 min-h-14 text-sm leading-6 text-text-muted">{plan.description}</p>

                <div className="mt-6 border-y py-5" style={{ borderColor: 'var(--border)' }}>
                  <div className="mb-4">
                    <div className="text-2xl font-bold tracking-[-0.03em]">{plan.price}</div>
                    <div className="mt-1 text-xs leading-5 text-text-muted">{plan.annualPrice}</div>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold tracking-[-0.04em]">{creditsLabel(planId)}</span>
                    <span className="pb-1 text-xs font-medium text-text-muted">{plan.creditLabel}</span>
                  </div>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {[...coreLimits(planId), ...plan.extras].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-text-muted">
                      <span className="mt-0.5 font-bold text-accent-500">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {planId === 'free' ? (
                  <Link href={localizedPath('/app/new', 'en')} className="btn btn-primary mt-7 h-11 w-full">
                    {plan.action} <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <div className="mt-7 grid gap-2">
                    <a href={`/api/checkout?plan=${planId}&period=annual`} className="btn btn-primary h-11 w-full">
                      {copy.subscribeYearly} <span aria-hidden="true">→</span>
                    </a>
                    <a href={`/api/checkout?plan=${planId}&period=monthly`} className="btn btn-secondary h-10 w-full text-xs">
                      {copy.subscribeMonthly}
                    </a>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border bg-surface p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
          <div>
            <h2 className="text-lg font-bold">{copy.teamHeading}</h2>
            <p className="mt-2 text-sm leading-6 text-text-muted">{copy.teamBody}</p>
          </div>
          <a href="mailto:support@mindmapany.com?subject=MindMapAny%20team%20plan" className="btn btn-secondary mt-5 h-11 shrink-0 px-5 sm:mt-0">
            {copy.teamAction}
          </a>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-6 text-text-subtle">
          {copy.footnoteEmail}
          <br />
          {copy.footnoteRenewal} {copy.footnoteCancel}
          <Link href={localizedPath('/billing', locale)} className="mx-1 font-medium text-brand-600 hover:text-brand-700">
            {locale === 'zh-CN' ? '订阅管理' : 'subscription management'}
          </Link>
          {locale === 'zh-CN' ? '中取消；退款条款见' : '; refund terms are in our'}
          <Link href={localizedPath('/refund-policy', locale)} className="ml-1 font-medium text-brand-600 hover:text-brand-700">
            {copy.footnoteRefund}
          </Link>
          {locale === 'zh-CN' ? '。' : '.'}
        </p>
      </section>
    </main>
  );
}
