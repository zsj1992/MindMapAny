/**
 * Public marketing entry points stay hidden until the Chrome Web Store listing
 * is approved. NEXT_PUBLIC_ is intentional: HeaderNav is a Client Component,
 * so Next.js replaces this value at build time.
 */
export const CHROME_EXTENSION_PUBLIC = process.env.NEXT_PUBLIC_CHROME_EXTENSION_PUBLIC === 'true';
