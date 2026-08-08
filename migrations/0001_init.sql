-- MindMapAny D1 结构（SQLite）
--
-- 与 Postgres 版的关键差异：SQLite 没有行级安全（RLS）。
-- 权限不再由数据库强制，而是收敛到 src/lib/db/repositories/ 一层，
-- 并由 ESLint 禁止其他地方直接拿 DB binding。见该目录下的说明。

-- ─────────── Better Auth 托管的表 ───────────
-- 这四张由 better-auth 的 schema 生成，字段名不能改。

create table if not exists user (
  id text primary key,
  name text not null,
  email text not null unique,
  emailVerified integer not null default 0,
  image text,
  createdAt integer not null,
  updatedAt integer not null
);

create table if not exists session (
  id text primary key,
  expiresAt integer not null,
  token text not null unique,
  createdAt integer not null,
  updatedAt integer not null,
  ipAddress text,
  userAgent text,
  userId text not null references user(id) on delete cascade
);
create index if not exists session_user_idx on session (userId);
create index if not exists session_token_idx on session (token);

create table if not exists account (
  id text primary key,
  accountId text not null,
  providerId text not null,
  userId text not null references user(id) on delete cascade,
  accessToken text,
  refreshToken text,
  idToken text,
  accessTokenExpiresAt integer,
  refreshTokenExpiresAt integer,
  scope text,
  password text,
  createdAt integer not null,
  updatedAt integer not null
);
create index if not exists account_user_idx on account (userId);

create table if not exists verification (
  id text primary key,
  identifier text not null,
  value text not null,
  expiresAt integer not null,
  createdAt integer,
  updatedAt integer
);
create index if not exists verification_identifier_idx on verification (identifier);

-- ─────────── 业务表 ───────────

create table if not exists profiles (
  id text primary key references user(id) on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free','basic','pro','unlimited')),
  credits integer not null default 30,
  credits_reset_at integer not null default (unixepoch()),
  created_at integer not null default (unixepoch())
);

create table if not exists maps (
  id text primary key,
  user_id text not null references user(id) on delete cascade,
  title text not null,
  -- MindMap 全量 JSON，编辑后整份覆盖
  data text not null,
  source_kind text not null check (source_kind in ('text','pdf','web','youtube')),
  source_url text,
  language text not null default 'zh-CN',
  depth text not null default 'standard',
  purpose text not null default 'general',
  -- 分享页地址，不可枚举
  share_slug text unique,
  is_public integer not null default 0,
  created_at integer not null default (unixepoch()),
  updated_at integer not null default (unixepoch())
);
create index if not exists maps_user_updated_idx on maps (user_id, updated_at desc);
create index if not exists maps_share_idx on maps (share_slug) where is_public = 1;

-- 排障依据 + 生成成功率指标来源
create table if not exists jobs (
  id text primary key,
  user_id text references user(id) on delete set null,
  map_id text references maps(id) on delete set null,
  status text not null check (status in ('pending','running','succeeded','failed')),
  source_kind text not null,
  source_url text,
  source_chars integer,
  model_tier text,
  input_tokens integer default 0,
  output_tokens integer default 0,
  credits_charged integer default 0,
  duration_ms integer,
  error_code text,
  error_message text,
  warnings text default '[]',
  created_at integer not null default (unixepoch())
);
create index if not exists jobs_user_created_idx on jobs (user_id, created_at desc);
create index if not exists jobs_status_idx on jobs (status, created_at desc);
