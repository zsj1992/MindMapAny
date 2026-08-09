/** 标记：品牌首字母 M 与中心知识节点的组合 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7 drop-shadow-sm" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#12345B" />
        <path d="M7.5 23.5v-15l8.5 9.5 8.5-9.5v15" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="18" r="3" fill="#34D3BE" stroke="#12345B" />
      </svg>
      <span className="text-[15px] font-bold tracking-[-0.02em]">MindMapAny</span>
    </span>
  );
}
