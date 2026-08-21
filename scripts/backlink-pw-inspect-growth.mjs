// Pass A — Futurepedia 与 aitools.fyi(Tally) 深查
// 用法: node scripts/backlink-pw-inspect-growth.mjs
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
const OUT = join(process.cwd(), 'docs', 'seo', 'backlink-campaign', 'evidence');
mkdirSync(OUT, { recursive: true });
const CHROME = 'C:\\Users\\Lenovo\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe';

const targets = [
  { id: 'g-futp', url: 'https://www.futurepedia.io/submit-tool' },
  { id: 'g-afyi', url: 'https://tally.so/r/2EkV4g' },
];

const browser = await chromium.launch({ headless: true, executablePath: CHROME });
const ctx = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36',
  locale: 'en-US', viewport: { width: 1280, height: 900 },
});
const out = [];
for (const t of targets) {
  const rec = { id: t.id, url: t.url, title: '', fields: [], captcha: false, error: null };
  const page = await ctx.newPage();
  try {
    await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(6000);
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
      return res.slice(0, 30);
    });
    const bodyText = await page.evaluate(() => document.body ? document.body.innerText.slice(0, 2500) : '');
    rec.captcha = /captcha|recaptcha|hcaptcha|turnstile|cloudflare|just a moment/i.test(bodyText + rec.title);
    writeFileSync(join(OUT, `pw-${t.id}-text.txt`), bodyText, 'utf8');
    await page.screenshot({ path: join(OUT, `pw-${t.id}.png`), fullPage: false });
  } catch (e) { rec.error = String(e.message || e).slice(0, 200); }
  out.push(rec);
  console.log(JSON.stringify(rec));
  await page.close();
}
await browser.close();
writeFileSync(join(OUT, 'pw-growth-inspect.json'), JSON.stringify(out, null, 2), 'utf8');
