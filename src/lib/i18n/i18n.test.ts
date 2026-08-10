import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LOCALES, resolveLocale, WORKBENCH_LOCALES } from './locales';

// 站点支持的语言数应随新增语言增长；写死数字会在加语言时变成假警报，只锁下界
const MIN_LOCALES = 7;
import { marketingCopy } from './marketing';
import { hasTranslation } from './routes';
import { translate, type MessageKey } from './messages';

// ── Accept-Language 解析 ──
// 浏览器发的头五花八门，这里锁住实际会遇到的形态
assert.equal(resolveLocale(undefined, 'zh-CN,zh;q=0.9,en;q=0.8'), 'zh-CN');
assert.equal(resolveLocale(undefined, 'zh-Hans-CN,zh-Hans;q=0.9'), 'zh-CN', 'zh-Hans 也要归到简体中文');
assert.equal(resolveLocale(undefined, 'zh-TW,zh;q=0.9'), 'zh-CN', '目前只有一套中文，繁体用户也先看中文界面');
assert.equal(resolveLocale(undefined, 'en-US,en;q=0.9'), 'en');
assert.equal(resolveLocale(undefined, 'ja-JP,ja;q=0.9'), 'ja');
assert.equal(resolveLocale(undefined, 'ko-KR,ko;q=0.9'), 'ko');
assert.equal(resolveLocale(undefined, 'es-MX,es;q=0.9'), 'es', '地区变体归到主语言');
assert.equal(resolveLocale(undefined, 'de-AT,de;q=0.9'), 'de');
assert.equal(resolveLocale(undefined, 'fr-CA,fr;q=0.9'), 'fr');
// 未支持的语言回退英文。这里必须用一门确实没做的语言 —— 早先这条写的是 fr-FR，
// 加上法语之后它开始「失败」，而代码是对的，失败的是断言本身。
assert.equal(resolveLocale(undefined, 'it-IT,it;q=0.9'), 'en', '不支持的语言回退英文');
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

// 只对工作台真正翻译过的语言要求完整。其余语言按设计回退英文，
// 用 LOCALES 遍历会因为回退而恒真，测了等于没测。
assert.ok(WORKBENCH_LOCALES.length >= 2, 'expected at least two workbench locales');
assert.ok(LOCALES.length >= MIN_LOCALES, `expected at least ${MIN_LOCALES} site locales, found ${LOCALES.length}`);
// 每种语言都必须有营销文案，否则 /de 这类路由会渲染出英文却声明 lang="de"
for (const locale of LOCALES) {
  assert.ok(marketingCopy(locale).home.metaTitle.trim().length > 0, `${locale} is missing marketing copy`);
}

for (const key of keys) {
  for (const locale of WORKBENCH_LOCALES) {
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

// 英文必须覆盖其他语言拥有的每一个页面。少一条，那个页面就只剩一种语言，
// 于是既不进 sitemap 也拿不到 hreflang —— 上线了却没人找得到。
const EVERY_PATH = [
  '/', '/pricing', '/support', '/billing',
  '/tools', '/tools/pdf-to-mind-map', '/tools/docx-to-mind-map', '/tools/epub-to-mind-map',
  '/tools/pptx-to-mind-map', '/tools/text-to-mind-map', '/tools/webpage-to-mind-map',
  '/terms', '/privacy', '/refund-policy',
];
for (const path of EVERY_PATH) {
  for (const locale of LOCALES) {
    if (locale === 'en' || !hasTranslation(path, locale)) continue;
    assert.ok(hasTranslation(path, 'en'), `${path} 有 ${locale} 译文，但英文侧没有登记`);
  }
}

console.log('✓ i18n: English covers every translated path');
