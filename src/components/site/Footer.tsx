import Link from 'next/link';
import { Logo } from './Logo';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Tools', href: '/tools' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'My mind maps', href: '/app/maps' },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
  {
    title: 'Tools & resources',
    links: [
      { label: 'PDF to mind map', href: '/tools/pdf-to-mind-map' },
      { label: 'Word to mind map', href: '/tools/docx-to-mind-map' },
      { label: 'EPUB to mind map', href: '/tools/epub-to-mind-map' },
      { label: 'PowerPoint to mind map', href: '/tools/pptx-to-mind-map' },
      { label: 'Text to mind map', href: '/tools/text-to-mind-map' },
      { label: 'Web page to mind map', href: '/tools/webpage-to-mind-map' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Support & legal',
    links: [
      { label: 'Contact support', href: '/support' },
      { label: 'Manage subscription', href: '/billing' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Refunds & cancellation', href: '/refund-policy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-surface" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-7 text-text-muted">
            Turn complex content into clear, editable, traceable knowledge structures.
          </p>
          <a href="mailto:support@mindmapany.com" className="mt-4 inline-flex text-sm font-medium text-brand-600 hover:text-brand-700">
            support@mindmapany.com
          </a>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-medium">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-text-muted transition-colors hover:text-text">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className="border-t px-4 py-5 text-center text-xs text-text-subtle"
        style={{ borderColor: 'var(--border)' }}
      >
        © {new Date().getFullYear()} MindMapAny · Payments processed by Creem as Merchant of Record
      </div>
    </footer>
  );
}
