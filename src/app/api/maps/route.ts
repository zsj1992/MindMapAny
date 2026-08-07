import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser, getSupabaseServer, isSupabaseConfigured } from '@/lib/db/server';
import { mindMapSchema } from '@/lib/mindmap/schema';

export const runtime = 'nodejs';

const createSchema = z.object({
  map: mindMapSchema,
  sourceKind: z.enum(['text', 'pdf', 'web', 'youtube']),
  sourceUrl: z.string().optional(),
});

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ maps: [] });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: { code: 'login_required' } }, { status: 401 });

  const supabase = await getSupabaseServer();
  // 列表不返回 data 字段，一张大图几百 KB，列表页不需要
  const { data, error } = await supabase
    .from('maps')
    .select('id, title, source_kind, source_url, share_slug, is_public, updated_at')
    .order('updated_at', { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: { code: 'db', message: error.message } }, { status: 500 });
  return NextResponse.json({ maps: data });
}

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: { code: 'unconfigured', message: '数据库未配置' } }, { status: 503 });
  }
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: { code: 'login_required' } }, { status: 401 });

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: { code: 'bad_request', message: '脑图数据格式不合法' } }, { status: 400 });
  }
  const { map, sourceKind, sourceUrl } = parsed.data;

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from('maps')
    .insert({
      user_id: user.id,
      title: map.title,
      data: map,
      source_kind: sourceKind,
      source_url: sourceUrl ?? null,
      language: map.language,
      depth: map.depth,
      purpose: map.purpose,
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: { code: 'db', message: error.message } }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
