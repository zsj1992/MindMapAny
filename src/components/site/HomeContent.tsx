import { Faq, Features, HowItWorks, InputTypes } from '@/components/site/Sections';
import { JsonLd } from '@/components/seo/JsonLd';
import { Footer } from '@/components/site/Footer';
import { HeroMap } from '@/components/site/HeroMap';
import Link from 'next/link';
import { SITE_URL } from '@/lib/seo/content';
import { marketingCopy } from '@/lib/i18n/marketing';
import { absoluteUrl, HTML_LANG, localizedPath } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/locales';

/* 首页正文。中英两条路由共用，唯一差别是 locale。 */

const INPUT_HREFS = [
  '/tools/text-to-mind-map',
  '/tools/pdf-to-mind-map',
  '/tools/docx-to-mind-map',
  '/tools/epub-to-mind-map',
  '/tools/pptx-to-mind-map',
  '/tools/webpage-to-mind-map',
];

const EXTENSION_CTA: Record<Locale, string> = {
  en: 'Chrome extension',
  'zh-CN': 'Chrome 插件',
  ja: 'Chrome 拡張機能',
  ko: 'Chrome 확장 프로그램',
  es: 'Extensión de Chrome',
  de: 'Chrome-Erweiterung',
  fr: 'Extension Chrome',
};

function ChromeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#2563eb" />
      <path d="M12 2a10 10 0 018.66 5H12a5 5 0 00-4.33 2.5L4.78 4.5A9.96 9.96 0 0112 2z" fill="#ef4444" />
      <path d="M20.66 7A10 10 0 0112 22l4.33-7.5A5 5 0 0017 12c0-1.85-1-3.47-2.5-4.33L20.66 7z" fill="#facc15" />
      <path d="M12 22A10 10 0 013.34 7h8.66A5 5 0 007.67 9.5L12 17v5z" fill="#22c55e" />
      <circle cx="12" cy="12" r="3.5" fill="#fff" />
      <circle cx="12" cy="12" r="2.7" fill="#3b82f6" />
    </svg>
  );
}

