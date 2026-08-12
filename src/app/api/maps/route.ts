import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth/session';
import { countOwned, create, listOwned } from '@/lib/db/repositories/maps';
import { MAX_SAVED_MAPS } from '@/lib/maps/autosave';
import { RequestBodyTooLargeError, readJsonLimited } from '@/lib/http/body-limit';
import { mindMapSchema } from '@/lib/mindmap/schema';
import { rateLimitRequest } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const createSchema = z.object({
  map: mindMapSchema,
  sourceKind: z.enum(['text', 'pdf', 'web', 'youtube']),
  sourceUrl: z.string().max(2_048).optional(),
});

const MAX_MAP_REQUEST_BYTES = 512 * 1024;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: { code: 'login_required' } }, { status: 401 });
  return NextResponse.json({ maps: await listOwned(user.id) });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: { code: 'login_required' } }, { status: 401 });

  const limited = await rateLimitRequest(req, {
    scope: 'maps:create:user:minute',
    subject: user.id,
    limit: 20,
    windowSeconds: 60,
  });
  if (!limited.allowed) return NextResponse.json({ error: { code: 'rate_limited' } }, { status: 429 });
  if (await countOwned(user.id) >= MAX_SAVED_MAPS) {
    return NextResponse.json({ error: { code: 'map_limit_reached', message: `You can save up to ${MAX_SAVED_MAPS} mind maps` } }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await readJsonLimited(req, MAX_MAP_REQUEST_BYTES);
  } catch (error) {
    const status = error instanceof RequestBodyTooLargeError ? 413 : 400;
    return NextResponse.json({ error: { code: status === 413 ? 'too_large' : 'bad_request' } }, { status });
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: 'bad_request', message: 'The mind map data is not in a valid format' } }, { status: 400 });
  }

  const id = await create(user.id, {
    map: parsed.data.map,
    sourceKind: parsed.data.sourceKind,
    ...(parsed.data.sourceUrl ? { sourceUrl: parsed.data.sourceUrl } : {}),
  });
  return NextResponse.json({ id }, { status: 201 });
}
