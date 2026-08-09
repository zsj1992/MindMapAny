import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '联系与支持',
  description: '联系 MindMapAny 获取产品、账户、订阅、退款和隐私支持。',
  alternates: { canonical: '/support' },
};

const TOPICS = [
  { title: '产品与账户', text: '生成失败、额度异常、登录或数据问题', subject: '产品与账户支持' },
  { title: '账单与订阅', text: '付款、发票、取消、套餐变更或退款', subject: '账单与订阅支持' },
  { title: '隐私与安全', text: '数据访问、导出、删除或安全问题', subject: '隐私与安全支持' },
];

export default function SupportPage() {
  return (
    <main>
      <section className="hero-glow border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:py-20">
          <span className="eyebrow">真人支持</span>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">我们来帮你解决问题</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-text-muted">请使用账户或购买时的邮箱联系我们。我们通常会在 3 个工作日内回复。</p>
          <a href="mailto:support@mindmapany.com" className="btn btn-primary mt-8 h-12 px-6">support@mindmapany.com</a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 sm:py-18">
        <div className="grid gap-4 md:grid-cols-3">
          {TOPICS.map((topic) => (
            <article key={topic.title} className="card p-6">
              <h2 className="text-lg font-bold">{topic.title}</h2>
              <p className="mt-3 min-h-12 text-sm leading-6 text-text-muted">{topic.text}</p>
              <a href={`mailto:support@mindmapany.com?subject=${encodeURIComponent(topic.subject)}`} className="mt-5 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700">发送邮件 →</a>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border bg-surface p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
          <div>
            <h2 className="text-lg font-bold">管理订阅或取消续费</h2>
            <p className="mt-2 text-sm leading-6 text-text-muted">使用购买邮箱进入安全的 Creem Customer Portal，无需等待人工处理。</p>
          </div>
          <Link href="/billing" className="btn btn-secondary mt-5 h-11 shrink-0 px-5 sm:mt-0">进入订阅管理</Link>
        </div>
      </section>
    </main>
  );
}

