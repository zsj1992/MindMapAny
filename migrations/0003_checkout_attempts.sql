-- 记录「用户点了购买、被送去 Creem」这一刻。
--
-- 在此之前，用户点击购买之后我们就完全失明了：webhook 只在付款成功时才来，
-- 卡被拒、3DS 没过、看到价格反悔——一律不留痕迹。结果是「有多少人想付钱
-- 但没付成」这个问题在库里根本无法回答，而这恰恰是最该盯的数字。
--
-- 只存决策所需：谁、买什么、什么时候。不存金额（价格由 product 决定，
-- 会变；真实成交金额以 Creem 为准），不存任何支付信息。
create table if not exists checkout_attempts (
  id text primary key,
  user_id text not null references user(id) on delete cascade,
  plan text not null,
  period text not null,
  created_at integer not null default (unixepoch())
);

-- 对账用：按时间取一段，和 billing_events 比完成率
create index if not exists idx_checkout_attempts_created on checkout_attempts (created_at);
create index if not exists idx_checkout_attempts_user on checkout_attempts (user_id, created_at);
