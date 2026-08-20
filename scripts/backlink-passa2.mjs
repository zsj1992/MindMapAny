// Pass A2 — 备选站点核查（补齐 batch 名额）
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'docs', 'seo', 'backlink-campaign', 'evidence');
mkdirSync(OUT, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const sites = [
  { id: 'b2-tag',  name: 'theaigeneration.com',        url: 'https://theaigeneration.com' },
  { id: 'b2-str',  name: 'startuptracker.io',          url: 'https://startuptracker.io/crowdsourcing/' },
  { id: 'b2-tlh',  name: 'toolhunter.ai',              url: 'https://www.toolhunter.ai/submit-a-tool' },
  { id: 'b2-fatd', name: 'free-ai-tools-directory.com',url: 'https://free-ai-tools-directory.com/' },
  { id: 'b2-unr',  name: 'unrola.com',                 url: 'https://unrola.com/list' },
  { id: 'b2-awm',  name: 'aiwith.me',                  url: 'https://aiwith.me/' },
  { id: 'b2-bat',  name: 'best-ai-tools.org',          url: 'https://best-ai-tools.org/' },
  { id: 'b2-iuu',  name: 'iuu.ai',                     url: 'https://iuu.ai/' },
  { id: 'b2-hno',  name: 'humanornot.co',              url: 'https://www.humanornot.co/submit-tool' },
  { id: 'b2-dok',  name: 'dokeyai.com',                url: 'https://dokeyai.com/' },
];

const CAPTCHA_RE = /captcha|hcaptcha|recaptcha|turnstile|cloudflare|cf-browser|just a moment/i;
const results = [];
for (const s of sites) {
  const rec = { id: s.id, name: s.name, url: s.url, status: 0, error: null, title: '', captcha: false, form: false, redirect: '' };
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 35000);
    const res = await fetch(s.url, { headers: { 'user-agent': UA }, redirect: 'follow', signal: ctrl.signal });
    clearTimeout(t);
    rec.status = res.status;
    rec.redirect = res.url;
    const html = await res.text();
    const titleM = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    rec.title = titleM ? titleM[1].trim().slice(0, 120) : '';
    rec.captcha = CAPTCHA_RE.test(html);
    rec.form = /<form[\s>]/i.test(html) || /tally\.so|typeform\.com|forms\.gle|airtable\.com/i.test(html);
    writeFileSync(join(OUT, `passa-${s.id}.html`), html, 'utf8');
  } catch (e) { rec.error = String(e.message || e).slice(0, 150); }
  results.push(rec);
  console.log(JSON.stringify(rec));
}
writeFileSync(join(OUT, 'passa2-summary.json'), JSON.stringify(results, null, 2), 'utf8');
