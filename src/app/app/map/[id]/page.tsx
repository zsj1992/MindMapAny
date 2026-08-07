import { notFound, redirect } from 'next/navigation';
import { Workspace } from '@/components/Workspace';
import { getCurrentUser, getSupabaseServer, isSupabaseConfigured } from '@/lib/db/server';
import { mindMapSchema } from '@/lib/mindmap/schema';

export const dynamic = 'force-dynamic';

export default async function MapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isSupabaseConfigured()) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/app/map/${id}`);

  const supabase = await getSupabaseServer();
  const { data } = await supabase.from('maps').select('data').eq('id', id).single();
  if (!data) notFound();

  const parsed = mindMapSchema.safeParse(data.data);
  if (!parsed.success) notFound();

  return <Workspace initialMap={parsed.data} mapId={id} />;
}
