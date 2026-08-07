import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser, getSupabaseServer, isSupabaseConfigured } from '@/lib/db/server';
import { mindMapSchema } from '@/lib/mindmap/schema';

export const runtime = 'nodejs';

const updateSchema = z.object({
  map: mindMapSchema.optional(),
  isPublic: z.boolean().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: { code: 'unconfigured' } }, { status: 503 });
  const { id } = await params;
  const supabase = await getSupabaseServer();
  // RLS 已经限定了「自己的图 或 公开图」，这里不再手写过滤条件
  const { data, error } = await supabase.from('maps').select('*').eq('id', id).single();
  if (error || !data) return NextResponse.json({ error: { code: 'not_found' } }, { status: 404 });
  return NextResponse.json({ map: data });
}

export async function PUT(req: Request, { params }: Ctx) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: { code: 'unconfigured' } }, { status: 503 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: { code: 'login_required' } }, { status: 401 });

  const { id } = await params;
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: { code: 'bad_request' } }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (parsed.data.map) {
    patch.data = parsed.data.map;
    patch.title = parsed.data.map.title;
  }
  if (parsed.data.isPublic !== undefined) {
    patch.is_public = parsed.data.isPublic;
    // 首次公开时才生成 slug，取消公开后保留，方便再次分享时链接不变
    if (parsed.data.isPublic) patch.share_slug = await ensureSlug(id);
  }
  if (!Object.keys(patch).length) return NextResponse.json({ ok: true });

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('maps')
    .update(patch)
    .eq('id', id)
    .select('id, share_slug, is_public')
    .single();

  if (error || !data) return NextResponse.json({ error: { code: 'not_found' } }, { status: 404 });
  return NextResponse.json({ ok: true, shareSlug: data.share_slug, isPublic: data.is_public });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: { code: 'unconfigured' } }, { status: 503 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: { code: 'login_required' } }, { status: 401 });

  const { id } = await params;
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from('maps').delete().eq('id', id);
  if (error) return NextResponse.json({ error: { code: 'db', message: error.message } }, { status: 500 });
  return NextResponse.json({ ok: true });
}

async function ensureSlug(id: string): Promise<string> {
  const supabase = await getSupabaseServer();
  const { data } = await supabase.from('maps').select('share_slug').eq('id', id).single();
  return data?.share_slug ?? nanoid(10);
}
