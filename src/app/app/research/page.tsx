import type { Metadata } from 'next';
import { DeepResearchWorkspace } from '@/components/research/DeepResearchWorkspace';

export const metadata: Metadata = {
  title: 'Deep research',
  description: 'Search multiple web sources to produce a cited research report and an editable mind map.',
};

export default function ResearchPage() {
  return <DeepResearchWorkspace />;
}

