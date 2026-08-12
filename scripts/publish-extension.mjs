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
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';

const ITEM_ID = 'fhbmomjeiofpapgjpdafmoddicpfilmf';
const SCOPE = 'https://www.googleapis.com/auth/chromewebstore';
const ZIP = join(process.cwd(), 'dist', 'mindmapany-chrome-extension.zip');
const PORT = 8976;

const { CWS_CLIENT_ID: CLIENT_ID, CWS_CLIENT_SECRET: CLIENT_SECRET, CWS_REFRESH_TOKEN: REFRESH_TOKEN } = process.env;

const command = process.argv[2];
if (!CLIENT_ID || !CLIENT_SECRET) fail('缺少 CWS_CLIENT_ID / CWS_CLIENT_SECRET');

if (command === 'auth') await auth();
else if (command === 'upload') await run(false);
else if (command === 'publish') await run(true);
else fail('用法: publish-extension.mjs auth|upload|publish');

/** 一次性拿 refresh token：本地起个回调端口，用户在自己浏览器里点同意 */
async function auth() {
  const redirect = `http://localhost:${PORT}`;
  const url = new URL('https://accounts.google.com/o/oauth2/auth');
  url.search = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirect,
    response_type: 'code',
    scope: SCOPE,
    // 只有 offline + consent 才会发 refresh token，少一个都拿不到
    access_type: 'offline',
    prompt: 'consent',
  }).toString();

  console.log('\n在浏览器里打开这个地址并点「允许」：\n');
  console.log(url.toString());
  console.log('\n等待授权回调…');

  const code = await new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const params = new URL(req.url, redirect).searchParams;
      const received = params.get('code');
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end(`<h2>${received ? '授权完成，回到终端。' : '授权失败：' + params.get('error')}</h2>`);
      server.close();
      if (received) resolve(received);
      else reject(new Error(params.get('error') ?? 'no_code'));
    });
    server.listen(PORT);
    setTimeout(() => { server.close(); reject(new Error('等待授权超时')); }, 300_000);
  });

  const token = await post('https://oauth2.googleapis.com/token', {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirect,
  });
  if (!token.refresh_token) fail(`没拿到 refresh token：${JSON.stringify(token)}`);
  console.log('\n把这行加进 .env.local：\n');
  console.log(`CWS_REFRESH_TOKEN=${token.refresh_token}\n`);
}

async function run(alsoPublish) {
  if (!REFRESH_TOKEN) fail('缺少 CWS_REFRESH_TOKEN，先跑一次 `auth`');
  const zip = await readFile(ZIP).catch(() => fail(`找不到 ${ZIP}，先跑 npm run extension:build`));
  const { version } = JSON.parse(await readFile(join(process.cwd(), 'extension', 'manifest.json'), 'utf8'));

  const { access_token: accessToken } = await post('https://oauth2.googleapis.com/token', {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: REFRESH_TOKEN,
    grant_type: 'refresh_token',
  });
  if (!accessToken) fail('刷新 access token 失败');

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

async function post(url, body) {
  return json(url, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body).toString(),
  });
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
