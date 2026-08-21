import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_TOOL_PAGES } from '../content';
import { TOOL_COPY } from './registry';

/**
 * 每种语言的工具页文案必须覆盖全部 slug。
 * 漏一个不会报错 —— localizedToolPage 会静默回退英文，
 * 结果是一个 lang="ja" 的页面上躺着英文正文。
 *
 * 这里比的是未过滤的全量列表，不是当前对外可见的那份：被功能开关暂时藏起来的页面
 * 同样要求译文齐全，否则开关一翻，线上立刻多出几个半英文的页面。
 */
const slugs = ALL_TOOL_PAGES.map((tool) => tool.slug);

for (const [locale, copy] of Object.entries(TOOL_COPY)) {
  for (const slug of slugs) {
    assert.ok(copy?.[slug], `${locale} 缺少工具页文案：${slug}`);
  }
  for (const slug of Object.keys(copy ?? {})) {
    assert.ok(slugs.includes(slug), `${locale} 有多余的 slug：${slug}（英文侧不存在）`);
  }
}

/**
 * 语言之间的文字混入检查。
 *
 * 翻译时手滑把一个汉字打进韩文、或把假名打进中文，
 * 在代码评审里几乎看不出来 —— 实际发生过：韩文的
 * 「교재 章을」里混了一个中文「章」。这里按文字系统兜住。
 */
const FOREIGN_SCRIPT: Record<string, { pattern: RegExp; label: string }> = {
  'ko.ts': { pattern: /[一-鿿぀-ヿ]/, label: '汉字或假名' },
  'ja.ts': { pattern: /[가-힯]/, label: '谚文' },
  'zh-CN.ts': { pattern: /[가-힯぀-ゟ゠-ヿ]/, label: '谚文或假名' },
  // 拉丁语系：任何 CJK 字符都是误入
  'es.ts': { pattern: /[一-鿿가-힯぀-ヿ]/, label: 'CJK 字符' },
  'de.ts': { pattern: /[一-鿿가-힯぀-ヿ]/, label: 'CJK 字符' },
  'fr.ts': { pattern: /[一-鿿가-힯぀-ヿ]/, label: 'CJK 字符' },
};

// fileURLToPath 而不是 .pathname：Windows 上 .pathname 会多个前导斜杠，路径直接废掉
const dir = fileURLToPath(new URL('.', import.meta.url));
for (const file of readdirSync(dir)) {
  const rule = FOREIGN_SCRIPT[file];
  if (!rule) continue;
  // 注释是中文写的，只检查文案字符串本身
  const body = readFileSync(join(dir, file), 'utf8').replace(/\/\*\*[\s\S]*?\*\//g, '');
  for (const [single, double] of body.matchAll(/'([^']*)'|"([^"]*)"/g)) {
    const value = single ?? double ?? '';
    assert.ok(!rule.pattern.test(value), `${file} 的文案里混入了${rule.label}：${value}`);
  }
}

console.log('✓ tool page copy: coverage and script purity passed');
