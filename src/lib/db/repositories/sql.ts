/**
 * 带权限语义的 SQL 片段。
 *
 * 单独抽出来只有一个目的：让越权测试跑的是**和线上一模一样的 SQL**。
 * 如果测试自己抄一份，改了实现忘了改测试，测试就变成了自欺欺人 ——
 * 而这几条正是 RLS 的替代品，是全站唯一的数据边界。
 *
 * 改动这里的任何一条，先去 scripts/authz-test.mjs 确认对应断言还成立。
 */

/** 列出自己的图 */
export const SQL_LIST_OWNED = `select id, title, source_kind, share_slug, is_public, updated_at
   from maps where user_id = ?1
  order by updated_at desc limit ?2`;

/** 读单张图：自己的，或者已公开的。等价于原 Postgres 版那两条 RLS 策略。 */
export const SQL_GET_OWNED_OR_PUBLIC = `select * from maps where id = ?1 and (is_public = 1 or user_id = ?2)`;

/** 分享页：只认公开图，不接受身份参数 */
export const SQL_GET_PUBLIC_BY_SLUG = `select * from maps where share_slug = ?1 and is_public = 1`;

/** 更新必须带 user_id —— 漏了它就是"任何人能改任何人的图" */
export const SQL_UPDATE_OWNED = `update maps set data = ?1, title = ?2, updated_at = ?3 where id = ?4 and user_id = ?5`;

export const SQL_SET_PUBLIC_OWNED = `update maps set is_public = ?1, share_slug = ?2, updated_at = ?3 where id = ?4 and user_id = ?5`;

export const SQL_DELETE_OWNED = `delete from maps where id = ?1 and user_id = ?2`;
