import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser, getSupabaseServer, isSupabaseConfigured } from '@/lib/db/server';

export const dynamic = 'force-dynamic';

const KIND_LABEL: Record<string, string> = { text: '文本', pdf: 'PDF', web: '网页', youtube: 'YouTube' };

export default async function MapsPage() {
  if (!isSupabaseConfigured()) {
    return <Empty message="数据库未配置，暂时无法保存脑图。" />;
  }
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/app/maps');

  const supabase = await getSupabaseServer();
  const { data: maps } = await supabase
    .from('maps')
    .select('id, title, source_kind, share_slug, is_public, updated_at')
    .order('updated_at', { ascending: false })
    .limit(100);

  if (!maps?.length) {
    return <Empty message="还没有保存的脑图。" />;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-xl font-semibold">我的脑图</h1>
      <ul className="card divide-y" style={{ borderColor: 'var(--border)' }}>
        {maps.map((m) => (
          <li key={m.id} className="flex items-center gap-3 px-4 py-3">
            <Link href={`/app/map/${m.id}`} className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{m.title}</span>
              <span className="mt-0.5 block text-xs text-text-subtle">
                {KIND_LABEL[m.source_kind] ?? m.source_kind} ·{' '}
                {new Date(m.updated_at).toLocaleDateString('zh-CN')}
              </span>
            </Link>
            {m.is_public && m.share_slug && (
              <Link href={`/m/${m.share_slug}`} className="text-xs text-text-subtle transition-colors hover:text-text">
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
