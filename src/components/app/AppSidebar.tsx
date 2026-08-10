'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { create } from 'zustand';
import { useT } from '@/lib/i18n/context';
import type { MessageKey } from '@/lib/i18n/messages';
import { useEditor } from '@/store/editor';

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

// 存文案 key 而不是文案本身：这两张表在模块顶层求值，那时还拿不到语言
const PRIMARY = [
  { href: '/app/new', key: 'nav.quickStart', icon: ICONS.spark },
  { href: '/app/research', key: 'nav.deepResearch', icon: ICONS.research, badgeKey: 'nav.new' },
  { href: '/app/maps', key: 'nav.myMaps', icon: ICONS.maps },
] satisfies Array<{ href: string; key: MessageKey; icon: ReactNode; badgeKey?: MessageKey }>;

const GROUPS = [
  {
    key: 'nav.uploadFile',
    items: [
      { key: 'nav.pdf', icon: ICONS.pdf, href: '/app/pdf' },
      { key: 'nav.docx', icon: ICONS.document, href: '/app/docx' },
      { key: 'nav.epub', icon: ICONS.ebook, href: '/app/epub' },
      { key: 'nav.pptx', icon: ICONS.slides, href: '/app/pptx' },
    ],
  },
  {
    key: 'nav.pasteContent',
    items: [
      { key: 'nav.longText', icon: ICONS.text, href: '/app/text' },
      { key: 'nav.webArticle', icon: ICONS.web, href: '/app/web' },
    ],
  },
] satisfies Array<{ key: MessageKey; items: Array<{ key: MessageKey; icon: ReactNode; href: string }> }>;

export function SidebarTrigger() {
  const setOpen = useDrawer((s) => s.setOpen);
  const t = useT();
  return (
    <button type="button" onClick={() => setOpen(true)} aria-label={t('nav.open')} className="btn btn-ghost h-9 w-9 lg:hidden">
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
  const t = useT();

  const nav = (
    <nav className="flex h-full flex-col overflow-y-auto px-3 py-4">
      <div className="space-y-0.5">
        {PRIMARY.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={t(item.key)}
            icon={item.icon}
            {...(item.badgeKey ? { badge: t(item.badgeKey) } : {})}
            active={pathname === item.href}
            onNavigate={() => setOpen(false)}
          />
        ))}
      </div>

      <div className="my-3 border-t" />

      <div className="space-y-4 pb-4">
        {GROUPS.map((group) => (
          <section key={group.key}>
            <p className="px-3 pb-1.5 text-[10px] font-bold tracking-[0.04em] text-text-subtle">{t(group.key)}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.key}
                  href={item.href}
                  label={t(item.key)}
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
          <button type="button" aria-label={t('nav.close')} className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
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

/**
 * 离开当前编辑器前清空画布。返回 false 表示用户在「未保存」确认框里点了取消，
 * 调用方要阻止这次导航。
 */
function resetEditorBeforeLeaving(confirmMessage: string): boolean {
  const { map, dirty } = useEditor.getState();
  if (!map) return true;
  if (dirty && !confirm(confirmMessage)) return false;
  useEditor.setState({ map: null, dirty: false, selectedId: null, editingId: null });
  return true;
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
  const confirmMessage = useT()('workspace.confirmLeave');
  return (
    <Link
      href={href}
      onClick={(event) => {
        // 侧栏跳的是同一个 Workspace 组件，同路由或同类型路由都不会重新挂载，
        // 编辑器 store 里还留着上一张图 —— 用户点「Quick start」却仍看到刚生成的
        // 脑图，会以为界面卡住了。这里主动清空，语义和工具栏的 New 按钮一致。
        if (!resetEditorBeforeLeaving(confirmMessage)) {
          event.preventDefault();
          return;
        }
        onNavigate();
      }}
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
