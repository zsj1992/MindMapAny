import { getDb, nowSec } from '@/lib/db/client';
import { mindMapSchema, type MindMap } from '@/lib/mindmap/schema';
import type { InputKind } from '@/lib/extract/types';
import {
  SQL_DELETE_OWNED,
  SQL_GET_OWNED_OR_PUBLIC,
  SQL_GET_PUBLIC_BY_SLUG,
  SQL_LIST_OWNED,
  SQL_SET_PUBLIC_OWNED,
  SQL_UPDATE_OWNED,
} from './sql';

/**
 * 脑图数据访问层 —— 这里是权限的唯一执行点。
 *
 * 设计约束（对应 Postgres 版丢掉的 RLS）：
 * 1. 每个函数的 userId 都是必填位置参数，不是 options 里的可选字段，忘了传就是类型错误
 * 2. 函数名自带权限语义：getOwnedOrPublic / listOwned，没有裸的 findById
 * 3. 过滤条件写死在 SQL 里，调用方无法覆盖
 */

export interface MapRow {
  id: string;
  user_id: string;
  title: string;
  data: string;
  source_kind: InputKind;
  source_url: string | null;
  language: string;
  depth: string;
  purpose: string;
  share_slug: string | null;
  is_public: number;
  created_at: number;
  updated_at: number;
}

export interface MapSummary {
  id: string;
  title: string;
  sourceKind: InputKind;
  shareSlug: string | null;
  isPublic: boolean;
  updatedAt: number;
}

function parseMap(row: MapRow): MindMap | null {
  try {
    const parsed = mindMapSchema.safeParse(JSON.parse(row.data));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/** 我的脑图列表。不返回 data —— 一张大图几百 KB，列表页不需要。 */
export async function listOwned(userId: string, limit = 100): Promise<MapSummary[]> {
  const { results } = await getDb()
    .prepare(SQL_LIST_OWNED)
    .bind(userId, limit)
    .all<Omit<MapRow, 'data' | 'user_id' | 'source_url' | 'language' | 'depth' | 'purpose' | 'created_at'>>();

  return (results ?? []).map((r): MapSummary => ({
    id: r.id,
    title: r.title,
    sourceKind: r.source_kind,
    shareSlug: r.share_slug,
    isPublic: Boolean(r.is_public),
    updatedAt: r.updated_at,
  }));
}

export async function countOwned(userId: string): Promise<number> {
  const row = await getDb()
    .prepare(`select count(*) as count from maps where user_id = ?1`)
    .bind(userId)
    .first<{ count: number }>();
  return row?.count ?? 0;
}

/**
 * 编辑器读取用。userId 为 null 表示未登录 —— 此时只有公开图能读到。
 * 这条 SQL 就是原来那两条 RLS 策略的等价物，务必和它们保持一致。
 */
export async function getOwnedOrPublic(id: string, userId: string | null): Promise<{ row: MapRow; map: MindMap } | null> {
  const row = await getDb()
    .prepare(SQL_GET_OWNED_OR_PUBLIC)
    // 未登录直接绑 null：SQLite 里 `user_id = NULL` 求值为 NULL（非真），
    // 私有行自然被排除，公开行靠 is_public = 1 命中。不需要造哨兵值。
    .bind(id, userId)
    .first<MapRow>();
  if (!row) return null;
  const map = parseMap(row);
  return map ? { row, map } : null;
}

/** 分享页专用：只认公开图，不接受任何身份参数，避免误用成越权入口 */
export async function getPublicBySlug(slug: string): Promise<{ row: MapRow; map: MindMap } | null> {
  const row = await getDb()
    .prepare(SQL_GET_PUBLIC_BY_SLUG)
    .bind(slug)
    .first<MapRow>();
  if (!row) return null;
  const map = parseMap(row);
  return map ? { row, map } : null;
}

export async function listPublicSlugs(limit = 5000): Promise<{ slug: string; updatedAt: number }[]> {
  const { results } = await getDb()
    .prepare(
      `select share_slug, updated_at from maps
        where is_public = 1 and share_slug is not null
        order by updated_at desc limit ?1`,
    )
    .bind(limit)
    .all<{ share_slug: string; updated_at: number }>();
  return (results ?? []).map((r: { share_slug: string; updated_at: number }) => ({
    slug: r.share_slug,
    updatedAt: r.updated_at,
  }));
}

export async function create(
  userId: string,
  input: { map: MindMap; sourceKind: InputKind; sourceUrl?: string },
): Promise<string> {
  const id = crypto.randomUUID();
  const ts = nowSec();
  await getDb()
    .prepare(
      `insert into maps (id, user_id, title, data, source_kind, source_url, language, depth, purpose, created_at, updated_at)
       values (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?10)`,
    )
    .bind(
      id,
      userId,
      input.map.title,
      JSON.stringify(input.map),
      input.sourceKind,
      input.sourceUrl ?? null,
      input.map.language,
      input.map.depth,
      input.map.purpose,
      ts,
    )
    .run();
  return id;
}

/** 更新一律带 user_id 条件 —— 漏了它就是"任何人能改任何人的图" */
export async function updateOwned(id: string, userId: string, map: MindMap): Promise<boolean> {
  const res = await getDb()
    .prepare(SQL_UPDATE_OWNED)
    .bind(JSON.stringify(map), map.title, nowSec(), id, userId)
    .run();
  return (res.meta.changes ?? 0) > 0;
}

/** Rename both the summary column and the root title inside the stored map. */
export async function renameOwned(id: string, userId: string, title: string): Promise<boolean> {
  const found = await getDb()
    .prepare(`select data from maps where id = ?1 and user_id = ?2`)
    .bind(id, userId)
    .first<{ data: string }>();
  if (!found) return false;
  let parsed: ReturnType<typeof mindMapSchema.safeParse>;
  try {
    parsed = mindMapSchema.safeParse(JSON.parse(found.data));
  } catch {
    return false;
  }
  if (!parsed.success) return false;
  const root = parsed.data.nodes.find((node) => node.parentId === null);
  const map: MindMap = {
    ...parsed.data,
    title,
    nodes: parsed.data.nodes.map((node) => (node.id === root?.id ? { ...node, title } : node)),
  };
  return updateOwned(id, userId, map);
}

export async function setPublicOwned(
  id: string,
  userId: string,
  isPublic: boolean,
): Promise<{ shareSlug: string | null; isPublic: boolean } | null> {
  const db = getDb();
  const existing = await db
    .prepare(`select share_slug from maps where id = ?1 and user_id = ?2`)
    .bind(id, userId)
    .first<{ share_slug: string | null }>();
  if (!existing) return null;

  // 首次公开才生成 slug；取消公开后保留，再次分享时链接不变
  const slug = existing.share_slug ?? (isPublic ? randomSlug() : null);
  await db
    .prepare(SQL_SET_PUBLIC_OWNED)
    .bind(isPublic ? 1 : 0, slug, nowSec(), id, userId)
    .run();
  return { shareSlug: slug, isPublic };
}

export async function deleteOwned(id: string, userId: string): Promise<boolean> {
  const res = await getDb().prepare(SQL_DELETE_OWNED).bind(id, userId).run();
  return (res.meta.changes ?? 0) > 0;
}

/** 10 位 URL 安全随机串，用 crypto 而不是 Math.random，避免可预测导致分享链接被枚举 */
function randomSlug(): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}
