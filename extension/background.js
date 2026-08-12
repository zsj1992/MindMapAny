const ORIGIN = 'https://mindmapany.com';

/*
 * 生成放在后台，不放在 popup 里。
 *
 * popup 一失焦就被销毁，它发出的 fetch 随之中断 —— 而生成要三十秒，
 * 用户在这期间几乎一定会点回网页。所以真正干活的必须是这里。
 *
 * 也只有这里能跨域调我们的接口：扩展的后台脚本带着 host_permissions
 * 发请求不受 CORS 限制，注入到第三方页面里的内容脚本则受限。
 *
 * 结果走「浮层主动连上来」的长连接，而不是 chrome.tabs.sendMessage：
 * 后者要求我们对目标站点有 host 权限，而我们只申请了自己的域名 —— 在任意
 * 第三方页面上会直接失败。反过来由内容脚本 connect 则不需要任何站点权限，
 * 顺带还白拿两件事：标签页 id 从 port.sender 就能拿到；用户关掉浮层会
 * 触发 disconnect，中止请求也就有了天然的信号。
 */

/** tabId -> { payload?, port?, controller? }。前两者凑齐才开工。 */
const jobs = new Map();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'MMA_SESSION') {
    fetchSession().then(sendResponse);
    return true;
  }
  if (message?.type === 'MMA_GENERATE') {
    const tabId = message.tabId ?? sender.tab?.id;
    if (tabId !== undefined) {
      const job = jobs.get(tabId) ?? {};
      job.payload = message.payload;
      jobs.set(tabId, job);
      maybeStart(tabId);
    }
    sendResponse({ started: true });
    return false;
  }
  return false;
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'mma') return;
  const tabId = port.sender?.tab?.id;
  if (tabId === undefined) return;

  const job = jobs.get(tabId) ?? {};
  job.port = port;
  jobs.set(tabId, job);

  port.onDisconnect.addListener(() => {
    // 关掉浮层 = 放弃这次生成。
    // 认端口而不是只认 tabId：同一页面再点一次生成时，旧浮层的 disconnect
    // 往往晚于新浮层的 connect 到达，不比对就会把刚建好的新任务删掉。
    const current = jobs.get(tabId);
    if (current?.port !== port) return;
    current.controller?.abort();
    jobs.delete(tabId);
  });

  maybeStart(tabId);
});

/** popup 的投递和浮层的连接谁先到都有可能，凑齐了才真正发请求 */
function maybeStart(tabId) {
  const job = jobs.get(tabId);
  if (!job?.payload || !job.port || job.controller) return;
  job.controller = new AbortController();
  void generate(tabId, job);
}

async function fetchSession() {
  try {
    const res = await fetch(`${ORIGIN}/api/extension/session`, { credentials: 'include' });
    if (!res.ok) return { signedIn: false };
    return await res.json();
  } catch {
    // 断网或接口不可达都当作未登录处理：popup 会引导去登录，那是能自救的路径
    return { signedIn: false };
  }
}

async function generate(tabId, job) {
  try {
    const res = await fetch(`${ORIGIN}/api/generate`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(job.payload),
      signal: job.controller.signal,
    });
    const body = await res.json();
    if (!res.ok || !body?.map) {
      post(job, { type: 'MMA_ERROR', message: body?.error?.message ?? '生成失败，请重试。' });
      return;
    }
    post(job, { type: 'MMA_RESULT', map: body.map, savedId: body.savedId ?? null });
  } catch (error) {
    // 用户按下停止不是故障，浮层自己会收起来，不该再弹一次错误
    if (error?.name !== 'AbortError') post(job, { type: 'MMA_ERROR', message: '网络错误，请重试。' });
  } finally {
    // 同上：只收自己这一趟的尾
    if (jobs.get(tabId) === job) jobs.delete(tabId);
  }
}

function post(job, message) {
  try {
    job.port.postMessage(message);
  } catch {
    // 端口已断（页面跳走或浮层被关）—— 结果无处可送，丢掉即可
  }
}
