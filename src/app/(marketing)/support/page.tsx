import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact & support',
  description: 'Contact MindMapAny for help with the product, your account, subscriptions, refunds and privacy.',
  alternates: { canonical: '/support' },
};

const TOPICS = [
  { title: 'Product & account', text: 'Failed generations, credit issues, sign-in or data problems', subject: 'Product and account support' },
  { title: 'Billing & subscriptions', text: 'Payments, invoices, cancellation, plan changes or refunds', subject: 'Billing and subscription support' },
  { title: 'Privacy & security', text: 'Data access, export, deletion or security concerns', subject: 'Privacy and security support' },
];

export default function SupportPage() {
  return (
    <main>
      <section className="hero-glow border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:py-20">
          <span className="eyebrow">Human support</span>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">We&apos;re here to sort it out</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-text-muted">Please write from your account email or the address you used at purchase. We usually reply within 3 business days.</p>
          <a href="mailto:support@mindmapany.com" className="btn btn-primary mt-8 h-12 px-6">support@mindmapany.com</a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 sm:py-18">
        <div className="grid gap-4 md:grid-cols-3">
          {TOPICS.map((topic) => (
            <article key={topic.title} className="card p-6">
              <h2 className="text-lg font-bold">{topic.title}</h2>
              <p className="mt-3 min-h-12 text-sm leading-6 text-text-muted">{topic.text}</p>
              <a href={`mailto:support@mindmapany.com?subject=${encodeURIComponent(topic.subject)}`} className="mt-5 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700">Send email →</a>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border bg-surface p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
          <div>
            <h2 className="text-lg font-bold">Manage or cancel your subscription</h2>
            <p className="mt-2 text-sm leading-6 text-text-muted">Use your purchase email to open the secure Creem Customer Portal — no waiting on a human.</p>
          </div>
          <Link href="/billing" className="btn btn-secondary mt-5 h-11 shrink-0 px-5 sm:mt-0">Go to subscription management</Link>
        </div>
      </section>
    </main>
  );
}

