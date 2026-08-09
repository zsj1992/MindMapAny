-- Production hardening: request throttling, subscription state and idempotent webhook processing.

alter table profiles add column creem_customer_id text;
alter table profiles add column creem_subscription_id text;
alter table profiles add column subscription_status text;
alter table profiles add column plan_updated_at integer;

create unique index if not exists profiles_creem_customer_idx
  on profiles (creem_customer_id) where creem_customer_id is not null;
create unique index if not exists profiles_creem_subscription_idx
  on profiles (creem_subscription_id) where creem_subscription_id is not null;
create index if not exists profiles_email_idx on profiles (lower(email));

create table if not exists rate_limits (
  rate_key text not null,
  window_start integer not null,
  count integer not null default 1,
  expires_at integer not null,
  primary key (rate_key, window_start)
);
create index if not exists rate_limits_expiry_idx on rate_limits (expires_at);

create table if not exists billing_events (
  id text primary key,
  event_type text not null,
  received_at integer not null default (unixepoch())
);
