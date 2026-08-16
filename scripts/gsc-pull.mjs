/**
 * 拉 Search Console 数据，落成快照 + 一份能直接看的报告。
 *
 *   node scripts/gsc-pull.mjs            # 最近 28 天
 *   node scripts/gsc-pull.mjs --days 90
 *   node scripts/gsc-pull.mjs auth       # OAuth 方式的一次性授权
 *
 * 两种认证都支持，优先服务账号：
 *
 *   服务账号（首选）  GSC_SA_EMAIL + GSC_SA_PRIVATE_KEY
 *     适合无人值守。但 Google 现在对新组织默认打开
 *     iam.disableServiceAccountKeyCreation，建不出密钥就只能走下面那条。
 *
 *   OAuth（兜底）    GSC_CLIENT_ID + GSC_CLIENT_SECRET + GSC_REFRESH_TOKEN
 *     注意同意屏必须发布为「生产」。留在「测试」状态的话
 *     refresh token 七天就失效，定时任务会莫名其妙断掉。
 */
import { createSign } from 'node:crypto';
import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import { accessTokenFromRefresh, authorize } from './lib/google-oauth.mjs';

const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const OUT_DIR = join(process.cwd(), 'docs', 'seo', 'data');
const SITE = 'mindmapany.com';
const DIMENSIONS = ['query', 'page', 'country', 'device'];
const PAGE_SIZE = 25_000;

const days = Number(argValue('--days') ?? 28);
const email = process.env.GSC_SA_EMAIL;
const privateKey = process.env.GSC_SA_PRIVATE_KEY?.replace(/\\n/g, '\n');
let { GSC_CLIENT_ID: clientId, GSC_CLIENT_SECRET: clientSecret, GSC_REFRESH_TOKEN: refreshToken } = process.env;

const clientJsonPath = argValue('--client-json');
if (clientJsonPath) {
  const credentials = JSON.parse(await readFile(clientJsonPath, 'utf8'));
  const client = credentials.installed ?? credentials.web;
  if (!client?.client_id || !client?.client_secret) die('OAuth 客户端 JSON 缺少 client_id / client_secret');
  clientId = client.client_id;
  clientSecret = client.client_secret;
}

if (process.argv[2] === 'auth') {
  if (!clientId || !clientSecret) die('缺少 GSC_CLIENT_ID / GSC_CLIENT_SECRET');
  const issued = await authorize({ clientId, clientSecret, scope: SCOPE });
  if (process.argv.includes('--write-env')) {
    await upsertEnv('.env.local', {
      GSC_CLIENT_ID: clientId,
      GSC_CLIENT_SECRET: clientSecret,
      GSC_REFRESH_TOKEN: issued,
    });
    console.log('\nOAuth 凭据已安全写入 .env.local。\n');
  } else {
    console.log('\n把这行加进 .env.local：\n');
    console.log(`GSC_REFRESH_TOKEN=${issued}\n`);
  }
  process.exit(0);
}

const token = await accessToken();
const site = await resolveSite(token);
console.log(`站点：${site}`);

// GSC 数据有 2–3 天延迟，拉到昨天只会得到一段假的下跌尾巴
const end = daysAgo(3);
const start = daysAgo(3 + days);
console.log(`区间：${start} → ${end}`);

const rows = await queryAll(token, site, start, end);
console.log(`拿到 ${rows.length} 行`);

await mkdir(OUT_DIR, { recursive: true });
const stamp = end;
const basename = `gsc-${days}d-${stamp}`;
await writeFile(join(OUT_DIR, `${basename}.json`), JSON.stringify({ site, start, end, days, rows }, null, 2));
await writeFile(join(OUT_DIR, `${basename}.csv`), toCsv(rows));
await writeFile(join(OUT_DIR, `${basename}.md`), report(rows, site, start, end));
console.log(`\n写入 docs/seo/data/${basename}.{json,csv,md}`);

// ── 认证 ──

