(() => {
  const REQUEST = 'MINDMAPANY_EXTENSION_REQUEST';
  const PREFILL = 'MINDMAPANY_EXTENSION_PREFILL';
  const PREFIX = 'mindmapany:prefill:';

  window.addEventListener('message', async (event) => {
    if (event.source !== window || event.data?.type !== REQUEST) return;
    const token = typeof event.data.token === 'string' ? event.data.token : '';
    if (!/^[0-9a-f-]{36}$/i.test(token)) return;

    const key = `${PREFIX}${token}`;
    const stored = (await chrome.storage.local.get(key))[key];
    if (!stored) return;
    await chrome.storage.local.remove(key);

    if (typeof stored.expiresAt !== 'number' || stored.expiresAt < Date.now()) return;
    window.postMessage({ type: PREFILL, payload: stored.payload }, window.location.origin);
  });
})();
