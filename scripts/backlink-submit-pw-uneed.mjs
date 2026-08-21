// Pass B — Uneed 提交（name + url 表单）
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
const posts = [];
page.on('response', async (res) => {
  if (res.request().method() === 'POST') {
    let body = ''; try { body = (await res.text()).slice(0, 300); } catch { body = '(no body)'; }
    posts.push(`${res.status()} ${res.url()} :: ${body}`);
  }
});
const rec = { site: 'uneed.best', status: 'attempted', detail: '', posts: [] };
try {
  await page.goto('https://www.uneed.best/submit-a-tool', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(10000);
  const hasForm = await page.locator('input[name="name"]').isVisible().catch(() => false);
  if (hasForm) {
    await page.fill('input[name="name"]', 'MindMapAny');
    await page.fill('input[name="url"]', 'https://mindmapany.com');
    await page.screenshot({ path: join(OUT, 'submit-uneed-filled.png') });
    const btn = page.locator('button[type="submit"], input[type="submit"]').first();
    await btn.click();
    await page.waitForTimeout(9000);
    const after = await page.evaluate(() => document.body.innerText);
    rec.detail = after.replace(/\s+/g, ' ').slice(0, 700);
    rec.posts = posts;
    rec.status = 'clicked';
    await page.screenshot({ path: join(OUT, 'submit-uneed-after.png') });
    writeFileSync(join(OUT, 'submit-uneed-result.txt'), JSON.stringify(rec, null, 2), 'utf8');
  } else {
    rec.status = 'no-form';
    rec.detail = (await page.evaluate(() => document.body.innerText)).slice(0, 300);
  }
} catch (e) { rec.status = 'error'; rec.detail = String(e.message || e).slice(0, 300); }
console.log(JSON.stringify(rec));
await browser.close();
