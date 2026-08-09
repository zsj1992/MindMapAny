import type { Metadata } from 'next';
import Link from 'next/link';
import { PLAN_CREDITS, PLAN_LIMITS, type Plan } from '@/lib/credits';

export const metadata: Metadata = {
  title: '价格与套餐',
  description: '查看 MindMapAny 免费版、Basic、Pro 与 Unlimited 套餐的积分、模型和文档上限。',
  alternates: { canonical: '/pricing' },
};

const PLANS = [
  {
    plan: 'free',
    name: 'Free',
    eyebrow: '免费开始',
    description: '体验常用内容输入，适合偶尔整理文章和资料。',
    price: '$0',
    annualPrice: '永久免费',
    creditLabel: '注册赠送积分',
    extras: ['文本 / 文档 / 电子书 / 网页', '编辑、导出与公开分享'],
    action: '免费开始',
    href: '/app/new',
  },
  {
    plan: 'basic',
    name: 'Basic',
    eyebrow: '日常使用',
    description: '面向日常学习和办公，更充足的月度使用额度。',
    price: '$8.99 / 月',
    annualPrice: '$64.68 / 年（相当于 $5.39 / 月）',
    creditLabel: '积分 / 月',
    extras: ['全部已开放内容输入', '保存、分享与多格式导出'],
    action: '开始使用 Basic',
    href: '/app/new',
  },
  {
    plan: 'pro',
    name: 'Pro',
    eyebrow: '推荐方案',
    description: '为深度研究和长文档设计，解锁高质量模型。',
    price: '$17.99 / 月',
    annualPrice: '$129.48 / 年（相当于 $10.79 / 月）',
    creditLabel: '积分 / 月',
    extras: ['详细脑图模式', '优先处理复杂长文档'],
    action: '开始使用 Pro',
    href: '/app/new',
    featured: true,
  },
  {
    plan: 'unlimited',
    name: 'Unlimited',
    eyebrow: '重度使用',
    description: '面向高频创作者与研究人员，不再计算月度积分。',
    price: '$26.99 / 月',
    annualPrice: '$194.28 / 年（相当于 $16.19 / 月）',
    creditLabel: '不限积分',
    extras: ['全部 Pro 能力', '公平使用原则下不限额度'],
    action: '开始使用 Unlimited',
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
    limits.tiers.includes('quality') ? '快速 + 高质量 AI 模型' : '快速 AI 模型',
    `最长 ${limits.maxChars.toLocaleString()} 字符`,
    `PDF 最多 ${limits.maxPdfPages} 页`,
  ];
}

export default function PricingPage() {
  return (
    <main>
      <section className="hero-glow relative overflow-hidden border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-5 py-16 text-center sm:py-20">
          <span className="eyebrow">简单、透明、按需升级</span>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">从免费体验开始</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-text-muted">
            所有价格均以美元计价。选择月付保持灵活，选择年付可节省 40%；税费会在结账前明确显示。
          </p>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border bg-surface px-4 py-2 text-xs font-semibold text-text-muted shadow-sm">
            <span className="h-2 w-2 rounded-full bg-accent-500" />
            注册即赠 30 积分，已开放输入均可体验
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

              <Link href={plan.href} className="btn btn-primary mt-7 h-11 w-full">
                {plan.action} <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border bg-surface p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
          <div>
            <h2 className="text-lg font-bold">团队或机构需要更高额度？</h2>
            <p className="mt-2 text-sm leading-6 text-text-muted">联系我们了解统一额度管理、采购与专属支持。通常在 3 个工作日内回复。</p>
          </div>
          <a href="mailto:support@mindmapany.com?subject=MindMapAny%20团队方案" className="btn btn-secondary mt-5 h-11 shrink-0 px-5 sm:mt-0">联系支持</a>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-6 text-text-subtle">
          订阅会按所选周期自动续费，直至取消。付款由 Creem 作为 Merchant of Record 处理。
          你可以随时进入<Link href="/billing" className="mx-1 font-medium text-brand-600 hover:text-brand-700">订阅管理</Link>取消，退款条件见
          <Link href="/refund-policy" className="ml-1 font-medium text-brand-600 hover:text-brand-700">退款与取消政策</Link>。
        </p>
      </section>
    </main>
  );
}
