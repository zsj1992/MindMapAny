import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { themeScript } from '@/components/site/ThemeToggle';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

const siteUrl = process.env.SITE_URL ?? 'https://mindmapany.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MapAny — 把任何内容变成脑图',
    template: '%s | MapAny',
  },
  description: '文本、PDF、网页、YouTube 一键生成可编辑、可溯源的思维导图。每个节点都能回到原文页码或视频时间戳。',
  keywords: ['思维导图', '脑图生成', 'PDF 转脑图', 'AI 思维导图', 'YouTube 总结'],
  openGraph: { type: 'website', siteName: 'MapAny', locale: 'zh_CN' },
};

/**
 * 根布局只管 html/body 和主题。
 * 页头分两套：(marketing) 用营销站头，/app 用工作台头 + 左侧栏 —— 两者结构完全不同，
 * 放在一起会互相迁就成四不像。
 */
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* 必须在样式和首屏之前执行，否则深色模式会白闪一帧 */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
