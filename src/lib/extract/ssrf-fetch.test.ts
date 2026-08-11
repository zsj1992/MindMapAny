import assert from 'node:assert/strict';
import { ExtractError } from './types';
import { safeFetchPdf } from './ssrf';

const originalFetch = globalThis.fetch;

globalThis.fetch = (async (input: string | URL | Request) => {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
  if (url.hostname === 'cloudflare-dns.com') {
    return Response.json({ Answer: [{ type: 1, data: url.searchParams.get('name') === 'private.example' ? '127.0.0.1' : '1.1.1.1' }] });
  }
  if (url.hostname === 'example.com') {
    return new Response(new TextEncoder().encode('%PDF-1.7\nfixture'), {
      headers: { 'content-type': 'application/pdf' },
    });
  }
  throw new Error(`Unexpected test URL: ${url}`);
}) as typeof fetch;

async function main() {
  try {
    const pdf = await safeFetchPdf('https://example.com/report.pdf');
    assert.equal(new TextDecoder().decode(pdf.data.slice(0, 5)), '%PDF-');
    await assert.rejects(
      () => safeFetchPdf('https://private.example/report.pdf'),
      (error: unknown) => error instanceof ExtractError && error.code === 'blocked_url',
    );
    console.log('✓ PDF URL fetch keeps SSRF and file-signature guards');
  } finally {
    globalThis.fetch = originalFetch;
  }
}

void main();
