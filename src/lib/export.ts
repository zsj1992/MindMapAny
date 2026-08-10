'use client';

import { toPng, toSvg } from 'html-to-image';
import { getViewportForBounds, type Rect } from '@xyflow/react';
import { toOutline } from '@/lib/mindmap/outline';
import type { MindMap } from '@/lib/mindmap/schema';

/**
 * 导出。PNG/SVG 都是把 React Flow 的 viewport 元素截下来，
 * 关键是先按节点包围盒重算 transform —— 否则导出的是当前屏幕可见区域，
 * 用户缩放到哪就导出到哪，图会被裁掉。
 *
 * bounds 由调用方用 useReactFlow().getNodesBounds 算好传进来。这里不能自己调
 * 顶层导出的 getNodesBounds：那个版本只认 node.measured，而画布节点是 useMemo
 * 每次新建的对象，实测尺寸只存在 nodeLookup 里，从不回写 —— 于是每个节点宽高
 * 都按 0 计，包围盒退化成「节点原点的包围盒」，导出图右边少一个卡片宽、
 * 下边少一个卡片高。这正是之前右侧一列和最底部节点被切掉的原因。
 */

const PADDING = 40;
const MAX_DIMENSION = 4096;

function viewportEl(): HTMLElement | null {
  return document.querySelector('.react-flow__viewport');
}

function computeFrame(bounds: Rect) {
  const width = Math.min(MAX_DIMENSION, Math.ceil(bounds.width) + PADDING * 2);
  const height = Math.min(MAX_DIMENSION, Math.ceil(bounds.height) + PADDING * 2);
  const viewport = getViewportForBounds(bounds, width, height, 0.2, 2, PADDING / Math.max(width, 1));
  return { width, height, viewport };
}

/** 尺寸没量出来时包围盒会退化成一条线/一个点，宁可不导出也不给用户一张裁掉的图 */
function usableBounds(bounds: Rect): boolean {
  return bounds.width > 0 && bounds.height > 0;
}

function frameStyle(width: number, height: number, viewport: { x: number; y: number; zoom: number }) {
  return {
    width: `${width}px`,
    height: `${height}px`,
    transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
  };
}

export async function exportPng(bounds: Rect, filename: string) {
  const el = viewportEl();
  if (!el || !usableBounds(bounds)) return;
  const { width, height, viewport } = computeFrame(bounds);
  const dataUrl = await toPng(el, {
    backgroundColor: '#ffffff',
    width,
    height,
    pixelRatio: 2,
    style: frameStyle(width, height, viewport),
  });
  download(dataUrl, `${filename}.png`);
}

export async function exportSvg(bounds: Rect, filename: string) {
  const el = viewportEl();
  if (!el || !usableBounds(bounds)) return;
  const { width, height, viewport } = computeFrame(bounds);
  const dataUrl = await toSvg(el, {
    backgroundColor: '#ffffff',
    width,
    height,
    style: frameStyle(width, height, viewport),
  });
  download(dataUrl, `${filename}.svg`);
}

export function exportMarkdown(map: MindMap) {
  const body = toOutline(map);
  const blob = new Blob([body], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  download(url, `${safeName(map.title)}.md`);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function safeName(title: string): string {
  return title.replace(/[\\/:*?"<>|]/g, '_').slice(0, 60) || 'mindmap';
}

function download(href: string, filename: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  a.click();
}
