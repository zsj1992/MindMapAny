import Link from 'next/link';
import type { Metadata } from 'next';
import { AppSidebar, SidebarTrigger } from '@/components/app/AppSidebar';
import { Logo } from '@/components/site/Logo';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { UserMenu } from '@/components/auth/UserMenu';
import { getCurrentProfile } from '@/lib/auth/session';
import type { Plan } from '@/lib/credits';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * 工作台外壳：左侧栏 + 顶栏（额度 / 升级 / 账号）。
 *
 * 整个 /app 需要登录。之前允许匿名试用，改掉的原因是免费额度被脚本刷的成本
 * 全部落在自己的模型账单上，而匿名请求没有可追责的主体，只能靠 IP 限流兜。
 * 代价是「打开就能试」的转化优势没了 —— 这是明确取舍，不是疏漏。
 *
 * 登录守卫不放在这里，放在各页面的 requireUser：layout 先于页面执行，
 * 一旦在这里 redirect，页面就没机会把「登录后回哪一页」带上，
 * 所有入口都会被拍平成 /app/new。
 *
 * 所以 layout 只负责容忍未登录状态地渲染外壳 —— 正常情况下页面已经先跳走了，
 * 这个分支只在新页面忘了调 requireUser 时才会露出来，
 * 那种情况下所有 API 依然会 401，不是安全漏洞。
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
            title={profile ? 'Credits remaining' : 'Sign in to see your credits'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5 text-accent-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
            </svg>
            {profile ? formatCredits(profile) : '—'}
          </span>

          <ThemeToggle />

          {user ? (
            <UserMenu
              name={user.name ?? null}
              email={user.email ?? null}
              plan={profile?.plan ?? 'free'}
              credits={profile?.credits ?? 0}
            />
          ) : (
            <Link href="/login?next=/app/new" className="btn btn-primary h-9 px-4 text-xs">
              Sign in
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
  if (profile.plan === 'unlimited') return 'Unlimited';
  return `${profile.credits}`;
}
