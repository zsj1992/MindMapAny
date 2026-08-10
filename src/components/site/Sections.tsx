import Link from 'next/link';
import type { ReactNode } from 'react';
import { marketingCopy } from '@/lib/i18n/marketing';
import { localizedPath } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/locales';

/*
 * 落地页的信息区块。纯服务端组件，不带任何交互，保证首屏和 SEO。
 * 文案按 locale 从 marketing.ts 取；图标和布局与语言无关，留在这里。
 */

function Icon({ path }: { path: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      {path}
    </svg>
  );
}

const FEATURE_ICONS = [
  <Icon
    key="inputs"
    path={
      <>
        <path strokeLinecap="round" d="M4 7h16M4 12h10M4 17h7" />
        <circle cx="18.5" cy="16.5" r="3" />
      </>
    }
  />,
  <Icon
    key="trace"
    path={
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="9" />
      </>
    }
  />,
  <Icon
    key="hierarchy"
    path={
      <>
        <rect x="3" y="4" width="7" height="5" rx="1.5" />
        <rect x="14" y="10" width="7" height="4" rx="1.5" />
        <rect x="14" y="16" width="7" height="4" rx="1.5" />
        <path strokeLinecap="round" d="M10 6.5h2a2 2 0 012 2V12m-2 0h2m-4-5.5h2a2 2 0 012 2V18h2" />
      </>
    }
  />,
  <Icon key="edit" path={<path strokeLinecap="round" strokeLinejoin="round" d="M4 20h4L18.5 9.5a2.1 2.1 0 00-3-3L5 17v3z" />} />,
  <Icon
    key="export"
    path={
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V3m0 0L8 7m4-4l4 4" />
        <path strokeLinecap="round" d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
      </>
    }
  />,
  <Icon
    key="language"
    path={
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 010 18a15 15 0 010-18z" />
      </>
    }
  />,
];

const SOURCE_CHIPS = ['PDF', 'DOCX', 'EPUB', 'PPTX', 'TXT', 'Markdown', 'Web link'];
const PIPELINE_STAGES = ['Extract', 'Chunk & anchor', 'Build hierarchy', 'Edit'];

