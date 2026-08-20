// Pass A — 候选站点资格核查抓取脚本
// 用法: node scripts/backlink-passa.mjs
// 抓取每个候选提交页，保存 HTML 并输出关键信号（状态码/标题/CAPTCHA/登录/表单关键词）
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'docs', 'seo', 'backlink-campaign', 'evidence');
mkdirSync(OUT, { recursive: true });

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const sites = [
  { id: 'bai',      name: 'bai.tools',                  url: 'https://bai.tools/submit-ai-tools' },
  { id: 'aiai',     name: 'aiai.tools',                 url: 'https://aiai.tools/submit-ai-tool' },
  { id: 'atg',      name: 'aitoolguru.com',             url: 'https://aitoolguru.com/submit-ai-tool' },
  { id: 'nox',      name: 'noxilo.com',                 url: 'https://noxilo.com/submit-tool/' },
  { id: 'aif',      name: 'ai-findr.com',               url: 'https://ai-findr.com/submit' },
  { id: 'aio',      name: 'aioffice.io',                url: 'https://aioffice.io/submit-tool' },
  { id: 'ffz',      name: 'futureforgez.com',           url: 'https://www.futureforgez.com/vendors/listing' },
  { id: 'adv',      name: 'advanced-innovation.io',     url: 'https://www.advanced-innovation.io/ki-tool-einreichen' },
  { id: 'rund',     name: 'supertools.therundown.ai',   url: 'https://supertools.therundown.ai/submit' },
  { id: 'phy',      name: 'library.phygital.plus',      url: 'https://library.phygital.plus/tool-submission' },
];

const CAPTCHA_RE = /captcha|hcaptcha|recaptcha|turnstile|cloudflare|cf-browser|verify/i;
const LOGIN_RE = /\b(sign ?in|log ?in|login|register|create account|auth0|oauth)\b/i;
const FORM_RE = /<form[\s>]/i;

const results = [];
for (const s of sites) {
  const rec = { id: s.id, name: s.name, url: s.url, status: 0, error: null, title: '', captcha: false, login: false, form: false, length: 0, redirect: '' };
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 45000);
    const res = await fetch(s.url, {
      headers: { 'user-agent': UA, 'accept-language': 'en-US,en;q=0.9' },
      redirect: 'follow',
      signal: ctrl.signal,
    });
    clearTimeout(t);
    rec.status = res.status;
    rec.redirect = res.url;
    const html = await res.text();
    rec.length = html.length;
    const titleM = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    rec.title = titleM ? titleM[1].trim().slice(0, 160) : '';
    rec.captcha = CAPTCHA_RE.test(html);
    rec.login = LOGIN_RE.test(html);
    rec.form = FORM_RE.test(html);
    writeFileSync(join(OUT, `passa-${s.id}.html`), html, 'utf8');
  } catch (e) {
    rec.error = String(e.message || e).slice(0, 200);
  }
  results.push(rec);
  console.log(JSON.stringify(rec));
}
writeFileSync(join(OUT, 'passa-summary.json'), JSON.stringify(results, null, 2), 'utf8');
