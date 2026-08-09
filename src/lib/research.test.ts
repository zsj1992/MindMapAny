import assert from 'node:assert/strict';
import { parseResearchOutput, parseResearchPlan } from './research';

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

const plan = parseResearchPlan(`1. 分析当前应用场景
2. 评估关键数据与实证效果
3. 比较不同地区的采用案例
4. 识别风险、争议与限制`, '高等教育中的 AI', 'standard');
assert.equal(plan.length, 4);
assert.deepEqual(plan.map((task) => task.id), ['task-1', 'task-2', 'task-3', 'task-4']);
assert.match(plan[1].title, /实证效果/);

const fallbackPlan = parseResearchPlan('无效', '主题', 'detailed');
assert.equal(fallbackPlan.length, 5);
assert.match(fallbackPlan[0].title, /主题/);
console.log('✓ research plan: parsing and fallback passed');
