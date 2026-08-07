import type { Metadata } from 'next';
import { Workspace } from '@/components/Workspace';

export const metadata: Metadata = {
  title: '快速开始',
  description: '粘贴文本、上传 PDF 或输入链接，几秒生成可编辑、可溯源的思维导图。',
};

export default function NewMapPage() {
  return (
    <Workspace title="生成一张脑图" subtitle="粘贴文本、上传 PDF，或丢一个网页 / YouTube 链接进来。" />
  );
}
