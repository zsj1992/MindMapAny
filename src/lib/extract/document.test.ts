import assert from 'node:assert/strict';
import { strToU8, zipSync } from 'fflate';
import { chunkDocument } from '../chunk';
import { extractDocument, isSupportedDocument } from './document';

function buffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function archive(files: Record<string, string>): ArrayBuffer {
  return buffer(zipSync(Object.fromEntries(Object.entries(files).map(([name, value]) => [name, strToU8(value)]))));
}

async function run() {
  assert.equal(isSupportedDocument('notes.docx'), true);
  assert.equal(isSupportedDocument('book.epub'), true);
  assert.equal(isSupportedDocument('slides.pptx'), true);
  assert.equal(isSupportedDocument('legacy.doc'), false);
  assert.equal(isSupportedDocument('payload.exe', 'text/plain'), false);
  assert.equal(isSupportedDocument(undefined, 'text/plain'), true);

  const plain = await extractDocument({
    data: buffer(strToU8('\uFEFF第一段内容。\n\n第二段内容。')),
    filename: '笔记.md',
  });
  assert.equal(plain.kind, 'document');
  assert.equal(plain.title, '笔记');
  assert.deepEqual(plain.blocks.map((block) => block.text), ['第一段内容。', '第二段内容。']);

  const docx = await extractDocument({
    filename: 'fallback.docx',
    data: archive({
      'word/document.xml': `
        <w:document xmlns:w="w"><w:body>
          <w:p><w:r><w:t>项目背景</w:t></w:r></w:p>
          <w:tbl><w:tr><w:tc><w:p><w:r><w:t>表格结论</w:t></w:r></w:p></w:tc></w:tr></w:tbl>
        </w:body></w:document>`,
      'docProps/core.xml': '<cp:coreProperties xmlns:dc="dc"><dc:title>季度复盘</dc:title></cp:coreProperties>',
    }),
  });
  assert.equal(docx.title, '季度复盘');
  assert.deepEqual(docx.blocks.map((block) => block.text), ['项目背景', '表格结论']);

  const pptx = await extractDocument({
    filename: '路演.pptx',
    data: archive({
      'ppt/slides/slide2.xml': '<p:sld xmlns:a="a"><a:t>市场规模</a:t><a:t>持续增长</a:t></p:sld>',
      'ppt/slides/slide1.xml': '<p:sld xmlns:a="a"><a:t>产品定位</a:t></p:sld>',
    }),
  });
  assert.deepEqual(pptx.blocks, [
    { text: '产品定位', location: 'Slide 1' },
    { text: '市场规模 持续增长', location: 'Slide 2' },
  ]);
  const { chunks } = chunkDocument(pptx, 100);
  assert.equal(chunks[0]?.hint, 'Slide 1');

  const epub = await extractDocument({
    filename: 'guide.epub',
    data: archive({
      'META-INF/container.xml': '<container><rootfiles><rootfile full-path="OPS/content.opf"/></rootfiles></container>',
      'OPS/content.opf': `<package xmlns:dc="dc"><metadata><dc:title>使用指南</dc:title></metadata><manifest>
        <item id="chapter-2" href="two.xhtml"/><item id="chapter-1" href="one.xhtml"/>
        </manifest><spine><itemref idref="chapter-1"/><itemref idref="chapter-2"/></spine></package>`,
      'OPS/one.xhtml': '<html><head><title>第一章</title></head><body><h1>开始</h1><p>第一章正文。</p></body></html>',
      'OPS/two.xhtml': '<html><head><title>第二章</title></head><body><p>第二章正文 &amp; 结论。</p></body></html>',
    }),
  });
  assert.equal(epub.title, '使用指南');
  assert.equal(epub.blocks[0]?.location, '第一章');
  assert.match(epub.blocks[0]?.text ?? '', /第一章正文/);
  assert.equal(epub.blocks[1]?.location, '第二章');
  assert.match(epub.blocks[1]?.text ?? '', /第二章正文 & 结论/);

  console.log('document extraction tests passed');
}

void run();
