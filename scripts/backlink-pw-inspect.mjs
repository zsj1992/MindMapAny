// Pass B 预检 — 用 Playwright 渲染 JS 表单，dump 字段结构（不提交）
// 用法: node scripts/backlink-pw-inspect.mjs
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'docs', 'seo', 'backlink-campaign', 'evidence');
mkdirSync(OUT, { recursive: true });

const targets = [
  { id: 'tally-aiai', url: 'https://tally.so/r/3NADy0' },
  { id: 'bai',        url: 'https://bai.tools/submit-ai-tools' },
  { id: 'nox',        url: 'https://noxilo.com/submit-tool/' },
  { id: 'phy',        url: 'https://library.phygital.plus/tool-submission' },
];

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Users\\Lenovo\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe',
});
const ctx = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  locale: 'en-US',
  viewport: { width: 1280, height: 900 },
});
const out = [];
for (const t of targets) {
  const rec = { id: t.id, url: t.url, title: '', fields: [], captcha: false, error: null };
  const page = await ctx.newPage();
  try {
    await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(4000);
    rec.title = await page.title();
    // 字段结构
    const fields = await page.evaluate(() => {
      const res = [];
      document.querySelectorAll('input, textarea, select').forEach((el) => {
        const name = el.getAttribute('name') || el.getAttribute('id') || '';
        const type = el.getAttribute('type') || el.tagName.toLowerCase();
        const ph = el.getAttribute('placeholder') || '';
        const label = (() => {
          const l = el.closest('label');
          if (l) return l.innerText.trim().slice(0, 60);
          const id = el.id;
          if (id) { const lab = document.querySelector(`label[for="${id}"]`); if (lab) return lab.innerText.trim().slice(0, 60); }
          return '';
        })();
        const vis = !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
        if (vis || name) res.push({ name: name.slice(0, 60), type: type.slice(0, 20), ph: ph.slice(0, 60), label: label.slice(0, 60) });
      });
      return res;
    });
    rec.fields = fields;
    const bodyText = await page.evaluate(() => document.body ? document.body.innerText.slice(0, 3000) : '');
    rec.captcha = /captcha|recaptcha|hcaptcha|turnstile|cloudflare|just a moment/i.test(bodyText + rec.title);
    await page.screenshot({ path: join(OUT, `pw-${t.id}.png`), fullPage: false });
    writeFileSync(join(OUT, `pw-${t.id}-text.txt`), bodyText, 'utf8');
  } catch (e) {
    rec.error = String(e.message || e).slice(0, 200);
  }
  out.push(rec);
  console.log(JSON.stringify(rec));
  await page.close();
}
await browser.close();
writeFileSync(join(OUT, 'pw-inspect-summary.json'), JSON.stringify(out, null, 2), 'utf8');
