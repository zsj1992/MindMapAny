import Link from 'next/link';
import { AppSidebar, SidebarTrigger } from '@/components/app/AppSidebar';
import { Logo } from '@/components/site/Logo';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { getCurrentProfile } from '@/lib/auth/session';
import type { Plan } from '@/lib/credits';

export const dynamic = 'force-dynamic';

/**
 * 工作台外壳：左侧栏 + 顶栏（额度 / 升级 / 账号）。
 *
 * 与 Mapify 的一处有意不同：未登录也能进工作台，用试用额度直接生成。
 * 强制登录才让用，会把「打开就能试」这个最大的转化优势扔掉。
 */
export default async function AppLayout({ children }: LayoutProps<'/app'>) {
  const session = await getCurrentProfile();
  const user = session?.user ?? null;
  const profile = session?.profile ?? null;

  return (
    <div className="flex h-screen flex-col bg-bg">
      <header
        className="flex h-16 shrink-0 items-center gap-3 border-b bg-surface px-3 sm:px-5"
        style={{ borderColor: 'var(--border)' }}
      >
        <SidebarTrigger />
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <span
            className="hidden items-center gap-2 rounded-lg border bg-bg-subtle px-3 py-2 text-xs font-medium tabular-nums text-text-muted sm:flex"
            style={{ borderColor: 'var(--border)' }}
            title={profile ? '剩余积分' : '未登录：按试用额度使用'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5 text-accent-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
            </svg>
            {profile ? formatCredits(profile) : '试用'}
          </span>

          <ThemeToggle />

          {user ? (
            <>
              <Link href="/pricing" className="btn btn-secondary h-9 px-3.5 text-xs">
                升级
              </Link>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#102f53] text-xs font-bold text-white"
                title={user.email ?? ''}
              >
                {(user.name ?? user.email ?? '?').slice(0, 1).toUpperCase()}
              </span>
              <SignOutButton className="btn btn-ghost h-9 px-2 text-xs" />
            </>
          ) : (
            <Link href="/login?next=/app/new" className="btn btn-primary h-9 px-4 text-xs">
              登录
            </Link>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <AppSidebar />
        <main className="surface-grid min-w-0 flex-1 overflow-y-auto bg-bg">{children}</main>
      </div>
    </div>
  );
}

function formatCredits(profile: { plan: Plan; credits: number }): string {
  if (profile.plan === 'unlimited') return '无限';
  return `${profile.credits}`;
}
