import { betterAuth } from 'better-auth';
import { getDb } from '@/lib/db/client';

/**
 * Better Auth + D1。
 *
 * 换掉 Supabase Auth 的原因不是它不好用，是它绑死 Postgres —— 全站上 Cloudflare 后
 * 数据库变成 D1（SQLite），Supabase Auth 就用不了了。
 *
 * 与 Supabase 的关键差异：那边浏览器直连数据库、靠 RLS 兜底；
 * 这边浏览器只能调我们自己的接口，数据库凭据根本不出服务端。
 * 也就是说风险模型本来就低一档，真正要防的是自己写漏 where 条件 —— 见 db/repositories。
 *
 * 每次请求现取实例：Workers 上没有长驻进程，D1 binding 也只能在请求上下文里拿到。
 */
export function getAuth() {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error('BETTER_AUTH_SECRET is missing');

  return betterAuth({
    database: getDb(),
    secret,
    // 必须用运行时变量：NEXT_PUBLIC_* 由 Next 在构建时内联，
    // 构建机上读到的是 .env.local 里的 localhost，wrangler 的 vars 覆盖不掉，
    // 结果就是线上 OAuth 的 redirect_uri 指向 localhost:3000。
    baseURL: process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    // MVP 只做 OAuth：魔法链接要额外接邮件服务，先不引入第四个外部依赖
    emailAndPassword: { enabled: false },
    socialProviders: {
      ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {}),
      ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
        ? {
            github: {
              clientId: process.env.GITHUB_CLIENT_ID,
              clientSecret: process.env.GITHUB_CLIENT_SECRET,
            },
          }
        : {}),
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24,
      // Workers 上每次请求都要查库验 session，加一层 cookie 缓存少一次 D1 往返
      cookieCache: { enabled: true, maxAge: 5 * 60 },
    },
    advanced: {
      // 分享页要在跨站场景下可用，但登录态本身不需要跨站，保持 lax 更安全
      defaultCookieAttributes: { sameSite: 'lax', secure: process.env.NODE_ENV === 'production' },
    },
  });
}

export function enabledProviders(): ('google' | 'github')[] {
  const list: ('google' | 'github')[] = [];
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) list.push('google');
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) list.push('github');
  return list;
}
