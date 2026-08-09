import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Subscription management',
  description: 'Open the Creem Customer Portal to manage your MindMapAny subscription, payment method, invoices and cancellation.',
  alternates: { canonical: '/billing' },
};

export default function BillingPage() {
  return (
    <main className="hero-glow flex min-h-[calc(100vh-4rem)] items-center border-b py-12" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto w-full max-w-3xl px-5">
        <div className="rounded-3xl border bg-surface p-7 shadow-xl shadow-brand-900/5 sm:p-10">
          <span className="eyebrow">Secure self-service</span>
          <h1 className="mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">Manage your subscription</h1>
          <p className="mt-4 text-base leading-8 text-text-muted">The Creem Customer Portal lets you view orders and invoices, update your payment method, and cancel at any time. Use the email you entered when you purchased MindMapAny to get a secure sign-in link.</p>

          <div className="mt-7 rounded-2xl border bg-bg-subtle p-5">
            <ol className="space-y-3 text-sm leading-6 text-text-muted">
              <li><strong className="text-text">1.</strong> Click the button below to open the Creem Customer Portal</li>
              <li><strong className="text-text">2.</strong> Enter the email you used at purchase</li>
              <li><strong className="text-text">3.</strong> Use the secure link in your inbox to manage or cancel the subscription</li>
            </ol>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="https://creem.io/my-orders/login" target="_blank" rel="noopener noreferrer" className="btn btn-primary h-12 px-6">Open Creem Customer Portal <span aria-hidden="true">↗</span></a>
            <a href="mailto:support@mindmapany.com?subject=MindMapAny%20subscription%20support" className="btn btn-secondary h-12 px-6">Contact billing support</a>
          </div>

          <p className="mt-6 text-xs leading-5 text-text-subtle">After cancelling you normally keep access until the end of the period you have already paid for. See our<Link href="/refund-policy" className="ml-1 underline underline-offset-2">Refund &amp; Cancellation Policy</Link> for refund terms.</p>
        </div>
      </div>
    </main>
  );
}

