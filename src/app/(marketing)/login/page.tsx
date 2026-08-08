import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { enabledProviders } from '@/lib/auth/server';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

export const dynamic = 'force-dynamic';

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const raw = typeof params.next === 'string' ? params.next : '/app/new';
  // 只允许站内相对路径，防开放重定向
  const next = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/app/new';

  if (user) redirect(next);

  const providers = enabledProviders();

  return (
    <main className="mx-auto max-w-sm px-4 py-24">
      <h1 className="text-2xl font-semibold tracking-tight">登录 MindMapAny</h1>
      <p className="mt-2 text-sm text-text-muted">登录后可保存脑图、生成分享链接，并获得免费额度。</p>

      {providers.length === 0 ? (
        <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          登录未配置：需要设置 GOOGLE_CLIENT_ID / GITHUB_CLIENT_ID 等环境变量。
        </p>
      ) : (
        <OAuthButtons providers={providers} next={next} />
      )}

      <p className="mt-8 text-center text-xs text-text-subtle">
        未登录也能直接试用文本和网页输入，只是不能保存。
      </p>
    </main>
  );
}
