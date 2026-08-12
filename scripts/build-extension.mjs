import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import process from 'node:process';
import sharp from 'sharp';
import { zipSync } from 'fflate';

const root = process.cwd();
const extensionDir = join(root, 'extension');
const iconDir = join(extensionDir, 'icons');
const distDir = join(root, 'dist');

await mkdir(iconDir, { recursive: true });
const svg = await readFile(join(extensionDir, 'icon.svg'));
for (const size of [16, 32, 48, 128]) {
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9, palette: true })
    .toFile(join(iconDir, `icon${size}.png`));
}

if (process.argv.includes('--icons')) {
  console.log('Generated extension icons.');
  process.exit(0);
}

const files = {};
for (const path of await walk(extensionDir)) {
  const name = relative(extensionDir, path);
  // store-assets 是商店listing用的截图，不属于扩展本体，不进包
  if (name === 'README.md' || name === 'icon.svg' || name.startsWith('store-assets')) continue;
  files[name] = new Uint8Array(await readFile(path));
}
await mkdir(distDir, { recursive: true });
const output = join(distDir, 'mindmapany-chrome-extension.zip');
await writeFile(output, zipSync(files, { level: 9 }));
console.log(`Built ${relative(root, output)}`);

async function walk(dir) {
  const entries = await readdir(dir);
  const out = [];
  for (const entry of entries) {
    const path = join(dir, entry);
    if ((await stat(path)).isDirectory()) out.push(...await walk(path));
    else out.push(path);
  }
  return out;
}
