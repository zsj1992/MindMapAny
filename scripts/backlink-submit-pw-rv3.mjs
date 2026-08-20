// reviewai.net 第三次尝试：监听所有请求 + 提交后 URL/form-note
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
const OUT = join(process.cwd(), 'docs', 'seo', 'backlink-campaign', 'evidence');
const CHROME = 'C:\\Users\\Lenovo\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe';

const browser = await chromium.launch({ headless: true, executablePath: CHROME });
const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36', locale: 'en-US', viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const reqs = [];
page.on('request', (r) => { if (r.method() !== 'GET' || /\/api\//.test(r.url())) reqs.push(`${r.method()} ${r.url()}`); });
const rec = { site: 'reviewai.net', status: 'attempted', detail: '', requests: [] };
try {
  await page.goto('https://reviewai.net/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(5000);
  const form = page.locator('#add-form');
  await form.locator('input[name="name"]').fill('MindMapAny');
  await form.locator('input[name="url"]').fill('https://mindmapany.com');
  await form.locator('textarea[name="desc"]').fill('AI mind map generator: turn PDFs, Word files, ebooks, PPTX decks, web articles and long text into editable, source-traceable mind maps. Every node cites its page, slide or chapter. Export PNG/SVG/Markdown, 30+ languages, free plan with 30 credits.');
  await form.locator('input[name="email"]').fill('support@mindmapany.com');
  await page.screenshot({ path: join(OUT, 'submit2v4-rv-filled.png') });
  await form.locator('button[type="submit"]').click();
  await page.waitForTimeout(4000);
  rec.detail = `url=${page.url()}; `;
  rec.detail += `note=${(await page.locator('#form-note').innerText().catch(() => '(none)')).slice(0, 300)}; `;
  rec.detail += `body=${(await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').slice(0, 400)}`;
  rec.requests = reqs;
  rec.status = 'clicked';
  await page.screenshot({ path: join(OUT, 'submit2v4-rv-after.png') });
} catch (e) { rec.status = 'error'; rec.detail = String(e.message || e).slice(0, 400); }
writeFileSync(join(OUT, 'submit2v4-rv-result.txt'), JSON.stringify(rec, null, 2), 'utf8');
console.log(JSON.stringify(rec));
await browser.close();
