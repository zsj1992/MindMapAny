'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { useHoverMenu } from '@/components/site/useHoverMenu';
import { marketingCopy } from '@/lib/i18n/marketing';
import { localizedPath } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/locales';
import { TrackedLink } from '@/components/analytics/TrackedLink';

/**
 * 站点页头导航。Tools 是一个悬停展开的大面板 —— 6 个工具页埋在 /tools 列表页里，
 * 从首页要两跳才到得了；摊在页头是竞品普遍做法，也确实少一跳。
 *
 * 三件事必须同时成立，少一件都会有一类用户点不开：
 *   1. 鼠标悬停展开（桌面）
 *   2. 键盘 focus 也展开（无障碍）
 *   3. Tools 本身仍是能点的链接，指向 /tools（触屏没有 hover，靠这条兜底）
 */

const icon = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4 shrink-0 text-brand-500">
    {path}
  </svg>
);

const DOC_ICON = icon(
  <>
    <path strokeLinejoin="round" d="M14 3v5h5" />
    <path strokeLinejoin="round" d="M19 8v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5z" />
  </>,
);

const GROUP_HREFS = [
  ['/tools/pdf-to-mind-map', '/tools/docx-to-mind-map', '/tools/pptx-to-mind-map', '/tools/epub-to-mind-map'],
  ['/tools/text-to-mind-map', '/tools/webpage-to-mind-map', '/tools/youtube-to-mind-map'],
];

const GROUP_ICONS = [
  [
    DOC_ICON,
    icon(
      <>
        <path strokeLinejoin="round" d="M14 3v5h5M19 8v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5z" />
        <path strokeLinecap="round" d="M8 13h8M8 16h6" />
      </>,
    ),
    icon(
      <>
        <rect x="4" y="3" width="16" height="13" rx="2" />
        <path strokeLinecap="round" d="M8 20l4-4 4 4M8 8h8M8 11h5" />
      </>,
    ),
    icon(
      <path strokeLinejoin="round" d="M4 5.5A2.5 2.5 0 016.5 3H11v16H6.5A2.5 2.5 0 004 21V5.5zM20 5.5A2.5 2.5 0 0017.5 3H13v16h4.5A2.5 2.5 0 0120 21V5.5z" />,
    ),
  ],
  [
    icon(<path strokeLinecap="round" d="M5 7h14M5 12h14M5 17h8" />),
    icon(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 010 18a15 15 0 010-18z" />
      </>,
    ),
    icon(
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path strokeLinejoin="round" d="M11 9.5l4 2.5-4 2.5v-5z" />
      </>,
    ),
  ],
];

/** toolLabels 是扁平的一维数组，这里给出每组的起始下标 */
const GROUP_LABEL_OFFSET = [0, 4];

const POPULAR_LABEL: Record<Locale, string> = {
  en: 'Popular tools',
  'zh-CN': '热门工具',
  ja: '人気のツール',
  ko: '인기 도구',
  es: 'Herramientas populares',
  de: 'Beliebte Werkzeuge',
  fr: 'Outils populaires',
};

const RESEARCH_ICON = icon(
  <>
    <circle cx="10" cy="10" r="6" />
    <path strokeLinecap="round" d="M14.5 14.5L20 20M10 7v6M7 10h6" />
  </>,
);

const ALL_TOOLS_ICON = icon(
  <>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </>,
);

const EXTENSION_LABEL: Record<Locale, string> = {
  en: 'Chrome extension',
  'zh-CN': 'Chrome 插件',
  ja: 'Chrome 拡張',
  ko: 'Chrome 확장',
  es: 'Extensión Chrome',
  de: 'Chrome-Erweiterung',
  fr: 'Extension Chrome',
};


export function HeaderNav({ locale }: { locale: Locale }) {
  const copy = marketingCopy(locale).nav;
  return (
    <nav className="hidden items-center gap-8 text-[13px] font-medium text-text-muted md:flex">
      <ToolsMenu locale={locale} />
      <Link href="/browser-extension" className="transition-colors hover:text-text">
        {EXTENSION_LABEL[locale]}
      </Link>
      <Link href={localizedPath('/blog', locale)} className="transition-colors hover:text-text">
        {copy.blog}
      </Link>
      <Link href={localizedPath('/pricing', locale)} className="transition-colors hover:text-text">
        {copy.pricing}
      </Link>
      <Link href={localizedPath('/#faq', locale)} className="transition-colors hover:text-text">
        {copy.faq}
      </Link>
    </nav>
  );
}

/** 面板最大宽度。JS 定位要用到它，所以不能只写在 class 里 */
const PANEL_MAX = 768;
const VIEWPORT_MARGIN = 16;
const TOOL_LINK_CLASS = 'flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] text-text-muted transition-colors hover:bg-bg-subtle hover:text-text';

