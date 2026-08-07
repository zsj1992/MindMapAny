import type { Metadata } from 'next';
import Link from 'next/link';
import { Faq, Features, HowItWorks } from '@/components/site/Sections';
import { Footer } from '@/components/site/Footer';
import { HeroMap } from '@/components/site/HeroMap';

export const metadata: Metadata = {
  title: 'MapAny — 把任何内容变成结构清晰、可溯源的脑图',
  description:
    '粘贴文本、上传 PDF、输入网页或 YouTube 链接，几秒生成可编辑的思维导图。每个节点都能回到原文页码或视频时间戳。',
  alternates: { canonical: '/' },
};

const INPUTS = [
  { label: '长文本', href: '/app/text' },
  { label: 'PDF', href: '/app/pdf' },
  { label: '网页文章', href: '/app/web' },
  { label: 'YouTube', href: '/app/youtube' },
];

export default function HomePage() {
  return (
    <>
      <main>
        <section className="hero-glow relative overflow-hidden">
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.55]" aria-hidden="true" />

          <div className="relative mx-auto max-w-6xl px-4 pb-4 pt-16 sm:pt-24">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border bg-surface/70 px-3 py-1 text-xs text-text-muted backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                每个节点都带原文页码与时间戳
              </span>

              <h1 className="mt-6 text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl">
                把任何内容
                <br className="sm:hidden" />
                变成<span className="text-gradient">一张脑图</span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-muted">
                文本、PDF、网页、YouTube —— 几秒生成层级清晰的思维导图，
                看得懂，改得动，还能一路查回原文。
              </p>

              <div className="mt-8 flex flex-col items-center gap-3">
                <Link href="/app/new" className="btn btn-primary h-12 px-8 text-base">
                  免费开始
                </Link>
                <p className="text-xs text-text-subtle">无需注册即可试用，登录后可保存与分享</p>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                {INPUTS.map((i) => (
                  <Link
                    key={i.label}
                    href={i.href}
                    className="rounded-lg border bg-surface px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-brand-300 hover:text-text"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {i.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="animate-in-up mx-auto mt-12 max-w-3xl">
              <HeroMap className="w-full" />
            </div>
          </div>
        </section>

        <Features />
        <HowItWorks />
        <Faq />

        <section className="border-t px-4 py-20 text-center" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-semibold tracking-tight">现在就试一张</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-text-muted">
            不用注册，粘一段文字进去看看效果。
          </p>
          <Link href="/app/new" className="btn btn-primary mt-7 h-12 px-8 text-base">
            免费开始
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
