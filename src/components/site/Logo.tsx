/** 标记：把任何内容映射出来的折叠地图与知识定位点 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7 drop-shadow-sm" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#12345B" />
        <path d="M4.5 8.5l7.5-2.5 8 3 7.5-2.5v17l-7.5 2.5-8-3-7.5 2.5z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 6v17M20 9v17" fill="none" stroke="#12345B" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="4" fill="#34D3BE" stroke="#12345B" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="1.25" fill="white" />
      </svg>
      <span className="text-[15px] font-bold tracking-[-0.02em]">MindMapAny</span>
    </span>
  );
}