function ToolsMenu({ locale }: { locale: Locale }) {
  const copy = marketingCopy(locale).nav;
  const { open, setOpen, handlers, rootRef } = useHoverMenu();
  const [panelLeft, setPanelLeft] = useState(0);
  const [panelWidth, setPanelWidth] = useState(PANEL_MAX);

  /**
   * 面板左边缘对齐触发器左边缘，宽度不够时再往左收，始终留 16px 边距。
   *
   * 为什么要用 JS 量而不是纯 CSS：三列面板宽 48rem，而 Tools 距左边只有 ~240px。
   * 以触发器为中心会有一半掉到视口外（实测左侧整列被裁）；改成页头居中又会让
   * 面板离触发器一百多像素，鼠标斜着移过去会穿过空白区把菜单关掉。
   * 只有「左对齐触发器 + 溢出时夹紧」两条同时成立，才在各种宽度下都对。
   */
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const trigger = rootRef.current?.getBoundingClientRect();
      if (!trigger) return;
      const width = Math.min(PANEL_MAX, window.innerWidth - VIEWPORT_MARGIN * 2);
      const maxLeft = window.innerWidth - width - VIEWPORT_MARGIN;
      setPanelWidth(width);
      setPanelLeft(Math.max(VIEWPORT_MARGIN, Math.min(trigger.left, maxLeft)));
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open, rootRef]);

  return (
    <div ref={rootRef} className="relative" {...handlers}>
      <Link
        href={localizedPath('/tools', locale)}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(false)}
        className={`flex items-center gap-1 transition-colors hover:text-text ${open ? 'text-text' : ''}`}
      >
        {copy.tools}
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m6.5 8 3.5 3.5L13.5 8" />
        </svg>
      </Link>

      {open && (
        <div
          /*
           * pt 把面板与触发器之间 0.55rem 的空隙纳入面板自身的命中区域 ——
           * 否则鼠标从 Tools 往下移会穿过一段「既不在触发器也不在面板」的死区，
           * 菜单当场关掉。这是悬停菜单最常见的毛病，实测确实会触发。
           */
          className="fixed top-[4.25rem] z-50 pt-[0.55rem]"
          style={{ left: panelLeft, width: panelWidth }}
        >
          <div
            className="overflow-hidden rounded-2xl border bg-surface p-4 shadow-[0_24px_70px_rgb(18_48_78/0.18)]"
            style={{ borderColor: 'var(--border-strong)' }}
          >
            <div className="grid grid-cols-3 gap-x-4 gap-y-4">
              <section>
                <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.1em] text-text-subtle">{POPULAR_LABEL[locale]}</p>
                <div className="space-y-0.5">
                  {[
                    { href: GROUP_HREFS[1][0], icon: GROUP_ICONS[1][0], label: copy.toolLabels[4] },
                    { href: GROUP_HREFS[0][0], icon: GROUP_ICONS[0][0], label: copy.toolLabels[0] },
                    { href: GROUP_HREFS[1][2], icon: GROUP_ICONS[1][2], label: copy.toolLabels[6] },
                  ].map((item) => (
                    <TrackedLink
                      key={item.href}
                      href={localizedPath(item.href, locale)}
                      eventName="popular_tool_clicked"
                      eventParameters={{ page: 'header', placement: 'tools-menu', tool: item.href.split('/').at(-1) ?? item.href, locale }}
                      onClick={() => setOpen(false)}
                      className={TOOL_LINK_CLASS}
                    >
                      {item.icon}
                      {item.label}
                    </TrackedLink>
                  ))}
                </div>
              </section>

              {[copy.toolsGroups.documents, copy.toolsGroups.textWeb].map((groupTitle, groupIndex) => (
                <section key={groupTitle}>
                  <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.1em] text-text-subtle">{groupTitle}</p>
                  <div className="space-y-0.5">
                    {GROUP_HREFS[groupIndex].map((href, itemIndex) => (
                      <Link
                        key={href}
                        href={localizedPath(href, locale)}
                        onClick={() => setOpen(false)}
                        className={TOOL_LINK_CLASS}
                      >
                        {GROUP_ICONS[groupIndex][itemIndex]}
                        {copy.toolLabels[GROUP_LABEL_OFFSET[groupIndex] + itemIndex]}
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
              {[
                { href: '/app/research', icon: RESEARCH_ICON, label: copy.deepResearch, hint: copy.deepResearchHint },
                { href: '/tools', icon: ALL_TOOLS_ICON, label: copy.allTools, hint: copy.allToolsHint },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={localizedPath(item.href, locale)}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl border bg-bg-subtle px-3 py-2.5 transition-colors hover:border-brand-300 hover:bg-surface"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {item.icon}
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold text-text">{item.label}</span>
                    <span className="block truncate text-[11px] text-text-subtle">{item.hint}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
