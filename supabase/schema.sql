-- MapAny 数据库结构
-- 所有表开 RLS：这是唯一防线，API 层的过滤条件不算数（一个漏写的 .eq('user_id') 就是全库泄漏）。

create extension if not exists "pgcrypto";

-- ─────────────────────────── 用户档案与配额 ───────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free','basic','pro','unlimited')),
  credits integer not null default 30,
  credits_reset_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "own profile read" on profiles
  for select using (auth.uid() = id);
create policy "own profile update" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- 注册即建档，避免应用层忘了初始化导致 credits 为空
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─────────────────────────── 脑图 ───────────────────────────
create table if not exists maps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  -- MindMap 全量 JSON，前端编辑后整份覆盖。MVP 阶段不做节点级增量。
  data jsonb not null,
  source_kind text not null check (source_kind in ('text','pdf','web','youtube')),
  source_url text,
  language text not null default 'zh-CN',
  depth text not null default 'standard',
  purpose text not null default 'general',
  -- 分享页地址用它，比暴露自增 id 或 uuid 好看且不可枚举
  share_slug text unique,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists maps_user_updated_idx on maps (user_id, updated_at desc);
create index if not exists maps_public_idx on maps (share_slug) where is_public;

alter table maps enable row level security;

create policy "own maps full access" on maps
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- 公开图任何人可读（含未登录），分享链接靠这条策略生效
create policy "public maps readable" on maps
  for select using (is_public = true);

-- ─────────────────────────── 生成任务记录 ───────────────────────────
-- 既是排障依据，也是"生成成功率"这个核心指标的数据源。
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  map_id uuid references maps(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','running','succeeded','failed')),
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
  -- 解析器产出的 warnings，用来监控生成质量退化
  warnings jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists jobs_user_created_idx on jobs (user_id, created_at desc);
create index if not exists jobs_status_idx on jobs (status, created_at desc);

alter table jobs enable row level security;
create policy "own jobs read" on jobs
  for select using (auth.uid() = user_id);

-- ─────────────────────────── 内容缓存 ───────────────────────────
-- 同一份 PDF / 同一个视频重复生成时直接命中，省掉解析和模型调用。
create table if not exists content_cache (
  content_hash text primary key,
  source_kind text not null,
  title text,
  blocks jsonb not null,
  created_at timestamptz not null default now()
);

alter table content_cache enable row level security;
-- 只有 service role 能读写，普通用户无权直接访问他人上传的内容
create policy "no direct access" on content_cache for select using (false);

create or replace function touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists maps_touch_updated_at on maps;
create trigger maps_touch_updated_at
  before update on maps
  for each row execute function touch_updated_at();
