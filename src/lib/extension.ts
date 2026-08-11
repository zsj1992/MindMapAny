import { z } from 'zod';
import { DEPTHS, PURPOSES } from '@/lib/mindmap/schema';

export const EXTENSION_MESSAGE_REQUEST = 'MINDMAPANY_EXTENSION_REQUEST';
export const EXTENSION_MESSAGE_PREFILL = 'MINDMAPANY_EXTENSION_PREFILL';

const httpUrl = z.string().max(2_048).url().refine((value) => {
  const protocol = new URL(value).protocol;
  return protocol === 'http:' || protocol === 'https:';
}, 'Only HTTP(S) sources are supported');

/**
 * The extension deliberately sends captured page text through chrome.storage,
 * not the URL. Besides keeping private selections out of browser history this
 * also lets us reject malformed or unexpectedly large payloads at one boundary.
 */
export const extensionPrefillSchema = z.object({
  token: z.string().uuid(),
  input: z.discriminatedUnion('kind', [
    z.object({
      kind: z.literal('text'),
      text: z.string().min(20).max(300_000),
      sourceUrl: httpUrl,
      sourceTitle: z.string().trim().min(1).max(120),
      capture: z.enum(['page', 'selection']),
    }),
    z.object({
      kind: z.literal('url'),
      url: httpUrl,
      sourceType: z.literal('pdf'),
      sourceTitle: z.string().trim().min(1).max(120),
    }),
  ]),
  language: z.string().min(2).max(35).default('auto'),
  depth: z.enum(DEPTHS).default('standard'),
  purpose: z.enum(PURPOSES).default('general'),
});

export type ExtensionPrefill = z.infer<typeof extensionPrefillSchema>;

export function parseExtensionPrefill(value: unknown, expectedToken: string): ExtensionPrefill | null {
  const parsed = extensionPrefillSchema.safeParse(value);
  if (!parsed.success || parsed.data.token !== expectedToken) return null;
  return parsed.data;
}
