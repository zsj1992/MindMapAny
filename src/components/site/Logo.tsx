/** 标记：一个根节点分出三条枝，直接对应产品在做的事 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7 drop-shadow-sm" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#12345B" />
        <g stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d="M10 16h6M16 16c0-4 .8-6.5 5.2-6.5M16 16h5.2M16 16c0 4 .8 6.5 5.2 6.5" />
        </g>
        <circle cx="8" cy="16" r="3.25" fill="#34D3BE" stroke="#12345B" />
        <circle cx="24.5" cy="9.5" r="2.4" fill="white" />
        <circle cx="24.5" cy="16" r="2.4" fill="white" />
        <circle cx="24.5" cy="22.5" r="2.4" fill="white" />
      </svg>
      <span className="text-[15px] font-bold tracking-[-0.02em]">MindMapAny</span>
    </span>
  );
}
