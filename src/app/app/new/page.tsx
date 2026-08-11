import type { Metadata } from 'next';
import { Workspace } from '@/components/Workspace';
import { requireUser } from '@/lib/auth/require-user';
import { appLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n/messages';

export const metadata: Metadata = {
  title: 'Quick start',
  description: 'Paste text, upload a PDF or enter a link, and get an editable, source-traceable mind map in seconds.',
};

export default async function NewMapPage({ searchParams }: PageProps<'/app/new'>) {
  const params = await searchParams;
  const extensionToken = typeof params.extension === 'string' && /^[0-9a-f-]{36}$/i.test(params.extension)
    ? params.extension
    : undefined;
  const next = extensionToken ? `/app/new?extension=${encodeURIComponent(extensionToken)}` : '/app/new';
  const { plan } = await requireUser(next);
  const locale = await appLocale();
  return (
    <Workspace
      plan={plan}
      title={translate(locale, 'workspace.createTitle')}
      subtitle={translate(locale, 'workspace.createSubtitle')}
      extensionToken={extensionToken}
    />
  );
}
