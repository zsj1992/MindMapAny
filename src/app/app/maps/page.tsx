import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { listOwned } from '@/lib/db/repositories/maps';

export const dynamic = 'force-dynamic';

const KIND_LABEL: Record<string, string> = { text: '文本', pdf: 'PDF', web: '网页', youtube: 'YouTube' };

export default async function MapsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/app/maps');

  const maps = await listOwned(user.id).catch(() => []);
  if (!maps.length) return <Empty message="还没有保存的脑图。" />;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-xl font-semibold">我的脑图</h1>
      <ul className="card divide-y" style={{ borderColor: 'var(--border)' }}>
        {maps.map((m) => (
          <li key={m.id} className="flex items-center gap-3 px-4 py-3">
            <Link href={`/app/map/${m.id}`} className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{m.title}</span>
              <span className="mt-0.5 block text-xs text-text-subtle">
                {KIND_LABEL[m.sourceKind] ?? m.sourceKind} ·{' '}
                {new Date(m.updatedAt * 1000).toLocaleDateString('zh-CN')}
              </span>
            </Link>
            {m.isPublic && m.shareSlug && (
              <Link href={`/m/${m.shareSlug}`} className="text-xs text-text-subtle transition-colors hover:text-text">
                公开链接
              </Link>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-sm text-text-muted">{message}</p>
      <Link href="/app/new" className="btn btn-primary mt-5 h-10 px-5">
        生成第一张脑图
      </Link>
    </main>
  );
}