async function accessToken() {
  if (clientId && clientSecret && refreshToken) {
    return accessTokenFromRefresh({ clientId, clientSecret, refreshToken });
  }
  if (!email || !privateKey) {
    die('没有可用的凭据。配服务账号（GSC_SA_EMAIL + GSC_SA_PRIVATE_KEY）或 OAuth（GSC_CLIENT_ID + GSC_CLIENT_SECRET + GSC_REFRESH_TOKEN），见 docs/seo/GSC-SETUP.md');
  }
  const now = Math.floor(Date.now() / 1000);
  const claim = { iss: email, scope: SCOPE, aud: 'https://oauth2.googleapis.com/token', exp: now + 3600, iat: now };
  const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64(claim)}`;
  const signature = createSign('RSA-SHA256').update(unsigned).end().sign(privateKey).toString('base64url');

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }).toString(),
  });
  const body = await res.json();
  if (!body.access_token) die(`换取 token 失败：${JSON.stringify(body)}`);
  return body.access_token;
}

/**
 * 域名属性（sc-domain:）和网址前缀属性（https://）是两个不同的东西，
 * 猜错就是 403。直接问一遍有权限的站点列表，比让人去填对格式可靠。
 */
async function resolveSite(accessTokenValue) {
  const res = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: { authorization: `Bearer ${accessTokenValue}` },
  });
  const body = await res.json();
  if (!res.ok) die(`读取站点列表失败：${JSON.stringify(body)}`);
  const entries = (body.siteEntry ?? []).map((entry) => entry.siteUrl);
  if (!entries.length) {
    die(
      email
        ? `服务账号 ${email} 在 Search Console 里还没有任何站点权限。\n  到 GSC → 设置 → 用户和权限，把它添加为用户。`
        : '这个账号在 Search Console 里没有任何站点。确认授权时用的是拥有 mindmapany.com 的那个 Google 账号。',
    );
  }
  const match =
    entries.find((url) => url === `sc-domain:${SITE}`) ??
    entries.find((url) => url.includes(SITE));
  if (!match) die(`没找到 ${SITE}。该账号能访问的是：\n  ${entries.join('\n  ')}`);
  return match;
}

// ── 取数 ──

async function queryAll(accessTokenValue, site, start, end) {
  const all = [];
  for (let startRow = 0; ; startRow += PAGE_SIZE) {
    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: { authorization: `Bearer ${accessTokenValue}`, 'content-type': 'application/json' },
        body: JSON.stringify({ startDate: start, endDate: end, dimensions: DIMENSIONS, rowLimit: PAGE_SIZE, startRow }),
      },
    );
    const body = await res.json();
    if (!res.ok) die(`查询失败：${JSON.stringify(body.error ?? body)}`);
    const page = body.rows ?? [];
    all.push(
      ...page.map((row) => ({
        query: row.keys[0],
        page: row.keys[1],
        country: row.keys[2],
        device: row.keys[3],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
      })),
    );
    if (page.length < PAGE_SIZE) return all;
  }
}

// ── 输出 ──

function toCsv(rows) {
  const head = 'query,page,country,device,clicks,impressions,ctr,position';
  const body = rows.map((r) =>
    [r.query, r.page, r.country, r.device, r.clicks, r.impressions, r.ctr.toFixed(4), r.position.toFixed(1)]
      .map((v) => (typeof v === 'string' && /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v))
      .join(','),
  );
  return [head, ...body].join('\n');
}

function report(rows, site, start, end) {
  if (!rows.length) {
    return `# GSC ${start} → ${end}\n\n站点 \`${site}\` 在这个区间没有任何数据。\n\n刚提交 sitemap 的话这是正常的 —— 从收录到有展现通常要一到几周。\n`;
  }

  const byQuery = group(rows, (r) => r.query);
  const byPage = group(rows, (r) => r.page);
  const totals = sum(rows);

  const lines = [
    `# GSC ${start} → ${end}`,
    '',
    `站点 \`${site}\` · ${rows.length} 行 · ${byQuery.size} 个查询 · ${byPage.size} 个页面`,
    '',
    `**合计**：${totals.clicks} 点击 · ${totals.impressions} 展现 · CTR ${(totals.ctr * 100).toFixed(2)}% · 平均排名 ${totals.position.toFixed(1)}`,
    '',
    '## 展现最多的查询',
    '',
    '| 查询 | 展现 | 点击 | CTR | 排名 |',
    '|---|---:|---:|---:|---:|',
    ...top(byQuery, 25).map(([k, v]) => `| ${k} | ${v.impressions} | ${v.clicks} | ${(v.ctr * 100).toFixed(1)}% | ${v.position.toFixed(1)} |`),
    '',
    '## 表现最好的页面',
    '',
    '| 页面 | 展现 | 点击 | CTR | 排名 |',
    '|---|---:|---:|---:|---:|',
    ...top(byPage, 20).map(([k, v]) => `| ${k.replace(/^https?:\/\/[^/]+/, '')} | ${v.impressions} | ${v.clicks} | ${(v.ctr * 100).toFixed(1)}% | ${v.position.toFixed(1)} |`),
    '',
  ];

  /*
   * 下面两段才是这个脚本真正的用处。
   *
   * 「近在咫尺」是投入产出最高的一档：已经排在第 5–20 名，说明 Google 认为
   * 这一页和这个词相关，只是还差一点。改标题、补内容就可能进前几名 ——
   * 比为一个零展现的新词从头写一页划算得多。
   *
   * 「有展现没点击」则通常不是排名问题，是 title 和 description 没让人想点。
   */
  const near = top(byQuery, Infinity).filter(([, v]) => v.position >= 5 && v.position <= 20 && v.impressions >= 10);
  lines.push('## 近在咫尺（排名 5–20，展现 ≥10）', '', near.length ? '' : '_暂无_', '');
  if (near.length) {
    lines.push('| 查询 | 展现 | 排名 |', '|---|---:|---:|');
    lines.push(...near.slice(0, 20).map(([k, v]) => `| ${k} | ${v.impressions} | ${v.position.toFixed(1)} |`));
    lines.push('');
  }

  const noClicks = top(byQuery, Infinity).filter(([, v]) => v.clicks === 0 && v.impressions >= 20);
  lines.push('## 有展现但零点击（展现 ≥20）', '', noClicks.length ? '' : '_暂无_', '');
  if (noClicks.length) {
    lines.push('| 查询 | 展现 | 排名 |', '|---|---:|---:|');
    lines.push(...noClicks.slice(0, 20).map(([k, v]) => `| ${k} | ${v.impressions} | ${v.position.toFixed(1)} |`));
    lines.push('');
  }

  return lines.join('\n');
}

