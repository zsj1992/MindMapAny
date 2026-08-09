import type { Metadata } from 'next';
import Link from 'next/link';
import { PLAN_CREDITS, PLAN_LIMITS, type Plan } from '@/lib/credits';

export const metadata: Metadata = {
  title: 'Pricing & plans',
  description: 'Compare credits, models and document limits across the MindMapAny Free, Basic, Pro and Unlimited plans.',
  alternates: { canonical: '/pricing' },
};

const PLANS = [
  {
    plan: 'free',
    name: 'Free',
    eyebrow: 'Start free',
    description: 'Try the common input types. Good for occasional articles and reference material.',
    price: '$0',
    annualPrice: 'Free forever',
    creditLabel: 'credits on signup',
    extras: ['Text / documents / ebooks / web pages', 'Editing, export and public sharing'],
    action: 'Start free',
    href: '/app/new',
  },
  {
    plan: 'basic',
    name: 'Basic',
    eyebrow: 'Everyday use',
    description: 'For day-to-day study and work, with a comfortable monthly allowance.',
    price: '$8.99 / month',
    annualPrice: '$64.68 / year (works out to $5.39 / month)',
    creditLabel: 'credits / month',
    extras: ['All available input types', 'Save, share and export in every format'],
    action: 'Get Basic',
    href: '/app/new',
  },
  {
    plan: 'pro',
    name: 'Pro',
    eyebrow: 'Recommended',
    description: 'Built for deep research and long documents. Unlocks the high-quality model.',
    price: '$17.99 / month',
    annualPrice: '$129.48 / year (works out to $10.79 / month)',
    creditLabel: 'credits / month',
    extras: ['Detailed map mode', 'Handles complex, long documents'],
    action: 'Get Pro',
    href: '/app/new',
    featured: true,
  },
  {
    plan: 'unlimited',
    name: 'Unlimited',
    eyebrow: 'Heavy use',
    description: 'For high-volume creators and researchers. No monthly credit counting.',
    price: '$26.99 / month',
    annualPrice: '$194.28 / year (works out to $16.19 / month)',
    creditLabel: 'unlimited credits',
    extras: ['Everything in Pro', 'Unlimited usage under a fair use policy'],
    action: 'Get Unlimited',
    href: '/app/new',
  },
] as const satisfies ReadonlyArray<{
  plan: Plan;
  name: string;
  eyebrow: string;
  description: string;
  price: string;
  annualPrice: string;
  creditLabel: string;
  extras: readonly string[];
  action: string;
  href?: string;
  featured?: boolean;
}>;

function creditsLabel(plan: Plan): string {
  const value = PLAN_CREDITS[plan];
  return Number.isFinite(value) ? value.toLocaleString() : '∞';
}

function coreLimits(plan: Plan): string[] {
  const limits = PLAN_LIMITS[plan];
  return [
    limits.tiers.includes('quality') ? 'Fast + high-quality AI models' : 'Fast AI model',
    `Up to ${limits.maxChars.toLocaleString()} characters`,
    `PDFs up to ${limits.maxPdfPages} pages`,
  ];
}

export default function PricingPage() {
  return (
    <main>
      <section className="hero-glow relative overflow-hidden border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-5 py-16 text-center sm:py-20">
          <span className="eyebrow">Simple, transparent, upgrade when you need to</span>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Start free</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-text-muted">
            All prices are in USD. Pay monthly to stay flexible, or pay annually and save 40%. Taxes are shown clearly before checkout.
          </p>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border bg-surface px-4 py-2 text-xs font-semibold text-text-muted shadow-sm">
            <span className="h-2 w-2 rounded-full bg-accent-500" />
            30 free credits on signup — try every available input type
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-8">
        <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col overflow-hidden rounded-2xl border bg-surface p-6 shadow-sm ${
                'featured' in plan && plan.featured
                  ? 'border-brand-500 shadow-xl shadow-brand-900/10 ring-1 ring-brand-500'
                  : ''
              }`}
            >
              {'featured' in plan && plan.featured && (
                <div className="-mx-6 -mt-6 mb-5 bg-brand-600 px-4 py-2 text-center text-[11px] font-bold tracking-wide text-white">
                  MOST POPULAR
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
                  <span className="text-4xl font-bold tracking-[-0.04em]">{creditsLabel(plan.plan)}</span>
                  <span className="pb-1 text-xs font-medium text-text-muted">{plan.creditLabel}</span>
                </div>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {[...coreLimits(plan.plan), ...plan.extras].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-text-muted">
                    <span className="mt-0.5 font-bold text-accent-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              {plan.plan === 'free' ? (
                <Link href={plan.href} className="btn btn-primary mt-7 h-11 w-full">
                  {plan.action} <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <div className="mt-7 grid gap-2">
                  <a href={`/api/checkout?plan=${plan.plan}&period=annual`} className="btn btn-primary h-11 w-full">
                    Subscribe yearly <span aria-hidden="true">→</span>
                  </a>
                  <a href={`/api/checkout?plan=${plan.plan}&period=monthly`} className="btn btn-secondary h-10 w-full text-xs">
                    Subscribe monthly
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border bg-surface p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
          <div>
            <h2 className="text-lg font-bold">Need more for a team or institution?</h2>
            <p className="mt-2 text-sm leading-6 text-text-muted">Get in touch about pooled credits, procurement and dedicated support. We usually reply within 3 business days.</p>
          </div>
          <a href="mailto:support@mindmapany.com?subject=MindMapAny%20team%20plan" className="btn btn-secondary mt-5 h-11 shrink-0 px-5 sm:mt-0">Contact support</a>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-6 text-text-subtle">
          Please check out with the same email as your MindMapAny account so your plan activates automatically after payment.
          <br />
          Subscriptions renew automatically for the billing period you choose until you cancel. Payments are processed by Creem as Merchant of Record.
          You can cancel any time from<Link href="/billing" className="mx-1 font-medium text-brand-600 hover:text-brand-700">subscription management</Link>; refund terms are in our
          <Link href="/refund-policy" className="ml-1 font-medium text-brand-600 hover:text-brand-700">Refund &amp; Cancellation Policy</Link>.
        </p>
      </section>
    </main>
  );
}
