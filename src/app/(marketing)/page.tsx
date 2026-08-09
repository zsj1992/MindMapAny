import type { Metadata } from 'next';
import Link from 'next/link';
import { Faq, Features, HowItWorks } from '@/components/site/Sections';
import { JsonLd } from '@/components/seo/JsonLd';
import { Footer } from '@/components/site/Footer';
import { HeroMap } from '@/components/site/HeroMap';
import { SITE_URL } from '@/lib/seo/content';

export const metadata: Metadata = {
  title: 'MindMapAny — 把任何内容变成结构清晰、可溯源的脑图',
  description:
    '粘贴文本，或上传 PDF、Word、EPUB、PPTX 和网页文章，几秒生成可编辑、可溯源的思维导图。',
  alternates: { canonical: '/' },
};

const INPUTS = [
  { label: '长文本', href: '/tools/text-to-mind-map' },
  { label: 'PDF', href: '/tools/pdf-to-mind-map' },
  { label: '网页文章', href: '/tools/webpage-to-mind-map' },
];

export default function HomePage() {
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
            inLanguage: 'zh-CN',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'MindMapAny',
            applicationCategory: 'ProductivityApplication',
            operatingSystem: 'Web',
            url: SITE_URL,
            description: metadata.description,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: '免费试用' },
          },
        ]}
      />
      <main>
        <section className="hero-glow relative overflow-hidden">
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-28 lg:pt-24">
            <div className="max-w-2xl">
              <span className="eyebrow">
                <span className="h-2 w-2 rounded-full bg-accent-500 shadow-[0_0_0_4px_rgb(15_159_143/0.12)]" />
                AI 思维导图工作台
              </span>

              <h1 className="mt-6 text-[2.75rem] font-bold leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-[4.15rem]">
                读完一份长内容，
                <br />
                只需要<span className="text-gradient">一张图</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-text-muted sm:text-lg">
                把 PDF、Word、电子书、网页或长文本变成层级清晰的思维导图。
                重要结论保留页码、章节等位置，随时回到原文核验。
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/app/new" className="btn btn-primary h-12 px-6 text-[15px]">
                  免费生成第一张图
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href="#how-it-works" className="btn btn-secondary h-12 px-5 text-[15px]">
                  看看如何工作
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-text-muted">
                <span className="flex items-center gap-1.5"><span className="text-accent-500">✓</span> 无需注册</span>
                <span className="flex items-center gap-1.5"><span className="text-accent-500">✓</span> 来源可追溯</span>
                <span className="flex items-center gap-1.5"><span className="text-accent-500">✓</span> 可编辑导出</span>
              </div>
            </div>

            <div className="animate-in-up relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-brand-200/35 via-transparent to-accent-400/25 blur-2xl" />
              <div className="app-panel relative overflow-hidden rounded-[1.4rem] border" style={{ borderColor: 'var(--border-strong)' }}>
                <div className="flex h-12 items-center gap-2 border-b bg-surface px-4" style={{ borderColor: 'var(--border)' }}>
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs font-medium text-text-muted">AI 研究报告 · 42 个节点</span>
                  <span className="ml-auto rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">已保存</span>
                </div>
                <div className="surface-grid bg-bg-subtle p-5 sm:p-7">
                  <HeroMap className="w-full" />
                </div>
                <div className="flex flex-wrap items-center gap-2 border-t bg-surface px-4 py-3" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-[11px] font-medium text-text-subtle">支持</span>
                  {INPUTS.map((i) => (
                    <Link key={i.label} href={i.href} className="rounded-md bg-bg-subtle px-2.5 py-1 text-[11px] font-semibold text-text-muted transition-colors hover:text-brand-600">
                      {i.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y bg-surface" style={{ borderColor: 'var(--border)' }}>
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-5 sm:grid-cols-4 lg:px-8">
            {[
              ['7 种', '内容输入格式'],
              ['30+', '输出语言'],
              ['110', '单图最大节点'],
              ['100%', '来源定位可核验'],
            ].map(([value, label]) => (
              <div key={label} className="px-4 py-6 text-center sm:py-7">
                <div className="text-xl font-bold tracking-tight text-text">{value}</div>
                <div className="mt-1 text-xs text-text-muted">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <Features />
        <HowItWorks />
        <Faq />

        <section className="px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#102f53] px-6 py-12 text-center text-white shadow-2xl shadow-blue-950/15 sm:px-12 sm:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">从内容到结构，只差一次点击</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">让复杂内容变得一目了然</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-blue-100/80">无需注册，粘贴一段文字即可体验完整生成流程。</p>
            <Link href="/app/new" className="btn mt-8 h-12 bg-white px-7 text-[15px] text-[#102f53] shadow-lg hover:bg-blue-50">
              免费开始 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
