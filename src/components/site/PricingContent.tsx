'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PLAN_CREDITS, PLAN_LIMITS, type Plan } from '@/lib/credits';
import type { BillingPeriod } from '@/lib/billing/creem';
import { fill, marketingCopy } from '@/lib/i18n/marketing';
import { localizedPath } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/locales';

/**
 * 定价页正文。中英等 7 种语言共用这一个组件，只有 locale 不同。
 *
 * 计费周期是页面级的一次选择，不是每张卡各选一次 —— 之前每张卡同时列出月价和年价、
 * 再各挂「按年订阅」「按月订阅」两个按钮，等于把同样的信息说了两遍，
 * 而用户其实早就决定了自己要按月还是按年。
 */

const ORDER = ['free', 'basic', 'pro', 'unlimited'] as const;
const FEATURED: Plan = 'pro';

/**
 * 价格是数字，不是文案 —— 各语言共用同一套美元金额。
 * 写成每种语言一份字符串的话，改一次价要改 7 处，迟早漏掉一处。
 * 金额必须和 Creem 后台一致，creem.test.ts 里钉了对照表。
 */
const PRICES: Record<Exclude<Plan, 'free'>, { monthly: number; annualTotal: number }> = {
  basic: { monthly: 8.99, annualTotal: 64.68 },
  pro: { monthly: 17.99, annualTotal: 129.48 },
  unlimited: { monthly: 26.99, annualTotal: 194.28 },
};

const money = (value: number) => `$${value.toFixed(2)}`;

/** 年付相对月付省多少。写死一个数字迟早和价格对不上，这里现算 */
function savePercent(): number {
  const { monthly, annualTotal } = PRICES.pro;
  return Math.round((1 - annualTotal / (monthly * 12)) * 100);
}

export function PricingContent({ locale }: { locale: Locale }) {
  const copy = marketingCopy(locale).pricing;
  // 年付是主推项，默认选中；这也是竞品的普遍做法
  const [period, setPeriod] = useState<BillingPeriod>('annual');
  const pct = savePercent();

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
        <div className="relative mx-auto max-w-4xl px-5 pb-8 pt-10 text-center sm:pb-10 sm:pt-12">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">{copy.heading}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-text-muted">{copy.intro}</p>

          {/* 外面这层 block 容器不能省：切换器和下面的徽章都是 inline-flex，
              同级放置会并排流到一行上去，看起来像两个不相干的东西挤在一起。 */}
          <div className="mt-7">
          <div
            role="radiogroup"
            aria-label={copy.eyebrow}
            className="inline-flex items-center gap-1 rounded-full border bg-surface p-1 shadow-sm"
            style={{ borderColor: 'var(--border)' }}
          >
            {(['monthly', 'annual'] as const).map((item) => (
              <button
                key={item}
                type="button"
                role="radio"
                aria-checked={period === item}
                onClick={() => setPeriod(item)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  period === item ? 'bg-bg-muted text-text shadow-sm' : 'text-text-muted hover:text-text'
                }`}
              >
                {item === 'monthly' ? copy.toggleMonthly : copy.toggleAnnual}
                {item === 'annual' && (
                  <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold text-accent-700 dark:bg-accent-900/40 dark:text-accent-200">
                    {fill(copy.saveBadge, { pct })}
                  </span>
                )}
              </button>
            ))}
          </div>
          </div>

          <div className="mt-4">
            <p className="inline-flex items-center gap-2 rounded-full border bg-surface px-4 py-2 text-xs font-semibold text-text-muted shadow-sm">
              <span className="h-2 w-2 rounded-full bg-accent-500" />
              {copy.badge}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:pb-20 lg:px-8">
        <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
          {ORDER.map((planId) => {
            const plan = copy.plans[planId];
            const featured = planId === FEATURED;
            const paid = planId !== 'free';
            const price = paid ? PRICES[planId] : null;
            // 年付卡上显示的是「折合每月」，下面一行才是实际扣款总额 —— 和月付并排时才可比
            const headline = price ? money(period === 'annual' ? price.annualTotal / 12 : price.monthly) : '$0';
            const note = price
              ? period === 'annual'
                ? fill(copy.billedAnnually, { total: price.annualTotal.toFixed(2), pct })
                : copy.billedMonthly
              : copy.forever;

            return (
              <article
                key={planId}
                className={`relative flex flex-col rounded-2xl border bg-surface p-5 shadow-sm sm:p-6 ${
                  featured ? 'border-brand-500 shadow-xl shadow-brand-900/10 ring-1 ring-brand-500' : ''
                }`}
              >
                {/* 徽章浮在卡片上边缘之外，不占卡内高度 —— 做成卡内横幅会把这一列
                    整体压低三十来像素，四张卡的价格行就对不齐了。 */}
                {featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-600 px-3 py-1 text-[10px] font-bold tracking-wide text-white shadow-sm">
                    {copy.mostPopular}
                  </span>
                )}
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
                  {plan.eyebrow}
                </div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">{plan.name}</h2>
                {/* 固定三行高度：四张卡的说明长短不一，不锁高度价格行就会各自错位 */}
                <p className="mt-2 min-h-[4rem] text-sm leading-[1.45] text-text-muted">{plan.description}</p>

                <div className="mt-4 border-y py-4" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold tracking-[-0.04em]">{headline}</span>
                    {paid && <span className="text-sm font-medium text-text-muted">{copy.perMonth}</span>}
                  </div>
                  <div className={`mt-1.5 text-xs leading-5 ${period === 'annual' && paid ? 'font-medium text-accent-600' : 'text-text-muted'}`}>
                    {note}
                  </div>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-2xl font-bold tracking-[-0.03em]">
                      {Number.isFinite(PLAN_CREDITS[planId]) ? PLAN_CREDITS[planId].toLocaleString() : '∞'}
                    </span>
                    <span className="pb-0.5 text-xs font-medium text-text-muted">{plan.creditLabel}</span>
                  </div>
                </div>

                <ul className="mt-4 flex-1 space-y-2">
                  {[...coreLimits(planId), ...plan.extras].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-text-muted">
                      <span className="mt-0.5 font-bold text-accent-500">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                {paid ? (
                  <a href={`/api/checkout?plan=${planId}&period=${period}`} className={`btn mt-5 h-11 w-full ${featured ? 'btn-primary' : 'btn-secondary'}`}>
                    {plan.action} <span aria-hidden="true">→</span>
                  </a>
                ) : (
                  <Link href="/app/new" className="btn btn-secondary mt-5 h-11 w-full">
                    {plan.action} <span aria-hidden="true">→</span>
                  </Link>
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
