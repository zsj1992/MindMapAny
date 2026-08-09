import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ClientTelemetry } from '@/components/ClientTelemetry';
import { themeScript } from '@/components/site/ThemeToggle';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

const siteUrl = process.env.SITE_URL ?? 'https://mindmapany.com';
const gaMeasurementId = process.env.NODE_ENV === 'production'
  ? (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? 'G-WKHBCSF9Q0')
  : null;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MindMapAny — Turn any content into a mind map',
    template: '%s | MindMapAny',
  },
  description: 'Turn text, PDFs, Word, EPUB, PPTX and web pages into editable, source-traceable mind maps.',
  keywords: ['mind map', 'mind map generator', 'PDF to mind map', 'Word to mind map', 'AI mind map'],
  openGraph: {
    type: 'website',
    siteName: 'MindMapAny',
    locale: 'en_US',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'MindMapAny — turn complex content into a clear mind map' }],
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
    <html lang="en" className={`${geistSans.variable} h-full`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* 必须在样式和首屏之前执行，否则深色模式会白闪一帧 */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <ClientTelemetry />
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
