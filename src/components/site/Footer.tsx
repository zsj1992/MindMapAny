import Link from 'next/link';
import { Logo } from './Logo';

const COLUMNS = [
  {
    title: '产品',
    links: [
      { label: '工具中心', href: '/tools' },
      { label: '价格', href: '/pricing' },
      { label: '我的脑图', href: '/app/maps' },
      { label: '常见问题', href: '/#faq' },
    ],
  },
  {
    title: 'AI 工具',
    links: [
      { label: 'PDF 转思维导图', href: '/tools/pdf-to-mind-map' },
      { label: '文本转思维导图', href: '/tools/text-to-mind-map' },
      { label: 'Word 文档转脑图', href: '/app/docx' },
      { label: '网页转思维导图', href: '/tools/webpage-to-mind-map' },
    ],
  },
  {
    title: '学习资源',
    links: [
      { label: '博客', href: '/blog' },
      { label: 'AI 思维导图指南', href: '/blog/ai-mind-map-guide' },
      { label: 'PDF 转脑图教程', href: '/blog/how-to-convert-pdf-to-mind-map' },
      { label: '脑图与摘要的区别', href: '/blog/mind-map-vs-summary' },
    ],
  },
  {
    title: '支持与条款',
    links: [
      { label: '联系支持', href: '/support' },
      { label: '订阅管理', href: '/billing' },
      { label: '隐私政策', href: '/privacy' },
      { label: '服务条款', href: '/terms' },
      { label: '退款与取消', href: '/refund-policy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-surface" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-6 lg:px-8">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-7 text-text-muted">
            把复杂内容变成清晰、可编辑、可追溯的知识结构。
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
