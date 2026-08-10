import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MapLibrary } from '@/components/maps/MapLibrary';
import { getCurrentUser } from '@/lib/auth/session';
import { listOwned } from '@/lib/db/repositories/maps';
import { appLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n/messages';

export const dynamic = 'force-dynamic';

export default async function MapsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/app/maps');

  const maps = await listOwned(user.id).catch(() => []);
  if (!maps.length) {
    const locale = await appLocale();
    return <Empty message={translate(locale, 'maps.empty')} cta={translate(locale, 'maps.emptyCta')} />;
  }

  return <main className="mx-auto max-w-4xl px-4 py-10"><MapLibrary initialMaps={maps} /></main>;
}

function Empty({ message, cta }: { message: string; cta: string }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-sm text-text-muted">{message}</p>
      <Link href="/app/new" className="btn btn-primary mt-5 h-10 px-5">
        {cta}
      </Link>
    </main>
  );
}
