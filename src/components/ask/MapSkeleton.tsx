/**
 * 生成期间的占位脑图。
 *
 * 作用不是装饰，是把「接下来会出现什么」先摆出来 —— 等待三十秒时，
 * 一片空白和一个已经成形的骨架，感受完全不同。
 * 形状刻意做成中心 + 左右分支，和真实产出的双侧布局一致。
 */
export function MapSkeleton() {
  const branches = [
    { top: '8%', width: '78%' },
    { top: '30%', width: '92%' },
    { top: '52%', width: '70%' },
    { top: '74%', width: '86%' },
  ];
  return (
    <div className="relative mx-auto h-44 w-full max-w-lg select-none" aria-hidden="true">
      <svg viewBox="0 0 400 176" className="absolute inset-0 h-full w-full" fill="none">
        {[26, 66, 108, 150].map((y) => (
          <path key={y} d={`M170 88 C 200 88, 200 ${y}, 226 ${y}`} stroke="currentColor" strokeWidth="1.5" className="text-border-strong" />
        ))}
      </svg>
      <div className="absolute left-0 top-1/2 h-9 w-[38%] -translate-y-1/2 animate-pulse rounded-lg bg-brand-100 dark:bg-brand-900/40" />
      {branches.map((branch, index) => (
        <div
          key={branch.top}
          className="absolute right-0 h-7 animate-pulse rounded-lg bg-bg-muted"
          style={{ top: branch.top, width: branch.width, maxWidth: '56%', animationDelay: `${index * 160}ms` }}
        />
      ))}
    </div>
  );
}
