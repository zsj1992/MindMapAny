import type { Metadata } from 'next';
import { DeepResearchWorkspace } from '@/components/research/DeepResearchWorkspace';
import { requireUser } from '@/lib/auth/require-user';

export const metadata: Metadata = {
  title: 'Deep research',
  description: 'Search multiple web sources to produce a cited research report and an editable mind map.',
};

export default async function ResearchPage() {
  await requireUser('/app/research');
  return <DeepResearchWorkspace />;
}

