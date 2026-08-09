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
  title: 'Sign in',
  description: 'Sign in to MindMapAny to save your mind maps and create public share links.',
  robots: { index: false },
};

const PERKS = [
  'Save your maps and pick up where you left off',
  'Create a public link others can open without signing up',
  '30 free credits on signup — try every available input type',
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
            Sign in and your maps
            <br />
            are truly <span className="text-gradient">yours</span>
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
          <h2 className="mt-4 text-xl font-semibold tracking-tight lg:mt-0">Get started</h2>
          <p className="mt-1.5 text-sm text-text-muted">Pick a sign-in method — it takes seconds.</p>

          {providers.length === 0 ? (
            <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              Sign-in is not configured: GOOGLE_CLIENT_ID / GITHUB_CLIENT_ID and related environment variables must be set.
            </p>
          ) : (
            <OAuthButtons providers={providers} next={next} />
          )}

          <p className="mt-6 text-center text-xs leading-relaxed text-text-subtle">
            By continuing you agree that we may process the content you submit in order to generate mind maps.
            <br />
            Rather not sign in?
            <Link href="/app/new" className="text-brand-600 underline-offset-2 hover:underline dark:text-brand-400">
              Try it directly
            </Link>
            {' '}(text and web pages work, but nothing is saved)
          </p>
        </div>
      </div>
    </main>
  );
}
