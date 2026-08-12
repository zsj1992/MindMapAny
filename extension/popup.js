const TARGET_ORIGIN = 'https://mindmapany.com';
const STORAGE_PREFIX = 'mindmapany:prefill:';
// Leaves ample room below the API's 2MB JSON cap even for multi-byte CJK text.
const MAX_CAPTURE_CHARS = 300_000;

const state = { page: null, mode: 'page', busy: false, session: null };
const els = {
  sourceIcon: document.querySelector('#sourceIcon'),
  sourceType: document.querySelector('#sourceType'),
  pageTitle: document.querySelector('#pageTitle'),
  pageMeta: document.querySelector('#pageMeta'),
  pageCount: document.querySelector('#pageCount'),
  selectionCount: document.querySelector('#selectionCount'),
  modeButtons: [...document.querySelectorAll('[data-mode]')],
  language: document.querySelector('#language'),
  depth: document.querySelector('#depth'),
  purpose: document.querySelector('#purpose'),
  generate: document.querySelector('#generate'),
  error: document.querySelector('#error'),
  account: document.querySelector('#account'),
  accountName: document.querySelector('#accountName'),
  accountPlan: document.querySelector('#accountPlan'),
  accountCredits: document.querySelector('#accountCredits'),
  signIn: document.querySelector('#signIn'),
};

void initialise();
void loadSession();

/**
 * 读登录态。拿不到就显示登录入口 —— 未登录不是错误，是一种要引导的正常状态。
 */
async function loadSession() {
  try {
    state.session = await chrome.runtime.sendMessage({ type: 'MMA_SESSION' });
  } catch {
    state.session = { signedIn: false };
  }
  const s = state.session;
  if (s?.signedIn) {
    els.accountName.textContent = s.name;
    els.accountPlan.textContent = PLAN_LABEL[s.plan] ?? s.plan;
    els.accountCredits.textContent = s.credits === null ? '积分无限' : `剩余 ${s.credits} 积分`;
    els.account.hidden = false;
    els.signIn.hidden = true;
  } else {
    els.account.hidden = true;
    els.signIn.hidden = false;
  }
}

const PLAN_LABEL = { free: '免费版', basic: '基础版', pro: '专业版', unlimited: '无限版' };

async function initialise() {
  cleanupExpiredPayloads();
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !/^https?:\/\//i.test(tab.url || '')) {
      throw new Error('这个页面受浏览器保护，无法读取。请在普通网页或在线 PDF 中使用。');
    }

    const obviousPdf = isPdfUrl(tab.url || '');
    let captured = null;
    if (!obviousPdf) {
      try {
        const [result] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: captureVisiblePage });
        captured = result?.result ?? null;
      } catch {
        // Some document viewers disallow script injection. A PDF can still be
        // processed safely by URL on the server.
      }
    }

    state.page = {
      url: tab.url,
      title: captured?.title || tab.title || filenameFromUrl(tab.url),
      text: captured?.text || '',
      selection: captured?.selection || '',
      isPdf: obviousPdf || captured?.isPdf === true,
    };
    if (!state.page.isPdf && state.page.text.trim().length < 20) {
      throw new Error('没有读到足够的正文。可以先选中需要整理的文字，再打开插件。');
    }
    if (state.page.selection.trim().length >= 20) state.mode = 'selection';
    render();
  } catch (error) {
    showError(error instanceof Error ? error.message : '读取页面失败，请刷新后重试。');
  }
}

