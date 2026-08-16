import Link from 'next/link';
import { Footer } from '@/components/site/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { localizedToolPage, SITE_URL, TOOL_PAGES } from '@/lib/seo/content';
import { marketingCopy } from '@/lib/i18n/marketing';
import { localizedPath } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/locales';
import { PopularTools } from '@/components/site/PopularTools';

/* 工具索引页正文。中英共用，只有 locale 不同。 */

export function ToolsIndexContent({ locale }: { locale: Locale }) {
  const tools = TOOL_PAGES.map((tool) => localizedToolPage(tool, locale));
  const copy = marketingCopy(locale).toolsIndex;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'MindMapAny AI mind map tools',
    url: `${SITE_URL}${localizedPath('/tools', locale)}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: tools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tool.title,
        url: `${SITE_URL}${localizedPath(`/tools/${tool.slug}`, locale)}`,
      })),
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main>
        <section className="hero-glow border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:py-20">
            <span className="eyebrow">{copy.eyebrow}</span>
            <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">{copy.heading}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-text-muted">{copy.lede}</p>
          </div>
        </section>

        <PopularTools locale={locale} placement="tools-index" />

        <section className="mx-auto grid max-w-6xl gap-5 px-5 py-14 md:grid-cols-2 lg:px-8 lg:py-20">
          {tools.map((tool) => (
            <article key={tool.slug} className="rounded-2xl border bg-surface p-6 shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">{tool.eyebrow}</div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight"><Link href={localizedPath(`/tools/${tool.slug}`, locale)} className="hover:text-brand-600">{tool.title}</Link></h2>
              <p className="mt-3 text-sm leading-7 text-text-muted">{tool.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">{tool.relatedKeywords.slice(0, 3).map((keyword) => <span key={keyword} className="rounded-full bg-bg-subtle px-2.5 py-1 text-[11px] text-text-muted">{keyword}</span>)}</div>
              <Link href={localizedPath(`/tools/${tool.slug}`, locale)} className="mt-6 inline-flex text-sm font-semibold text-brand-600">{copy.viewDetails} →</Link>
            </article>
          ))}
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
