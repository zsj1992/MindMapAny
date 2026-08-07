import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { ExtractError } from './types';

/**
 * 抓取任意用户 URL = 把服务端当成代理，必须挡 SSRF。
 * 关键点：不能只校验字符串，要把域名解析成 IP 再判断，
 * 否则攻击者用一个解析到 169.254.169.254 的域名就绕过去了。
 */

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
const ALLOWED_PORTS = new Set(['', '80', '443', '8080', '8443']);
export const FETCH_TIMEOUT_MS = 15_000;
export const MAX_HTML_BYTES = 5 * 1024 * 1024;
export const MAX_REDIRECTS = 3;

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

function ipv6IsPrivate(ip: string): boolean {
  const v = ip.toLowerCase();
  if (v === '::' || v === '::1') return true;
  if (v.startsWith('fe80') || v.startsWith('fc') || v.startsWith('fd')) return true;
  // IPv4-mapped，如 ::ffff:127.0.0.1
  const mapped = v.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return ipv4IsPrivate(mapped[1]);
  return false;
}

export function ipIsPrivate(ip: string): boolean {
  const v = isIP(ip);
  if (v === 4) return ipv4IsPrivate(ip);
  if (v === 6) return ipv6IsPrivate(ip);
  return true;
}

/** 校验单个 URL：协议、端口、DNS 解析后的所有 IP 都必须是公网 */
export async function assertPublicUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new ExtractError('blocked_url', 'URL 格式无效');
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    throw new ExtractError('blocked_url', '仅支持 http / https 链接');
  }
  if (!ALLOWED_PORTS.has(url.port)) {
    throw new ExtractError('blocked_url', '不允许访问该端口');
  }
  if (url.username || url.password) {
    throw new ExtractError('blocked_url', 'URL 不允许携带凭据');
  }

  const host = url.hostname.replace(/^\[|\]$/g, '');
  if (isIP(host)) {
    if (ipIsPrivate(host)) throw new ExtractError('blocked_url', '不允许访问内网地址');
    return url;
  }
  if (/^(localhost|.*\.local|.*\.internal)$/i.test(host)) {
    throw new ExtractError('blocked_url', '不允许访问内网地址');
  }

  let records: { address: string }[];
  try {
    records = await lookup(host, { all: true });
  } catch {
    throw new ExtractError('fetch_failed', '域名解析失败');
  }
  if (!records.length || records.some((r) => ipIsPrivate(r.address))) {
    throw new ExtractError('blocked_url', '该域名指向内网地址');
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
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; MapAnyBot/0.1; +https://mindmapany.com/bot)',
          accept: 'text/html,application/xhtml+xml',
        },
      });
    } catch {
      throw new ExtractError('fetch_failed', '页面抓取失败或超时');
    } finally {
      clearTimeout(timer);
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) throw new ExtractError('fetch_failed', '跳转地址缺失');
      current = new URL(location, url).toString();
      continue;
    }
    if (!res.ok) {
      const hint = res.status === 403 || res.status === 401 ? '（页面可能需要登录或有反爬保护）' : '';
      throw new ExtractError('fetch_failed', `页面返回 ${res.status}${hint}`);
    }

    const ctype = res.headers.get('content-type') ?? '';
    if (!/text\/html|application\/xhtml/i.test(ctype)) {
      throw new ExtractError('unsupported', '该链接不是网页内容');
    }
    const len = Number(res.headers.get('content-length') ?? 0);
    if (len > MAX_HTML_BYTES) throw new ExtractError('too_large', '页面体积过大');

    const html = await readCapped(res);
    return { url: url.toString(), html };
  }
  throw new ExtractError('fetch_failed', '跳转次数过多');
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
      throw new ExtractError('too_large', '页面体积过大');
    }
    out += decoder.decode(value, { stream: true });
  }
  return out + decoder.decode();
}
