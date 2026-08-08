import assert from 'node:assert/strict';
import { useEditor } from './editor';
import type { MindMap } from '@/lib/mindmap/schema';

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

console.log('✓ editor level controls: all cases passed');
