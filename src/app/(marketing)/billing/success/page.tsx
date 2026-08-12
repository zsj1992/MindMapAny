import Link from 'next/link';
import { PurchaseCompletedTracker } from '@/components/analytics/PurchaseCompletedTracker';

export const metadata = { title: 'Your subscription is activating' };

export default function BillingSuccessPage() {
  return (
    <main className="hero-glow flex min-h-[calc(100vh-4rem)] items-center px-5 py-14">
      <PurchaseCompletedTracker />
      <section className="mx-auto w-full max-w-xl rounded-3xl border bg-surface p-8 text-center shadow-xl shadow-brand-900/5 sm:p-11">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600 dark:bg-emerald-950/40">✓</span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Payment complete</h1>
        <p className="mt-4 text-sm leading-7 text-text-muted">Creem is confirming your subscription, which usually takes a few seconds. Head back to the workbench and refresh to see your new plan and credits. If you checked out with a different email than your account, contact support and we&apos;ll sort it out.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/app/new" className="btn btn-primary h-11 px-6">Back to workbench</Link>
          <Link href="/billing" className="btn btn-secondary h-11 px-6">Manage subscription</Link>
        </div>
      </section>
    </main>
  );
}
