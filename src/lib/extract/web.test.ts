import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';
import { requestHeaders } from './ssrf';
import { extractEmbeddedArticle, extractWechatArticle, htmlToBlocks } from './web';

const legacyEditorArticle = `
  <article>
    <p>这是一段语义化的开头，用于说明文章主题。</p>
    <section><section><span>第一部分：旧编辑器把正文直接放在 section 和 span 里面，没有使用段落标签。这部分必须被兼容提取。</span></section></section>
    <section><section><span>第二部分：提取时只保留最深层的结构块，不能把父容器中的相同文字再提取一次。</span></section></section>
    <section><section><span>第三部分：政府网站和公众号历史文章常见这种 HTML，正文仍然是服务端直接输出的。</span></section></section>
    <section><section><span>第四部分：这些文字共同超过标准提取阈值，应该作为多个完整、独立的内容块返回给后续切块流程。</span></section></section>
  </article>
`;

const blocks = htmlToBlocks(legacyEditorArticle);
const text = blocks.map((block) => block.text).join('\n');

assert.ok(text.length >= 200, `expected at least 200 chars, got ${text.length}`);
assert.match(text, /第一部分/);
assert.match(text, /第四部分/);
assert.equal(blocks.filter((block) => block.text.includes('第一部分')).length, 1, 'nested containers must not duplicate text');

console.log('✓ web extractor: legacy section/span content passed');

const wechatArticle = `
  <html>
    <body>
      <h1 id="activity-name">公众号文章标题</h1>
      <div id="js_content">
        <p>第一段：微信公众号正文固定放在 js_content 容器内，不能让通用正文算法误选作者信息。</p>
        <h2>核心方法</h2>
        <p>第二段：公众号的公开文章会根据请求标识返回正文或环境异常页，因此抓取时需要使用微信移动端浏览器标识。</p>
        <p>第三段：专用解析只对微信官方文章域名启用，不会改变普通网页的请求行为，也不会携带用户 Cookie 或登录凭据。</p>
        <p>第四段：解析完成后仍然保留标题和段落锚点，后续切块与脑图生成流程可以继续使用统一的数据结构。</p>
        <p>第五段：这些测试文字需要共同超过正文阈值，确保误选到短作者栏或验证码提示时不会被当作有效文章。</p>
      </div>
    </body>
  </html>
`;

const { document: wechatDocument } = parseHTML(wechatArticle);
const wechat = extractWechatArticle(wechatDocument as unknown as Document);
assert.ok(wechat, 'expected WeChat article to be extracted');
assert.equal(wechat.title, '公众号文章标题');
assert.match(wechat.blocks.map((block) => block.text).join('\n'), /微信移动端浏览器标识/);
assert.ok(wechat.blocks.some((block) => block.anchor === '核心方法'));

const wechatHeaders = requestHeaders(new URL('https://mp.weixin.qq.com/s/example'));
assert.match(wechatHeaders['user-agent'], /MicroMessenger/);
assert.equal(wechatHeaders.referer, 'https://mp.weixin.qq.com/');
assert.match(requestHeaders(new URL('https://example.com/article'))['user-agent'], /MapAnyBot/);

console.log('✓ web extractor: WeChat article content passed');

/**
 * 服务端把正文注入 <script>、DOM 里只有模板骨架的页面（政务站和国内 CMS 很常见）。
 * 真实案例：cqrspx.cn —— Readability 只拿得到 960 字符的壳，正文全在 script 的 JSON 里。
 *
 * 转义用代码生成而不是手写：\uXXXX 经过源码字面量再到运行时要数三层反斜杠，
 * 手写极易多写一层，测的就不是真实形态了。
 */
const jsonEscape = (value: string): string =>
  value.replace(/[\u0080-\uffff]/g, (ch) => `\\u${ch.charCodeAt(0).toString(16).padStart(4, '0')}`).replace(/\//g, '\\/');

// 正文必须超过 MIN_ARTICLE_CHARS(200)，否则测的是长度门槛而不是提取能力
const articleHtml =
  '<p>一、培训范围</p><p>根据数字化管理师、大数据工程技术人员、人工智能工程技术人员职业技术标准开展师资培训，按职业技能标准开展师资培训。</p>' +
  '<p>二、培训对象</p><p>我市企事业单位、高校、企业、民办培训机构以及行业协会从事数字技术技能领域相关工作且符合申报条件的专业技术人员。</p>' +
  '<p>三、申报条件</p><p>从事数字技术领域相关工作，业绩突出，能够胜任相应等级培训教学工作，应具有对应或相近专业中级及以上职称。</p>' +
  '<p>四、培训费用</p><p>本次师资培训7天，培训费用为2800元/人，食宿交通费用自理，培训期间的食宿交通自理。</p>';

// 导航配置：同样带转义中文，但没有块级标签，不能被误当成正文
const navJson = jsonEscape(JSON.stringify({ nav: Array.from({ length: 40 }, (_, i) => ({ id: i, name: '首页导航项目' })) }));

const scriptEmbeddedPage = [
  '<!doctype html><html><body>',
  "<div id=\"app\">{{appName}}<span>{{data['1'].value}}</span></div>",
  `<script>var cfg = ${navJson};</script>`,
  `<script>RichTextUitl.loadDetailPageProfile();var detail = {"content":"${jsonEscape(articleHtml)}"};</script>`,
  '</body></html>',
].join('\n');

const embedded = extractEmbeddedArticle(scriptEmbeddedPage);
assert.ok(embedded, 'expected to recover the article embedded in a script tag');
const embeddedText = embedded.map((block) => block.text).join('\n');
assert.match(embeddedText, /培训范围/);
assert.match(embeddedText, /培训费用/);
assert.match(embeddedText, /2800/);
assert.doesNotMatch(embeddedText, /首页导航/, 'config JSON without block tags must not be mistaken for the article');

// 常规 HTML 页面不该走这条兜底
assert.equal(extractEmbeddedArticle(legacyEditorArticle), null, 'plain HTML must not be treated as script-embedded');

console.log('✓ web extractor: script-embedded article content passed');