export function Features({ locale }: { locale: Locale }) {
  const copy = marketingCopy(locale).features;
  const layout = [
    'md:col-span-7 md:row-span-2 bg-[#102f53] text-white',
    'md:col-span-5',
    'md:col-span-5',
    'md:col-span-4',
    'md:col-span-4',
    'md:col-span-4',
  ];
  return (
    <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8">
      <div className="grid gap-4 md:grid-cols-[0.42fr_1fr] md:items-end">
        <div>
          <p className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.15em] text-brand-600 dark:text-brand-300"><span className="font-mono text-text-subtle">01</span> {copy.eyebrow}</p>
          <p className="mt-3 max-w-xs text-sm leading-7 text-text-muted">{copy.lede}</p>
        </div>
        <div>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">{copy.headingA}<br className="hidden sm:block" />{copy.headingB}</h2>
        </div>
      </div>

      <div className="mt-10 grid gap-3 md:grid-cols-12 md:auto-rows-[minmax(11.5rem,auto)]">
        {copy.items.map((f, index) => (
          <article
            key={f.title}
            className={`group relative flex min-h-[11.5rem] flex-col overflow-hidden rounded-[1.15rem] border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgb(18_48_78/0.10)] ${layout[index]}`}
            style={{ borderColor: index === 0 ? 'rgb(255 255 255 / 0.1)' : 'var(--border)' }}
          >
            <span className={`absolute right-5 top-4 font-mono text-[10px] ${index === 0 ? 'text-white/35' : 'text-text-subtle'}`}>0{index + 1}</span>
            <div className={`relative flex h-9 w-9 items-center justify-center rounded-lg ${index === 0 ? 'bg-white/10 text-cyan-200' : 'bg-bg-muted text-[#102f53] dark:text-brand-300'}`}>
              {FEATURE_ICONS[index]}
            </div>
            <h3 className={`relative mt-5 text-base font-semibold ${index === 0 ? 'text-white' : 'text-text'}`}>{f.title}</h3>
            <p className={`relative mt-2 max-w-xl pr-6 text-sm leading-7 ${index === 0 ? 'text-blue-100/70' : 'text-text-muted'}`}>{f.body}</p>
            {index === 0 && (
              <>
                <ul className="relative mt-6 flex flex-wrap gap-2">
                  {SOURCE_CHIPS.map((chip) => (
                    <li key={chip} className="rounded-lg border border-white/15 bg-white/[0.06] px-2.5 py-1.5 text-[11px] font-medium text-blue-50/80">
                      {chip}
                    </li>
                  ))}
                </ul>
                <div className="relative mt-7 border-t border-white/10 pt-5">
                  <p className="text-[10px] font-semibold tracking-[0.14em] text-cyan-300/80">{copy.pipelineLabel}</p>
                  <ol className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-2">
                    {copy.pipelineStages.map((stage, stageIndex) => (
                      <li key={stage} className="flex items-center gap-2.5">
                        <span className="text-[12px] font-medium text-blue-100/75">{stage}</span>
                        {stageIndex < copy.pipelineStages.length - 1 && (
                          <span className="text-white/25" aria-hidden="true">→</span>
                        )}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3 max-w-md text-[12px] leading-6 text-blue-100/55">{copy.pipelineNote}</p>
                </div>
              </>
            )}
            <p className={`relative mt-auto pt-5 text-right font-mono text-[10px] font-semibold ${index === 0 ? 'text-cyan-300' : 'text-brand-600 dark:text-brand-300'}`}>{f.detail}</p>
            {index === 0 && <div className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full border border-white/10" aria-hidden="true" />}
          </article>
        ))}
      </div>
    </section>
  );
}

/* 六种输入各自的差异点。既是给读者的分流入口，也是首页到工具页的内链。 */
const INPUT_HREFS = [
  '/tools/pdf-to-mind-map',
  '/tools/docx-to-mind-map',
  '/tools/epub-to-mind-map',
  '/tools/pptx-to-mind-map',
  '/tools/text-to-mind-map',
  '/tools/webpage-to-mind-map',
];

export function InputTypes({ locale }: { locale: Locale }) {
  const copy = marketingCopy(locale).inputTypes;
  return (
    <section id="inputs" className="border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8">
        <div className="grid gap-4 md:grid-cols-[0.42fr_1fr] md:items-end">
          <div>
            <p className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.15em] text-brand-600 dark:text-brand-300"><span className="font-mono text-text-subtle">02</span> {copy.eyebrow}</p>
            <p className="mt-3 max-w-xs text-sm leading-7 text-text-muted">{copy.lede}</p>
          </div>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">{copy.heading}</h2>
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {copy.items.map((input, index) => (
            <article key={input.name} className="border-t pt-5" style={{ borderColor: 'var(--border-strong)' }}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight">{input.name}</h3>
                <span className="shrink-0 font-mono text-[10px] font-semibold text-accent-600">{input.anchor}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-text-muted">{input.body}</p>
              <Link href={localizedPath(INPUT_HREFS[index], locale)} className="mt-4 inline-flex text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300">
                {input.linkLabel} <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


export function HowItWorks({ locale }: { locale: Locale }) {
  const copy = marketingCopy(locale).howItWorks;
  return (
    <section id="how-it-works" className="border-y bg-bg-subtle" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24 lg:px-8">
        <div className="grid gap-4 md:grid-cols-[0.42fr_1fr] md:items-end">
          <div><p className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.15em] text-brand-600 dark:text-brand-300"><span className="font-mono text-text-subtle">03</span> {copy.eyebrow}</p></div>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">{copy.heading}</h2>
        </div>
        <div className="mt-10 border-t" style={{ borderColor: 'var(--border-strong)' }}>
          {copy.steps.map((step, index) => (
            <article key={step.title} className="grid gap-x-6 gap-y-2 border-b py-6 sm:grid-cols-[3rem_minmax(0,15.5rem)_minmax(0,1fr)] sm:items-baseline" style={{ borderColor: 'var(--border)' }}>
              <span className="font-mono text-xs font-semibold text-accent-600">/0{index + 1}</span>
              <h3 className="text-lg font-semibold tracking-[-0.02em] sm:text-xl">{step.title}</h3>
              <p className="max-w-2xl text-sm leading-7 text-text-muted">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


export function Faq({ locale }: { locale: Locale }) {
  const copy = marketingCopy(locale).faq;
  return (
    <section id="faq" className="mx-auto grid max-w-6xl gap-x-14 gap-y-10 px-5 py-20 sm:py-24 lg:grid-cols-[0.42fr_1fr] lg:px-8">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.15em] text-brand-600 dark:text-brand-300"><span className="font-mono text-text-subtle">04</span> {copy.eyebrow}</p>
        <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">{copy.headingA}<br />{copy.headingB}</h2>
        <p className="mt-4 max-w-xs text-sm leading-7 text-text-muted">{copy.lede}</p>
      </div>
      <div className="border-t" style={{ borderColor: 'var(--border-strong)' }}>
        {copy.items.map((f) => (
          <details key={f.q} className="group border-b py-5 [&_summary::-webkit-details-marker]:hidden" style={{ borderColor: 'var(--border)' }}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[15px] font-semibold leading-6">
              {f.q}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 shrink-0 text-text-subtle transition-transform duration-200 group-open:rotate-180"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <p className="mt-3 max-w-2xl pr-6 text-sm leading-7 text-text-muted">{f.a}</p>
          </details>
        ))}
      </div>

      {/* FAQ 结构化数据：这类页面拿富媒体结果的概率很高，成本几乎为零 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: copy.items.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
    </section>
  );
}
