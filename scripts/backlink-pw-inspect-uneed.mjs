// Pass A — Uneed /submit-a-tool 深查
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
const OUT = join(process.cwd(), 'docs', 'seo', 'backlink-campaign', 'evidence');
mkdirSync(OUT, { recursive: true });
const CHROME = 'C:\\Users\\Lenovo\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe';

const browser = await chromium.launch({ headless: true, executablePath: CHROME });
const ctx = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36',
  locale: 'en-US', viewport: { width: 1280, height: 900 },
});
const page = await ctx.newPage();
const rec = { id: 'uneed-submit', title: '', fields: [], links: [], loginRequired: false, error: null };
try {
  await page.goto('https://www.uneed.best/submit-a-tool', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(12000);
  rec.title = await page.title();
  const bodyText = await page.evaluate(() => document.body ? document.body.innerText.slice(0, 1500) : '');
  rec.loginRequired = /log ?in|sign ?in|register|create account/i.test(bodyText);
  rec.fields = await page.evaluate(() => {
    const res = [];
    document.querySelectorAll('input:not([type="hidden"]), textarea, select').forEach((el) => {
      const name = el.getAttribute('name') || el.getAttribute('id') || '';
      const type = el.getAttribute('type') || el.tagName.toLowerCase();
      const ph = el.getAttribute('placeholder') || '';
      const vis = !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
      if (vis || name) res.push(`${type}:${name} [${ph.slice(0, 45)}]`);
    });
    return res.slice(0, 25);
  });
  rec.links = await page.evaluate(() => {
    const res = [];
    document.querySelectorAll('a').forEach((a) => {
      const href = a.getAttribute('href') || '';
      const text = (a.innerText || '').trim().slice(0, 45);
      if (/submit|log ?in|sign ?up|register/i.test(href + ' ' + text)) res.push(`${href} => ${text}`);
    });
    return [...new Set(res)].slice(0, 10);
  });
  writeFileSync(join(OUT, 'pw-uneed-submit-text.txt'), bodyText, 'utf8');
  await page.screenshot({ path: join(OUT, 'pw-uneed-submit.png') });
} catch (e) { rec.error = String(e.message || e).slice(0, 200); }
console.log(JSON.stringify(rec));
await browser.close();
