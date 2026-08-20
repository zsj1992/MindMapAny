// Pass A — 第二批 Playwright 深查（渲染后表单/入口）
// 用法: node scripts/backlink-pw-inspect-b2.mjs
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'docs', 'seo', 'backlink-campaign', 'evidence');
mkdirSync(OUT, { recursive: true });
const CHROME = 'C:\\Users\\Lenovo\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe';

const targets = [
  { id: 'c2-atm', url: 'https://aitoolsmarketer.com/submit/' },
  { id: 'c2-it',  url: 'https://www.indietool.io/' },
  { id: 'c2-tly1', url: 'https://tally.so/r/wvB7Xg' },
  { id: 'c2-tly2', url: 'https://tally.so/r/mBkqj5' },
  { id: 'c2-ft',  url: 'https://futuretools.io/submit-a-tool' },
  { id: 'c2-rv',  url: 'https://reviewai.net/' },
  { id: 'c2-tag2', url: 'https://www.theaigeneration.com/' },
  { id: 'c2-fl',  url: 'https://fastlaunch.io/' },
  { id: 'c2-as',  url: 'https://aistage.net/' },
  { id: 'c2-pz',  url: 'https://www.promptzone.com/' },
  { id: 'c2-fai', url: 'https://findaitools.co/' },
  { id: 'c2-oh',  url: 'https://openhunts.com/' },
];

const browser = await chromium.launch({ headless: true, executablePath: CHROME });
const ctx = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  locale: 'en-US',
  viewport: { width: 1280, height: 900 },
});
const out = [];
for (const t of targets) {
  const rec = { id: t.id, url: t.url, title: '', fields: [], submitLinks: [], captcha: false, error: null };
  const page = await ctx.newPage();
  try {
    await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(4500);
    rec.title = await page.title();
    rec.fields = await page.evaluate(() => {
      const res = [];
      document.querySelectorAll('input:not([type="hidden"]), textarea, select').forEach((el) => {
        const name = el.getAttribute('name') || el.getAttribute('id') || '';
        const type = el.getAttribute('type') || el.tagName.toLowerCase();
        const ph = el.getAttribute('placeholder') || '';
        const vis = !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
        if (vis || name) res.push(`${type}:${name} [${ph.slice(0, 50)}]`);
      });
      return res.slice(0, 25);
    });
    rec.submitLinks = await page.evaluate(() => {
      const res = [];
      document.querySelectorAll('a').forEach((a) => {
        const href = a.getAttribute('href') || '';
        const text = (a.innerText || '').trim().slice(0, 50);
        if (/submit|add|list|suggest|launch/i.test(href + ' ' + text)) res.push(`${href} => ${text}`);
      });
      return [...new Set(res)].slice(0, 12);
    });
    const bodyText = await page.evaluate(() => document.body ? document.body.innerText.slice(0, 2500) : '');
    rec.captcha = /captcha|recaptcha|hcaptcha|turnstile|cloudflare|just a moment/i.test(bodyText + rec.title);
    await page.screenshot({ path: join(OUT, `pw2-${t.id}.png`), fullPage: false });
    writeFileSync(join(OUT, `pw2-${t.id}-text.txt`), bodyText, 'utf8');
  } catch (e) { rec.error = String(e.message || e).slice(0, 200); }
  out.push(rec);
  console.log(JSON.stringify(rec));
  await page.close();
}
await browser.close();
writeFileSync(join(OUT, 'pw2-inspect-summary.json'), JSON.stringify(out, null, 2), 'utf8');
