import assert from 'node:assert/strict';
import { useEditor } from './editor';
import { layoutMindMap } from '@/lib/layout';
import { formatOf, mindMapSchema, type MindMap } from '@/lib/mindmap/schema';

const map: MindMap = {
  version: 1,
  title: '层级测试',
  language: 'zh-CN',
  depth: 'detailed',
  purpose: 'general',
  createdAt: new Date(0).toISOString(),
  nodes: [
    { id: 'root', parentId: null, title: '根', order: 0 },
    { id: 'topic', parentId: 'root', title: '主题', order: 0 },
    { id: 'section', parentId: 'topic', title: '分类', order: 0 },
    { id: 'detail', parentId: 'section', title: '细节', order: 0 },
  ],
};

useEditor.getState().load(map);
useEditor.getState().collapseToLevel(2);
assert.deepEqual([...useEditor.getState().collapsed], ['topic', 'section']);
assert.equal(useEditor.getState().levelLimit, 2);

useEditor.getState().collapseToLevel(3);
assert.deepEqual([...useEditor.getState().collapsed], ['section']);
assert.equal(useEditor.getState().levelLimit, 3);

useEditor.getState().collapseToLevel(4);
assert.deepEqual([...useEditor.getState().collapsed], []);
assert.equal(useEditor.getState().levelLimit, 4);

useEditor.getState().collapseToLevel(99);
assert.deepEqual([...useEditor.getState().collapsed], []);
assert.equal(useEditor.getState().levelLimit, 99);

useEditor.getState().updateFormat({ layout: 'right', theme: 'ocean', numbering: true });
assert.deepEqual(useEditor.getState().map?.format, { layout: 'right', theme: 'ocean', numbering: true });
assert.equal(useEditor.getState().dirty, true);

const persisted = mindMapSchema.parse(JSON.parse(JSON.stringify(useEditor.getState().map)));
assert.equal(formatOf(persisted).theme, 'ocean');
assert.equal(formatOf(mindMapSchema.parse(map)).layout, 'balanced');

const right = layoutMindMap({ ...map, format: { ...formatOf(map), layout: 'right' } }, new Set());
const left = layoutMindMap({ ...map, format: { ...formatOf(map), layout: 'left' } }, new Set());
assert.ok(right.get('topic')!.x > right.get('root')!.x);
assert.ok(left.get('topic')!.x < left.get('root')!.x);

console.log('✓ editor level and format controls: all cases passed');
