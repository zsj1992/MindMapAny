import Link from 'next/link';
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

const SOURCE_CHIPS = ['PDF', 'DOCX', 'EPUB', 'PPTX', 'TXT', 'Markdown', 'Web link'];
const PIPELINE_STAGES = ['Extract', 'Chunk & anchor', 'Build hierarchy', 'Edit'];

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
    <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8">
      <div className="grid gap-4 md:grid-cols-[0.42fr_1fr] md:items-end">
        <div>
          <p className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.15em] text-brand-600 dark:text-brand-300"><span className="font-mono text-text-subtle">01</span> CAPABILITIES</p>
          <p className="mt-3 max-w-xs text-sm leading-7 text-text-muted">Built for people who need to read, verify and organise long content carefully.</p>
        </div>
        <div>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">A summary tells you what was said.<br className="hidden sm:block" />Structure tells you why.</h2>
        </div>
      </div>

      <div className="mt-10 grid gap-3 md:grid-cols-12 md:auto-rows-[minmax(11.5rem,auto)]">
        {FEATURES.map((f, index) => (
          <article
            key={f.title}
            className={`group relative flex min-h-[11.5rem] flex-col overflow-hidden rounded-[1.15rem] border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgb(18_48_78/0.10)] ${layout[index]}`}
            style={{ borderColor: index === 0 ? 'rgb(255 255 255 / 0.1)' : 'var(--border)' }}
          >
            <span className={`absolute right-5 top-4 font-mono text-[10px] ${index === 0 ? 'text-white/35' : 'text-text-subtle'}`}>0{index + 1}</span>
            <div className={`relative flex h-9 w-9 items-center justify-center rounded-lg ${index === 0 ? 'bg-white/10 text-cyan-200' : 'bg-bg-muted text-[#102f53] dark:text-brand-300'}`}>
              {f.icon}
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
                  <p className="text-[10px] font-semibold tracking-[0.14em] text-cyan-300/80">ONE PIPELINE</p>
                  <ol className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-2">
                    {PIPELINE_STAGES.map((stage, stageIndex) => (
                      <li key={stage} className="flex items-center gap-2.5">
                        <span className="text-[12px] font-medium text-blue-100/75">{stage}</span>
                        {stageIndex < PIPELINE_STAGES.length - 1 && (
                          <span className="text-white/25" aria-hidden="true">→</span>
                        )}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3 max-w-md text-[12px] leading-6 text-blue-100/55">
                    Only the first step differs per format. Everything after it is shared, which is why a slide deck and a research paper come out equally structured.
                  </p>
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
const INPUT_TYPES = [
  {
    name: 'PDF',
    href: '/tools/pdf-to-mind-map',
    anchor: 'Page numbers',
    body: 'Papers, reports and white papers. Every node keeps the page it came from, so checking a figure means opening one page rather than re-reading the file. Text-based PDFs only — scans need OCR first.',
  },
  {
    name: 'Word',
    href: '/tools/docx-to-mind-map',
    anchor: 'Document order',
    body: 'Specifications, drafts and long reports. Body paragraphs and table text are read in order. A DOCX has no fixed pages until Word renders it, so nodes anchor to position in the document rather than a page number.',
  },
  {
    name: 'EPUB',
    href: '/tools/epub-to-mind-map',
    anchor: 'Chapter titles',
    body: 'Whole books, read in the order the publisher defined. Nodes carry the chapter they came from, which is the stable anchor for an ebook — page numbers shift with font size. DRM-protected files cannot be opened.',
  },
  {
    name: 'PowerPoint',
    href: '/tools/pptx-to-mind-map',
    anchor: 'Slide numbers',
    body: 'Conference talks, training decks and proposals. Slide text is pulled in deck order and every node is labelled with its slide. Speaker notes and images are not read, so decks that hide the substance in notes will map thin.',
  },
  {
    name: 'Long text',
    href: '/tools/text-to-mind-map',
    anchor: 'Paste and go',
    body: 'Meeting minutes, transcripts, research notes, anything you can select and copy. The fastest way to see whether a pile of unstructured writing actually holds a coherent argument.',
  },
  {
    name: 'Web pages',
    href: '/tools/webpage-to-mind-map',
    anchor: 'Section anchors',
    body: 'Articles, documentation and encyclopedia entries. We pull the body text and drop the navigation and ads. Pages behind a login, anti-bot protection or pure client-side rendering cannot be read.',
  },
];

export function InputTypes() {
  return (
    <section id="inputs" className="border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8">
        <div className="grid gap-4 md:grid-cols-[0.42fr_1fr] md:items-end">
          <div>
            <p className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.15em] text-brand-600 dark:text-brand-300"><span className="font-mono text-text-subtle">02</span> BY INPUT TYPE</p>
            <p className="mt-3 max-w-xs text-sm leading-7 text-text-muted">Each format is extracted differently, and each one anchors its nodes to something different.</p>
          </div>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">What are you starting from?</h2>
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {INPUT_TYPES.map((input) => (
            <article key={input.name} className="border-t pt-5" style={{ borderColor: 'var(--border-strong)' }}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight">{input.name}</h3>
                <span className="shrink-0 font-mono text-[10px] font-semibold text-accent-600">{input.anchor}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-text-muted">{input.body}</p>
              <Link href={input.href} className="mt-4 inline-flex text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300">
                {input.name} to mind map <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
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
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24 lg:px-8">
        <div className="grid gap-4 md:grid-cols-[0.42fr_1fr] md:items-end">
          <div><p className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.15em] text-brand-600 dark:text-brand-300"><span className="font-mono text-text-subtle">03</span> HOW IT WORKS</p></div>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">Same reading. Better order.</h2>
        </div>
        <div className="mt-10 border-t" style={{ borderColor: 'var(--border-strong)' }}>
          {STEPS.map((s) => (
            <article key={s.n} className="grid gap-x-6 gap-y-2 border-b py-6 sm:grid-cols-[3rem_minmax(0,15.5rem)_minmax(0,1fr)] sm:items-baseline" style={{ borderColor: 'var(--border)' }}>
              <span className="font-mono text-xs font-semibold text-accent-600">/{s.n}</span>
              <h3 className="text-lg font-semibold tracking-[-0.02em] sm:text-xl">{s.title}</h3>
              <p className="max-w-2xl text-sm leading-7 text-text-muted">{s.body}</p>
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
  {
    q: 'Do I have to sign up to try it?',
    a: 'No. You can generate a map straight away without an account, using a daily trial allowance, for text and web page inputs. Signing in is what lets you save maps, create share links, use longer documents and keep a credit balance.',
  },
  {
    q: 'How do credits work?',
    a: 'Credits are charged per generation, and the cost depends on the input type, the model tier and how long the content is — a short article costs a fraction of a 200-page report. Your remaining balance is shown in the workbench, and if a generation fails the credits are returned to your account.',
  },
  {
    q: 'Can I edit the map after it is generated, or is it a fixed image?',
    a: 'You can edit it. Double-click a node to rename it, Tab adds a child, Enter adds a sibling, Space collapses a branch, and Delete removes one. Layout, colour theme, typography and branch numbering are all adjustable, and the formatting is saved with the map.',
  },
  {
    q: 'What can I export, and can I share a map with someone who has no account?',
    a: 'Maps export to PNG, SVG and Markdown. You can also switch on a public link, which lets anyone open a read-only view without signing up. Sharing is off by default and you can turn it off again at any time.',
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto grid max-w-6xl gap-x-14 gap-y-10 px-5 py-20 sm:py-24 lg:grid-cols-[0.42fr_1fr] lg:px-8">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.15em] text-brand-600 dark:text-brand-300"><span className="font-mono text-text-subtle">04</span> FAQ</p>
        <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">A few things<br />before you start.</h2>
        <p className="mt-4 max-w-xs text-sm leading-7 text-text-muted">Still have a question? Email support@mindmapany.com and we usually reply within 3 business days.</p>
      </div>
      <div className="border-t" style={{ borderColor: 'var(--border-strong)' }}>
        {FAQS.map((f) => (
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
