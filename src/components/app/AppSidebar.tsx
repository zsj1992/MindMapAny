'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { create } from 'zustand';

/** 抽屉开关是跨组件状态：触发按钮在顶栏，抽屉本体在内容区 */
const useDrawer = create<{ open: boolean; setOpen: (v: boolean) => void }>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

/* 工作台左侧栏：按输入类型分组导航。公开搜索入口位于 /tools，
   这里的 /app 路由只负责完成生成任务，不参与搜索索引。 */

const icon = (path: ReactNode, className = '') => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={`h-4 w-4 ${className}`}>
    {path}
  </svg>
);

const ICONS = {
  spark: icon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />,
  ),
  research: icon(
    <>
      <circle cx="10" cy="10" r="6" />
      <path strokeLinecap="round" d="M14.5 14.5L20 20M10 7v6M7 10h6" />
    </>,
  ),
  pdf: icon(
    <>
      <path strokeLinejoin="round" d="M14 3v5h5" />
      <path strokeLinejoin="round" d="M19 8v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5z" />
    </>,
  ),
  text: icon(<path strokeLinecap="round" d="M5 7h14M5 12h14M5 17h8" />),
  web: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 010 18a15 15 0 010-18z" />
    </>,
  ),
  document: icon(
    <>
      <path strokeLinejoin="round" d="M14 3v5h5" />
      <path strokeLinejoin="round" d="M19 8v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5z" />
      <path strokeLinecap="round" d="M8 13h8M8 16h6" />
    </>,
  ),
  ebook: icon(
    <>
      <path strokeLinejoin="round" d="M4 5.5A2.5 2.5 0 016.5 3H11v16H6.5A2.5 2.5 0 004 21V5.5zM20 5.5A2.5 2.5 0 0017.5 3H13v16h4.5A2.5 2.5 0 0120 21V5.5z" />
    </>,
  ),
  slides: icon(
    <>
      <rect x="4" y="3" width="16" height="13" rx="2" />
      <path strokeLinecap="round" d="M8 20l4-4 4 4M8 8h8M8 11h5" />
    </>,
  ),
  maps: icon(
    <>
      <rect x="3" y="4" width="7" height="6" rx="1.5" />
      <rect x="14" y="9" width="7" height="5" rx="1.5" />
      <rect x="14" y="16" width="7" height="4" rx="1.5" />
    </>,
  ),
};

const PRIMARY = [
  { href: '/app/new', label: '快速开始', icon: ICONS.spark },
  { href: '/app/research', label: '深度研究', icon: ICONS.research, badge: '新' },
  { href: '/app/maps', label: '我的脑图', icon: ICONS.maps },
];

const GROUPS = [
  {
    label: '上传文件',
    items: [
      { label: 'PDF', icon: ICONS.pdf, href: '/app/pdf' },
      { label: 'Word 文档', icon: ICONS.document, href: '/app/docx' },
      { label: 'EPUB 电子书', icon: ICONS.ebook, href: '/app/epub' },
      { label: 'PPT 演示文稿', icon: ICONS.slides, href: '/app/pptx' },
    ],
  },
  {
    label: '粘贴内容',
    items: [
      { label: '长文本', icon: ICONS.text, href: '/app/text' },
      { label: '网页文章', icon: ICONS.web, href: '/app/web' },
    ],
  },
] satisfies Array<{ label: string; items: Array<{ label: string; icon: ReactNode; href: string }> }>;

export function SidebarTrigger() {
  const setOpen = useDrawer((s) => s.setOpen);
  return (
    <button type="button" onClick={() => setOpen(true)} aria-label="打开导航" className="btn btn-ghost h-9 w-9 lg:hidden">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    </button>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const open = useDrawer((s) => s.open);
  const setOpen = useDrawer((s) => s.setOpen);

  const nav = (
    <nav className="flex h-full flex-col overflow-y-auto px-3 py-4">
      <div className="space-y-0.5">
        {PRIMARY.map((item) => (
          <NavLink key={item.href} {...item} active={pathname === item.href} onNavigate={() => setOpen(false)} />
        ))}
      </div>

      <div className="my-3 border-t" />

      <div className="space-y-4 pb-4">
        {GROUPS.map((group) => (
          <section key={group.label}>
            <p className="px-3 pb-1.5 text-[10px] font-bold tracking-[0.04em] text-text-subtle">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={pathname === item.href}
                  onNavigate={() => setOpen(false)}
                  compact
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </nav>
  );

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="关闭导航" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside
            className="absolute left-0 top-0 h-full w-72 border-r bg-surface shadow-2xl"
            style={{ borderColor: 'var(--border)' }}
          >
            {nav}
          </aside>
        </div>
      )}

      <aside
        className="hidden w-[248px] shrink-0 border-r bg-surface lg:block"
        style={{ borderColor: 'var(--border)' }}
      >
        {nav}
      </aside>
    </>
  );
}

function NavLink({
  href,
  label,
  icon,
  active,
  onNavigate,
  badge,
  compact = false,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  active: boolean;
  onNavigate: () => void;
  badge?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`relative flex items-center gap-3 rounded-lg px-3 ${compact ? 'py-2 text-[12px]' : 'py-2.5 text-[13px]'} font-medium transition-all duration-200 active:scale-[0.99] ${
        active ? 'bg-bg-muted font-semibold text-text' : 'text-text-muted hover:bg-bg-subtle hover:text-text'
      }`}
    >
      {active && <span className="absolute left-0 h-5 w-0.5 rounded-full bg-brand-600" />}
      {icon}
      {label}
      {badge && <span className="ml-auto text-[9px] font-bold text-brand-600 dark:text-brand-300">{badge}</span>}
    </Link>
  );
}
