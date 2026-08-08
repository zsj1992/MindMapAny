'use client';

import { useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

/**
 * 主题的唯一真相是 <html> 上的 class（layout 里的内联脚本在首屏前就设好了）。
 * 用 useSyncExternalStore 直接订阅它，而不是在 effect 里 setState 同步一份副本 ——
 * 后者会多一轮渲染，而且和外部改动容易不同步。
 */
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(
    subscribe,
    () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light'),
    () => 'light', // 服务端渲染时的兜底；真实值由内联脚本在水合前写好
  );

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
      className="btn btn-ghost h-9 w-9 rounded-lg"
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
        </svg>
      )}
    </button>
  );
}

/** 阻塞式主题脚本，必须在首屏绘制前执行，否则深色模式会闪一下白 */
export const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()`;
