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
    title: '四种输入，一条管线',
    body: '粘贴文本、上传 PDF、丢一个网页链接或 YouTube 地址。提取方式不同，出来的结构一样干净。',
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
    body: 'PDF 节点标着页码，视频节点标着时间戳。位置在切块阶段就锚定好，不是让模型凭印象编出来的。',
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
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-brand-600">为什么不是又一个 AI 摘要工具</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          结构要站得住，来源要查得到
        </h2>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="card p-6 transition-colors hover:border-brand-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
              {f.icon}
            </div>
            <h3 className="mt-4 font-medium">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const STEPS = [
  { n: '01', title: '丢进内容', body: '文本、PDF、网页或 YouTube 链接，选好输出语言、深度和用途。' },
  { n: '02', title: '等几秒', body: '系统提取正文、切块并锚定位置，再让模型输出层级结构。' },
  { n: '03', title: '改完带走', body: '直接在画布上编辑，导出 PNG / SVG / Markdown，或生成公开链接。' },
];

export function HowItWorks() {
  return (
    <section className="border-y bg-bg-subtle" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">三步就完事</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="relative">
              <span className="text-sm font-semibold tabular-nums text-brand-500">{s.n}</span>
              <h3 className="mt-2 font-medium">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{s.body}</p>
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
    a: '目前支持粘贴文本、PDF 文件（最大 20MB / 200 页）、公开网页链接，以及带字幕的 YouTube 视频。扫描版 PDF、音视频文件、PPT 和 Excel 暂不支持。',
  },
  {
    q: '节点上的页码准确吗？',
    a: '准确。内容在切块阶段就把每一块和它的页码、时间戳绑定好了，模型只负责引用块的编号，位置信息由系统查表还原，不经过模型生成。',
  },
  {
    q: '为什么有的网页抓不到内容？',
    a: '需要登录、有反爬保护，或者完全依赖 JavaScript 渲染的页面，当前版本无法提取正文。普通文章页、文档站、博客一般没问题。',
  },
  {
    q: '没有字幕的视频能处理吗？',
    a: '暂时不能。首版只读取视频已有的字幕轨，语音转录会在后续版本加入。',
  },
  {
    q: '生成的脑图归谁？',
    a: '归你。可以随时导出、删除。分享链接默认关闭，只有你主动打开公开后别人才能访问。',
  },
  {
    q: '免费能用多少？',
    a: '注册即赠送额度，够完整体验文本和网页输入。PDF、YouTube 和高质量模型需要付费套餐。',
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:py-24">
      <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">常见问题</h2>
      <div className="mt-10 space-y-3">
        {FAQS.map((f) => (
          <details key={f.q} className="card group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
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
