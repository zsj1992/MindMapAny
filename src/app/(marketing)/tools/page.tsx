import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/site/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL, TOOL_PAGES } from '@/lib/seo/content';

export const metadata: Metadata = {
  title: 'AI 思维导图工具中心',
  description: '使用 AI 将 PDF、YouTube 视频、网页文章和长文本转换为可编辑、可追溯的多层级思维导图。',
  alternates: { canonical: '/tools' },
};

export default function ToolsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'MindMapAny AI 思维导图工具中心',
    url: `${SITE_URL}/tools`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: TOOL_PAGES.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tool.title,
        url: `${SITE_URL}/tools/${tool.slug}`,
      })),
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main>
        <section className="hero-glow border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:py-20">
            <span className="eyebrow">按内容来源选择工具</span>
            <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">AI 思维导图工具中心</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-text-muted">每种内容使用独立的提取流程，最终得到同样可编辑、可折叠、可回到来源的知识结构。</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-5 px-5 py-14 md:grid-cols-2 lg:px-8 lg:py-20">
          {TOOL_PAGES.map((tool) => (
            <article key={tool.slug} className="rounded-2xl border bg-surface p-6 shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">{tool.eyebrow}</div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight"><Link href={`/tools/${tool.slug}`} className="hover:text-brand-600">{tool.title}</Link></h2>
              <p className="mt-3 text-sm leading-7 text-text-muted">{tool.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">{tool.relatedKeywords.slice(0, 3).map((keyword) => <span key={keyword} className="rounded-full bg-bg-subtle px-2.5 py-1 text-[11px] text-text-muted">{keyword}</span>)}</div>
              <Link href={`/tools/${tool.slug}`} className="mt-6 inline-flex text-sm font-semibold text-brand-600">查看工具详情 →</Link>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
