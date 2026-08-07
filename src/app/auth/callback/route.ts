import { NextResponse } from 'next/server';
import { getSupabaseServer, isSupabaseConfigured } from '@/lib/db/server';

export const runtime = 'nodejs';

/** OAuth / magic link 回跳：用 code 换 session 并写入 cookie */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  // next 只允许站内相对路径，防开放重定向
  const raw = url.searchParams.get('next') ?? '/maps';
  const next = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/maps';

  if (!code || !isSupabaseConfigured()) {
    return NextResponse.redirect(new URL('/login?error=1', url.origin));
  }

  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL('/login?error=1', url.origin));

  return NextResponse.redirect(new URL(next, url.origin));
}
