'use client';

import { ReactFlowProvider } from '@xyflow/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { MindMapCanvas } from '@/components/canvas/MindMapCanvas';
import { Toolbar } from '@/components/Toolbar';
import type { MindMap } from '@/lib/mindmap/schema';
import { useEditor } from '@/store/editor';

/** 只读分享视图：可看、可折叠、可导出，不可编辑不可保存 */
export function SharedMap({ map }: { map: MindMap }) {
  const load = useEditor((s) => s.load);

  useEffect(() => {
    load(map);
  }, [map, load]);

  return (
    <ReactFlowProvider>
      <div className="flex h-full flex-col">
        <Toolbar readOnly />
        <div className="min-h-0 flex-1">
          <MindMapCanvas readOnly />
        </div>
        <div className="border-t px-4 py-2.5 text-center text-xs text-text-subtle" style={{ borderColor: 'var(--border)' }}>
          由 <Link href="/" className="font-medium text-brand-600 hover:underline dark:text-brand-400">MindMapAny</Link> 生成 —— 把任何内容变成脑图
        </div>
      </div>
    </ReactFlowProvider>
  );
}
