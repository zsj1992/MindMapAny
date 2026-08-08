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

/* 工作台左侧栏：按输入类型分组导航。每个类型一个独立路由，
   既是产品结构，也顺便是四个可被搜索索引的落地页。 */

const icon = (path: ReactNode, className = '') => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={`h-4 w-4 ${className}`}>
    {path}
  </svg>
);

const ICONS = {
  spark: icon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />,
    'text-brand-500',
  ),
  pdf: icon(
    <>
      <path strokeLinejoin="round" d="M14 3v5h5" />
      <path strokeLinejoin="round" d="M19 8v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5z" />
    </>,
    'text-red-500',
  ),
  youtube: icon(
    <>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M11 10l4 2-4 2v-4z" fill="currentColor" stroke="none" />
    </>,
    'text-red-500',
  ),
  text: icon(<path strokeLinecap="round" d="M5 7h14M5 12h14M5 17h8" />, 'text-emerald-500'),
  web: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 010 18a15 15 0 010-18z" />
    </>,
    'text-brand-500',
  ),
  maps: icon(
    <>
      <rect x="3" y="4" width="7" height="6" rx="1.5" />
      <rect x="14" y="9" width="7" height="5" rx="1.5" />
      <rect x="14" y="16" width="7" height="4" rx="1.5" />
    </>,
  ),
  lock: icon(
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </>,
  ),
};

const PRIMARY = [
  { href: '/app/new', label: '快速开始', icon: ICONS.spark },
  { href: '/app/maps', label: '我的脑图', icon: ICONS.maps },
];

const SOURCES = [
  { href: '/app/pdf', label: 'PDF', icon: ICONS.pdf },
  { href: '/app/youtube', label: 'YouTube', icon: ICONS.youtube },
  { href: '/app/text', label: '长文本', icon: ICONS.text },
  { href: '/app/web', label: '网页文章', icon: ICONS.web },
];

/** 明确标出未支持的输入，比让用户点进去撞墙好，也顺便传达了路线图 */
const PLANNED = ['音频 / 播客', '会议录音', '扫描件 OCR', 'Word / PPT / Excel'];

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
    <nav className="flex h-full flex-col gap-7 overflow-y-auto px-3 py-5">
      <div className="space-y-0.5">
        {PRIMARY.map((item) => (
          <NavLink key={item.href} {...item} active={pathname === item.href} onNavigate={() => setOpen(false)} />
        ))}
      </div>

      <div>
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-text-subtle">内容来源</p>
        <div className="space-y-0.5">
          {SOURCES.map((item) => (
            <NavLink key={item.href} {...item} active={pathname === item.href} onNavigate={() => setOpen(false)} />
          ))}
        </div>
      </div>

      <div>
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-text-subtle">即将支持</p>
        <div className="space-y-0.5">
          {PLANNED.map((label) => (
            <span
              key={label}
              className="flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-text-subtle"
              title="当前版本尚未支持"
            >
              <span className="opacity-50">{ICONS.lock}</span>
              {label}
            </span>
          ))}
        </div>
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
        className="hidden w-64 shrink-0 border-r bg-surface lg:block"
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
}: {
  href: string;
  label: string;
  icon: ReactNode;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all ${
        active ? 'bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-900/30 dark:text-brand-200' : 'text-text-muted hover:bg-bg-subtle hover:text-text'
      }`}
    >
      {active && <span className="absolute left-0 h-5 w-0.5 rounded-full bg-brand-600" />}
      {icon}
      {label}
    </Link>
  );
}
