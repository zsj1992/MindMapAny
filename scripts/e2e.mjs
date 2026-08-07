/**
 * 端到端验证：注册 → 登录回调 → 生成 → 保存 → 公开分享 → 匿名访问 → 记账扣分
 *   set -a && source .env.local && set +a && node scripts/e2e.mjs
 * 会创建并删除一个临时账号，跑完不留数据。
 */
/* 端到端：注册 → 生成脑图 → 保存 → 开公开链接 → 退出后匿名访问分享页 */
import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

const URL = 'https://tvcdkeutbjadqjzupbin.supabase.co';
const admin = createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const email = `e2e-${Date.now()}@example.com`;
const password = 'E2e!' + Math.random().toString(36).slice(2, 10);

const step = (ok, name, d = '') => console.log(`${ok ? '✓' : '✗'} ${name}${d ? '  ' + d : ''}`);

const { data: created, error: cErr } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
step(!cErr, '创建测试账号', email);
const uid = created?.user?.id;

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();

// 走真实的魔法链接回调流程：既拿到 session，也顺便验证 /auth/callback
const { data: link, error: lErr } = await admin.auth.admin.generateLink({
  type: 'magiclink',
  email,
  options: { redirectTo: 'http://localhost:3000/auth/callback' },
});
step(!lErr, '生成魔法链接', lErr?.message ?? '');

// 用 token_hash 走服务端回调（Supabase SSR 官方推荐形态）
const cbUrl = `http://localhost:3000/auth/callback?token_hash=${link.properties.hashed_token}&type=magiclink&next=/app/maps`;
const resp = await p.goto(cbUrl, { waitUntil: 'networkidle' });
step(!p.url().includes('error'), '★ /auth/callback 换取 session', p.url());

await p.goto('http://localhost:3000/app/text', { waitUntil: 'networkidle' });
const header = await p.textContent('header').catch(() => '');
step(!header.includes('登录'), '顶栏显示已登录状态', header.replace(/\s+/g, ' ').slice(0, 60));

await p.getByRole('button', { name: /示例|试试/ }).first().click().catch(() => {});
await p.locator('textarea').fill('人工智能的三个主要分支是机器学习、自然语言处理和计算机视觉。机器学习又分为监督学习、无监督学习和强化学习。监督学习需要标注数据，常见算法包括线性回归和决策树。无监督学习不需要标签，典型任务是聚类和降维。');
await p.getByRole('button', { name: '生成脑图' }).click();
await p.waitForSelector('.react-flow__node', { timeout: 180000 });
const nodes = await p.locator('.react-flow__node').count();
step(nodes > 3, '生成脑图', `${nodes} 个可见节点`);

await p.getByRole('button', { name: /^保存/ }).click();
await p.waitForTimeout(3000);
const { data: saved } = await admin.from('maps').select('id,title,share_slug,is_public').eq('user_id', uid);
step((saved?.length ?? 0) > 0, '保存到数据库', saved?.[0]?.title ?? '');

await p.getByRole('button', { name: '分享' }).click();
await p.waitForTimeout(3000);
const { data: shared } = await admin.from('maps').select('share_slug,is_public').eq('user_id', uid).single();
step(!!shared?.share_slug && shared.is_public, '生成公开链接', shared?.share_slug ?? '');

// 匿名上下文访问分享页
if (shared?.share_slug) {
  const anonCtx = await b.newContext();
  const ap = await anonCtx.newPage();
  const r = await ap.goto(`http://localhost:3000/m/${shared.share_slug}`, { waitUntil: 'networkidle' });
  const anonNodes = await ap.locator('.react-flow__node').count();
  const hasOutline = (await ap.content()).includes('机器学习');
  step(r?.status() === 200 && anonNodes > 0, '★ 退出登录后匿名可访问分享页', `HTTP ${r?.status()} ${anonNodes} 节点`);
  step(hasOutline, '★ 分享页正文进入 HTML（爬虫可见）');
  await anonCtx.close();
}

const { data: jobs } = await admin.from('jobs').select('status,source_kind,credits_charged,duration_ms').eq('user_id', uid);
step((jobs?.length ?? 0) > 0, '生成任务已记账', JSON.stringify(jobs?.[0] ?? {}));

const { data: prof } = await admin.from('profiles').select('credits').eq('id', uid).single();
step(prof?.credits < 30, '积分已扣除', `剩余 ${prof?.credits}`);

await b.close();
await admin.auth.admin.deleteUser(uid);
console.log('✓ 清理测试账号');
