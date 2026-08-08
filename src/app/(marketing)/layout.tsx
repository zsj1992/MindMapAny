import Link from 'next/link';
import { Logo } from '@/components/site/Logo';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { HeaderAuth } from '@/components/auth/HeaderAuth';

/** 对外站点的页头：导航 + 入口 CTA。登录后 CTA 直接指向工作台。 */
export default function MarketingLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <header
        className="sticky top-0 z-40 border-b bg-surface/90 backdrop-blur-xl"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-5 lg:px-8">
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-text-muted md:flex">
            <Link href="/#features" className="transition-colors hover:text-text">
              功能
            </Link>
            <Link href="/#faq" className="transition-colors hover:text-text">
              常见问题
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-text">
              价格
            </Link>
            <Link href="/app/maps" className="transition-colors hover:text-text">
              我的脑图
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <HeaderAuth />
          </div>
        </div>
      </header>

      {children}
    </>
  );
}
