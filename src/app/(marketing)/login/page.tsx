import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { HeroMap } from '@/components/site/HeroMap';
import { Logo } from '@/components/site/Logo';
import { enabledProviders } from '@/lib/auth/server';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '登录',
  description: '登录 MindMapAny，保存脑图、生成公开分享链接。',
  robots: { index: false },
};

const PERKS = [
  '保存脑图，随时回来接着改',
  '生成公开链接，别人不用注册也能看',
  '注册即送 30 积分，已开放输入均可体验',
];

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const raw = typeof params.next === 'string' ? params.next : '/app/new';
  // 只允许站内相对路径，防开放重定向
  const next = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/app/new';

  if (user) redirect(next);

  const providers = enabledProviders();

  return (
    <main className="hero-glow relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="relative grid w-full max-w-4xl items-center gap-10 lg:grid-cols-2">
        {/* 左侧：说清楚登录能换来什么。空白的登录页转化率最差。 */}
        <div className="hidden lg:block">
          <Logo />
          <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight">
            登录后，
            <br />
            脑图才是<span className="text-gradient">你的</span>
          </h1>
          <ul className="mt-6 space-y-3">
            {PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-text-muted">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent-500"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                </svg>
                {p}
              </li>
            ))}
          </ul>
          <HeroMap className="mt-8 w-full opacity-70" />
        </div>

        {/* 右侧：登录卡片 */}
        <div className="card mx-auto w-full max-w-sm p-7 shadow-xl shadow-brand-900/[0.07] dark:shadow-black/40">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h2 className="mt-4 text-xl font-semibold tracking-tight lg:mt-0">开始使用</h2>
          <p className="mt-1.5 text-sm text-text-muted">选择一种方式登录，几秒完成。</p>

          {providers.length === 0 ? (
            <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              登录未配置：需要设置 GOOGLE_CLIENT_ID / GITHUB_CLIENT_ID 等环境变量。
            </p>
          ) : (
            <OAuthButtons providers={providers} next={next} />
          )}

          <p className="mt-6 text-center text-xs leading-relaxed text-text-subtle">
            继续即表示同意我们处理你提交的内容用于生成脑图。
            <br />
            不想登录？
            <Link href="/app/new" className="text-brand-600 underline-offset-2 hover:underline dark:text-brand-400">
              直接试用
            </Link>
            （文本和网页可用，但不能保存）
          </p>
        </div>
      </div>
    </main>
  );
}
