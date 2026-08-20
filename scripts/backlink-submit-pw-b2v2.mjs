// Pass B — 第二批提交 v2（稳健版：honeypot 留空、监听网络、抓成功提示）
// 用法: node scripts/backlink-submit-pw-b2v2.mjs
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'docs', 'seo', 'backlink-campaign', 'evidence');
mkdirSync(OUT, { recursive: true });
const CHROME = 'C:\\Users\\Lenovo\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe';

const browser = await chromium.launch({ headless: true, executablePath: CHROME });
const ctx = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  locale: 'en-US',
  viewport: { width: 1280, height: 900 },
});
const results = [];

async function makePage() {
  const page = await ctx.newPage();
  const posts = [];
  page.on('response', async (res) => {
    if (res.request().method() === 'POST') {
      let body = '';
      try { body = (await res.text()).slice(0, 400); } catch { body = '(no body)'; }
      posts.push({ url: res.url(), status: res.status(), body });
    }
  });
  page.posts = posts;
  return page;
}

// ---------- 1) aitoolsmarketer.com（website 为 honeypot，留空） ----------
{
  const page = await makePage();
  const rec = { site: 'aitoolsmarketer.com', status: 'attempted', detail: '', posts: [] };
  try {
    await page.goto('https://aitoolsmarketer.com/submit/', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3500);
    const hasForm = await page.locator('input[name="tool_url"]').isVisible().catch(() => false);
    if (hasForm) {
      await page.fill('input[name="submitter_name"]', 'MindMapAny Team');
      await page.fill('input[name="email"]', 'support@mindmapany.com');
      // website 是 honeypot —— 留空
      await page.fill('input[name="tool_url"]', 'https://mindmapany.com');
      await page.fill('input[name="subject"]', 'MindMapAny — AI mind map generator with source citations');
      await page.fill('textarea[name="message"]', 'MindMapAny turns PDFs, Word files, ebooks, PPTX decks, web articles and long text into editable, source-traceable mind maps in seconds. Every node cites its page, slide or chapter — not a summary, but a map you can verify against the original. Free plan with 30 credits, exports to PNG/SVG/Markdown, 30+ output languages.');
      await page.screenshot({ path: join(OUT, 'submit2v2-atm-filled.png') });
      const btn = page.locator('button[type="submit"], input[type="submit"], .wpcf7-submit').first();
      await btn.click();
      await page.waitForTimeout(9000);
      const after = await page.evaluate(() => document.body.innerText);
      rec.detail = after.replace(/\s+/g, ' ').slice(0, 900);
      rec.posts = page.posts.map((p) => `${p.status} ${p.url} :: ${p.body.slice(0, 200)}`);
      rec.status = 'clicked';
      await page.screenshot({ path: join(OUT, 'submit2v2-atm-after.png') });
    } else { rec.status = 'no-form'; rec.detail = (await page.evaluate(() => document.body.innerText)).slice(0, 300); }
  } catch (e) { rec.status = 'error'; rec.detail = String(e.message || e).slice(0, 300); }
  writeFileSync(join(OUT, 'submit2v2-atm-result.txt'), JSON.stringify(rec, null, 2), 'utf8');
  results.push(rec);
  console.log(JSON.stringify(rec));
  await page.close();
}

