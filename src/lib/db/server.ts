import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

function requireEnv(): { url: string; anonKey: string } {
  if (!url || !anonKey) throw new Error('Supabase 未配置：缺少 NEXT_PUBLIC_SUPABASE_URL / ANON_KEY');
  return { url, anonKey };
}

/** 请求级客户端，走用户 session，受 RLS 约束 */
export async function getSupabaseServer() {
  const env = requireEnv();
  const store = await cookies();
  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Server Component 里不能写 cookie，中间件会补刷新，忽略即可
        }
      },
    },
  });
}

/**
 * service role 客户端，绕过 RLS。只能用在服务端且用途明确的地方：
 * 扣积分、写 jobs、读内容缓存。绝不能把它暴露给任何按用户输入决定过滤条件的查询。
 */
export function getSupabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase 未配置：缺少 SERVICE_ROLE_KEY');
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
