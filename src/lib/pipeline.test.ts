import assert from 'node:assert/strict';
import { chunkDocument, formatTimestamp, groupChunks, needsMapReduce } from './chunk';
import { groupCues, parseVideoId } from './extract/youtube';
import { assertPublicUrl, ipIsPrivate, ipVersion } from './extract/ssrf';
import { ExtractError, type ExtractedDoc } from './extract/types';
import { buildMindMap } from './mindmap/outline';

/**
 * 管线测试：不调用模型，验证「提取 → 切块 → 溯源还原」这条链。
 * 溯源是整个产品最容易悄悄坏掉的地方，必须有回归测试盯着。
 */

// ── SSRF 防护 ──
{
  for (const ip of ['127.0.0.1', '10.0.0.5', '172.16.3.1', '192.168.1.1', '169.254.169.254', '::1', '::ffff:127.0.0.1']) {
    assert.equal(ipIsPrivate(ip), true, `${ip} 应被判为内网`);
  }
  for (const ip of ['8.8.8.8', '1.1.1.1', '2001:4860:4860::8888']) {
    assert.equal(ipIsPrivate(ip), false, `${ip} 应被判为公网`);
  }
  // 自己实现的 IP 版本判断（Workers 上没有 node:net）
  assert.equal(ipVersion('1.2.3.4'), 4);
  assert.equal(ipVersion('999.1.1.1'), 0);
  assert.equal(ipVersion('::1'), 6);
  assert.equal(ipVersion('example.com'), 0);

  const blocked = [
    'http://127.0.0.1/admin',
    'http://169.254.169.254/latest/meta-data/',
    'file:///etc/passwd',
    'http://localhost:3000',
    'http://user:pass@example.com',
    'http://example.com:22',
  ];
  // 顶层 await 在 cjs 下不可用，收进 IIFE
  void (async () => {
    for (const url of blocked) {
      await assert.rejects(assertPublicUrl(url), (e: unknown) => e instanceof ExtractError, `${url} 应被拦截`);
    }
  })();
}

// ── 切块保留页码 ──
{
  const doc: ExtractedDoc = {
    kind: 'pdf',
    title: '测试文档',
    notes: [],
    blocks: [
      { text: 'A'.repeat(3000), page: 1 },
      { text: 'B'.repeat(3000), page: 2 },
      { text: 'C'.repeat(3000), page: 5 },
    ],
  };
  const { chunks, chunkIndex } = chunkDocument(doc, 4000);
  assert.ok(chunks.length >= 2);
  // 每个 chunk 都必须能查到溯源位置，否则节点上的页码就是瞎编的
  for (const c of chunks) {
    const ref = chunkIndex.get(c.chunkId);
    assert.ok(ref && ref.type === 'pdf' && ref.page >= 1, `${c.chunkId} 缺少页码`);
  }
  const first = chunkIndex.get('c1');
  assert.ok(first?.type === 'pdf' && first.page === 1);
}

// ── 超长无标点段落被硬切，不丢内容 ──
{
  const doc: ExtractedDoc = {
    kind: 'text',
    title: 't',
    notes: [],
    blocks: [{ text: 'x'.repeat(25000) }],
  };
  const { chunks } = chunkDocument(doc, 5000);
  assert.ok(chunks.length >= 5);
  assert.ok(chunks.every((c) => c.text.length <= 5000));
}

// ── YouTube ID 解析 ──
{
  const cases = [
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ?t=42', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/watch?list=PL1&v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
  ] as const;
  for (const [url, id] of cases) assert.equal(parseVideoId(url), id, url);
  assert.equal(parseVideoId('https://example.com/watch?v=abc'), null);
}

// ── 字幕按 30 秒窗口合并，时间戳取窗口起点 ──
{
  const cues = Array.from({ length: 40 }, (_, i) => ({ text: `w${i}`, startSec: i * 5 }));
  const blocks = groupCues(cues);
  assert.ok(blocks.length >= 6);
  assert.equal(blocks[0].startSec, 0);
  assert.equal(blocks[1].startSec, 30);
  assert.ok(blocks[0].text.includes('w0') && blocks[0].text.includes('w5'));
}

assert.equal(formatTimestamp(0), '0:00');
assert.equal(formatTimestamp(75), '1:15');
assert.equal(formatTimestamp(3725), '1:02:05');

// ── 全链路：切块 → 模拟模型输出 → 溯源还原成时间戳 ──
{
  const doc: ExtractedDoc = {
    kind: 'youtube',
    title: '演讲',
    url: 'https://youtu.be/abc',
    notes: [],
    blocks: [
      { text: '开场介绍背景'.repeat(200), startSec: 0 },
      { text: '核心论点展开'.repeat(200), startSec: 300 },
    ],
  };
  const { chunks, chunkIndex } = chunkDocument(doc, 1500);
  const outline = ['# 演讲', `- 背景 ^${chunks[0].chunkId}`, `- 论点 ^${chunks[chunks.length - 1].chunkId}`].join('\n');
  const { map, warnings } = buildMindMap(outline, {
    language: 'zh-CN',
    depth: 'standard',
    purpose: 'general',
    chunkIndex,
  });

  assert.deepEqual(warnings, []);
  const leaf = map.nodes.find((n) => n.title === '背景')!;
  assert.equal(leaf.source?.type, 'youtube');
  assert.equal(leaf.source && 'startSec' in leaf.source && leaf.source.startSec, 0);
  const last = map.nodes.find((n) => n.title === '论点')!;
  assert.equal(last.source && 'startSec' in last.source && last.source.startSec, 300);
}

// ── map-reduce 分组 ──
{
  const chunks = Array.from({ length: 10 }, (_, i) => ({ chunkId: `c${i}`, text: 'x'.repeat(6000) }));
  assert.equal(needsMapReduce(chunks), true);
  const groups = groupChunks(chunks, 24000);
  assert.equal(groups.length, 3);
  assert.equal(groups.flat().length, 10);
  assert.equal(needsMapReduce([{ chunkId: 'c1', text: 'x'.repeat(1000) }]), false);
}

console.log('✓ pipeline: all cases passed');
