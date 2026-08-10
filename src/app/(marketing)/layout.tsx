import Link from 'next/link';
import { Logo } from '@/components/site/Logo';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { HeaderAuth } from '@/components/auth/HeaderAuth';
import { HeaderNav } from '@/components/site/HeaderNav';

/** 对外站点的页头：导航 + 入口 CTA。登录后 CTA 直接指向工作台。 */
export default function MarketingLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <a href="#main-content" className="fixed left-3 top-3 z-50 -translate-y-20 rounded-md bg-[#102f53] px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0">Skip to main content</a>
      <header
        className="sticky top-0 z-40 border-b bg-surface/85 backdrop-blur-xl"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-[86rem] items-center gap-4 px-4 sm:px-5 md:gap-10 lg:px-10">
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>

          <HeaderNav />

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <HeaderAuth />
          </div>
        </div>
      </header>

      <div id="main-content">{children}</div>
    </>
  );
}
