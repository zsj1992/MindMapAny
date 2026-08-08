import assert from 'node:assert/strict';
import { htmlToBlocks } from './web';

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
