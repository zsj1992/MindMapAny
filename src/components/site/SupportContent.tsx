import Link from 'next/link';
import { marketingCopy } from '@/lib/i18n/marketing';
import { localizedPath } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/locales';

/* 支持页正文。7 种语言共用，只有 locale 不同。 */

export function SupportContent({ locale }: { locale: Locale }) {
  const copy = marketingCopy(locale).support;
  return (
    <main>
      <section className="hero-glow border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:py-20">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">{copy.heading}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-text-muted">{copy.intro}</p>
          <a href="mailto:support@mindmapany.com" className="btn btn-primary mt-8 h-12 px-6">support@mindmapany.com</a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 sm:py-18">
        <div className="grid gap-4 md:grid-cols-3">
          {copy.topics.map((topic) => (
            <article key={topic.title} className="card p-6">
              <h2 className="text-lg font-bold">{topic.title}</h2>
              <p className="mt-3 min-h-12 text-sm leading-6 text-text-muted">{topic.text}</p>
              <a
                href={`mailto:support@mindmapany.com?subject=${encodeURIComponent(topic.subject)}`}
                className="mt-5 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                {copy.sendEmail} →
              </a>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border bg-surface p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
          <div>
            <h2 className="text-lg font-bold">{copy.manageHeading}</h2>
            <p className="mt-2 text-sm leading-6 text-text-muted">{copy.manageBody}</p>
          </div>
          <Link href={localizedPath('/billing', locale)} className="btn btn-secondary mt-5 h-11 shrink-0 px-5 sm:mt-0">
            {copy.manageAction}
          </Link>
        </div>
      </section>
    </main>
  );
}
