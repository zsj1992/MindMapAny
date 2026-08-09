import assert from 'node:assert/strict';
import { parseResearchOutput } from './research';

const parsed = parseResearchOutput(`# 研究报告

执行摘要引用来源 [1]，并由第二个来源补充 [2]。

## 核心发现

这是研究结论。[1]

## 网页来源
[1] 官方来源 A — https://example.com/report
[2] [来源 B] - https://example.org/data
[3] 重复地址 — https://example.com/report
[4] 危险地址 — javascript:alert(1)
`);

assert.match(parsed.report, /研究报告/);
assert.doesNotMatch(parsed.report, /网页来源/);
assert.equal(parsed.sources.length, 2);
assert.deepEqual(parsed.sources.map((source) => source.id), [1, 2]);
assert.deepEqual(parsed.sources.map((source) => source.url), ['https://example.com/report', 'https://example.org/data']);
console.log('✓ research output: source parsing and deduplication passed');
