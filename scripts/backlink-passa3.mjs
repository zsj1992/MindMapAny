// Pass A3 — 最后一批候选核查
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
const OUT = join(process.cwd(), 'docs', 'seo', 'backlink-campaign', 'evidence');
mkdirSync(OUT, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const sites = [
  { id: 'b3-tag-submit', name: 'theaigeneration submit', url: 'https://www.theaigeneration.com/submit' },
  { id: 'b3-str',        name: 'startuptracker crowdsource', url: 'https://startuptracker.io/crowdsourcing/' },
  { id: 'b3-many',       name: 'manytools.ai', url: 'https://manytools.ai' },
  { id: 'b3-600',        name: '600.tools', url: 'https://600.tools' },
  { id: 'b3-aiedu',      name: 'aieducator.tools', url: 'https://aieducator.tools/' },
  { id: 'b3-df',         name: 'dofollow.tools', url: 'https://dofollow.tools/' },
  { id: 'b3-navs',       name: 'navs.site', url: 'https://navs.site/' },
  { id: 'b3-ai800',      name: 'ai800.com', url: 'https://ai800.com' },
  { id: 'b3-moss',       name: 'mossai.org', url: 'https://mossai.org' },
  { id: 'b3-openlaunch', name: 'openlaunch.ai', url: 'https://openlaunch.ai/' },
];
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
    rec.title = titleM ? titleM[1].trim().slice(0, 110) : '';
    rec.captcha = /captcha|hcaptcha|recaptcha|turnstile|cloudflare|just a moment/i.test(html);
    rec.form = /<form[\s>]/i.test(html) || /tally\.so|typeform\.com|forms\.gle|airtable\.com/i.test(html);
    writeFileSync(join(OUT, `passa-${s.id}.html`), html, 'utf8');
  } catch (e) { rec.error = String(e.message || e).slice(0, 150); }
  results.push(rec);
  console.log(JSON.stringify(rec));
}
writeFileSync(join(OUT, 'passa3-summary.json'), JSON.stringify(results, null, 2), 'utf8');
