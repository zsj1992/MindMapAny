import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { deleteOwned, getOwnedOrPublic, renameOwned, setPublicOwned, updateOwned } from '@/lib/db/repositories/maps';
import { mindMapSchema } from '@/lib/mindmap/schema';

export const runtime = 'nodejs';

const updateSchema = z.object({
  map: mindMapSchema.optional(),
  isPublic: z.boolean().optional(),
  title: z.string().trim().min(1).max(120).optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const user = await getCurrentUser();
  // 未登录时只能读到公开图，这条等价于原先的两条 RLS 策略
  const found = await getOwnedOrPublic(id, user?.id ?? null);
  if (!found) return NextResponse.json({ error: { code: 'not_found' } }, { status: 404 });
  return NextResponse.json({ map: found.map, isPublic: Boolean(found.row.is_public) });
}

export async function PUT(req: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: { code: 'login_required' } }, { status: 401 });

  const { id } = await params;
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: { code: 'bad_request' } }, { status: 400 });

  if (parsed.data.map) {
    const ok = await updateOwned(id, user.id, parsed.data.map);
    if (!ok) return NextResponse.json({ error: { code: 'not_found' } }, { status: 404 });
  }


  if (parsed.data.title !== undefined) {
    const ok = await renameOwned(id, user.id, parsed.data.title);
    if (!ok) return NextResponse.json({ error: { code: 'not_found' } }, { status: 404 });
  }

  if (parsed.data.isPublic !== undefined) {
    const res = await setPublicOwned(id, user.id, parsed.data.isPublic);
    if (!res) return NextResponse.json({ error: { code: 'not_found' } }, { status: 404 });
    return NextResponse.json({ ok: true, shareSlug: res.shareSlug, isPublic: res.isPublic });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: { code: 'login_required' } }, { status: 401 });
  const { id } = await params;
  const ok = await deleteOwned(id, user.id);
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}
