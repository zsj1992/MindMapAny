import Link from 'next/link';

export const metadata = { title: '订阅正在生效' };

export default function BillingSuccessPage() {
  return (
    <main className="hero-glow flex min-h-[calc(100vh-4rem)] items-center px-5 py-14">
      <section className="mx-auto w-full max-w-xl rounded-3xl border bg-surface p-8 text-center shadow-xl shadow-brand-900/5 sm:p-11">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600 dark:bg-emerald-950/40">✓</span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">付款已完成</h1>
        <p className="mt-4 text-sm leading-7 text-text-muted">Creem 正在确认订阅，通常几秒内生效。返回工作台后刷新页面即可看到新套餐和积分；如果结账邮箱与账号邮箱不同，请联系支持处理。</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/app/new" className="btn btn-primary h-11 px-6">返回工作台</Link>
          <Link href="/billing" className="btn btn-secondary h-11 px-6">管理订阅</Link>
        </div>
      </section>
    </main>
  );
}
