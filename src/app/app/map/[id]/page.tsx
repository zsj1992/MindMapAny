import { notFound, redirect } from 'next/navigation';
import { Workspace } from '@/components/Workspace';
import { getCurrentUser } from '@/lib/auth/session';
import { getOwnedOrPublic } from '@/lib/db/repositories/maps';

export const dynamic = 'force-dynamic';

export default async function MapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/app/map/${id}`);

  const found = await getOwnedOrPublic(id, user.id);
  if (!found) notFound();

  return <Workspace initialMap={found.map} mapId={id} />;
}
