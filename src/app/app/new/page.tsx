import type { Metadata } from 'next';
import { Workspace } from '@/components/Workspace';

export const metadata: Metadata = {
  title: 'Quick start',
  description: 'Paste text, upload a PDF or enter a link, and get an editable, source-traceable mind map in seconds.',
};

export default function NewMapPage() {
  return (
    <Workspace title="Create a mind map" subtitle="Paste text, upload a document, or drop in a web link." />
  );
}
