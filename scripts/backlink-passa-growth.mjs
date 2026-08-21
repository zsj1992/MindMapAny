// Pass A — 用户分发清单站点核验（docs/growth/DISTRIBUTION.md）
// 用法: node scripts/backlink-passa-growth.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
const OUT = join(process.cwd(), 'docs', 'seo', 'backlink-campaign', 'evidence');
mkdirSync(OUT, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const sites = [
  { id: 'g-alt',   name: 'AlternativeTo',        url: 'https://alternativeto.net/' },
  { id: 'g-saas',  name: 'SaaSHub',              url: 'https://www.saashub.com/submit' },
  { id: 'g-taaft', name: 'TheresAnAIForThat',    url: 'https://theresanaiforthat.com/submit/' },
  { id: 'g-futp',  name: 'Futurepedia',          url: 'https://www.futurepedia.io/submit-tool' },
  { id: 'g-tfy',   name: 'Toolify',              url: 'https://www.toolify.ai/submit' },
  { id: 'g-afyi',  name: 'aitools.fyi',          url: 'https://aitools.fyi/submit' },
  { id: 'g-dang',  name: 'Dang.ai',              url: 'https://dang.ai/submit' },
  { id: 'g-uneed', name: 'Uneed',                url: 'https://www.uneed.best/' },
  { id: 'g-faz',   name: 'Fazier',               url: 'https://fazier.com/launch' },
  { id: 'g-ss',    name: 'StackShare',           url: 'https://stackshare.io/submit/' },
];

const results = [];
for (const s of sites) {
  const rec = { id: s.id, name: s.name, url: s.url, status: 0, error: null, title: '', captcha: false, form: false, login: false, redirect: '' };
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 35000);
    const res = await fetch(s.url, { headers: { 'user-agent': UA }, redirect: 'follow', signal: ctrl.signal });
    clearTimeout(t);
    rec.status = res.status;
    rec.redirect = res.url;
    const html = await res.text();
    const titleM = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    rec.title = titleM ? titleM[1].trim().slice(0, 110) : '';
    rec.captcha = /captcha|hcaptcha|recaptcha|turnstile|cloudflare|just a moment/i.test(html);
    rec.form = /<form[\s>]/i.test(html);
    rec.login = /(sign ?in|log ?in|login|register|create account)/i.test(html);
    writeFileSync(join(OUT, `passa-${s.id}.html`), html, 'utf8');
  } catch (e) { rec.error = String(e.message || e).slice(0, 150); }
  results.push(rec);
  console.log(JSON.stringify(rec));
}
writeFileSync(join(OUT, 'passa-growth-summary.json'), JSON.stringify(results, null, 2), 'utf8');
