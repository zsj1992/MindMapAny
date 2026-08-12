/**
 * 把扩展包推到 Chrome 应用商店。
 *
 *   node scripts/publish-extension.mjs auth      # 一次性：换取 refresh token
 *   node scripts/publish-extension.mjs upload    # 传包（不提审）
 *   node scripts/publish-extension.mjs publish   # 传包并提交审核
 *
 * 为什么不用浏览器自动化：Chrome 在内核层禁止扩展操作应用商店域名，
 * 而绕开它的两条路（读 cookie 库、给真实 profile 开远程调试端口）都等于
 * 把整个 Google 会话交出去。官方 API 不需要碰任何一样东西。
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import { accessTokenFromRefresh, authorize } from './lib/google-oauth.mjs';

const ITEM_ID = 'fhbmomjeiofpapgjpdafmoddicpfilmf';
const SCOPE = 'https://www.googleapis.com/auth/chromewebstore';
const ZIP = join(process.cwd(), 'dist', 'mindmapany-chrome-extension.zip');

const { CWS_CLIENT_ID: CLIENT_ID, CWS_CLIENT_SECRET: CLIENT_SECRET, CWS_REFRESH_TOKEN: REFRESH_TOKEN } = process.env;

const command = process.argv[2];
if (!CLIENT_ID || !CLIENT_SECRET) fail('缺少 CWS_CLIENT_ID / CWS_CLIENT_SECRET');

if (command === 'auth') await auth();
else if (command === 'upload') await run(false);
else if (command === 'publish') await run(true);
else fail('用法: publish-extension.mjs auth|upload|publish');

async function auth() {
  const token = await authorize({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET, scope: SCOPE });
  console.log('\n把这行加进 .env.local：\n');
  console.log(`CWS_REFRESH_TOKEN=${token}\n`);
}

async function run(alsoPublish) {
  if (!REFRESH_TOKEN) fail('缺少 CWS_REFRESH_TOKEN，先跑一次 `auth`');
  const zip = await readFile(ZIP).catch(() => fail(`找不到 ${ZIP}，先跑 npm run extension:build`));
  const { version } = JSON.parse(await readFile(join(process.cwd(), 'extension', 'manifest.json'), 'utf8'));

  const accessToken = await accessTokenFromRefresh({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
  });

  const headers = { authorization: `Bearer ${accessToken}`, 'x-goog-api-version': '2' };

  console.log(`上传 ${version} (${(zip.length / 1024).toFixed(1)} KB)…`);
  const upload = await json(
    `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${ITEM_ID}`,
    { method: 'PUT', headers, body: zip },
  );
  // uploadState 为 FAILURE 时 HTTP 仍是 200，只看状态码会把失败当成功
  if (upload.uploadState !== 'SUCCESS') fail(`上传失败：${JSON.stringify(upload.itemError ?? upload)}`);
  console.log('上传成功。');

  if (!alsoPublish) return;
  console.log('提交审核…');
  const published = await json(
    `https://www.googleapis.com/chromewebstore/v1.1/items/${ITEM_ID}/publish`,
    { method: 'POST', headers: { ...headers, 'content-length': '0' } },
  );
  console.log(`状态：${(published.status ?? []).join(', ') || JSON.stringify(published)}`);
}

async function json(url, init) {
  const res = await fetch(url, init);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    fail(`${res.status} 返回了非 JSON：${text.slice(0, 300)}`);
  }
}

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}
