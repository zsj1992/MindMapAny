import type { ReactNode } from 'react';

/* 落地页的信息区块。纯服务端组件，不带任何交互，保证首屏和 SEO。 */

function Icon({ path }: { path: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      {path}
    </svg>
  );
}

const FEATURES = [
  {
    title: 'Many inputs, one pipeline',
    body: 'Paste text, upload a PDF / DOCX / EPUB / PPTX, or drop in a web link. Extraction differs per format; the structure that comes out is equally clean.',
    detail: '7 sources',
    icon: (
      <Icon
        path={
          <>
            <path strokeLinecap="round" d="M4 7h16M4 12h10M4 17h7" />
            <circle cx="18.5" cy="16.5" r="3" />
          </>
        }
      />
    ),
  },
  {
    title: 'Every node traces back',
    body: 'PDF nodes carry page numbers, PPTX nodes carry slide positions. Locations are anchored during chunking, not invented by the model after the fact.',
    detail: 'Deterministic citations',
    icon: (
      <Icon
        path={
          <>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="9" />
          </>
        }
      />
    ),
  },
  {
    title: 'Stable hierarchy, not a flat list',
    body: 'Long documents are summarised section by section and then merged; duplicate topics collapse and orphan nodes are dropped. Three depth settings map to different level and node budgets.',
    detail: 'Up to 5 levels',
    icon: (
      <Icon
        path={
          <>
            <rect x="3" y="4" width="7" height="5" rx="1.5" />
            <rect x="14" y="10" width="7" height="4" rx="1.5" />
            <rect x="14" y="16" width="7" height="4" rx="1.5" />
            <path strokeLinecap="round" d="M10 6.5h2a2 2 0 012 2V12m-2 0h2m-4-5.5h2a2 2 0 012 2V18h2" />
          </>
        }
      />
    ),
  },
  {
    title: 'Editable after generation',
    body: 'Double-click to rename, Tab for a child node, Enter for a sibling, Space to collapse. Not a static image you can only look at.',
    detail: 'Keyboard editing',
    icon: (
      <Icon
        path={<path strokeLinecap="round" strokeLinejoin="round" d="M4 20h4L18.5 9.5a2.1 2.1 0 00-3-3L5 17v3z" />}
      />
    ),
  },
  {
    title: 'Export and share',
    body: 'One-click export to PNG, SVG or Markdown. Turn on a public link and others can view it without signing up.',
    detail: '3 export formats',
    icon: (
      <Icon
        path={
          <>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V3m0 0L8 7m4-4l4 4" />
            <path strokeLinecap="round" d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </>
        }
      />
    ),
  },
  {
    title: '30+ output languages',
    body: 'Read a paper in one language and get the map in another. Source language and output language are independent.',
    detail: 'Cross-language',
    icon: (
      <Icon
        path={
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a15 15 0 010 18a15 15 0 010-18z" />
          </>
        }
      />
    ),
  },
];

export function Features() {
  const layout = [
    'md:col-span-7 md:row-span-2 bg-[#102f53] text-white',
    'md:col-span-5',
    'md:col-span-5',
    'md:col-span-4',
    'md:col-span-4',
    'md:col-span-4',
  ];
  return (
    <section id="features" className="mx-auto max-w-7xl px-5 py-24 sm:py-32 lg:px-8">
      <div className="grid gap-6 md:grid-cols-[0.55fr_1fr] md:items-end">
        <div>
          <p className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.15em] text-brand-600 dark:text-brand-300"><span className="font-mono text-text-subtle">01</span> CAPABILITIES</p>
          <p className="mt-3 max-w-xs text-sm leading-7 text-text-muted">Built for people who need to read, verify and organise long content carefully.</p>
        </div>
        <div>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">A summary tells you what was said.<br className="hidden sm:block" />Structure tells you why.</h2>
        </div>
      </div>

      <div className="mt-14 grid gap-3 md:grid-cols-12 md:auto-rows-[11.5rem]">
        {FEATURES.map((f, index) => (
          <article
            key={f.title}
            className={`group relative min-h-[11.5rem] overflow-hidden rounded-[1.15rem] border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgb(18_48_78/0.10)] ${layout[index]}`}
            style={{ borderColor: index === 0 ? 'rgb(255 255 255 / 0.1)' : 'var(--border)' }}
          >
            <span className={`absolute right-5 top-4 font-mono text-[10px] ${index === 0 ? 'text-white/35' : 'text-text-subtle'}`}>0{index + 1}</span>
            <div className={`relative flex h-9 w-9 items-center justify-center rounded-lg ${index === 0 ? 'bg-white/10 text-cyan-200' : 'bg-bg-muted text-[#102f53] dark:text-brand-300'}`}>
              {f.icon}
            </div>
            <h3 className={`relative mt-5 text-base font-semibold ${index === 0 ? 'text-white' : 'text-text'}`}>{f.title}</h3>
            <p className={`relative mt-2 max-w-xl text-sm leading-7 ${index === 0 ? 'text-blue-100/70' : 'text-text-muted'}`}>{f.body}</p>
            <p className={`absolute bottom-5 right-5 font-mono text-[10px] font-semibold ${index === 0 ? 'text-cyan-300' : 'text-brand-600 dark:text-brand-300'}`}>{f.detail}</p>
            {index === 0 && <div className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full border border-white/10" aria-hidden="true" />}
          </article>
        ))}
      </div>
    </section>
  );
}

