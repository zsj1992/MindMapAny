'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHoverMenu } from '@/components/site/useHoverMenu';
import { LOCALE_NAMES, type Locale } from '@/lib/i18n/locales';
import { basePath, localesWithTranslation, localizedPath } from '@/lib/i18n/routes';

/**
 * 地球图标 + 语言列表下拉。
 *
 * 只列出「当前这一页真的有译文」的语言，而不是站点支持的全部语言 ——
 * 列一个点了之后语言没变的选项，比不列更让人以为坏了。
 * 各语言覆盖范围见 routes.ts 的 TRANSLATED。
 *
 * 切换后落在当前页面的对应语言版本，不是一律回首页：
 * 在定价页点日本語却被丢回首页，用户还得自己找回来。
 */
export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const { open, setOpen, handlers, rootRef } = useHoverMenu();

  const english = basePath(pathname);
  const available = localesWithTranslation(english);
  // 只有一种语言时整个入口不显示，省得点开是个单选项
  if (available.length < 2) return null;

  return (
    <div ref={rootRef} className="relative" {...handlers}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Language — ${LOCALE_NAMES[locale]}`}
        onClick={() => setOpen((value) => !value)}
        className="btn btn-ghost h-9 w-9 p-0"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-[18px] w-[18px]" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a15 15 0 010 18a15 15 0 010-18z" />
        </svg>
      </button>

      {open && (
        // pt 把按钮和面板之间的空隙纳入命中区，避免鼠标下移时穿过死区导致菜单关闭
        <div className="absolute right-0 top-full z-50 pt-[0.55rem]">
          <ul
            role="menu"
            className="min-w-[11rem] overflow-hidden rounded-xl border bg-surface py-1 shadow-[0_24px_70px_rgb(18_48_78/0.18)]"
            style={{ borderColor: 'var(--border-strong)' }}
          >
            {available.map((item) => (
              <li key={item}>
                <Link
                  href={localizedPath(english, item)}
                  hrefLang={item}
                  role="menuitem"
                  aria-current={item === locale ? 'true' : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between gap-3 px-4 py-2 text-sm transition-colors hover:bg-bg-subtle ${
                    item === locale ? 'font-semibold text-text' : 'text-text-muted hover:text-text'
                  }`}
                >
                  {LOCALE_NAMES[item]}
                  {item === locale && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-3.5 w-3.5 text-brand-600" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
