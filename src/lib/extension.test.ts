import assert from 'node:assert/strict';
import { parseExtensionPrefill } from './extension';

const token = '8e9b4987-66ee-4c5a-97c8-8368aa9d92a2';
const valid = {
  token,
  input: {
    kind: 'text',
    text: 'A captured article paragraph that is long enough to become a mind map.',
    sourceUrl: 'https://example.com/article',
    sourceTitle: 'Example article',
    capture: 'page',
  },
  language: 'auto',
  depth: 'standard',
  purpose: 'general',
};

assert.ok(parseExtensionPrefill(valid, token));
assert.equal(parseExtensionPrefill(valid, 'f24b6e7a-7bee-4fc2-bb76-c81251830cb7'), null, 'token must be single-use and exact');
assert.equal(
  parseExtensionPrefill({ ...valid, input: { ...valid.input, sourceUrl: 'javascript:alert(1)' } }, token),
  null,
  'captured sources must be HTTP(S)',
);
assert.equal(
  parseExtensionPrefill({ ...valid, input: { ...valid.input, text: 'too short' } }, token),
  null,
  'tiny captures should not trigger a paid generation',
);

console.log('✓ extension payload validation passed');
