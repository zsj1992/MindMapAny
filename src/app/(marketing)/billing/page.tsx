import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '订阅管理',
  description: '进入 Creem Customer Portal，管理 MindMapAny 订阅、付款方式、发票和取消续费。',
  alternates: { canonical: '/billing' },
};

export default function BillingPage() {
  return (
    <main className="hero-glow flex min-h-[calc(100vh-4rem)] items-center border-b py-12" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto w-full max-w-3xl px-5">
        <div className="rounded-3xl border bg-surface p-7 shadow-xl shadow-brand-900/5 sm:p-10">
          <span className="eyebrow">安全的自助服务</span>
          <h1 className="mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">管理你的订阅</h1>
          <p className="mt-4 text-base leading-8 text-text-muted">Creem Customer Portal 支持查看订单与发票、更新付款方式，以及随时取消订阅。使用购买 MindMapAny 时填写的邮箱获取安全登录链接。</p>

          <div className="mt-7 rounded-2xl border bg-bg-subtle p-5">
            <ol className="space-y-3 text-sm leading-6 text-text-muted">
              <li><strong className="text-text">1.</strong> 点击下方按钮打开 Creem Customer Portal</li>
              <li><strong className="text-text">2.</strong> 输入购买时使用的邮箱</li>
              <li><strong className="text-text">3.</strong> 从邮件中的安全链接管理或取消订阅</li>
            </ol>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="https://creem.io/my-orders/login" target="_blank" rel="noopener noreferrer" className="btn btn-primary h-12 px-6">打开 Creem Customer Portal <span aria-hidden="true">↗</span></a>
            <a href="mailto:support@mindmapany.com?subject=MindMapAny%20订阅支持" className="btn btn-secondary h-12 px-6">联系账单支持</a>
          </div>

          <p className="mt-6 text-xs leading-5 text-text-subtle">取消后通常可以使用到当前已付周期结束。退款条件请查看<Link href="/refund-policy" className="ml-1 underline underline-offset-2">退款与取消政策</Link>。</p>
        </div>
      </div>
    </main>
  );
}

