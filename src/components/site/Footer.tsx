import Link from 'next/link';
import { Logo } from './Logo';

const COLUMNS = [
  {
    title: '产品',
    links: [
      { label: '功能', href: '/#features' },
      { label: '常见问题', href: '/#faq' },
      { label: '我的脑图', href: '/app/maps' },
    ],
  },
  {
    title: '用途',
    links: [
      { label: 'PDF 转脑图', href: '/app/pdf' },
      { label: '网页转脑图', href: '/app/web' },
      { label: 'YouTube 转脑图', href: '/app/youtube' },
      { label: '长文本转脑图', href: '/app/text' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-bg-subtle" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-muted">
            把任何内容变成结构清晰、可溯源的脑图。
          </p>
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
        © {new Date().getFullYear()} MapAny
      </div>
    </footer>
  );
}
