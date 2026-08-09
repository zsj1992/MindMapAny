import assert from 'node:assert/strict';
import { searchResearchSources } from './research';

async function main() {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.JINA_API_KEY;

  try {
    process.env.JINA_API_KEY = 'jina_test';
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({
        data: [
          { title: '来源 A', url: 'https://example.com/a', description: 'A', content: 'A'.repeat(160) },
          { title: '重复来源', url: 'https://example.com/a', description: '重复', content: 'B'.repeat(160) },
          { title: '危险地址', url: 'javascript:alert(1)', description: '危险', content: 'C'.repeat(160) },
          { title: '来源 B', url: 'https://example.org/b', description: 'B', content: 'D'.repeat(180) },
        ],
      }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch;

    const sources = await searchResearchSources('测试研究问题');
    assert.equal(sources.length, 2);
    assert.deepEqual(sources.map((source) => source.id), [1, 2]);
    assert.deepEqual(sources.map((source) => source.url), ['https://example.com/a', 'https://example.org/b']);
    console.log('✓ research search: validation and deduplication passed');
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.JINA_API_KEY;
    else process.env.JINA_API_KEY = originalKey;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
