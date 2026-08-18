import Link from 'next/link';
import { SubscriptionPanel } from '@/components/site/SubscriptionPanel';
import { marketingCopy } from '@/lib/i18n/marketing';
import { localizedPath } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/locales';

/* 订阅管理页正文。7 种语言共用，只有 locale 不同。 */

export function BillingContent({ locale }: { locale: Locale }) {
  const copy = marketingCopy(locale).billing;
  return (
    <main className="hero-glow flex min-h-[calc(100vh-4rem)] items-center border-b py-12" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto w-full max-w-3xl px-5">
        <div className="rounded-3xl border bg-surface p-7 shadow-xl shadow-brand-900/5 sm:p-10">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1 className="mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">{copy.heading}</h1>
          <p className="mt-4 text-base leading-8 text-text-muted">{copy.intro}</p>

          {/* 登录的人直接看到自己的套餐和取消按钮；游客看到的还是这份说明。
              说明本身作为 children 交给面板，由它决定还显不显示 —— 已经登录的人
              不需要再读一遍「怎么登录」。 */}
          <SubscriptionPanel locale={locale}>
            <div className="mt-7 rounded-2xl border bg-bg-subtle p-5">
              <ol className="space-y-3 text-sm leading-6 text-text-muted">
                {copy.steps.map((step, index) => (
                  <li key={step}>
                    <strong className="text-text">{index + 1}.</strong> {step}
                  </li>
                ))}
              </ol>
            </div>
          </SubscriptionPanel>

          <div className="mt-7">
            <a href="mailto:support@mindmapany.com?subject=MindMapAny%20subscription%20support" className="btn btn-secondary h-12 px-6">
              {copy.contactBilling}
            </a>
          </div>

          <p className="mt-6 text-xs leading-5 text-text-subtle">
            {copy.afterCancel}
            <Link href={localizedPath('/refund-policy', locale)} className="mx-1 underline underline-offset-2">
              {copy.refundLink}
            </Link>
            {copy.refundTail}
          </p>
        </div>
      </div>
    </main>
  );
}