function group(rows, keyOf) {
  const map = new Map();
  for (const row of rows) {
    const key = keyOf(row);
    const found = map.get(key);
    if (found) found.push(row);
    else map.set(key, [row]);
  }
  return new Map([...map].map(([k, v]) => [k, sum(v)]));
}

/** 排名要按展现加权平均，直接取算术平均会被一堆零展现的长尾拉歪 */
function sum(rows) {
  const clicks = rows.reduce((s, r) => s + r.clicks, 0);
  const impressions = rows.reduce((s, r) => s + r.impressions, 0);
  const position = impressions
    ? rows.reduce((s, r) => s + r.position * r.impressions, 0) / impressions
    : rows.reduce((s, r) => s + r.position, 0) / (rows.length || 1);
  return { clicks, impressions, ctr: impressions ? clicks / impressions : 0, position };
}

function top(map, n) {
  const sorted = [...map].sort((a, b) => b[1].impressions - a[1].impressions);
  return n === Infinity ? sorted : sorted.slice(0, n);
}

// ── 小工具 ──

function b64(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function daysAgo(n) {
  const date = new Date(Date.now() - n * 86_400_000);
  return date.toISOString().slice(0, 10);
}

function argValue(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function upsertEnv(path, values) {
  let source = '';
  try {
    source = await readFile(path, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const lines = source.split(/\r?\n/);
  for (const [key, value] of Object.entries(values)) {
    const encoded = JSON.stringify(value);
    const index = lines.findIndex((line) => line.startsWith(`${key}=`));
    if (index >= 0) lines[index] = `${key}=${encoded}`;
    else lines.push(`${key}=${encoded}`);
  }
  await writeFile(path, `${lines.filter(Boolean).join('\n')}\n`, { mode: 0o600 });
  await chmod(path, 0o600);
}

function die(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}
