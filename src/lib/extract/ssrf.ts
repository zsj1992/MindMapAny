import { ExtractError } from './types';

/**
 * 抓取任意用户 URL = 把服务端当成代理，必须挡 SSRF。
 * 关键点：不能只校验字符串，要把域名解析成 IP 再判断，
 * 否则攻击者用一个解析到 169.254.169.254 的域名就绕过去了。
 *
 * 域名解析走 DoH 而不是 node:dns —— Cloudflare Workers 没有 node:dns，
 * 实测在 workerd 上解析结果会被误判成内网，导致所有网页抓取失败。
 * DoH 是纯 HTTP 调用，Node 和 Workers 两端同一套代码。
 */

const DOH_ENDPOINT = process.env.DOH_ENDPOINT ?? 'https://cloudflare-dns.com/dns-query';
const DOH_TIMEOUT_MS = 5_000;

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
const ALLOWED_PORTS = new Set(['', '80', '443', '8080', '8443']);
export const FETCH_TIMEOUT_MS = 15_000;
export const MAX_HTML_BYTES = 5 * 1024 * 1024;
export const MAX_REDIRECTS = 3;

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (compatible; MapAnyBot/0.1; +https://mindmapany.com/bot)';
const WECHAT_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.59 NetType/WIFI Language/zh_CN';

/**
 * 公众号会把明显的服务端爬虫标识跳转到验证码页，但同一篇公开文章会向
 * 微信移动端浏览器返回服务端渲染的正文。只对微信官方域名使用该标识，
 * 避免影响普通网站，也不携带用户 Cookie 或任何登录凭据。
 */
export function requestHeaders(url: URL): Record<string, string> {
  if (url.hostname.toLowerCase() === 'mp.weixin.qq.com') {
    return {
      'user-agent': WECHAT_USER_AGENT,
      accept: 'text/html,application/xhtml+xml',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.6',
      referer: 'https://mp.weixin.qq.com/',
    };
  }

  return {
    'user-agent': DEFAULT_USER_AGENT,
    accept: 'text/html,application/xhtml+xml',
  };
}

function ipv4IsPrivate(ip: string): boolean {
  const p = ip.split('.').map(Number);
  if (p.length !== 4 || p.some((n) => Number.isNaN(n))) return true;
  const [a, b] = p;
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true; // 云元数据服务
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a >= 224) return true; // 组播 / 保留
  return false;
}

function parseIpv6(ip: string): number[] | null {
  const value = ip.toLowerCase();
  if (!/^[0-9a-f:]+$/.test(value) || (value.match(/::/g)?.length ?? 0) > 1) return null;

  const [leftRaw, rightRaw] = value.split('::');
  const parseSide = (side: string | undefined): number[] | null => {
    if (!side) return [];
    const parts = side.split(':');
    if (parts.some((part) => !/^[0-9a-f]{1,4}$/.test(part))) return null;
    return parts.map((part) => Number.parseInt(part, 16));
  };
  const left = parseSide(leftRaw);
  const right = parseSide(rightRaw);
  if (!left || !right) return null;

  if (value.includes('::')) {
    const missing = 8 - left.length - right.length;
    if (missing < 1) return null;
    return [...left, ...Array<number>(missing).fill(0), ...right];
  }
  return left.length === 8 ? left : null;
}

function ipv6IsPrivate(ip: string): boolean {
  const words = parseIpv6(ip);
  if (!words) return true;
  const [first] = words;

  // 未指定、回环、ULA(fc00::/7)、链路本地(fe80::/10)。
  if (words.every((word) => word === 0)) return true;
  if (words.slice(0, 7).every((word) => word === 0) && words[7] === 1) return true;
  if ((first & 0xfe00) === 0xfc00 || (first & 0xffc0) === 0xfe80) return true;

  // IPv4-mapped / IPv4-compatible。URL 会把点分形式规范化为两个十六进制 word。
  const mapped = words.slice(0, 5).every((word) => word === 0) && words[5] === 0xffff;
  const compatible = words.slice(0, 6).every((word) => word === 0);
  if (mapped || compatible) {
    const ipv4 = `${words[6] >> 8}.${words[6] & 0xff}.${words[7] >> 8}.${words[7] & 0xff}`;
    return ipv4IsPrivate(ipv4);
  }
  return false;
}

/** 自己判断 IP 版本，不依赖 node:net —— Workers 上不保证有 */
export function ipVersion(value: string): 0 | 4 | 6 {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(value)) {
    return value.split('.').every((p) => Number(p) <= 255) ? 4 : 0;
  }
  if (value.includes(':') && parseIpv6(value)) return 6;
  return 0;
}

