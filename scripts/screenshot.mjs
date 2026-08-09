/**
 * 视觉回归：跑一遍关键页面，浅色深色各截一张。
 *   node scripts/screenshot.mjs <输出目录>
 * 改完 UI 跑一次，比盯着 diff 猜靠谱。
 */
import { chromium } from 'playwright';

const out = process.argv[2] ?? '.';
const PAGES = [
  { name: 'landing', path: '/', full: true },
  { name: 'app-new', path: '/app/new' },
  { name: 'app-pdf', path: '/app/pdf' },
  { name: 'app-docx', path: '/app/docx' },
];

const b = await chromium.launch();
for (const theme of ['light', 'dark']) {
  for (const p of PAGES) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: theme });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:3000${p.path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${out}/${p.name}-${theme}.png`, fullPage: !!p.full });
    await ctx.close();
  }
}
await b.close();
console.log('ok');