const STEPS = [
  { n: '01', title: 'Drop in your content', body: 'Text, a document, an ebook or a web link. Pick the output language, depth and purpose.' },
  { n: '02', title: 'Wait a few seconds', body: 'We extract the body text, chunk it and anchor each chunk to its location, then have the model produce the hierarchy.' },
  { n: '03', title: 'Edit and take it with you', body: 'Edit directly on the canvas, export to PNG / SVG / Markdown, or generate a public link.' },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y bg-bg-subtle" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto max-w-7xl px-5 py-24 sm:py-28 lg:px-8">
        <div className="grid gap-6 md:grid-cols-[0.55fr_1fr] md:items-end">
          <div><p className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.15em] text-brand-600 dark:text-brand-300"><span className="font-mono text-text-subtle">02</span> HOW IT WORKS</p></div>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">Same reading. Better order.</h2>
        </div>
        <div className="mt-14 border-t" style={{ borderColor: 'var(--border-strong)' }}>
          {STEPS.map((s) => (
            <article key={s.n} className="grid gap-4 border-b py-7 sm:grid-cols-[5rem_0.7fr_1fr] sm:items-center" style={{ borderColor: 'var(--border)' }}>
              <span className="font-mono text-xs font-semibold text-accent-600">/{s.n}</span>
              <h3 className="text-xl font-semibold tracking-[-0.02em]">{s.title}</h3>
              <p className="max-w-xl text-sm leading-7 text-text-muted">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: 'Which input formats are supported?',
    a: 'Pasted text, PDF, DOCX, EPUB, PPTX, TXT, Markdown and public web links. Maximum 20MB per file. Scanned PDFs, audio, video and legacy DOC files are not supported yet.',
  },
  {
    q: 'Are the page numbers on nodes accurate?',
    a: 'Yes. Each chunk is bound to its page number or section position during chunking. The model only references chunk IDs; the location is resolved by lookup, never generated by the model.',
  },
  {
    q: 'Why can some web pages not be read?',
    a: 'Pages that require a login, sit behind anti-bot protection, or render entirely through JavaScript cannot be extracted in the current version. Ordinary article pages, documentation sites and blogs are generally fine.',
  },
  {
    q: 'Who owns the mind maps I generate?',
    a: 'You do. You can export or delete them at any time. Share links are off by default — nobody else can access a map until you turn public sharing on yourself.',
  },
  {
    q: 'How much can I do on the free plan?',
    a: 'Signing up grants 30 credits, enough to fully try text and web page inputs. Long documents and the high-quality model are charged against your plan and credit balance.',
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:py-32 lg:grid-cols-[0.55fr_1fr] lg:px-8">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.15em] text-brand-600 dark:text-brand-300"><span className="font-mono text-text-subtle">03</span> FAQ</p>
        <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">A few things<br />before you start.</h2>
        <p className="mt-5 max-w-sm text-sm leading-7 text-text-muted">Still have a question? Email support@mindmapany.com and we usually reply within 3 business days.</p>
      </div>
      <div className="border-t" style={{ borderColor: 'var(--border-strong)' }}>
        {FAQS.map((f) => (
          <details key={f.q} className="group border-b py-6 [&_summary::-webkit-details-marker]:hidden" style={{ borderColor: 'var(--border)' }}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold">
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
            <p className="mt-4 max-w-2xl pr-8 text-sm leading-7 text-text-muted">{f.a}</p>
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
            mainEntity: FAQS.map((f) => ({
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
