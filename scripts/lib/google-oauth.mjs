import { createServer } from 'node:http';

/**
 * 桌面应用式的 OAuth：本地起一个回调端口，用户在自己浏览器里点同意。
 *
 * 发布扩展和拉 GSC 数据都要走这一套，所以放在这里共用。
 */

const TOKEN_URL = 'https://oauth2.googleapis.com/token';

/** 换一次性的授权码，再换成长期可用的 refresh token */
export async function authorize({ clientId, clientSecret, scope, port = 8976 }) {
  const redirect = `http://localhost:${port}`;
  const url = new URL('https://accounts.google.com/o/oauth2/auth');
  url.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirect,
    response_type: 'code',
    scope,
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
      res.end(`<h2>${received ? '授权完成，回到终端。' : `授权失败：${params.get('error')}`}</h2>`);
      server.close();
      if (received) resolve(received);
      else reject(new Error(params.get('error') ?? 'no_code'));
    });
    server.listen(port);
    setTimeout(() => {
      server.close();
      reject(new Error('等待授权超时'));
    }, 300_000);
  });

  const token = await form(TOKEN_URL, {
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirect,
  });
  if (!token.refresh_token) {
    throw new Error(`没拿到 refresh token：${JSON.stringify(token)}`);
  }
  return token.refresh_token;
}

export async function accessTokenFromRefresh({ clientId, clientSecret, refreshToken }) {
  const token = await form(TOKEN_URL, {
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });
  if (!token.access_token) throw new Error(`刷新 access token 失败：${JSON.stringify(token)}`);
  return token.access_token;
}

async function form(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body).toString(),
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${res.status} 返回了非 JSON：${text.slice(0, 300)}`);
  }
}
