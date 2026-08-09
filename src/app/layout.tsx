import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { themeScript } from '@/components/site/ThemeToggle';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

const siteUrl = process.env.SITE_URL ?? 'https://mindmapany.com';
const gaMeasurementId = process.env.NODE_ENV === 'production'
  ? (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? 'G-WKHBCSF9Q0')
  : null;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MindMapAny — 把任何内容变成脑图',
    template: '%s | MindMapAny',
  },
  description: '文本、PDF、Word、EPUB、PPT 和网页一键生成可编辑、可溯源的思维导图。',
  keywords: ['思维导图', '脑图生成', 'PDF 转脑图', 'Word 转脑图', 'AI 思维导图'],
  openGraph: {
    type: 'website',
    siteName: 'MindMapAny',
    locale: 'zh_CN',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'MindMapAny — 把复杂内容变成清晰脑图' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og.png'],
  },
};

/**
 * 根布局只管 html/body 和主题。
 * 页头分两套：(marketing) 用营销站头，/app 用工作台头 + 左侧栏 —— 两者结构完全不同，
 * 放在一起会互相迁就成四不像。
 */
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} h-full`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* 必须在样式和首屏之前执行，否则深色模式会白闪一帧 */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        {gaMeasurementId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
