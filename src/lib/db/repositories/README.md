# 数据访问层

**这个目录是权限的唯一执行点。**

Postgres 版本靠 RLS（行级安全）在数据库层强制「只能看自己的数据」——不管谁发什么 SQL，
数据库都会自动追加 `where user_id = 当前用户`，应用代码绕不过去。

D1 是 SQLite，**没有 RLS**。所以这一层是替代品，靠三条约束：

1. **`userId` 是必填位置参数**，不是 options 里的可选字段 —— 忘了传就是类型错误
2. **函数名自带权限语义**：`getOwnedOrPublic` / `listOwned` / `updateOwned`，没有裸的 `findById`
3. **过滤条件写死在 SQL 里**，调用方无法覆盖

再加一条构建期强制：`eslint.config.mjs` 里禁止本目录之外 import `@/lib/db/client`，
谁绕过谁构建失败。

## 改这里的时候

任何新增的查询，**先问一句「未登录的人调用它会看到什么」**。
答案必须是「什么都看不到」或「只有公开数据」，没有第三种。

越权测试在 `src/lib/db/authz.test.ts`，对应原先 Supabase 那 14 项 RLS 检查。
