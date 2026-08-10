import Link from 'next/link';
import type { ReactNode } from 'react';
import { HeaderAuth } from '@/components/auth/HeaderAuth';
import { HeaderNav } from '@/components/site/HeaderNav';
import { LanguageSwitch } from '@/components/site/LanguageSwitch';
import { Logo } from '@/components/site/Logo';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { HTML_LANG, localizedPath } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/locales';

/**
 * 对外站点的页头外壳。中英两套布局共用，只有 locale 不同。
 *
 * lang 挂在这个 div 上而不是根 <html>：根布局被工作台和营销页共用，
 * 在那里按路由判断语言就得读请求信息，整站会从静态预渲染退化成动态渲染。
 */
export function MarketingShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <div lang={HTML_LANG[locale]}>
      <a href="#main-content" className="fixed left-3 top-3 z-50 -translate-y-20 rounded-md bg-[#102f53] px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0">
        Skip to main content
      </a>
      <header className="sticky top-0 z-40 border-b bg-surface/85 backdrop-blur-xl" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto flex h-[4.25rem] max-w-[86rem] items-center gap-4 px-4 sm:px-5 md:gap-10 lg:px-10">
          <Link href={localizedPath('/', locale)} className="shrink-0">
            <Logo />
          </Link>

          <HeaderNav locale={locale} />

          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitch locale={locale} />
            <ThemeToggle />
            <HeaderAuth locale={locale} />
          </div>
        </div>
      </header>

      <div id="main-content">{children}</div>
    </div>
  );
}
