'use client';

import { toPng, toSvg } from 'html-to-image';
import { getNodesBounds, getViewportForBounds, type Node } from '@xyflow/react';
import { toOutline } from '@/lib/mindmap/outline';
import type { MindMap } from '@/lib/mindmap/schema';

/**
 * 导出。PNG/SVG 都是把 React Flow 的 viewport 元素截下来，
 * 关键是先按节点包围盒重算 transform —— 否则导出的是当前屏幕可见区域，
 * 用户缩放到哪就导出到哪，图会被裁掉。
 */

const PADDING = 40;
const MAX_DIMENSION = 4096;

function viewportEl(): HTMLElement | null {
  return document.querySelector('.react-flow__viewport');
}

function computeFrame(nodes: Node[]) {
  const bounds = getNodesBounds(nodes);
  const width = Math.min(MAX_DIMENSION, Math.ceil(bounds.width) + PADDING * 2);
  const height = Math.min(MAX_DIMENSION, Math.ceil(bounds.height) + PADDING * 2);
  const viewport = getViewportForBounds(bounds, width, height, 0.2, 2, PADDING / Math.max(width, 1));
  return { width, height, viewport };
}

function frameStyle(width: number, height: number, viewport: { x: number; y: number; zoom: number }) {
  return {
    width: `${width}px`,
    height: `${height}px`,
    transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
  };
}

export async function exportPng(nodes: Node[], filename: string) {
  const el = viewportEl();
  if (!el || !nodes.length) return;
  const { width, height, viewport } = computeFrame(nodes);
  const dataUrl = await toPng(el, {
    backgroundColor: '#ffffff',
    width,
    height,
    pixelRatio: 2,
    style: frameStyle(width, height, viewport),
  });
  download(dataUrl, `${filename}.png`);
}

export async function exportSvg(nodes: Node[], filename: string) {
  const el = viewportEl();
  if (!el || !nodes.length) return;
  const { width, height, viewport } = computeFrame(nodes);
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
