import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 420, height: 600 } });
  await page.addInitScript(() => {
    const storage = {};
    globalThis.__extensionTest = { storage, created: null };
    globalThis.chrome = {
      tabs: {
        query: async () => [{ id: 7, url: 'https://example.com/research', title: 'Research methods' }],
        create: async (options) => { globalThis.__extensionTest.created = options; },
      },
      scripting: {
        executeScript: async () => [{ result: {
          title: 'Research methods',
          text: 'A complete article body about research methods. '.repeat(30),
          selection: 'A selected passage with enough detail to generate a useful map.',
          isPdf: false,
        } }],
      },
      storage: {
        local: {
          get: async (key) => key === null ? storage : { [key]: storage[key] },
          set: async (values) => Object.assign(storage, values),
          remove: async (keys) => { for (const key of Array.isArray(keys) ? keys : [keys]) delete storage[key]; },
        },
      },
    };
    globalThis.close = () => {};
  });

  await page.goto(pathToFileURL(resolve('extension/popup.html')).toString());
  await page.locator('#generate:not([disabled])').waitFor();
  assert.equal(await page.locator('[data-mode="selection"]').getAttribute('aria-checked'), 'true');
  assert.match(await page.locator('#pageTitle').textContent(), /Research methods/);

  await page.locator('#generate').click();
  await page.waitForFunction(() => globalThis.__extensionTest.created !== null);
  const result = await page.evaluate(() => globalThis.__extensionTest);
  assert.match(result.created.url, /^https:\/\/mindmapany\.com\/app\/new\?extension=/);
  const [key, stored] = Object.entries(result.storage)[0];
  assert.match(key, /^mindmapany:prefill:/);
  assert.equal(stored.payload.input.capture, 'selection');
  assert.equal(stored.payload.input.sourceUrl, 'https://example.com/research');

  await page.screenshot({ path: '/tmp/mindmapany-extension-popup.png' });
  console.log('✓ extension popup capture, single-use payload and workspace handoff passed');
} finally {
  await browser.close();
}
