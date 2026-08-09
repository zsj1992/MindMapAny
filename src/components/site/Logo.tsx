/** 标记：四个信息节点汇聚为中心知识块 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7 drop-shadow-sm" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#12345B" />
        <g fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
          <path d="M8.5 8.5l5 5M23.5 8.5l-5 5M8.5 23.5l5-5M23.5 23.5l-5-5" />
        </g>
        <g fill="white">
          <rect x="5" y="5" width="7" height="7" rx="2.3" />
          <rect x="20" y="5" width="7" height="7" rx="2.3" />
          <rect x="5" y="20" width="7" height="7" rx="2.3" />
          <rect x="20" y="20" width="7" height="7" rx="2.3" />
        </g>
        <rect x="11" y="11" width="10" height="10" rx="3.2" fill="#34D3BE" stroke="#12345B" strokeWidth="1.5" />
      </svg>
      <span className="text-[15px] font-bold tracking-[-0.02em]">MindMapAny</span>
    </span>
  );
}
