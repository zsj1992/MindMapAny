'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { trackEvent } from '@/lib/analytics';

type LinkProps = ComponentProps<typeof Link>;

type TrackedLinkProps = LinkProps & {
  eventName: string;
  eventParameters?: Record<string, string | number | boolean | undefined>;
};

/**
 * Keep marketing pages server-rendered while making only the CTA itself interactive.
 * Event parameters must describe UI context only — never pass user input or URL queries.
 */
export function TrackedLink({ eventName, eventParameters, onClick, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackEvent(eventName, eventParameters);
        onClick?.(event);
      }}
    />
  );
}
