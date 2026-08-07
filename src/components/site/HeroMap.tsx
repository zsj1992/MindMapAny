/**
 * 首屏示意图。用内联 SVG 而不是截图：矢量在任何分辨率下都清晰、
 * 跟随主题变色、不增加图片请求，还能直接展示产品最核心的卖点 —— 节点上的页码徽标。
 */

interface Item {
  label: string;
  badge?: string;
  y: number;
}

const BRANCHES: { title: string; y: number; children: Item[] }[] = [
  {
    title: '研究背景',
    y: 52,
    children: [
      { label: '现有方法局限', badge: 'p.2', y: 24 },
      { label: '核心问题定义', badge: 'p.3', y: 62 },
    ],
  },
  {
    title: '方法设计',
    y: 132,
    children: [
      { label: '模型结构', badge: 'p.5', y: 104 },
      { label: '训练策略', badge: 'p.7', y: 142 },
      { label: '消融实验', badge: 'p.9', y: 180 },
    ],
  },
  {
    title: '结论与展望',
    y: 212,
    children: [{ label: '主要贡献', badge: 'p.12', y: 222 }],
  },
];

export function HeroMap({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 264"
      className={className}
      role="img"
      aria-label="示例：一篇论文被转换成三级思维导图，节点上标注了原文页码"
    >
      <defs>
        <linearGradient id="hm-root" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-brand-600)" />
          <stop offset="100%" stopColor="var(--color-brand-400)" />
        </linearGradient>
      </defs>

      {/* 连线先画，保证节点覆盖在上面 */}
      <g fill="none" stroke="var(--border-strong)" strokeWidth="1.5">
        {BRANCHES.map((b) => (
          <path key={b.title} d={`M136 132 C 176 132, 176 ${b.y + 14}, 208 ${b.y + 14}`} />
        ))}
        {BRANCHES.flatMap((b) =>
          b.children.map((c) => (
            <path key={c.label} d={`M336 ${b.y + 14} C 372 ${b.y + 14}, 372 ${c.y + 13}, 404 ${c.y + 13}`} />
          )),
        )}
      </g>

      {/* 根节点 */}
      <g>
        <rect x="16" y="110" width="120" height="44" rx="11" fill="url(#hm-root)" />
        <text x="76" y="137" textAnchor="middle" className="fill-white text-[13px] font-medium">
          研究论文
        </text>
      </g>

      {/* 一级分支 */}
      {BRANCHES.map((b) => (
        <g key={b.title}>
          <rect
            x="208"
            y={b.y}
            width="128"
            height="28"
            rx="8"
            fill="var(--surface)"
            stroke="var(--border-strong)"
          />
          <text x="272" y={b.y + 18} textAnchor="middle" fill="var(--text)" className="text-[12px]">
            {b.title}
          </text>
        </g>
      ))}

      {/* 叶子节点 + 页码徽标 */}
      {BRANCHES.flatMap((b) =>
        b.children.map((c) => (
          <g key={c.label}>
            <rect
              x="404"
              y={c.y}
              width="140"
              height="26"
              rx="7"
              fill="var(--bg-subtle)"
              stroke="var(--border)"
            />
            <text x="416" y={c.y + 17} fill="var(--text-muted)" className="text-[11px]">
              {c.label}
            </text>
            {c.badge && (
              <>
                <rect
                  x="552"
                  y={c.y + 4}
                  width="34"
                  height="18"
                  rx="5"
                  fill="var(--color-accent-500)"
                  fillOpacity="0.14"
                />
                <text
                  x="569"
                  y={c.y + 17}
                  textAnchor="middle"
                  fill="var(--color-accent-600)"
                  className="text-[10px] font-medium"
                >
                  {c.badge}
                </text>
              </>
            )}
          </g>
        )),
      )}
    </svg>
  );
}
