import Link from 'next/link';
import { Logo } from './Logo';
import { marketingCopy } from '@/lib/i18n/marketing';
import { localizedPath } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/locales';

/* 链接结构与语言无关，文案按 locale 取。两者分开，改一边不会漏掉另一边。 */
const HREFS = [
  ['/tools', '/pricing', '/app/maps', '/#faq'],
  [
    '/tools/pdf-to-mind-map',
    '/tools/docx-to-mind-map',
    '/tools/epub-to-mind-map',
    '/tools/pptx-to-mind-map',
    '/tools/text-to-mind-map',
    '/tools/webpage-to-mind-map',
    '/blog',
  ],
  ['/support', '/billing', '/privacy', '/terms', '/refund-policy'],
];

export function Footer({ locale }: { locale: Locale }) {
  const copy = marketingCopy(locale).footer;
  return (
    <footer className="border-t bg-surface" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-7 text-text-muted">{copy.tagline}</p>
          <a href="mailto:support@mindmapany.com" className="mt-4 inline-flex text-sm font-medium text-brand-600 hover:text-brand-700">
            support@mindmapany.com
          </a>
        </div>

        {copy.columns.map((col, colIndex) => (
          <div key={col.title}>
            <h3 className="text-sm font-medium">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.labels.map((label, index) => (
                <li key={label}>
                  <Link href={localizedPath(HREFS[colIndex][index], locale)} className="text-sm text-text-muted transition-colors hover:text-text">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t px-4 py-5 text-center text-xs text-text-subtle" style={{ borderColor: 'var(--border)' }}>
        © {new Date().getFullYear()} MindMapAny · {copy.legal}
      </div>
    </footer>
  );
}