function captureVisiblePage() {
  const selection = window.getSelection()?.toString().replace(/\s+/g, ' ').trim() || '';
  const isPdf = document.contentType === 'application/pdf' || /\.pdf(?:$|[?#])/i.test(location.href);
  if (isPdf) return { title: document.title, text: '', selection, isPdf: true };

  const root = document.querySelector('article, main, [role="main"], .article-content, .post-content, #js_content') || document.body;
  const clone = root.cloneNode(true);
  clone.querySelectorAll('script, style, noscript, nav, footer, aside, form, dialog, [aria-hidden="true"]').forEach((node) => node.remove());
  const text = (clone.innerText || clone.textContent || '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 300_000);
  return { title: document.title.slice(0, 120), text, selection: selection.slice(0, 300_000), isPdf: false };
}

function render() {
  const page = state.page;
  if (!page) return;
  els.sourceIcon.textContent = page.isPdf ? 'PDF' : page.selection.length >= 20 ? '¶' : '↗';
  els.sourceType.textContent = page.isPdf ? '网页 PDF' : '浏览器当前内容';
  els.pageTitle.textContent = page.title;
  els.pageMeta.textContent = safeHost(page.url);
  els.pageCount.textContent = page.isPdf ? '保留页码' : formatCount(page.text.length);
  els.selectionCount.textContent = page.selection.length >= 20 ? formatCount(page.selection.length) : '未选择';

  for (const button of els.modeButtons) {
    const mode = button.dataset.mode;
    const disabled = page.isPdf || (mode === 'selection' && page.selection.length < 20);
    button.disabled = disabled;
    button.classList.toggle('active', mode === state.mode && !disabled);
    button.setAttribute('aria-checked', String(mode === state.mode && !disabled));
  }
  els.generate.disabled = false;
}

for (const button of els.modeButtons) {
  button.addEventListener('click', () => {
    if (button.disabled) return;
    state.mode = button.dataset.mode;
    render();
  });
}

els.signIn?.addEventListener('click', () => {
  void chrome.tabs.create({ url: `${TARGET_ORIGIN}/login?next=/app/new` });
  window.close();
});

els.generate.addEventListener('click', async () => {
  if (!state.page || state.busy) return;
  hideError();
  state.busy = true;
  els.generate.disabled = true;

  const page = state.page;
  // 与下方跳转路径同一份取材逻辑，只是换了投递方式；溯源字段两边都得带上
  const title = page.title.slice(0, 120);
  const body = page.isPdf
    ? { url: page.url, sourceType: 'pdf', sourceTitle: title }
    : {
        text: (state.mode === 'selection' ? page.selection : page.text).slice(0, MAX_CAPTURE_CHARS),
        sourceUrl: page.url,
        sourceTitle: title,
      };
  const request = { ...body, language: els.language.value, depth: els.depth.value, purpose: els.purpose.value };

  // 已登录就地生成：注入浮层、交给后台去请求，popup 随即关闭也不影响
  if (state.session?.signedIn) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['overlay.js'] });
      await chrome.runtime.sendMessage({ type: 'MMA_GENERATE', payload: request, tabId: tab.id });
      window.close();
      return;
    } catch {
      // 注入失败（受保护页面等）不算走投无路，掉回原来的跳转方案
    }
  }

  els.generate.firstElementChild.textContent = '正在送往工作台…';
  try {
    const token = crypto.randomUUID();
    const input = page.isPdf
      ? { kind: 'url', url: page.url, sourceType: 'pdf', sourceTitle: page.title.slice(0, 120) }
      : {
          kind: 'text',
          text: (state.mode === 'selection' ? page.selection : page.text).slice(0, MAX_CAPTURE_CHARS),
          sourceUrl: page.url,
          sourceTitle: page.title.slice(0, 120),
          capture: state.mode,
        };
    const payload = {
      token,
      input,
      language: els.language.value,
      depth: els.depth.value,
      purpose: els.purpose.value,
    };
    const key = `${STORAGE_PREFIX}${token}`;
    await chrome.storage.local.set({ [key]: { payload, expiresAt: Date.now() + 15 * 60_000 } });
    await chrome.tabs.create({ url: `${TARGET_ORIGIN}/app/new?extension=${encodeURIComponent(token)}` });
    window.close();
  } catch {
    state.busy = false;
    els.generate.firstElementChild.textContent = '总结为思维导图';
    els.generate.disabled = false;
    showError('没有成功打开工作台，请稍后重试。');
  }
});

async function cleanupExpiredPayloads() {
  const all = await chrome.storage.local.get(null);
  const stale = Object.entries(all)
    .filter(([key, value]) => key.startsWith(STORAGE_PREFIX) && (!value?.expiresAt || value.expiresAt < Date.now()))
    .map(([key]) => key);
  if (stale.length) await chrome.storage.local.remove(stale);
}

function showError(message) {
  els.error.textContent = message;
  els.error.hidden = false;
  els.generate.disabled = true;
}

function hideError() {
  els.error.hidden = true;
  els.error.textContent = '';
}

function isPdfUrl(url) {
  try {
    return /\.pdf$/i.test(new URL(url).pathname);
  } catch {
    return false;
  }
}

function filenameFromUrl(url) {
  try {
    return decodeURIComponent(new URL(url).pathname.split('/').pop() || '当前页面');
  } catch {
    return '当前页面';
  }
}

function safeHost(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function formatCount(chars) {
  if (chars >= 10_000) return `${(chars / 10_000).toFixed(1)} 万字`;
  return `${chars.toLocaleString('zh-CN')} 字`;
}
