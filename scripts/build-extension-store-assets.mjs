import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import process from 'node:process';
import { chromium } from 'playwright';
import sharp from 'sharp';

const root = process.cwd();
const outputDir = join(root, 'extension', 'store-assets');
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 520 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(join(root, 'extension', 'popup.html')).href);
await page.waitForTimeout(100);
await page.evaluate(() => {
  document.querySelector('#sourceType').textContent = '网页文章';
  document.querySelector('#pageTitle').textContent = 'AI 如何改变高等教育的教学与学习';
  document.querySelector('#pageMeta').textContent = 'example.edu · 已识别 3,842 字';
  document.querySelector('#pageCount').textContent = '整页 3,842 字';
  const button = document.querySelector('#generate');
  button.disabled = false;
  button.style.background = '#2563eb';
  button.style.boxShadow = '0 10px 24px rgba(37, 99, 235, .22)';
  const error = document.querySelector('#error');
  error.hidden = true;
  error.textContent = '';
});
const popup = await page.screenshot({ type: 'png' });
await browser.close();

const screenshotBackground = Buffer.from(`
  <svg width="1280" height="800" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f7f9ff"/>
        <stop offset="1" stop-color="#eefaf8"/>
      </linearGradient>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#143b75" flood-opacity="0.18"/>
      </filter>
    </defs>
    <rect width="1280" height="800" fill="url(#bg)"/>
    <g opacity="0.35" fill="#c5d7ee">
      ${Array.from({ length: 16 }, (_, row) => Array.from({ length: 26 }, (_, col) => `<circle cx="${28 + col * 50}" cy="${26 + row * 50}" r="1.5"/>`).join('')).join('')}
    </g>
    <text x="78" y="116" fill="#2563eb" font-family="Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="3">MINDMAPANY · CHROME EXTENSION</text>
    <text x="78" y="210" fill="#0f1b33" font-family="Arial, 'PingFang SC', sans-serif" font-size="56" font-weight="800">把正在看的内容</text>
    <text x="78" y="282" fill="#0f1b33" font-family="Arial, 'PingFang SC', sans-serif" font-size="56" font-weight="800">一键变成脑图</text>
    <text x="78" y="356" fill="#65748b" font-family="Arial, 'PingFang SC', sans-serif" font-size="24">当前网页、选中文本和在线 PDF，</text>
    <text x="78" y="394" fill="#65748b" font-family="Arial, 'PingFang SC', sans-serif" font-size="24">直接送进可编辑、可溯源的工作台。</text>
    <g font-family="Arial, 'PingFang SC', sans-serif" font-size="22" fill="#334155">
      <circle cx="90" cy="480" r="6" fill="#0f9f8f"/><text x="112" y="488">只在点击后读取当前标签页</text>
      <circle cx="90" cy="538" r="6" fill="#0f9f8f"/><text x="112" y="546">支持整页与选中文本两种范围</text>
      <circle cx="90" cy="596" r="6" fill="#0f9f8f"/><text x="112" y="604">语言、深度和整理方式可控</text>
    </g>
    <rect x="78" y="658" width="318" height="62" rx="16" fill="#2563eb"/>
    <text x="112" y="699" fill="#fff" font-family="Arial, 'PingFang SC', sans-serif" font-size="22" font-weight="700">打开页面 · 点击扩展 · 生成脑图</text>
    <rect x="737" y="74" width="430" height="652" rx="30" fill="#fff" filter="url(#shadow)"/>
  </svg>
`);

await sharp(screenshotBackground)
  .composite([{ input: popup, left: 757, top: 94 }])
  .flatten({ background: '#ffffff' })
  .removeAlpha()
  .png({ compressionLevel: 9 })
  .toFile(join(outputDir, 'screenshot-1280x800.png'));

const icon = await readFile(join(root, 'extension', 'icons', 'icon128.png'));
const tileIcon = await sharp(icon).resize(72, 72).png().toBuffer();
const tile = Buffer.from(`
  <svg width="440" height="280" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tile" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#eef4ff"/>
        <stop offset="1" stop-color="#eafaf7"/>
      </linearGradient>
    </defs>
    <rect width="440" height="280" rx="0" fill="url(#tile)"/>
    <text x="30" y="42" fill="#2563eb" font-family="Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="2">MINDMAPANY</text>
    <text x="30" y="102" fill="#0f1b33" font-family="Arial, 'PingFang SC', sans-serif" font-size="31" font-weight="800">网页一键转脑图</text>
    <text x="30" y="141" fill="#65748b" font-family="Arial, 'PingFang SC', sans-serif" font-size="16">清晰层级 · 可编辑 · 可溯源</text>
    <path d="M44 204H150M150 204C170 204 170 174 190 174H238M150 204C170 204 170 234 190 234H238" fill="none" stroke="#2563eb" stroke-width="5" stroke-linecap="round"/>
    <circle cx="44" cy="204" r="12" fill="#0f9f8f"/>
    <circle cx="244" cy="174" r="9" fill="#60a5fa"/>
    <circle cx="244" cy="234" r="9" fill="#34d399"/>
    <rect x="318" y="162" width="92" height="92" rx="24" fill="#fff"/>
  </svg>
`);

await sharp(tile)
  .composite([{ input: tileIcon, left: 328, top: 172, blend: 'over' }])
  .flatten({ background: '#ffffff' })
  .removeAlpha()
  .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
  .toFile(join(outputDir, 'promo-440x280.jpg'));

console.log(`Built Chrome Web Store assets in ${outputDir}`);
