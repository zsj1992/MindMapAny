// Pass B — reviewai.net 重试（精确定位 #submit 表单按钮 + 网络监听）
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
const OUT = join(process.cwd(), 'docs', 'seo', 'backlink-campaign', 'evidence');
const CHROME = 'C:\\Users\\Lenovo\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe';

const browser = await chromium.launch({ headless: true, executablePath: CHROME });
const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36', locale: 'en-US', viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const rec = { site: 'reviewai.net', status: 'attempted', detail: '', posts: [] };
page.on('response', async (res) => {
  if (res.request().method() === 'POST') {
    let body = ''; try { body = (await res.text()).slice(0, 300); } catch { body = '(no body)'; }
    rec.posts.push(`${res.status()} ${res.url()} :: ${body}`);
  }
});
try {
  await page.goto('https://reviewai.net/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(5000);
  // 打印 #submit 区域结构
  const info = await page.evaluate(() => {
    const sec = document.querySelector('#submit');
    if (!sec) return 'no #submit';
    return sec.outerHTML.slice(0, 2500);
  });
  rec.detail += `section: ${info}; `;
  const form = page.locator('#submit form').first();
  const fc = await form.count();
  rec.detail += `formsInSection=${fc}; `;
  if (fc > 0) {
    await form.locator('input[name="name"]').fill('MindMapAny');
    await form.locator('input[name="url"]').fill('https://mindmapany.com');
    await form.locator('textarea[name="desc"]').fill('AI mind map generator: turn PDFs, Word files, ebooks, PPTX decks, web articles and long text into editable, source-traceable mind maps. Every node cites its page, slide or chapter. Export PNG/SVG/Markdown, 30+ languages, free plan with 30 credits.');
    const em = form.locator('input[name="email"]');
    if (await em.count()) await em.fill('support@mindmapany.com');
    await page.screenshot({ path: join(OUT, 'submit2v3-rv-filled.png') });
    const btn = form.locator('button[type="submit"], input[type="submit"]').first();
    rec.detail += `btnCount=${await form.locator('button, input[type="submit"]').count()}; `;
    await btn.click();
    await page.waitForTimeout(10000);
    const after = await page.evaluate(() => document.body.innerText);
    rec.detail += `afterSubmit: ${after.replace(/\s+/g, ' ').slice(0, 700)}`;
    rec.status = 'clicked';
    await page.screenshot({ path: join(OUT, 'submit2v3-rv-after.png') });
  } else {
    rec.status = 'no-form-in-section';
  }
} catch (e) { rec.status = 'error'; rec.detail += String(e.message || e).slice(0, 400); }
writeFileSync(join(OUT, 'submit2v3-rv-result.txt'), JSON.stringify(rec, null, 2), 'utf8');
console.log(JSON.stringify(rec));
await browser.close();
