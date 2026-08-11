import Link from 'next/link';
import Image from 'next/image';
import { JsonLd } from '@/components/seo/JsonLd';
import { Footer } from '@/components/site/Footer';
import { SITE_URL } from '@/lib/seo/content';

const DOWNLOAD = '/downloads/mindmapany-chrome-extension.zip';

const FEATURES = [
  ['Current page', 'Capture the article you are actually reading — including content rendered by JavaScript or visible after sign-in.'],
  ['Selected text', 'Turn only the passage you highlight into a map while keeping the original page as its source.'],
  ['Online PDFs', 'Send a public PDF straight to MindMapAny and retain page-number references in the resulting map.'],
];

const STEPS = [
  ['Download and unzip', 'Download the Beta ZIP below and expand it to a permanent folder on your computer.'],
  ['Open Chrome extensions', 'Visit chrome://extensions and turn on Developer mode in the top-right corner.'],
  ['Load the extension', 'Choose “Load unpacked”, select the expanded folder, then pin MindMapAny to the toolbar.'],
];

export function ExtensionContent() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'MindMapAny Chrome Extension',
          applicationCategory: 'BrowserApplication',
          operatingSystem: 'Chrome',
          url: `${SITE_URL}/browser-extension`,
          downloadUrl: `${SITE_URL}${DOWNLOAD}`,
          softwareVersion: '0.1.0 beta',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <main>
        <section className="hero-glow relative overflow-hidden border-b px-5 py-16 sm:py-20 lg:px-8" style={{ borderColor: 'var(--border)' }}>
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.82fr]">
            <div className="max-w-2xl">
              <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
                <span className="h-px w-9 bg-brand-500" /> Browser extension · Beta
              </p>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-6xl">
                Map what you are reading without breaking your flow
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-base leading-8 text-text-muted">
                Turn the current page, a highlighted passage, or an online PDF into an editable, source-traceable mind map from the Chrome toolbar.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href={DOWNLOAD} download className="btn btn-primary h-12 px-6 text-[15px]">
                  Download Chrome Beta <span aria-hidden="true">↓</span>
                </a>
                <Link href="/app/new" className="btn btn-secondary h-12 px-5 text-sm">Open workbench ↗</Link>
              </div>
              <p className="mt-4 text-xs leading-5 text-text-subtle">
                Manual Beta installation for Chrome on desktop. Chrome Web Store release is coming after review.
              </p>
            </div>

            <div className="rounded-[1.5rem] border bg-surface p-5 shadow-[0_28px_80px_rgb(18_48_78/0.14)]" style={{ borderColor: 'var(--border-strong)' }}>
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <Image src="/icon.svg" alt="" width={40} height={40} className="h-10 w-10 rounded-xl" />
                  <div><p className="text-sm font-semibold">MindMapAny</p><p className="text-[10px] text-text-subtle">Browser capture</p></div>
                </div>
                <span className="rounded-full bg-accent-50 px-2.5 py-1 text-[10px] font-semibold text-accent-700 dark:bg-accent-900/30 dark:text-accent-300">On click only</span>
              </div>
              <div className="mt-4 rounded-xl bg-bg-subtle p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-accent-600">Current page</p>
                <p className="mt-2 truncate text-sm font-semibold">Research methods and findings</p>
                <p className="mt-1 text-[11px] text-text-subtle">12,480 characters · source retained</p>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-medium text-text-muted">
                {['Original language', 'Standard', 'General'].map((item) => <span key={item} className="rounded-lg border px-2 py-2" style={{ borderColor: 'var(--border)' }}>{item}</span>)}
              </div>
              <div className="mt-4 flex h-11 items-center justify-between rounded-xl bg-brand-600 px-4 text-xs font-semibold text-white shadow-lg shadow-brand-700/15">
                Generate mind map <span>→</span>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-600">Capture what the server cannot see</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">One small extension, three useful entry points</h2>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {FEATURES.map(([title, body], index) => (
                <article key={title} className="rounded-2xl border bg-surface p-6" style={{ borderColor: 'var(--border)' }}>
                  <span className="font-mono text-xs font-semibold text-accent-600">0{index + 1}</span>
                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-text-muted">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y bg-bg-subtle px-5 py-16 lg:px-8" style={{ borderColor: 'var(--border)' }}>
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-600">Install the Beta</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Ready in about a minute</h2>
              <p className="mt-4 text-sm leading-7 text-text-muted">The public ZIP is temporary while the extension awaits Chrome Web Store review.</p>
              <a href={DOWNLOAD} download className="btn btn-primary mt-7 h-11 px-5 text-sm">Download ZIP ↓</a>
            </div>
            <ol className="space-y-3">
              {STEPS.map(([title, body], index) => (
                <li key={title} className="flex gap-4 rounded-2xl border bg-surface p-5" style={{ borderColor: 'var(--border)' }}>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 font-mono text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">{index + 1}</span>
                  <div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1.5 text-xs leading-6 text-text-muted">{body}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-5 py-14 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 rounded-2xl border bg-surface p-7 sm:flex-row sm:items-center" style={{ borderColor: 'var(--border)' }}>
            <div><h2 className="text-xl font-semibold">Minimal permissions by design</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">It reads the active tab only after you click it, keeps captured text in a single-use 15-minute payload, and never requests history, cookies, or all-site background access.</p></div>
            <Link href="/privacy" className="shrink-0 text-sm font-semibold text-brand-600 hover:text-brand-700">Read privacy policy →</Link>
          </div>
        </section>
      </main>
      <Footer locale="en" />
    </>
  );
}
