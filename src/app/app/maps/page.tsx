import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MapLibrary } from '@/components/maps/MapLibrary';
import { getCurrentUser } from '@/lib/auth/session';
import { listOwned } from '@/lib/db/repositories/maps';

export const dynamic = 'force-dynamic';

export default async function MapsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/app/maps');

  const maps = await listOwned(user.id).catch(() => []);
  if (!maps.length) return <Empty message="还没有保存的脑图。" />;

  return <main className="mx-auto max-w-4xl px-4 py-10"><MapLibrary initialMaps={maps} /></main>;
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
