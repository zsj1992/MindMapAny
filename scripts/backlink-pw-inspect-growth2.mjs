// Pass A — 用 Playwright 尝试通过 Cloudflare 并渲染表单
// 用法: node scripts/backlink-pw-inspect-growth2.mjs
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
const OUT = join(process.cwd(), 'docs', 'seo', 'backlink-campaign', 'evidence');
mkdirSync(OUT, { recursive: true });
const CHROME = 'C:\\Users\\Lenovo\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe';

const targets = [
  { id: 'g2-alt',   url: 'https://alternativeto.net/' },
  { id: 'g2-saas',  url: 'https://www.saashub.com/submit' },
  { id: 'g2-taaft', url: 'https://theresanaiforthat.com/submit/' },
  { id: 'g2-tfy',   url: 'https://www.toolify.ai/submit' },
  { id: 'g2-uneed', url: 'https://www.uneed.best/' },
  { id: 'g2-futp',  url: 'https://www.futurepedia.io/submit-tool' },
];

const browser = await chromium.launch({ headless: true, executablePath: CHROME });
const ctx = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  locale: 'en-US', viewport: { width: 1280, height: 900 },
});
const out = [];
for (const t of targets) {
  const rec = { id: t.id, url: t.url, title: '', cloudflare: false, fields: [], links: [], error: null };
  const page = await ctx.newPage();
  try {
    await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    // 给 Cloudflare 挑战时间自动通过
    await page.waitForTimeout(18000);
    rec.title = await page.title();
    const bodyText = await page.evaluate(() => document.body ? document.body.innerText.slice(0, 1500) : '');
    rec.cloudflare = /just a moment|checking your browser|verify/i.test(bodyText + rec.title) && /cloudflare/i.test(await page.evaluate(() => document.body ? document.body.innerHTML.slice(0, 3000) : ''));
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
        if (/submit|add|register|sign ?up|log ?in|launch/i.test(href + ' ' + text)) res.push(`${href} => ${text}`);
      });
      return [...new Set(res)].slice(0, 12);
    });
    writeFileSync(join(OUT, `pw-${t.id}-text.txt`), bodyText, 'utf8');
    await page.screenshot({ path: join(OUT, `pw-${t.id}.png`), fullPage: false });
  } catch (e) { rec.error = String(e.message || e).slice(0, 200); }
  out.push(rec);
  console.log(JSON.stringify(rec));
  await page.close();
}
await browser.close();
writeFileSync(join(OUT, 'pw-growth-inspect2.json'), JSON.stringify(out, null, 2), 'utf8');
