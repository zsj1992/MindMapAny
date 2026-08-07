import Link from 'next/link';
import { AppSidebar, SidebarTrigger } from '@/components/app/AppSidebar';
import { Logo } from '@/components/site/Logo';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import type { Plan } from '@/lib/credits';
import { getCurrentUser, getSupabaseServer, isSupabaseConfigured } from '@/lib/db/server';

export const dynamic = 'force-dynamic';

/**
 * 工作台外壳：左侧栏 + 顶栏（额度 / 升级 / 账号）。
 *
 * 与 Mapify 的一处有意不同：未登录也能进工作台，用试用额度直接生成。
 * 强制登录才让用，会把「打开就能试」这个最大的转化优势扔掉。
 */
export default async function AppLayout({ children }: LayoutProps<'/app'>) {
  const user = await getCurrentUser().catch(() => null);
  const profile = user ? await loadProfile(user.id) : null;

  return (
    <div className="flex h-screen flex-col">
      <header
        className="flex h-14 shrink-0 items-center gap-3 border-b bg-surface px-3 sm:px-4"
        style={{ borderColor: 'var(--border)' }}
      >
        <SidebarTrigger />
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <span
            className="hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs tabular-nums text-text-muted sm:flex"
            style={{ borderColor: 'var(--border)' }}
            title={profile ? '剩余积分' : '未登录：按试用额度使用'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5 text-brand-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
            </svg>
            {profile ? formatCredits(profile) : '试用'}
          </span>

          <ThemeToggle />

          {user ? (
            <>
              <Link href="/pricing" className="btn btn-primary h-9 px-3.5 text-xs">
                升级
              </Link>
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700 dark:bg-brand-900/50 dark:text-brand-200"
                title={user.email ?? ''}
              >
                {(user.email ?? '?').slice(0, 1).toUpperCase()}
              </span>
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
        <main className="min-w-0 flex-1 overflow-y-auto bg-bg">{children}</main>
      </div>
    </div>
  );
}

function formatCredits(profile: { plan: Plan; credits: number }): string {
  if (profile.plan === 'unlimited') return '无限';
  return `${profile.credits}`;
}

async function loadProfile(userId: string): Promise<{ plan: Plan; credits: number } | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await getSupabaseServer();
    const { data } = await supabase.from('profiles').select('plan, credits').eq('id', userId).single();
    return data ? { plan: data.plan as Plan, credits: data.credits } : null;
  } catch {
    return null;
  }
}
