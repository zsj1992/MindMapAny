import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { create, listOwned } from '@/lib/db/repositories/maps';
import { mindMapSchema } from '@/lib/mindmap/schema';

export const runtime = 'nodejs';

const createSchema = z.object({
  map: mindMapSchema,
  sourceKind: z.enum(['text', 'pdf', 'web', 'youtube']),
  sourceUrl: z.string().optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: { code: 'login_required' } }, { status: 401 });
  return NextResponse.json({ maps: await listOwned(user.id) });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: { code: 'login_required' } }, { status: 401 });

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: { code: 'bad_request', message: '脑图数据格式不合法' } }, { status: 400 });
  }

  const id = await create(user.id, {
    map: parsed.data.map,
    sourceKind: parsed.data.sourceKind,
    ...(parsed.data.sourceUrl ? { sourceUrl: parsed.data.sourceUrl } : {}),
  });
  return NextResponse.json({ id }, { status: 201 });
}
