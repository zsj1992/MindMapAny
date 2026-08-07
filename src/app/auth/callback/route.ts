import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { getSupabaseServer, isSupabaseConfigured } from '@/lib/db/server';

export const runtime = 'nodejs';

/**
 * 登录回调。必须同时支持两种形态，少一种就有一条路走不通：
 *
 *   ?code=...                  OAuth（Google 等）与浏览器端 PKCE 发起的魔法链接
 *   ?token_hash=...&type=...   服务端签发的邮件链接（Supabase SSR 官方推荐形态）
 *
 * 还有第三种：token 放在 URL fragment（#access_token=...），服务端读不到。
 * 我们不会产生这种形态 —— 浏览器端发起的登录一律走 PKCE，服务端签发的走 token_hash。
 * 真出现了只能靠客户端兜底，当前没有这条路径。
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type') as EmailOtpType | null;

  // next 只允许站内相对路径，防开放重定向
  const raw = url.searchParams.get('next') ?? '/app/maps';
  const next = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/app/maps';

  if (!isSupabaseConfigured() || (!code && !tokenHash)) {
    return NextResponse.redirect(new URL('/login?error=1', url.origin));
  }

  const supabase = await getSupabaseServer();

  const { error } = tokenHash
    ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type ?? 'magiclink' })
    : await supabase.auth.exchangeCodeForSession(code!);

  if (error) {
    console.error('[auth/callback]', error.message);
    return NextResponse.redirect(new URL('/login?error=1', url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
