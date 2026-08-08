import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * D1 binding 的唯一取处。
 *
 * ⚠️ 除了 src/lib/db/repositories/ 和 src/lib/auth/，任何地方都不许 import 本文件 ——
 * ESLint 里有 no-restricted-imports 规则会让构建失败。
 *
 * 原因：Postgres 版靠 RLS 在数据库层强制"只能看自己的数据"，D1（SQLite）没有这个能力。
 * 替代方案是把所有查询收敛到 repositories 一层、userId 作为必填参数，
 * 再用 lint 把"不许绕过"从纪律变成构建期约束。
 * 详见 repositories/README.md。
 */

export interface AppEnv {
  DB: D1Database;
}

export function getDb(): D1Database {
  const { env } = getCloudflareContext();
  const db = (env as unknown as AppEnv).DB;
  if (!db) throw new Error('D1 binding "DB" 不存在：检查 wrangler.jsonc 的 d1_databases 配置');
  return db;
}

/** 本地 next dev 下没有 Workers 上下文，用它决定是否降级 */
export function hasDb(): boolean {
  try {
    return Boolean((getCloudflareContext().env as unknown as AppEnv).DB);
  } catch {
    return false;
  }
}

export function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}
