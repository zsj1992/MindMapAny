import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { Footer } from '@/components/site/Footer';
import { BLOG_POSTS, getToolPage, SITE_URL, TOOL_PAGES } from '@/lib/seo/content';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TOOL_PAGES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getToolPage((await params).slug);
  if (!tool) return {};
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    keywords: [tool.primaryKeyword, ...tool.relatedKeywords],
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: { title: tool.seoTitle, description: tool.seoDescription, url: `/tools/${tool.slug}` },
  };
}

export default async function ToolLandingPage({ params }: Props) {
  const tool = getToolPage((await params).slug);
  if (!tool) notFound();
  const url = `${SITE_URL}/tools/${tool.slug}`;
  const relatedPosts = BLOG_POSTS.filter((post) => post.relatedTool === `/tools/${tool.slug}`);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.title,
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'Web',
      url,
      description: tool.seoDescription,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free trial' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
        { '@type': 'ListItem', position: 3, name: tool.title, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <main>
        <section className="hero-glow border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-20">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Tools', href: '/tools' }, { label: tool.title }]} />
            <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
              <div>
                <span className="eyebrow">{tool.eyebrow}</span>
                <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">{tool.title}</h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-text-muted sm:text-lg">{tool.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={tool.appPath} className="btn btn-primary h-12 px-6">Start free →</Link>
                  <Link href="/pricing" className="btn btn-secondary h-12 px-5">See plans &amp; limits</Link>
                </div>
              </div>
              <div className="rounded-2xl border bg-surface p-6 shadow-xl shadow-brand-900/10" style={{ borderColor: 'var(--border)' }}>
                <div className="text-xs font-semibold text-text-subtle">Good for</div>
                <ul className="mt-3 space-y-3">{tool.useCases.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-text-muted"><span className="text-accent-500">✓</span>{item}</li>)}</ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight">Not just a summary — a structure you can keep using</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">{tool.benefits.map((benefit) => <article key={benefit.title} className="rounded-2xl border bg-surface p-6" style={{ borderColor: 'var(--border)' }}><h3 className="font-bold">{benefit.title}</h3><p className="mt-3 text-sm leading-7 text-text-muted">{benefit.description}</p></article>)}</div>
        </section>

        <section className="border-y bg-surface" style={{ borderColor: 'var(--border)' }}>
          <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight">Three steps</h2>
            <ol className="mt-8 grid gap-6 md:grid-cols-3">{tool.steps.map((step, index) => <li key={step.title}><div className="text-xs font-bold text-brand-600">0{index + 1}</div><h3 className="mt-2 font-bold">{step.title}</h3><p className="mt-2 text-sm leading-7 text-text-muted">{step.description}</p></li>)}</ol>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-8 divide-y rounded-2xl border bg-surface px-6" style={{ borderColor: 'var(--border)' }}>{tool.faq.map((item) => <details key={item.question} className="group py-5"><summary className="cursor-pointer list-none font-semibold">{item.question}<span className="float-right text-brand-600 group-open:rotate-45">＋</span></summary><p className="mt-3 pr-8 text-sm leading-7 text-text-muted">{item.answer}</p></details>)}</div>
          <div className="mt-10 rounded-2xl bg-[#102f53] px-6 py-10 text-center text-white"><h2 className="text-2xl font-bold">Turn your content into a clear map</h2><p className="mt-3 text-sm text-blue-100/80">Nothing to install — just open your browser and try it.</p><Link href={tool.appPath} className="btn mt-6 h-11 bg-white px-6 text-[#102f53]">Start free →</Link></div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="border-t bg-surface" style={{ borderColor: 'var(--border)' }}>
            <div className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
              <h2 className="text-2xl font-bold tracking-tight">Related guides</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {relatedPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-xl border bg-bg p-5 transition-colors hover:border-brand-300" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs font-bold text-brand-600">{post.category}</div>
                    <h3 className="mt-2 font-bold leading-6">{post.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-text-muted">{post.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
