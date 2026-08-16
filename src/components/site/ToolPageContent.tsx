import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { Footer } from '@/components/site/Footer';
import { BLOG_POSTS, SITE_URL, type ToolPage } from '@/lib/seo/content';
import { marketingCopy } from '@/lib/i18n/marketing';
import { localizedPath } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/locales';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import { PdfLandingTool } from '@/components/site/PdfLandingTool';
import { TextLandingTool } from '@/components/site/TextLandingTool';

/* 工具详情页正文。中英共用；tool 已经由调用方按语言取好。 */

export function ToolPageContent({ tool, locale }: { tool: ToolPage; locale: Locale }) {
  const copy = marketingCopy(locale).toolPage;
  const url = `${SITE_URL}${localizedPath(`/tools/${tool.slug}`, locale)}`;
  const relatedPosts = BLOG_POSTS.filter((post) => post.relatedTool === `/tools/${tool.slug}`);
  const isEnglishPdf = locale === 'en' && tool.slug === 'pdf-to-mind-map';
  const isEnglishText = locale === 'en' && tool.slug === 'text-to-mind-map';
  const embeddedToolAnchor = isEnglishPdf ? '#pdf-converter' : isEnglishText ? '#text-converter' : null;
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
        // 必须和下面可见的面包屑逐项一致 —— 结构化数据和页面内容对不上，
        // Google 会判定为不匹配并直接丢掉这个富媒体结果
        { '@type': 'ListItem', position: 1, name: copy.breadcrumbHome, item: `${SITE_URL}${localizedPath('/', locale)}` },
        { '@type': 'ListItem', position: 2, name: copy.breadcrumbTools, item: `${SITE_URL}${localizedPath('/tools', locale)}` },
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
            <Breadcrumbs items={[{ label: copy.breadcrumbHome, href: localizedPath('/', locale) }, { label: copy.breadcrumbTools, href: localizedPath('/tools', locale) }, { label: tool.title }]} />
            <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
              <div>
                <span className="eyebrow">{tool.eyebrow}</span>
                <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">{tool.title}</h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-text-muted sm:text-lg">{tool.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <TrackedLink
                    href={embeddedToolAnchor ?? tool.appPath}
                    eventName={isEnglishPdf ? 'pdf_landing_tool_focused' : isEnglishText ? 'text_landing_tool_focused' : 'landing_cta_clicked'}
                    eventParameters={{ page: 'tool', placement: 'hero', tool: tool.slug, locale }}
                    className="btn btn-primary h-12 px-6"
                  >
                    {isEnglishPdf ? 'Upload PDF' : isEnglishText ? 'Paste text' : copy.startFree} →
                  </TrackedLink>
                  <Link href={localizedPath('/pricing', locale)} className="btn btn-secondary h-12 px-5">{copy.seePlans}</Link>
                </div>
              </div>
              <div className="rounded-2xl border bg-surface p-6 shadow-xl shadow-brand-900/10" style={{ borderColor: 'var(--border)' }}>
                <div className="text-xs font-semibold text-text-subtle">{copy.goodFor}</div>
                <ul className="mt-3 space-y-3">{tool.useCases.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-text-muted"><span className="text-accent-500">✓</span>{item}</li>)}</ul>
              </div>
            </div>
            {isEnglishPdf && <div className="mt-10"><PdfLandingTool /></div>}
            {isEnglishText && <div className="mt-10"><TextLandingTool /></div>}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight">{copy.benefitsHeading}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">{tool.benefits.map((benefit) => <article key={benefit.title} className="rounded-2xl border bg-surface p-6" style={{ borderColor: 'var(--border)' }}><h3 className="font-bold">{benefit.title}</h3><p className="mt-3 text-sm leading-7 text-text-muted">{benefit.description}</p></article>)}</div>
        </section>

        {isEnglishPdf && <PdfEvidence />}

        <section className="border-y bg-surface" style={{ borderColor: 'var(--border)' }}>
          <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight">{copy.stepsHeading}</h2>
            <ol className="mt-8 grid gap-6 md:grid-cols-3">{tool.steps.map((step, index) => <li key={step.title}><div className="text-xs font-bold text-brand-600">0{index + 1}</div><h3 className="mt-2 font-bold">{step.title}</h3><p className="mt-2 text-sm leading-7 text-text-muted">{step.description}</p></li>)}</ol>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight">{copy.faqHeading}</h2>
          <div className="mt-8 divide-y rounded-2xl border bg-surface px-6" style={{ borderColor: 'var(--border)' }}>{tool.faq.map((item) => <details key={item.question} className="group py-5"><summary className="cursor-pointer list-none font-semibold">{item.question}<span className="float-right text-brand-600 group-open:rotate-45">＋</span></summary><p className="mt-3 pr-8 text-sm leading-7 text-text-muted">{item.answer}</p></details>)}</div>
          <div className="mt-10 rounded-2xl bg-[#102f53] px-6 py-10 text-center text-white">
            <h2 className="text-2xl font-bold">{copy.ctaHeading}</h2>
            <p className="mt-3 text-sm text-blue-100/80">{copy.ctaBody}</p>
            <TrackedLink
              href={embeddedToolAnchor ?? tool.appPath}
              eventName="landing_cta_clicked"
              eventParameters={{ page: 'tool', placement: 'bottom', tool: tool.slug, locale }}
              className="btn mt-6 h-11 bg-white px-6 text-[#102f53]"
            >
              {copy.startFree} →
            </TrackedLink>
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="border-t bg-surface" style={{ borderColor: 'var(--border)' }}>
            <div className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
              <h2 className="text-2xl font-bold tracking-tight">{copy.relatedHeading}</h2>
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
      <Footer locale={locale} />
    </>
  );
}

function PdfEvidence() {
  const nodes = [
    { label: 'Verification problem', page: 1, offset: 'ml-0' },
    { label: 'Page-aware extraction', page: 2, offset: 'ml-8' },
    { label: 'Hierarchy checks', page: 3, offset: 'ml-8' },
    { label: 'Keep or revise decision', page: 4, offset: 'ml-8' },
  ];
  return (
    <>
      <section className="border-y bg-surface" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <span className="eyebrow">Fixed verification sample</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Check the map against the PDF, page by page</h2>
            <p className="mt-4 text-sm leading-7 text-text-muted">A summary is only useful when you can verify it. Our four-page test PDF has one controlled idea per page, so page badges in the output can be checked without guessing where a claim came from.</p>
            <a href="/samples/pdf-to-mind-map-verification-sample.pdf" download className="btn btn-secondary mt-6 h-11 px-5">Download the test PDF</a>
            <ul className="mt-7 space-y-3 text-sm leading-6 text-text-muted">
              <li><strong className="text-text">1. Check coverage:</strong> every major section should appear in the map.</li>
              <li><strong className="text-text">2. Check placement:</strong> details should sit under the right parent branch.</li>
              <li><strong className="text-text">3. Check provenance:</strong> each page badge should resolve to the page that supports the node.</li>
              <li><strong className="text-text">4. Check edits:</strong> revise a label, collapse a branch and export the updated map.</li>
            </ul>
          </div>
          <div className="rounded-2xl border bg-bg p-5 shadow-inner" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between gap-4 border-b pb-4 text-xs text-text-subtle" style={{ borderColor: 'var(--border)' }}>
              <span>Expected traceability structure</span><span>4 controlled pages</span>
            </div>
            <div className="mt-5 space-y-3">
              {nodes.map((node, index) => (
                <div key={node.label} className={`relative flex items-center gap-3 ${node.offset}`}>
                  {index > 0 && <span className="absolute -left-5 h-px w-5 bg-border-strong" aria-hidden="true" />}
                  <div className={`flex-1 rounded-xl border bg-surface px-4 py-3 text-sm font-semibold ${index === 0 ? 'border-brand-400' : ''}`} style={index === 0 ? undefined : { borderColor: 'var(--border)' }}>{node.label}</div>
                  <span className="rounded-md bg-accent-500/10 px-2 py-1 text-[11px] font-bold text-accent-600">p.{node.page}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-text-subtle">This diagram states the expected evidence structure for the fixed sample; run the live tool above to produce and inspect your own editable map.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border bg-surface p-6" style={{ borderColor: 'var(--border)' }}><div className="text-xs font-bold text-text-subtle">Manual mind mapping</div><h3 className="mt-3 font-bold">Full control, slow verification</h3><p className="mt-3 text-sm leading-7 text-text-muted">You choose every branch, but page references and coverage checks must be maintained by hand.</p></article>
          <article className="rounded-2xl border bg-surface p-6" style={{ borderColor: 'var(--border)' }}><div className="text-xs font-bold text-text-subtle">AI summary, then redraw</div><h3 className="mt-3 font-bold">Two tools and a broken trail</h3><p className="mt-3 text-sm leading-7 text-text-muted">A generic summary can be fast, but moving it into a map often drops the link back to the source page.</p></article>
          <article className="rounded-2xl border border-brand-300 bg-brand-50/60 p-6 dark:bg-brand-900/15"><div className="text-xs font-bold text-brand-600 dark:text-brand-300">MindMapAny PDF workflow</div><h3 className="mt-3 font-bold">Upload, map and verify in one flow</h3><p className="mt-3 text-sm leading-7 text-text-muted">The map remains editable and PDF-derived nodes retain page badges. Text PDFs work today; OCR does not.</p></article>
        </div>
      </section>
    </>
  );
}
