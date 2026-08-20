// Pass B — Playwright 表单提交（无验证码站点）
// 用法: node scripts/backlink-submit-pw.mjs
// 提交 bai.tools 与 aiai.tools(Tally)，输出结果与截图证据
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'docs', 'seo', 'backlink-campaign', 'evidence');
mkdirSync(OUT, { recursive: true });
const CHROME = 'C:\\Users\\Lenovo\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe';

const results = [];
const browser = await chromium.launch({ headless: true, executablePath: CHROME });
const ctx = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  locale: 'en-US',
  viewport: { width: 1280, height: 900 },
});

// ---------- 1) bai.tools ----------
{
  const rec = { site: 'bai.tools', status: 'attempted', detail: '' };
  const page = await ctx.newPage();
  try {
    await page.goto('https://bai.tools/submit-ai-tools', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);
    const btn = page.locator('button[type="submit"], input[type="submit"], button:has-text("Submit")').first();
    const btnVisible = await btn.isVisible().catch(() => false);
    rec.detail += `submitBtnVisible=${btnVisible}; `;
    // 检查是否已有提交表单之外的要求（如登录提示）
    const bodyText = (await page.evaluate(() => document.body.innerText)).slice(0, 800);
    rec.detail += `body: ${bodyText.replace(/\s+/g, ' ').slice(0, 300)}; `;
    if (btnVisible) {
      await page.fill('input[name="toolName"]', 'MindMapAny');
      await page.fill('input[name="toolUrl"]', 'https://mindmapany.com');
      await page.screenshot({ path: join(OUT, 'submit-bai-filled.png') });
      await btn.click();
      await page.waitForTimeout(6000);
      const after = await page.evaluate(() => document.body.innerText);
      rec.detail += `afterSubmit: ${after.replace(/\s+/g, ' ').slice(0, 500)}`;
      rec.status = after.length ? 'clicked' : 'clicked';
      await page.screenshot({ path: join(OUT, 'submit-bai-after.png') });
    } else {
      rec.status = 'blocked-no-button';
    }
    writeFileSync(join(OUT, 'submit-bai-result.txt'), rec.detail, 'utf8');
  } catch (e) {
    rec.status = 'error';
    rec.detail = String(e.message || e).slice(0, 300);
  }
  results.push(rec);
  console.log(JSON.stringify(rec));
  await page.close();
}

// ---------- 2) aiai.tools via Tally ----------
{
  const rec = { site: 'aiai.tools (tally)', status: 'attempted', detail: '' };
  const page = await ctx.newPage();
  try {
    await page.goto('https://tally.so/r/3NADy0', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(5000);
    // 读出问题文本，判断单选含义
    const questions = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('h1,h2,h3,[class*="question"],label').forEach((el) => {
        const t = el.innerText.trim();
        if (t && t.length > 3 && t.length < 200) out.push(t);
      });
      return [...new Set(out)].slice(0, 20);
    });
    rec.detail += `questions: ${JSON.stringify(questions)}; `;
    const byPh = async (ph) => {
      const loc = page.locator(`input[placeholder*="${ph}"], textarea[placeholder*="${ph}"]`).first();
      return loc.isVisible().catch(() => false);
    };
    const fName = await byPh('Your Name');
    const fEmail = await byPh('Contact Email');
    const fTool = await byPh('Tool Name');
    const fUrl = await byPh('Tool URL');
    const fShot = await byPh('Screenshot');
    if (fName) await page.fill('input[placeholder*="Your Name"]', 'MindMapAny Team');
    if (fEmail) await page.fill('input[placeholder*="Contact Email"]', 'support@mindmapany.com');
    if (fTool) await page.fill('input[placeholder*="Tool Name"]', 'MindMapAny');
    if (fUrl) await page.fill('input[placeholder*="Tool URL"]', 'https://mindmapany.com');
    if (fShot) { /* 截图 URL 非必填时留空 */ }
    // 单选 Yes/No：根据问题含义选择（如 "Is this your tool?" → Yes）
    const radios = page.locator('input[type="radio"]');
    const rc = await radios.count();
    if (rc > 0) {
      const firstVal = await radios.first().inputValue();
      const secondVal = await radios.nth(1).inputValue();
      rec.detail += `radioVals=${firstVal},${secondVal}; `;
      // 默认选 Yes（第一个选项）
      await radios.first().check();
    }
    await page.screenshot({ path: join(OUT, 'submit-tally-filled.png') });
    const submitBtn = page.locator('button[type="submit"], .tally-submit-button, button:has-text("Submit")').first();
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();
      await page.waitForTimeout(7000);
      const after = await page.evaluate(() => document.body.innerText);
      rec.detail += `afterSubmit: ${after.replace(/\s+/g, ' ').slice(0, 500)}`;
      rec.status = 'submitted-clicked';
      await page.screenshot({ path: join(OUT, 'submit-tally-after.png') });
    } else {
      rec.status = 'no-submit-button';
    }
    writeFileSync(join(OUT, 'submit-tally-result.txt'), rec.detail, 'utf8');
  } catch (e) {
    rec.status = 'error';
    rec.detail = String(e.message || e).slice(0, 300);
  }
  results.push(rec);
  console.log(JSON.stringify(rec));
  await page.close();
}

await browser.close();
writeFileSync(join(OUT, 'submit-pw-summary.json'), JSON.stringify(results, null, 2), 'utf8');