export function ipIsPrivate(ip: string): boolean {
  const v = ipVersion(ip);
  if (v === 4) return ipv4IsPrivate(ip);
  if (v === 6) return ipv6IsPrivate(ip);
  return true;
}

interface DohAnswer {
  type: number;
  data: string;
}

/**
 * 用 DoH 查 A 和 AAAA。两条都查是必须的：
 * 只查 A 的话，攻击者用一个只有 AAAA 记录且指向内网的域名就能绕过。
 */
async function resolveHost(host: string): Promise<string[]> {
  const query = async (type: 'A' | 'AAAA'): Promise<string[]> => {
    const url = `${DOH_ENDPOINT}?name=${encodeURIComponent(host)}&type=${type}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), DOH_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        headers: { accept: 'application/dns-json' },
        signal: controller.signal,
      });
      if (!res.ok) return [];
      const body = (await res.json()) as { Answer?: DohAnswer[] };
      // type 1 = A，28 = AAAA；CNAME(5) 等中间记录直接忽略
      return (body.Answer ?? [])
        .filter((a) => a.type === 1 || a.type === 28)
        .map((a) => a.data);
    } catch {
      return [];
    } finally {
      clearTimeout(timer);
    }
  };

  const [v4, v6] = await Promise.all([query('A'), query('AAAA')]);
  return [...v4, ...v6];
}

/** 校验单个 URL：协议、端口、DNS 解析后的所有 IP 都必须是公网 */
export async function assertPublicUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new ExtractError('blocked_url', 'Invalid URL format');
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    throw new ExtractError('blocked_url', 'Only http and https links are supported');
  }
  if (!ALLOWED_PORTS.has(url.port)) {
    throw new ExtractError('blocked_url', 'That port is not allowed');
  }
  if (url.username || url.password) {
    throw new ExtractError('blocked_url', 'URLs may not carry credentials');
  }

  const host = url.hostname.replace(/^\[|\]$/g, '');
  if (ipVersion(host) !== 0) {
    if (ipIsPrivate(host)) throw new ExtractError('blocked_url', 'Private network addresses are not allowed');
    return url;
  }
  if (/^(localhost|.*\.local|.*\.internal)$/i.test(host)) {
    throw new ExtractError('blocked_url', 'Private network addresses are not allowed');
  }

  const addresses = await resolveHost(host);
  if (!addresses.length) {
    throw new ExtractError('fetch_failed', 'Could not resolve the domain');
  }
  // 只要有任何一条记录指向内网就整体拒绝，不做部分放行
  if (addresses.some(ipIsPrivate)) {
    throw new ExtractError('blocked_url', 'That domain resolves to a private network address');
  }
  return url;
}

/**
 * 安全抓取：手动跟随跳转，每一跳都重新做 SSRF 校验
 * （redirect: 'follow' 会让公网域名 302 到内网，是常见绕过手法）。
 */
export async function safeFetchHtml(raw: string): Promise<{ url: string; html: string }> {
  let current = raw;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const url = await assertPublicUrl(current);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(url, {
        redirect: 'manual',
        signal: controller.signal,
        headers: requestHeaders(url),
      });
    } catch {
      throw new ExtractError('fetch_failed', 'Fetching the page failed or timed out');
    } finally {
      clearTimeout(timer);
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) throw new ExtractError('fetch_failed', 'The redirect had no target');
      current = new URL(location, url).toString();
      continue;
    }
    if (!res.ok) {
      const hint = res.status === 403 || res.status === 401 ? ' (the page may require a login or have anti-bot protection)' : '';
      throw new ExtractError('fetch_failed', `The page returned ${res.status}${hint}`);
    }

    const ctype = res.headers.get('content-type') ?? '';
    if (!/text\/html|application\/xhtml/i.test(ctype)) {
      throw new ExtractError('unsupported', 'That link is not a web page');
    }
    const len = Number(res.headers.get('content-length') ?? 0);
    if (len > MAX_HTML_BYTES) throw new ExtractError('too_large', 'The page is too large');

    const html = await readCapped(res);
    return { url: url.toString(), html };
  }
  throw new ExtractError('fetch_failed', 'Too many redirects');
}

/** content-length 可能缺失，读流时再兜一次大小上限 */
async function readCapped(res: Response): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return res.text();
  const decoder = new TextDecoder();
  let out = '';
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_HTML_BYTES) {
      await reader.cancel();
      throw new ExtractError('too_large', 'The page is too large');
    }
    out += decoder.decode(value, { stream: true });
  }
  return out + decoder.decode();
}
