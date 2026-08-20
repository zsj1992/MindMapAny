// Pass A — 第二批候选核验
// 用法: node scripts/backlink-passa-b2.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
const OUT = join(process.cwd(), 'docs', 'seo', 'backlink-campaign', 'evidence');
mkdirSync(OUT, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const sites = [
  { id: 'c2-ft',   name: 'futuretools.io',          url: 'https://www.futuretools.io/submit-a-tool' },
  { id: 'c2-tly1', name: 'tally submit-ai-tools',   url: 'https://tally.so/r/wvB7Xg' },
  { id: 'c2-tly2', name: 'tally spotsaas',          url: 'https://tally.so/r/mBkqj5' },
  { id: 'c2-rv',   name: 'reviewai.net',            url: 'https://reviewai.net/' },
  { id: 'c2-atm',  name: 'aitoolsmarketer.com',     url: 'https://aitoolsmarketer.com/submit/' },
  { id: 'c2-awt',  name: 'aiwikitools.com',         url: 'https://aiwikitools.com/submit-a-tool/' },
  { id: 'c2-fai',  name: 'findaitools.co',          url: 'https://findaitools.co/account/' },
  { id: 'c2-tag2', name: 'theaigeneration home',    url: 'https://www.theaigeneration.com/' },
  { id: 'c2-pz',   name: 'promptzone.com',          url: 'https://www.promptzone.com/' },
  { id: 'c2-oh',   name: 'openhunts.com',           url: 'https://openhunts.com/' },
  { id: 'c2-ltx',  name: 'launchitx.com',           url: 'https://launchitx.com/' },
  { id: 'c2-h0',   name: 'hunt0.com',               url: 'https://hunt0.com' },
  { id: 'c2-sg',   name: 'startups.gallery',        url: 'https://startups.gallery/' },
  { id: 'c2-fl',   name: 'fastlaunch.io',           url: 'https://fastlaunch.io/' },
  { id: 'c2-it',   name: 'indietool.io',            url: 'https://www.indietool.io/' },
  { id: 'c2-as',   name: 'aistage.net',             url: 'https://aistage.net/' },
  { id: 'c2-atl',  name: 'aitoolslist.io',          url: 'https://aitoolslist.io/submit-ai-tool/' },
  { id: 'c2-sh',   name: 'saashunt.best',           url: 'https://saashunt.best/' },
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
writeFileSync(join(OUT, 'passa-b2-summary.json'), JSON.stringify(results, null, 2), 'utf8');