export function HomeContent({ locale }: { locale: Locale }) {
  const copy = marketingCopy(locale).home;
  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'MindMapAny',
            url: SITE_URL,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'MindMapAny',
            url: SITE_URL,
            inLanguage: HTML_LANG[locale],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'MindMapAny',
            applicationCategory: 'ProductivityApplication',
            operatingSystem: 'Web',
            url: absoluteUrl('/', locale),
            description: copy.metaDescription,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free trial' },
          },
        ]}
      />
      <main>
        <section className="home-hero relative overflow-hidden border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="home-grain pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[86rem] items-center gap-14 px-5 pb-10 pt-14 lg:grid-cols-[0.86fr_1.14fr] lg:px-10 lg:pb-12 lg:pt-20 xl:gap-20">
            <div className="max-w-[39rem]">
              <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.14em] text-brand-600 dark:text-brand-300">
                <span className="h-px w-9 bg-brand-500" />
                {copy.eyebrow}
              </p>
              <h1 className="mt-7 text-balance text-[2.8rem] font-semibold leading-[1.01] tracking-[-0.06em] sm:text-[4rem] lg:text-[4.7rem]">
                {copy.headingLead}
                <span className="relative ml-3 inline-block text-brand-600 dark:text-brand-300">
                  {copy.headingHighlight}
                  <svg className="absolute -bottom-1 left-0 h-2 w-full text-accent-500/70" viewBox="0 0 180 10" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M2 7C48 2 122 2 178 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="mt-7 max-w-[34rem] text-pretty text-base leading-8 text-text-muted sm:text-[1.05rem]">
                {copy.lede}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link href="/app/new" className="btn btn-primary h-12 px-6 text-[15px]">
                  {copy.ctaPrimary} <span aria-hidden="true">↗</span>
                </Link>
                <Link href="/browser-extension" className="btn btn-secondary h-12 px-5 text-[14px]">
                  <ChromeIcon /> {EXTENSION_CTA[locale]} <span aria-hidden="true">↓</span>
                </Link>
                <Link href="#features" className="group inline-flex h-12 items-center justify-center gap-2 px-2 text-sm font-semibold text-text-muted transition-colors hover:text-text">
                  {copy.ctaSecondary} <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="mt-9 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
                <p className="text-[10px] font-semibold tracking-[0.12em] text-text-subtle">{copy.worksWith}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  {copy.inputLabels.map((label, index) => (
                    <Link key={label} href={localizedPath(INPUT_HREFS[index], locale)} className="text-xs font-medium text-text-muted underline decoration-border-strong underline-offset-4 transition-colors hover:text-brand-600">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="animate-in-up relative lg:-mr-8">
              <div className="absolute -left-5 top-10 hidden w-28 -rotate-3 rounded-xl border bg-surface p-3 shadow-xl xl:block" style={{ borderColor: 'var(--border)' }}>
                <div className="text-[9px] font-semibold text-text-subtle">{copy.sourceDocLabel}</div>
                <div className="mt-2 h-1.5 w-16 rounded bg-bg-muted" />
                <div className="mt-1.5 h-1.5 w-20 rounded bg-bg-muted" />
                <div className="mt-1.5 h-1.5 w-12 rounded bg-brand-100 dark:bg-brand-900" />
                <div className="mt-3 text-[10px] font-semibold text-text">{copy.sourceDocPages}</div>
              </div>
              <div className="app-panel relative overflow-hidden rounded-[1.25rem] border bg-surface shadow-[0_32px_90px_rgb(18_48_78/0.16)]" style={{ borderColor: 'var(--border-strong)' }}>
                <div className="flex h-12 items-center border-b px-4" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-1.5" aria-hidden="true"><span className="h-2 w-2 rounded-full bg-[#ff7a66]" /><span className="h-2 w-2 rounded-full bg-[#f6bf4f]" /><span className="h-2 w-2 rounded-full bg-[#4dbb82]" /></div>
                  <span className="ml-4 truncate text-[11px] font-medium text-text-muted">{copy.panelTitle}</span>
                  <span className="ml-auto border-l pl-4 text-[10px] font-semibold text-accent-600" style={{ borderColor: 'var(--border)' }}>{copy.panelNodes}</span>
                </div>
                <div className="surface-grid relative bg-bg-subtle px-4 py-6 sm:px-7 sm:py-8">
                  <HeroMap className="w-full" />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg border bg-surface/90 px-2.5 py-1.5 text-[10px] font-medium text-text-muted shadow-sm backdrop-blur" style={{ borderColor: 'var(--border)' }}>
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-500" /> {copy.panelTrace}
                  </div>
                </div>
                <div className="grid grid-cols-3 border-t bg-surface" style={{ borderColor: 'var(--border)' }}>
                  {copy.panelFooter.map((label) => <span key={label} className="border-r px-3 py-3 text-center text-[10px] font-medium text-text-subtle last:border-r-0" style={{ borderColor: 'var(--border)' }}>{label}</span>)}
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto max-w-[86rem] px-5 lg:px-10">
            <div className="grid grid-cols-2 gap-y-4 border-t py-5 sm:grid-cols-4 sm:gap-y-0" style={{ borderColor: 'var(--border)' }}>
            {copy.stats.map(([value, label], index) => (
              <div
                key={label}
                className={`flex items-baseline gap-2.5 px-1 sm:px-0 ${index < 3 ? 'sm:border-r' : ''}`}
                style={{ borderColor: 'var(--border)' }}
              >
                <span className="font-mono text-base font-semibold tracking-[-0.03em] text-text sm:text-lg">{value}</span>
                <span className="text-[11px] leading-4 text-text-subtle">{label}</span>
              </div>
            ))}
            </div>
          </div>
        </section>

        <Features locale={locale} />
        <InputTypes locale={locale} />
        <HowItWorks locale={locale} />
        <Faq locale={locale} />

        <section className="px-5 pb-20 pt-4 sm:pb-24 sm:pt-8 lg:px-8">
          <div className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[1.5rem] bg-[#102f53] px-6 py-10 text-white shadow-[0_28px_80px_rgb(15_47_82/0.18)] sm:px-10 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-end lg:px-14">
            <div className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full border border-white/10" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-2 -top-12 h-44 w-44 rounded-full border border-white/10" aria-hidden="true" />
            <div className="relative max-w-2xl">
              <p className="text-[10px] font-semibold tracking-[0.16em] text-cyan-300">{copy.ctaEyebrow}</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">{copy.ctaHeading}</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100/70">{copy.ctaBody}</p>
            </div>
            <Link href="/app/new" className="btn relative mt-8 h-12 bg-white px-6 text-[14px] text-[#102f53] shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-blue-50 lg:mt-0">
              {copy.ctaButton} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
