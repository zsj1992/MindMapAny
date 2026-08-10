import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LOCALES, resolveLocale } from './locales';
import { translate, type MessageKey } from './messages';

// ── Accept-Language 解析 ──
// 浏览器发的头五花八门，这里锁住实际会遇到的形态
assert.equal(resolveLocale(undefined, 'zh-CN,zh;q=0.9,en;q=0.8'), 'zh-CN');
assert.equal(resolveLocale(undefined, 'zh-Hans-CN,zh-Hans;q=0.9'), 'zh-CN', 'zh-Hans 也要归到简体中文');
assert.equal(resolveLocale(undefined, 'zh-TW,zh;q=0.9'), 'zh-CN', '目前只有一套中文，繁体用户也先看中文界面');
assert.equal(resolveLocale(undefined, 'en-US,en;q=0.9'), 'en');
assert.equal(resolveLocale(undefined, 'fr-FR,fr;q=0.9'), 'en', '不支持的语言回退英文');
assert.equal(resolveLocale(undefined, null), 'en');
assert.equal(resolveLocale(undefined, ''), 'en');

// q 值决定优先级，不是书写顺序
assert.equal(resolveLocale(undefined, 'en;q=0.3,zh-CN;q=0.9'), 'zh-CN');

// 用户选过就永远听用户的，哪怕浏览器语言完全相反
assert.equal(resolveLocale('en', 'zh-CN,zh;q=0.9'), 'en');
assert.equal(resolveLocale('zh-CN', 'en-US,en;q=0.9'), 'zh-CN');
// cookie 被篡改成非法值时不能崩，退回浏览器判定
assert.equal(resolveLocale('klingon', 'zh-CN'), 'zh-CN');

// ── 文案完整性 ──
// 漏翻一条在界面上只是「某处还是英文」，不会报错，只能靠测试兜住
const source = readFileSync(new URL('./messages.ts', import.meta.url), 'utf8');
const keys = [...source.matchAll(/^ {2}'([\w.]+)': \{/gm)].map((m) => m[1] as MessageKey);
assert.ok(keys.length > 100, `expected the dictionary to be populated, found ${keys.length}`);

for (const key of keys) {
  for (const locale of LOCALES) {
    const value = translate(locale, key);
    assert.notEqual(value, key, `${key} is missing a ${locale} translation`);
    assert.ok(value.trim().length > 0, `${key} is empty in ${locale}`);
  }
}

// 中文条目不能整条照抄英文。品牌名和格式名（PDF、FAQ…）本来就该一样，放行。
const SAME_BY_DESIGN = new Set(['nav.pdf', 'maps.kind.pdf', 'maps.kind.youtube', 'account.faq']);
const untranslated = keys.filter(
  (key) => !SAME_BY_DESIGN.has(key) && translate('zh-CN', key) === translate('en', key),
);
assert.deepEqual(untranslated, [], `these keys were never translated: ${untranslated.join(', ')}`);

// ── 变量替换 ──
assert.equal(translate('en', 'toolbar.nodes', { n: 42 }), '42 nodes');
assert.equal(translate('zh-CN', 'toolbar.nodes', { n: 42 }), '42 个节点');
// 占位符没给值时原样保留，好过渲染出 "undefined"
assert.match(translate('en', 'toolbar.nodes'), /\{n\}/);

console.log('✓ i18n: locale negotiation and dictionary completeness passed');
