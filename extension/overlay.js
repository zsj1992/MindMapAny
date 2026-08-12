(() => {
  // 同一个标签页再点一次生成：拆掉上一个浮层重来，而不是早退。
  // 早退会让新的一次请求没有端口可送结果，界面停在旧内容上，看着像没反应。
  window.__mmaClose?.();
  const ORIGIN = 'https://mindmapany.com';

  /*
   * 就地展示结果的浮层。注入到任意第三方页面，所以有两条硬约束：
   *
   *   1. 所有样式必须自带并写死。宿主页面的 CSS 千奇百怪，
   *      依赖继承来的字号或颜色，在某些站点上就会糊成一团。
   *   2. 只做只读预览，不做编辑。真正的编辑在我们自己的画布上，
   *      在别人的页面里重造一套编辑器，维护成本和出错面都不值得。
   */

  const root = document.createElement('div');
  root.id = 'mma-overlay';
  root.style.cssText = [
    'position:fixed', 'right:20px', 'bottom:20px', 'width:min(420px,calc(100vw - 40px))',
    'max-height:min(560px,calc(100vh - 40px))', 'z-index:2147483647',
    'background:#fff', 'color:#141a26', 'border:1px solid #c3cad9', 'border-radius:16px',
    'box-shadow:0 24px 70px rgba(18,48,78,.22)', 'display:flex', 'flex-direction:column',
    'font:14px/1.5 system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif',
    'overflow:hidden',
  ].join(';');

  root.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid #e6eaf2">
      <strong style="flex:1;font-size:13px;letter-spacing:-.01em">MindMapAny</strong>
      <button id="mma-close" aria-label="关闭" style="all:unset;cursor:pointer;padding:4px 8px;border-radius:6px;color:#6b7590;font-size:16px;line-height:1">×</button>
    </div>
    <div id="mma-body" style="flex:1;min-height:0;overflow:auto;padding:16px 14px"></div>
    <div id="mma-foot" style="display:none;gap:8px;padding:10px 14px;border-top:1px solid #e6eaf2">
      <a id="mma-edit" target="_blank" rel="noopener" style="flex:1;text-align:center;text-decoration:none;background:#3a4ee0;color:#fff;border-radius:9px;padding:9px 12px;font-size:13px;font-weight:600">在 MindMapAny 中编辑</a>
    </div>`;
  document.documentElement.appendChild(root);

  const body = root.querySelector('#mma-body');
  const foot = root.querySelector('#mma-foot');
  root.querySelector('#mma-close').addEventListener('click', close);

  // 后台按这条连接来认标签页；断开就是「停止」，不需要另发消息
  const port = chrome.runtime.connect({ name: 'mma' });

  function close() {
    port.disconnect();
    root.remove();
    window.__mmaClose = undefined;
  }
  window.__mmaClose = close;

  function working() {
    foot.style.display = 'none';
    body.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:14px;padding:34px 0">
        <div style="width:26px;height:26px;border:3px solid #e6eaf2;border-top-color:#3a4ee0;border-radius:50%;animation:mma-spin .9s linear infinite"></div>
        <div style="font-size:13px;color:#3d475c">正在总结为思维导图…</div>
        <button id="mma-stop" style="all:unset;cursor:pointer;font-size:12px;color:#6b7590;border:1px solid #dde2ec;border-radius:8px;padding:5px 14px">停止</button>
      </div>
      <style>@keyframes mma-spin{to{transform:rotate(360deg)}}</style>`;
    body.querySelector('#mma-stop').addEventListener('click', close);
  }

  /** 只读预览：按层级缩进画树，靠左侧色条表达分支，不引入任何布局库 */
  function renderMap(map) {
    const byParent = new Map();
    let rootNode = null;
    for (const node of map.nodes) {
      if (node.parentId === null) { rootNode = node; continue; }
      const list = byParent.get(node.parentId) ?? [];
      list.push(node);
      byParent.set(node.parentId, list);
    }
    if (!rootNode) return '<p style="color:#6b7590">这张图是空的。</p>';

    const colours = ['#3a4ee0', '#0f9d76', '#c2622f', '#8b45c8', '#c2354f', '#1a7fa8'];
    const walk = (node, depth, colour) => {
      const kids = (byParent.get(node.id) ?? []).sort((a, b) => a.order - b.order);
      const branch = depth === 1 ? colours[Math.abs(hash(node.id)) % colours.length] : colour;
      const pad = depth === 1 ? 0 : 12;
      const style = depth === 1
        ? `font-weight:600;font-size:13px;color:#141a26;border-left:3px solid ${branch};padding-left:9px;margin:10px 0 4px`
        : `font-size:12px;color:#3d475c;border-left:1px solid #dde2ec;padding-left:9px;margin:3px 0`;
      return `<div style="margin-left:${pad}px"><div style="${style}">${escape(node.title)}</div>${kids.map((kid) => walk(kid, depth + 1, branch)).join('')}</div>`;
    };
    const top = (byParent.get(rootNode.id) ?? []).sort((a, b) => a.order - b.order);
    return `<div style="font-weight:700;font-size:15px;letter-spacing:-.02em;margin-bottom:6px">${escape(rootNode.title)}</div>
            <div style="font-size:11px;color:#6b7590;margin-bottom:10px">${map.nodes.length} 个节点</div>
            ${top.map((node) => walk(node, 1, colours[0])).join('')}`;
  }

  function hash(value) {
    let out = 0;
    for (let i = 0; i < value.length; i += 1) out = (out * 31 + value.charCodeAt(i)) | 0;
    return out;
  }

  function escape(value) {
    return String(value).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
  }

  port.onMessage.addListener((message) => {
    if (message?.type === 'MMA_RESULT') {
      body.innerHTML = renderMap(message.map);
      const edit = root.querySelector('#mma-edit');
      // 有 id 就直接开那张图；没有（比如库满了没存上）就退回工作台，别给一个死链接
      edit.href = message.savedId ? `${ORIGIN}/app/map/${message.savedId}` : `${ORIGIN}/app/maps`;
      foot.style.display = 'flex';
    }
    if (message?.type === 'MMA_ERROR') {
      foot.style.display = 'none';
      body.innerHTML = `<p style="color:#c2352f;font-size:13px;padding:18px 0;text-align:center">${escape(message.message)}</p>`;
    }
  });

  working();
})();
