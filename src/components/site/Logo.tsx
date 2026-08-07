/** 标记：一个根节点分出三条枝，直接对应产品在做的事 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 28 28" className="h-6 w-6" aria-hidden="true">
        <rect width="28" height="28" rx="8" fill="var(--color-brand-600)" />
        <g stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round">
          <path d="M9 14h3.5M12.5 14c0-3 .5-4 3-4M12.5 14c0 3 .5 4 3 4" />
        </g>
        <circle cx="8.5" cy="14" r="2" fill="white" />
        <circle cx="17.5" cy="10" r="1.6" fill="white" fillOpacity="0.85" />
        <circle cx="17.5" cy="18" r="1.6" fill="white" fillOpacity="0.85" />
        <circle cx="17.5" cy="14" r="1.6" fill="white" fillOpacity="0.85" />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight">MapAny</span>
    </span>
  );
}
