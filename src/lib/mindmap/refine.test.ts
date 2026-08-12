import assert from 'node:assert/strict';
import { parseOutline } from './outline';
import type { MindMap, SourceRef } from './schema';

/**
 * 改图走的是「脑图 → 大纲 → 模型 → 大纲 → 脑图」。
 * 这一趟里最容易悄悄坏掉的是溯源：大纲少写一个 ^chunkId，
 * 页码引用就没了，而图看起来完全正常 —— 没有任何报错。
 */

const source: SourceRef = { type: 'pdf', chunkId: 'c7', page: 12 };
const map: MindMap = {
  version: 1,
  title: '住宿规定',
  language: 'zh-CN',
  depth: 'standard',
  purpose: 'general',
  createdAt: new Date().toISOString(),
  nodes: [
    { id: 'n1', parentId: null, title: '住宿规定', order: 0 },
    { id: 'n2', parentId: 'n1', title: '费用', order: 0 },
    { id: 'n3', parentId: 'n2', title: '押金：入住时缴纳两千元', order: 0, source },
  ],
};

const chunkIndex = new Map<string, SourceRef>();
for (const node of map.nodes) if (node.source) chunkIndex.set(node.source.chunkId, node.source);

// 模型保留了标记 → 页码必须原样回来
const kept = parseOutline('# 住宿规定\n- 费用\n  - 押金：入住时缴纳两千元 ^c7', { depth: 'standard', chunkIndex });
const keptLeaf = kept.nodes.find((n) => n.title.includes('押金'));
assert.ok(keptLeaf?.source, '模型保留 ^chunkId 时，溯源必须还原');
assert.equal(keptLeaf.source.type, 'pdf');
assert.equal((keptLeaf.source as { page: number }).page, 12, '页码必须是原来那一页');

// 模型新增的节点没有标记 → 不能凭空得到别人的页码
const added = parseOutline('# 住宿规定\n- 费用\n  - 押金：入住时缴纳两千元 ^c7\n  - 水电费另计', { depth: 'standard', chunkIndex });
const newLeaf = added.nodes.find((n) => n.title.includes('水电'));
assert.ok(newLeaf, '新增节点应当存在');
assert.equal(newLeaf.source, undefined, '新增节点没有出处，不能借用别人的页码');

// 模型把标记丢了 → 该节点失去溯源，但不能错挂到别处
const dropped = parseOutline('# 住宿规定\n- 费用\n  - 押金：入住时缴纳两千元', { depth: 'standard', chunkIndex });
assert.equal(dropped.nodes.find((n) => n.title.includes('押金'))?.source, undefined);
assert.equal(dropped.nodes.filter((n) => n.source).length, 0, '丢标记只应失去溯源，不该转移给别的节点');

console.log('✓ refine: citations survive the outline round-trip');
