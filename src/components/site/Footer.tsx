import Link from 'next/link';
import { Logo } from './Logo';

const COLUMNS = [
  {
    title: '产品',
    links: [
      { label: '功能', href: '/#features' },
      { label: '价格', href: '/pricing' },
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
    <footer className="border-t bg-surface" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-7 text-text-muted">
            把复杂内容变成清晰、可编辑、可追溯的知识结构。
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
        © {new Date().getFullYear()} MindMapAny
      </div>
    </footer>
  );
}
