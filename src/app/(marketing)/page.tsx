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
  { label: 'Word', href: '/app/docx' },
  { label: 'EPUB', href: '/app/epub' },
  { label: 'PPTX', href: '/app/pptx' },
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
        <section className="home-hero relative overflow-hidden border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="home-grain pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[86rem] items-center gap-14 px-5 pb-14 pt-14 lg:grid-cols-[0.86fr_1.14fr] lg:px-10 lg:pb-20 lg:pt-20 xl:gap-20">
            <div className="max-w-[39rem]">
              <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.14em] text-brand-600 dark:text-brand-300">
                <span className="h-px w-9 bg-brand-500" />
                MINDMAPANY / CONTENT INTELLIGENCE
              </p>
              <h1 className="mt-7 text-balance text-[2.8rem] font-semibold leading-[1.01] tracking-[-0.06em] sm:text-[4rem] lg:text-[4.7rem]">
                长内容，应该先看见
                <span className="relative ml-2 inline-block text-brand-600 dark:text-brand-300">
                  结构
                  <svg className="absolute -bottom-1 left-0 h-2 w-full text-accent-500/70" viewBox="0 0 180 10" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M2 7C48 2 122 2 178 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="mt-7 max-w-[34rem] text-pretty text-base leading-8 text-text-muted sm:text-[1.05rem]">
                把论文、报告、Word、电子书和网页整理成真正有层级的思维导图。不是一段更短的摘要，而是一张能编辑、能核验的内容地图。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/app/new" className="btn btn-primary h-12 px-6 text-[15px]">
                  免费生成脑图 <span aria-hidden="true">↗</span>
                </Link>
                <Link href="#features" className="group inline-flex h-12 items-center justify-center gap-2 px-2 text-sm font-semibold text-text-muted transition-colors hover:text-text">
                  为什么不是普通摘要 <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="mt-9 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
                <p className="text-[10px] font-semibold tracking-[0.12em] text-text-subtle">直接处理这些内容</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  {INPUTS.map((input) => (
                    <Link key={input.label} href={input.href} className="text-xs font-medium text-text-muted underline decoration-border-strong underline-offset-4 transition-colors hover:text-brand-600">
                      {input.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="animate-in-up relative lg:-mr-8">
              <div className="absolute -left-5 top-10 hidden w-28 -rotate-3 rounded-xl border bg-surface p-3 shadow-xl xl:block" style={{ borderColor: 'var(--border)' }}>
                <div className="text-[9px] font-semibold text-text-subtle">输入文档</div>
                <div className="mt-2 h-1.5 w-16 rounded bg-bg-muted" />
                <div className="mt-1.5 h-1.5 w-20 rounded bg-bg-muted" />
                <div className="mt-1.5 h-1.5 w-12 rounded bg-brand-100 dark:bg-brand-900" />
                <div className="mt-3 text-[10px] font-semibold text-text">48 页 PDF</div>
              </div>
              <div className="app-panel relative overflow-hidden rounded-[1.25rem] border bg-surface shadow-[0_32px_90px_rgb(18_48_78/0.16)]" style={{ borderColor: 'var(--border-strong)' }}>
                <div className="flex h-12 items-center border-b px-4" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-1.5" aria-hidden="true"><span className="h-2 w-2 rounded-full bg-[#ff7a66]" /><span className="h-2 w-2 rounded-full bg-[#f6bf4f]" /><span className="h-2 w-2 rounded-full bg-[#4dbb82]" /></div>
                  <span className="ml-4 truncate text-[11px] font-medium text-text-muted">AI 研究报告 / 研究方法与结论</span>
                  <span className="ml-auto border-l pl-4 text-[10px] font-semibold text-accent-600" style={{ borderColor: 'var(--border)' }}>42 个节点</span>
                </div>
                <div className="surface-grid relative bg-bg-subtle px-4 py-6 sm:px-7 sm:py-8">
                  <HeroMap className="w-full" />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg border bg-surface/90 px-2.5 py-1.5 text-[10px] font-medium text-text-muted shadow-sm backdrop-blur" style={{ borderColor: 'var(--border)' }}>
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-500" /> 每个结论可回到原文
                  </div>
                </div>
                <div className="grid grid-cols-3 border-t bg-surface" style={{ borderColor: 'var(--border)' }}>
                  {['可编辑节点', '页码引用', 'PNG / SVG / MD'].map((label) => <span key={label} className="border-r px-3 py-3 text-center text-[10px] font-medium text-text-subtle last:border-r-0" style={{ borderColor: 'var(--border)' }}>{label}</span>)}
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto max-w-[86rem] px-5 lg:px-10">
            <div className="grid grid-cols-2 border-t sm:grid-cols-4" style={{ borderColor: 'var(--border)' }}>
            {[
              ['7 种', '内容输入格式'],
              ['30+', '输出语言'],
              ['110', '单图最大节点'],
              ['可溯源', '页码与章节定位'],
            ].map(([value, label]) => (
              <div key={label} className="border-r px-1 py-6 last:border-r-0 sm:py-7" style={{ borderColor: 'var(--border)' }}>
                <div className="font-mono text-lg font-semibold tracking-[-0.03em] text-text sm:text-xl">{value}</div>
                <div className="mt-1 text-[11px] text-text-subtle sm:text-xs">{label}</div>
              </div>
            ))}
            </div>
          </div>
        </section>

        <Features />
        <HowItWorks />
        <Faq />

        <section className="px-5 pb-24 pt-8 sm:pb-32 sm:pt-12 lg:px-8">
          <div className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[1.5rem] bg-[#102f53] px-6 py-10 text-white shadow-[0_28px_80px_rgb(15_47_82/0.18)] sm:px-10 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-end lg:px-14">
            <div className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full border border-white/10" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-2 -top-12 h-44 w-44 rounded-full border border-white/10" aria-hidden="true" />
            <div className="relative max-w-2xl">
              <p className="text-[10px] font-semibold tracking-[0.16em] text-cyan-300">READY WHEN YOU ARE</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">下一份长文档，先别从第一页硬读。</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100/70">上传内容，先得到全局结构，再决定哪些章节值得深入。无需注册即可开始。</p>
            </div>
            <Link href="/app/new" className="btn relative mt-8 h-12 bg-white px-6 text-[14px] text-[#102f53] shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-blue-50 lg:mt-0">
              生成第一张脑图 <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
