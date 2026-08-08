/**
 * 越权测试 —— D1 版本的"RLS 是否生效"检查。
 *
 *   node scripts/authz-test.mjs
 *
 * 跑的是 src/lib/db/repositories/sql.ts 里的同一批 SQL（不是抄一份），
 * 所以实现改了、权限条件漏了，这里会直接红。
 *
 * 对应原 Postgres 版那 14 项 RLS 检查：核心断言是「B 用户拿不到 A 用户的私有图」。
 */
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const DB = 'mindmapany';

// 直接读 TS 源里的 SQL 常量，避免测试和实现各写一份而漂移
const src = readFileSync('src/lib/db/repositories/sql.ts', 'utf8');
const sqlOf = (name) => {
  const m = src.match(new RegExp(`export const ${name} = \`([\\s\\S]*?)\``));
  if (!m) throw new Error(`没找到 SQL 常量 ${name}`);
  return m[1].trim();
};

function d1(sql) {
  const out = execFileSync(
    'npx',
    ['wrangler', 'd1', 'execute', DB, '--local', '--json', '--command', sql],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
  const json = JSON.parse(out.slice(out.indexOf('[')));
  return json[0]?.results ?? [];
}

/** 把 ?n 占位符替成字面量，仅测试用；值都是我们自己造的，不接受外部输入 */
const bind = (sql, ...args) =>
  sql.replace(/\?(\d+)/g, (_, i) => {
    const v = args[Number(i) - 1];
    return typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`;
  });

const results = [];
const check = (name, ok, detail = '') => {
  results.push(ok);
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? '  ' + detail : ''}`);
};

const A = 'authz-user-a';
const B = 'authz-user-b';
const PRIVATE_ID = 'authz-map-private';
const PUBLIC_ID = 'authz-map-public';
const SLUG = 'authzslug01';
const now = Math.floor(Date.now() / 1000);
const DATA = `{"version":1,"title":"t","language":"zh-CN","depth":"standard","purpose":"general","nodes":[],"createdAt":"2026-01-01T00:00:00.000Z"}`;

// ── 准备数据 ──
d1(`delete from maps where id in ('${PRIVATE_ID}','${PUBLIC_ID}')`);
d1(`delete from user where id in ('${A}','${B}')`);
for (const [id, name] of [[A, 'A'], [B, 'B']]) {
  d1(`insert into user (id,name,email,emailVerified,createdAt,updatedAt)
      values ('${id}','${name}','${id}@example.com',1,${now},${now})`);
}
d1(`insert into maps (id,user_id,title,data,source_kind,is_public,created_at,updated_at)
    values ('${PRIVATE_ID}','${A}','A 的私有图','${DATA}','text',0,${now},${now})`);
d1(`insert into maps (id,user_id,title,data,source_kind,share_slug,is_public,created_at,updated_at)
    values ('${PUBLIC_ID}','${A}','A 的公开图','${DATA}','text','${SLUG}',1,${now},${now})`);

// ── 断言 ──
const listOwned = sqlOf('SQL_LIST_OWNED');
const getOwnedOrPublic = sqlOf('SQL_GET_OWNED_OR_PUBLIC');
const getPublicBySlug = sqlOf('SQL_GET_PUBLIC_BY_SLUG');
const updateOwned = sqlOf('SQL_UPDATE_OWNED');
const deleteOwned = sqlOf('SQL_DELETE_OWNED');

check('A 能列出自己的两张图', d1(bind(listOwned, A, 100)).length === 2);
check('B 列不到 A 的任何图', d1(bind(listOwned, B, 100)).length === 0);

check('★ A 能读自己的私有图', d1(bind(getOwnedOrPublic, PRIVATE_ID, A)).length === 1);
check('★ B 读不到 A 的私有图', d1(bind(getOwnedOrPublic, PRIVATE_ID, B)).length === 0);
check('★ 匿名读不到 A 的私有图', d1(bind(getOwnedOrPublic, PRIVATE_ID, ' ')).length === 0);

check('★ B 能读 A 的公开图', d1(bind(getOwnedOrPublic, PUBLIC_ID, B)).length === 1);
check('★ 匿名能读公开图（分享页依赖）', d1(bind(getOwnedOrPublic, PUBLIC_ID, ' ')).length === 1);

check('★ 分享链接能打开公开图', d1(bind(getPublicBySlug, SLUG)).length === 1);
check('私有图没有分享链接可用', d1(bind(getPublicBySlug, 'nonexistent-slug')).length === 0);

// 写操作
d1(bind(updateOwned, DATA, 'B 改的', now + 1, PRIVATE_ID, B));
const afterBadUpdate = d1(`select title from maps where id = '${PRIVATE_ID}'`)[0];
check('★ B 改不了 A 的图', afterBadUpdate?.title === 'A 的私有图', `实际标题=${afterBadUpdate?.title}`);

d1(bind(deleteOwned, PRIVATE_ID, B));
check('★ B 删不掉 A 的图', d1(`select id from maps where id = '${PRIVATE_ID}'`).length === 1);

d1(bind(updateOwned, DATA, 'A 自己改的', now + 2, PRIVATE_ID, A));
check('A 能改自己的图', d1(`select title from maps where id = '${PRIVATE_ID}'`)[0]?.title === 'A 自己改的');

d1(bind(deleteOwned, PRIVATE_ID, A));
check('A 能删自己的图', d1(`select id from maps where id = '${PRIVATE_ID}'`).length === 0);

// ── 清理 ──
d1(`delete from maps where id in ('${PRIVATE_ID}','${PUBLIC_ID}')`);
d1(`delete from user where id in ('${A}','${B}')`);

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} 通过`);
if (passed !== results.length) process.exit(1);
