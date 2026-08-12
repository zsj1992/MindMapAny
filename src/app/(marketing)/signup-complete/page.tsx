import type { Metadata } from 'next';
import { SignupCompletedRedirect } from '@/components/analytics/SignupCompletedRedirect';

export const metadata: Metadata = {
  title: 'Finishing account setup',
  robots: { index: false },
};

export default async function SignupCompletePage({ searchParams }: PageProps<'/signup-complete'>) {
  const params = await searchParams;
  const rawNext = typeof params.next === 'string' ? params.next : '/app/new';
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/app/new';
  const method = params.method === 'github' ? 'github' : 'google';

  return <SignupCompletedRedirect next={next} method={method} />;
}
