import type { ReactNode } from 'react';

/* 落地页的信息区块。纯服务端组件，不带任何交互，保证首屏和 SEO。 */

function Icon({ path }: { path: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
      {path}
    </svg>
  );
}

const FEATURES = [
  {
    title: '多种输入，一条管线',
    body: '粘贴文本、上传 PDF / DOCX / EPUB / PPTX，或丢一个网页链接。提取方式不同，出来的结构一样干净。',
    icon: (
      <Icon
        path={
          <>
            <path strokeLinecap="round" d="M4 7h16M4 12h10M4 17h7" />
            <circle cx="18.5" cy="16.5" r="3" />
          </>
        }
      />
    ),
  },
  {
    title: '每个节点都能回到原文',
    body: 'PDF 节点标着页码，PPTX 节点标着幻灯片位置。位置在切块阶段就锚定好，不是让模型凭印象编出来的。',
    icon: (
      <Icon
        path={
          <>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="9" />
          </>
        }
      />
    ),
  },
  {
    title: '层级稳定，不是流水账',
    body: '长文档走分段摘要再合并，重复主题会被合并，孤立节点会被剔除。三档深度对应不同的层数和节点预算。',
    icon: (
      <Icon
        path={
          <>
            <rect x="3" y="4" width="7" height="5" rx="1.5" />
            <rect x="14" y="10" width="7" height="4" rx="1.5" />
            <rect x="14" y="16" width="7" height="4" rx="1.5" />
            <path strokeLinecap="round" d="M10 6.5h2a2 2 0 012 2V12m-2 0h2m-4-5.5h2a2 2 0 012 2V18h2" />
          </>
        }
      />
    ),
  },
  {
    title: '生成完还能改',
    body: '双击改字，Tab 加子节点，Enter 加同级，空格折叠。不是一张只能看的静态图。',
    icon: (
      <Icon
        path={<path strokeLinecap="round" strokeLinejoin="round" d="M4 20h4L18.5 9.5a2.1 2.1 0 00-3-3L5 17v3z" />}
      />
    ),
  },
  {
    title: '导出与分享',
    body: 'PNG、SVG、Markdown 一键导出。生成公开链接后，别人不用注册也能看。',
    icon: (
      <Icon
        path={
          <>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V3m0 0L8 7m4-4l4 4" />
            <path strokeLinecap="round" d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </>
        }
      />
    ),
  },
  {
    title: '30+ 语言输出',
    body: '英文论文可以直接产出中文脑图，原文语言和输出语言互不影响。',
    icon: (
      <Icon
        path={
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a15 15 0 010 18a15 15 0 010-18z" />
          </>
        }
      />
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:py-28 lg:px-8">
      <div className="max-w-2xl">
        <p className="eyebrow">为认真阅读而设计</p>
        <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
          不止是摘要，是真正可用的知识结构
        </h2>
        <p className="mt-4 text-base leading-7 text-text-muted">从提取、理解到编辑与分享，每一步都围绕“可信、清晰、可回溯”设计。</p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, index) => (
          <div
            key={f.title}
            className={`card group relative overflow-hidden p-6 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-xl ${index === 1 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
          >
            <span className="absolute right-5 top-4 text-4xl font-bold text-bg-muted">0{index + 1}</span>
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#102f53] text-white shadow-sm">
              {f.icon}
            </div>
            <h3 className="relative mt-5 text-base font-bold">{f.title}</h3>
            <p className="relative mt-2 text-sm leading-7 text-text-muted">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const STEPS = [
  { n: '01', title: '丢进内容', body: '文本、文档、电子书或网页链接，选好输出语言、深度和用途。' },
  { n: '02', title: '等几秒', body: '系统提取正文、切块并锚定位置，再让模型输出层级结构。' },
  { n: '03', title: '改完带走', body: '直接在画布上编辑，导出 PNG / SVG / Markdown，或生成公开链接。' },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y bg-[#0d2948] text-white" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">工作流程</p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">三步，把长内容变成清晰决策</h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-300 text-xs font-bold tabular-nums text-[#0d2948]">{s.n}</span>
              <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-7 text-blue-100/70">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: '支持哪些输入格式？',
    a: '目前支持粘贴文本、PDF、DOCX、EPUB、PPTX、TXT、Markdown 和公开网页链接。单个文件最大 20MB；扫描版 PDF、音视频和旧版 DOC 暂不支持。',
  },
  {
    q: '节点上的页码准确吗？',
    a: '准确。内容在切块阶段就把每一块和页码或章节位置绑定好了，模型只负责引用块的编号，位置信息由系统查表还原，不经过模型生成。',
  },
  {
    q: '为什么有的网页抓不到内容？',
    a: '需要登录、有反爬保护，或者完全依赖 JavaScript 渲染的页面，当前版本无法提取正文。普通文章页、文档站、博客一般没问题。',
  },
  {
    q: '生成的脑图归谁？',
    a: '归你。可以随时导出、删除。分享链接默认关闭，只有你主动打开公开后别人才能访问。',
  },
  {
    q: '免费能用多少？',
    a: '注册即赠送额度，够完整体验文本和网页输入。长文档和高质量模型会按当前套餐与额度计费。',
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-4xl px-5 py-20 sm:py-28">
      <div className="text-center">
        <p className="eyebrow">FAQ</p>
        <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">你可能还想知道</h2>
      </div>
      <div className="mt-10 space-y-3">
        {FAQS.map((f) => (
          <details key={f.q} className="card group px-5 py-5 sm:px-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
              {f.q}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 shrink-0 text-text-subtle transition-transform group-open:rotate-180"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{f.a}</p>
          </details>
        ))}
      </div>

      {/* FAQ 结构化数据：这类页面拿富媒体结果的概率很高，成本几乎为零 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
    </section>
  );
}
