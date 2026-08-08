import assert from 'node:assert/strict';
import { applyHierarchyPlan, buildMindMap, inspectHierarchy, parseOutline, toOutline } from './outline';
import { toTree, type SourceRef } from './schema';

const chunkIndex = new Map<string, SourceRef>([
  ['c1', { type: 'pdf', chunkId: 'c1', page: 3 }],
  ['c2', { type: 'pdf', chunkId: 'c2', page: 7 }],
]);

// 正常输入
{
  const { map, warnings } = buildMindMap(
    ['# 深度学习基础', '- 神经网络 ^c1', '  > 由层堆叠而成', '  - 前向传播 ^c1', '  - 反向传播 ^c2', '- 优化方法 ^c2'].join('\n'),
    { language: 'zh-CN', depth: 'standard', purpose: 'study', chunkIndex },
  );
  assert.equal(map.title, '深度学习基础');
  assert.equal(map.nodes.length, 5);
  const root = toTree(map)!;
  assert.equal(root.children.length, 2);
  assert.equal(root.children[0].children.length, 2);
  assert.equal(root.children[0].summary, '由层堆叠而成');
  assert.deepEqual(root.children[0].children[1].source, { type: 'pdf', chunkId: 'c2', page: 7 });
  assert.deepEqual(warnings, []);
}

// 脏输入：混合缩进、代码围栏、编号符号、粗体、未知 ref、重复兄弟
{
  const { nodes, title, warnings } = parseOutline(
    [
      '```markdown',
      '# 忽略我',
      '```',
      '# 真标题',
      '1. **主题 A** ^c1',
      '\t- 子项 ^c9',
      '   - 子项 ^c1',
      '- 主题 A',
      '- 主题 B',
    ].join('\n'),
    { depth: 'standard', chunkIndex },
  );
  assert.equal(title, '真标题');
  const titles = nodes.map((n) => n.title);
  assert.deepEqual(titles, ['真标题', '主题 A', '子项', '主题 B']);
  assert.ok(warnings.some((w) => w.includes('unknown chunk ref ^c9')));
  assert.ok(warnings.some((w) => w.includes('duplicate sibling dropped')));
}

// 超深层级被裁剪（concise = 3 层）
{
  const { nodes, warnings } = parseOutline(
    ['# 根', '- L2', '  - L3', '    - L4 应被丢弃'].join('\n'),
    { depth: 'concise' },
  );
  assert.deepEqual(nodes.map((n) => n.title), ['根', 'L2', 'L3']);
  assert.ok(warnings.some((w) => w.includes('beyond depth 3')));
}

// 无标题 + 单一顶层节点 -> 提升为根
{
  const { map } = buildMindMap(['- 唯一主题', '  - 子项 1', '  - 子项 2'].join('\n'), {
    language: 'en',
    depth: 'standard',
    purpose: 'general',
  });
  assert.equal(map.title, '唯一主题');
  const root = toTree(map)!;
  assert.equal(root.children.length, 2);
}

// 无标题 + 多顶层节点 -> 用 fallback
{
  const { map, warnings } = buildMindMap(['- A', '- B'].join('\n'), {
    language: 'en',
    depth: 'standard',
    purpose: 'general',
    fallbackTitle: 'My Doc',
  });
  assert.equal(map.title, 'My Doc');
  assert.ok(warnings.some((w) => w.includes('no title')));
}

// 空/垃圾输入不抛异常
{
  const { map } = buildMindMap('抱歉，我无法处理。', { language: 'zh-CN', depth: 'concise', purpose: 'general', fallbackTitle: 'X' });
  assert.equal(map.nodes.length, 1);
}

// 往返：解析 -> 导出 -> 再解析，结构一致
{
  const src = ['# 根', '- A', '  > 说明', '  - A1', '- B'].join('\n');
  const { map } = buildMindMap(src, { language: 'zh-CN', depth: 'standard', purpose: 'general' });
  const { map: again } = buildMindMap(toOutline(map), { language: 'zh-CN', depth: 'standard', purpose: 'general' });
  assert.deepEqual(
    again.nodes.map((n) => n.title),
    map.nodes.map((n) => n.title),
  );
}

// 星爆型结构会被标记，分类优先的三级结构不会误报
{
  const flat = buildMindMap(
    ['# 住宿规则', ...Array.from({ length: 12 }, (_, i) => `- 条款${i + 1}：具体说明 ^c1`)].join('\n'),
    { language: 'zh-CN', depth: 'standard', purpose: 'general', chunkIndex },
  ).map;
  const flatQuality = inspectHierarchy(flat);
  assert.equal(flatQuality.needsRepair, true);
  assert.equal(flatQuality.rootChildren, 12);
  assert.equal(flatQuality.maxDepth, 1);

  const grouped = buildMindMap(
    [
      '# 住宿规则',
      '- 申请管理',
      '  - 申请时间：须在截止日期前提交 ^c1',
      '  - 资格要求：申请人须符合住宿条件 ^c1',
      '- 行为规范',
      '  - 安静时段：夜间不得制造噪音 ^c2',
      '  - 访客管理：访客须登记后进入 ^c2',
      '- 费用责任',
      '  - 住宿费用：费用须按期缴纳 ^c1',
      '  - 损坏赔偿：人为损坏须承担费用 ^c2',
      '- 退宿管理',
      '  - 退宿申请：应按流程提前申请 ^c1',
      '  - 物品清理：离开前须清空个人物品 ^c2',
    ].join('\n'),
    { language: 'zh-CN', depth: 'standard', purpose: 'general', chunkIndex },
  ).map;
  const groupedQuality = inspectHierarchy(grouped);
  assert.equal(groupedQuality.needsRepair, false);
  assert.ok(groupedQuality.score > flatQuality.score);

  const plan = JSON.stringify({
    groups: [
      { title: '申请管理', parentNodeId: 'n2', nodeIds: ['n3', 'n4'] },
      { title: '行为规范', parentNodeId: null, nodeIds: ['n5', 'n6', 'n7'] },
      { title: '费用责任', parentNodeId: null, nodeIds: ['n8', 'n9', 'n10'] },
      { title: '退宿管理', parentNodeId: null, nodeIds: ['n11', 'n12', 'n13'] },
    ],
  });
  const applied = applyHierarchyPlan(flat, `\`\`\`json\n${plan}\n\`\`\``);
  assert.ok(applied);
  assert.equal(applied.groups, 4);
  assert.equal(applied.map.nodes.filter((node) => node.parentId === applied.map.nodes[0].id).length, 4);
  assert.equal(applied.map.nodes.find((node) => node.id === 'n3')?.parentId, 'n2');
  assert.equal(applied.map.nodes.filter((node) => node.id === 'n2').length, 1);
  assert.equal(applied.map.nodes.filter((node) => node.source).length, 12);
  assert.equal(inspectHierarchy(applied.map).needsRepair, false);
}

console.log('✓ outline parser: all cases passed');
