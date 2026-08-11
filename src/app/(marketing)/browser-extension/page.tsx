import type { Metadata } from 'next';
import { ExtensionContent } from '@/components/site/ExtensionContent';
import { alternatesFor, openGraphFor } from '@/lib/i18n/routes';

export const metadata: Metadata = {
  title: 'Chrome extension — turn any page into a mind map',
  description: 'Download the MindMapAny Chrome extension Beta to turn current pages, selected text and online PDFs into editable, source-traceable mind maps.',
  alternates: alternatesFor('/browser-extension', 'en'),
  openGraph: openGraphFor('en', {
    title: 'MindMapAny Chrome extension',
    description: 'Map the page you are reading in one click.',
    url: '/browser-extension',
  }),
};

export default function BrowserExtensionPage() {
  return <ExtensionContent />;
}