// ---------- 2) reviewai.net（Astro 前端表单，监听 fetch） ----------
{
  const page = await makePage();
  const rec = { site: 'reviewai.net', status: 'attempted', detail: '', posts: [] };
  try {
    await page.goto('https://reviewai.net/', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(4000);
    await page.evaluate(() => { const el = document.querySelector('#submit'); if (el) el.scrollIntoView(); });
    await page.waitForTimeout(1500);
    const hasForm = await page.locator('input[name="name"]').isVisible().catch(() => false);
    if (hasForm) {
      await page.fill('input[name="name"]', 'MindMapAny');
      await page.fill('input[name="url"]', 'https://mindmapany.com');
      await page.fill('textarea[name="desc"]', 'AI mind map generator: turn PDFs, Word files, ebooks, PPTX decks, web articles and long text into editable, source-traceable mind maps. Every node cites its page, slide or chapter. Export PNG/SVG/Markdown, 30+ languages, free plan with 30 credits.');
      await page.fill('input[name="email"]', 'support@mindmapany.com');
      // website 若存在可能是 honeypot —— 留空
      await page.screenshot({ path: join(OUT, 'submit2v2-rv-filled.png') });
      const btn = page.locator('#submit button[type="submit"], #submit input[type="submit"], button[type="submit"], input[type="submit"]').first();
      await btn.click();
      await page.waitForTimeout(9000);
      const after = await page.evaluate(() => document.body.innerText);
      rec.detail = after.replace(/\s+/g, ' ').slice(0, 900);
      rec.posts = page.posts.map((p) => `${p.status} ${p.url} :: ${p.body.slice(0, 200)}`);
      rec.status = 'clicked';
      await page.screenshot({ path: join(OUT, 'submit2v2-rv-after.png') });
    } else { rec.status = 'no-form'; rec.detail = (await page.evaluate(() => document.body.innerText)).slice(0, 300); }
  } catch (e) { rec.status = 'error'; rec.detail = String(e.message || e).slice(0, 300); }
  writeFileSync(join(OUT, 'submit2v2-rv-result.txt'), JSON.stringify(rec, null, 2), 'utf8');
  results.push(rec);
  console.log(JSON.stringify(rec));
  await page.close();
}

// ---------- 3) futuretools.io（radio 用 JS 设置，newsletter 不勾） ----------
{
  const page = await makePage();
  const rec = { site: 'futuretools.io', status: 'attempted', detail: '', posts: [] };
  try {
    await page.goto('https://futuretools.io/submit-a-tool', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(4000);
    const hasForm = await page.locator('input[name="tool_name"]').isVisible().catch(() => false);
    if (hasForm) {
      await page.fill('input[name="submitter_name"]', 'MindMapAny Team');
      await page.fill('input[name="tool_name"]', 'MindMapAny');
      await page.fill('input[name="tool_url"]', 'https://mindmapany.com');
      await page.fill('textarea[name="description"]', 'AI mind map generator: turn PDFs, Word files, ebooks, PPTX decks, web articles and long text into editable, source-traceable mind maps. Every node cites its page, slide or chapter. Export PNG/SVG/Markdown, 30+ languages, free plan with 30 credits.');
      const sel = page.locator('select[name="category"]');
      const opts = await sel.locator('option').allTextContents();
      rec.detail += `categories=${JSON.stringify(opts)}; `;
      const want = ['Productivity', 'Mind Mapping', 'Research', 'Other'];
      let chosen = null;
      for (const w of want) { if (opts.some((o) => o.trim().toLowerCase() === w.toLowerCase())) { chosen = w; break; } }
      if (!chosen && opts.length > 1) chosen = opts[opts.length - 1].trim();
      if (chosen) await sel.selectOption({ label: chosen });
      rec.detail += `chosenCategory=${chosen}; `;
      // radio：用 JS 直接点 label（sr-only input 不可见）
      const radios = page.locator('input[name="pricing_tier"]');
      const rc = await radios.count();
      const radioLabels = [];
      for (let i = 0; i < rc; i++) { radioLabels.push((await radios.nth(i).evaluate((el) => (el.closest('label')?.innerText || el.parentElement?.innerText || '').trim().slice(0, 40)))); }
      rec.detail += `pricing=${JSON.stringify(radioLabels)}; `;
      const freeIdx = radioLabels.findIndex((l) => /free/i.test(l));
      if (freeIdx >= 0) {
        await radios.nth(freeIdx).evaluate((el) => {
          el.checked = true;
          el.dispatchEvent(new Event('change', { bubbles: true }));
          el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        rec.detail += 'pricingSet=free; ';
      } else { rec.detail += 'pricingSet=none; '; }
      await page.fill('input[name="submitter_email"]', 'support@mindmapany.com');
      await page.screenshot({ path: join(OUT, 'submit2v2-ft-filled.png') });
      const btn = page.locator('button[type="submit"], input[type="submit"]').first();
      await btn.click();
      await page.waitForTimeout(9000);
      const after = await page.evaluate(() => document.body.innerText);
      rec.detail += `afterSubmit: ${after.replace(/\s+/g, ' ').slice(0, 700)}`;
      rec.posts = page.posts.map((p) => `${p.status} ${p.url} :: ${p.body.slice(0, 200)}`);
      rec.status = 'clicked';
      await page.screenshot({ path: join(OUT, 'submit2v2-ft-after.png') });
    } else { rec.status = 'no-form'; rec.detail = (await page.evaluate(() => document.body.innerText)).slice(0, 300); }
  } catch (e) { rec.status = 'error'; rec.detail = String(e.message || e).slice(0, 400); }
  writeFileSync(join(OUT, 'submit2v2-ft-result.txt'), JSON.stringify(rec, null, 2), 'utf8');
  results.push(rec);
  console.log(JSON.stringify(rec));
  await page.close();
}

await browser.close();
writeFileSync(join(OUT, 'submit2v2-summary.json'), JSON.stringify(results, null, 2), 'utf8');
