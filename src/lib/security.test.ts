import assert from 'node:assert/strict';
import { RequestBodyTooLargeError, readBodyBytesLimited, readJsonLimited } from './http/body-limit';
import { MAX_SAVED_NODES, mindMapSchema } from './mindmap/schema';
import { serializeJsonLd } from './seo/json-ld';

const injected = serializeJsonLd({ title: '</script><script>alert(1)</script>' });
assert.doesNotMatch(injected, /<\/script>/i, 'dynamic JSON-LD must not be able to close its script element');
assert.match(injected, /\\u003c\/script>/, 'less-than characters must be encoded');

const baseNode = { id: 'root', parentId: null, title: 'Root', order: 0 };
const oversizedMap = {
  version: 1,
  title: 'Too large',
  language: 'en',
  depth: 'detailed',
  purpose: 'general',
  nodes: Array.from({ length: MAX_SAVED_NODES + 1 }, (_, index) => ({
    ...baseNode,
    id: `node-${index}`,
    parentId: index === 0 ? null : 'node-0',
  })),
  createdAt: new Date().toISOString(),
};
assert.equal(mindMapSchema.safeParse(oversizedMap).success, false, 'saved maps must have a hard node cap');

async function main() {
  const jsonRequest = new Request('https://mindmapany.com/api/test', {
    method: 'POST',
    body: JSON.stringify({ ok: true }),
  });
  assert.deepEqual(await readJsonLimited(jsonRequest, 100), { ok: true });

  const oversized = new Request('https://mindmapany.com/api/test', {
    method: 'POST',
    body: 'x'.repeat(101),
  });
  await assert.rejects(() => readBodyBytesLimited(oversized, 100), RequestBodyTooLargeError);

  console.log('✓ security regressions: JSON-LD, body caps and map caps passed');
}

void main();
