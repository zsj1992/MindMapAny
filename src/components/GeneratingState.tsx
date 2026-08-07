'use client';

import { useEffect, useState } from 'react';

/**
 * 生成过程可能要一两分钟。空转的 spinner 会让人以为卡死，
 * 所以按真实阶段推进文案，并给一条永远到不了 100% 的进度条 ——
 * 骗人的百分比比没有反馈更糟，这里只表达「还在动」。
 */

const STAGES = [
  { at: 0, label: '正在提取内容…' },
  { at: 3500, label: '正在切分并定位原文…' },
  { at: 9000, label: '正在生成层级结构…' },
  { at: 25000, label: '内容较长，正在分段归纳…' },
  { at: 55000, label: '正在合并重复主题…' },
];

export function GeneratingState() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const started = Date.now();
    const timer = setInterval(() => setElapsed(Date.now() - started), 500);
    return () => clearInterval(timer);
  }, []);

  const stage = [...STAGES].reverse().find((s) => elapsed >= s.at) ?? STAGES[0];
  // 渐近曲线：越久增长越慢，永远不到 100%
  const progress = Math.min(94, 100 * (1 - Math.exp(-elapsed / 22000)));

  return (
    <div className="card mx-auto w-full max-w-2xl p-8">
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 24 24" className="h-5 w-5 animate-spin text-brand-500" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
          <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{stage.label}</p>
          <p className="mt-0.5 text-xs tabular-nums text-text-subtle">已用 {Math.round(elapsed / 1000)} 秒</p>
        </div>
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-bg-muted">
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-6 space-y-2.5" aria-hidden="true">
        {[92, 68, 78, 54].map((w, i) => (
          <div
            key={w}
            className="h-3 animate-pulse rounded bg-bg-muted"
            style={{ width: `${w}%`, animationDelay: `${i * 140}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
