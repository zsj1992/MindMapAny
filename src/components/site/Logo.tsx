/** 标记：一个根节点分出三条枝，直接对应产品在做的事 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7 drop-shadow-sm" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#12345B" />
        <g stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round">
          <path d="M9.5 16h4M13.5 16c0-3.5.5-5 3.6-5M13.5 16c0 3.5.5 5 3.6 5" />
        </g>
        <circle cx="9" cy="16" r="2.25" fill="#34D3BE" />
        <circle cx="19.5" cy="11" r="1.8" fill="white" />
        <circle cx="19.5" cy="21" r="1.8" fill="white" />
        <circle cx="19.5" cy="16" r="1.8" fill="white" />
      </svg>
      <span className="text-[15px] font-bold tracking-[-0.02em]">MindMapAny</span>
    </span>
  );
}
