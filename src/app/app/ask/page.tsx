import type { Metadata } from 'next';
import { AskWorkspace } from '@/components/ask/AskWorkspace';
import { requireUser } from '@/lib/auth/require-user';

export const metadata: Metadata = {
  title: 'Ask Anything',
  description: 'Ask a question and get a web-sourced mind map — no document needed.',
};

export default async function AskPage() {
  const { plan } = await requireUser('/app/ask');
  return <AskWorkspace unlimited={plan === 'unlimited'} />;
}
