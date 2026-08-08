export const SITE_URL = process.env.SITE_URL ?? 'https://mindmapany.com';

export interface ToolPage {
  slug: string;
  appPath: string;
  eyebrow: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  primaryKeyword: string;
  relatedKeywords: string[];
  benefits: { title: string; description: string }[];
  steps: { title: string; description: string }[];
  useCases: string[];
  faq: { question: string; answer: string }[];
}

export const TOOL_PAGES: ToolPage[] = [
  {
    slug: 'pdf-to-mind-map',
    appPath: '/app/pdf',
    eyebrow: 'AI 文档结构化工具',
    title: 'PDF 转思维导图',
    description: '上传 PDF，自动识别章节、主题和关键论据，生成可编辑的多层级思维导图；每条结论保留原文页码。',
    seoTitle: 'PDF 转思维导图工具 — AI 自动提炼结构与要点',
    seoDescription: '免费试用 AI PDF 转思维导图工具。上传论文、报告或电子书，生成多层级脑图，节点保留原文页码并支持 PNG、SVG、Markdown 导出。',
    primaryKeyword: 'PDF 转思维导图',
    relatedKeywords: ['PDF 生成脑图', 'AI PDF 总结', '论文转思维导图', 'PDF 内容可视化'],
    benefits: [
      { title: '先理解结构，再生成节点', description: '不是逐段摘抄，而是先识别主题类别，再把事实归入对应分支。' },
      { title: '每个要点可回到原文', description: '节点保留 PDF 页码，核验结论时无需重新翻完整份文档。' },
      { title: '生成后继续编辑', description: '支持增删节点、折叠层级，并导出 PNG、SVG 或 Markdown。' },
    ],
    steps: [
      { title: '上传 PDF', description: '选择文本型 PDF；当前支持最大 20MB、200 页。' },
      { title: '选择深度和用途', description: '根据速读、学习或结构分析需要控制脑图层级。' },
      { title: '检查来源并导出', description: '查看页码引用，调整节点后保存或导出结果。' },
    ],
    useCases: ['快速阅读研究论文', '梳理行业报告与白皮书', '将教材章节整理成复习框架', '提取合同或规则文件的主题结构'],
    faq: [
      { question: '扫描版 PDF 可以生成思维导图吗？', answer: '当前版本主要支持可以选择和复制文字的 PDF，扫描件 OCR 将在后续版本开放。' },
      { question: '生成的节点为什么带页码？', answer: '系统在文档切块阶段记录页码，模型只引用已存在的内容块，因此可以从节点回到对应页面。' },
      { question: 'PDF 会永久保存吗？', answer: '生成流程只为处理当前请求读取文件；只有你主动保存脑图时，结构化结果才会进入个人脑图库。' },
    ],
  },
  {
    slug: 'youtube-to-mind-map',
    appPath: '/app/youtube',
    eyebrow: 'AI 视频学习工具',
    title: 'YouTube 视频转思维导图',
    description: '粘贴公开视频链接，把长视频字幕整理成结构清晰的脑图，并从节点跳回对应时间点。',
    seoTitle: 'YouTube 转思维导图 — 带时间戳的 AI 视频总结',
    seoDescription: '粘贴 YouTube 链接，自动读取字幕并生成多层级思维导图。节点保留视频时间戳，适合课程、访谈与演讲总结。',
    primaryKeyword: 'YouTube 转思维导图',
    relatedKeywords: ['视频转脑图', 'YouTube 视频总结', '视频字幕总结', '课程视频笔记'],
    benefits: [
      { title: '一小时视频压缩成一张图', description: '用主题分支呈现内容脉络，比线性摘要更容易快速浏览。' },
      { title: '时间戳可追溯', description: '点击来源提示即可定位到对应片段，重要信息能够回看核验。' },
      { title: '适合跨语言学习', description: '原视频和输出语言互不限制，可以直接生成中文学习框架。' },
    ],
    steps: [
      { title: '粘贴 YouTube 链接', description: '使用带公开字幕的视频链接。' },
      { title: '自动读取字幕', description: '系统按时间切分字幕并识别主题之间的层级。' },
      { title: '查看脑图与时间点', description: '编辑节点，按时间戳复看原片段并导出。' },
    ],
    useCases: ['整理公开课和教学视频', '提取访谈与播客视频观点', '复盘产品演示与行业分享', '生成带时间点的学习笔记'],
    faq: [
      { question: '没有字幕的视频可以处理吗？', answer: '当前依赖公开视频字幕，暂不包含语音转录；没有字幕时会提示无法提取。' },
      { question: '时间戳准确吗？', answer: '时间点来自字幕分段而非模型猜测，通常会落在对应内容开始附近。' },
      { question: '可以总结其他视频平台吗？', answer: '目前公开版本先支持 YouTube，后续会把视频输入能力扩展到更多来源。' },
    ],
  },
  {
    slug: 'text-to-mind-map',
    appPath: '/app/text',
    eyebrow: 'AI 内容整理工具',
    title: '文本转思维导图',
    description: '粘贴文章、笔记或会议纪要，AI 自动归纳主题和层级，把线性文字转换为可编辑的知识结构。',
    seoTitle: '文本转思维导图 — AI 自动生成多层级脑图',
    seoDescription: '免费试用文本转思维导图工具。粘贴长文本、笔记或会议纪要，AI 自动分类并生成可编辑、可导出的多层级脑图。',
    primaryKeyword: '文本转思维导图',
    relatedKeywords: ['文字生成脑图', 'AI 思维导图生成器', '笔记转思维导图', '会议纪要脑图'],
    benefits: [
      { title: '自动提炼主题', description: '先建立主要类别，再将细节归入分支，避免所有信息挤在中心节点。' },
      { title: '三档信息深度', description: '可以选择简洁、标准或详细模式，匹配速览与深度学习。' },
      { title: '不是静态图片', description: '生成后可继续修改文字、添加节点、折叠层级和导出。' },
    ],
    steps: [
      { title: '粘贴文本', description: '输入文章、记录、说明文档或任意长文本。' },
      { title: '选择生成目标', description: '按学习、结构分析、会议或通用理解调整输出。' },
      { title: '整理并带走', description: '检查层级，手动编辑后导出或生成分享链接。' },
    ],
    useCases: ['把读书笔记变成知识框架', '将会议纪要拆成议题与行动项', '整理产品需求和项目计划', '从长文章快速建立整体认识'],
    faq: [
      { question: '一次可以粘贴多长的文本？', answer: '匿名试用适合较短内容，登录后的上限会根据套餐和生成深度调整。' },
      { question: '是否支持中英文混合文本？', answer: '支持。你可以单独指定输出语言，系统会统一节点语言。' },
      { question: '生成后可以增加子节点吗？', answer: '可以。选中节点后按 Tab 新增子节点，按 Enter 新增同级节点。' },
    ],
  },
  {
    slug: 'webpage-to-mind-map',
    appPath: '/app/web',
    eyebrow: 'AI 网页阅读工具',
    title: '网页文章转思维导图',
    description: '输入文章链接，自动提取正文、过滤导航和广告，并将主要观点整理成多层级脑图。',
    seoTitle: '网页转思维导图 — AI 提取文章正文并生成脑图',
    seoDescription: '粘贴网页或文章链接，AI 自动提取正文并生成结构清晰的思维导图。支持编辑、分享与 PNG、SVG、Markdown 导出。',
    primaryKeyword: '网页转思维导图',
    relatedKeywords: ['文章转脑图', '网页文章总结', 'URL 生成思维导图', '网站内容摘要'],
    benefits: [
      { title: '自动过滤页面噪音', description: '尽量排除导航、广告和推荐模块，只保留主要文章内容。' },
      { title: '保留文章语义结构', description: '根据标题、段落与论证关系归纳主题，而不是按页面顺序机械切分。' },
      { title: '从阅读直接进入整理', description: '链接输入后得到可编辑脑图，适合研究、收藏和团队分享。' },
    ],
    steps: [
      { title: '粘贴公开链接', description: '输入无需登录即可访问的文章或网页 URL。' },
      { title: '提取并分析正文', description: '系统识别主要内容，分块后生成主题层级。' },
      { title: '核对并导出', description: '检查关键观点，编辑后保存或分享。' },
    ],
    useCases: ['整理行业文章和新闻分析', '归纳产品文档与知识库', '快速比较多篇参考资料', '将收藏文章转换成复习结构'],
    faq: [
      { question: '所有网页都可以提取吗？', answer: '公开的服务端可访问文章成功率最高；登录墙、严格反爬和纯客户端渲染页面可能无法提取。' },
      { question: '会把网页广告也放进脑图吗？', answer: '系统会使用正文识别过滤常见导航和广告区域，但结构异常的页面仍可能包含少量噪音。' },
      { question: '可以输入新闻和博客吗？', answer: '可以，新闻、博客、百科和公开文档都是适合的输入类型。' },
    ],
  },
];

export interface BlogSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: '指南' | '方法' | '对比';
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  author: string;
  primaryKeyword: string;
  relatedTool: string;
  sections: BlogSection[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'ai-mind-map-guide',
    title: 'AI 思维导图完整指南：从信息提取到可用知识结构',
    description: '了解 AI 思维导图如何把长文本、PDF、网页和视频转换成层级结构，以及判断生成质量的实用标准。',
    category: '指南',
    publishedAt: '2026-08-08',
    updatedAt: '2026-08-08',
    readingMinutes: 8,
    author: 'MindMapAny 编辑部',
    primaryKeyword: 'AI 思维导图',
    relatedTool: '/tools/text-to-mind-map',
    sections: [
      {
        id: 'what-is-ai-mind-map',
        title: '什么是 AI 思维导图',
        paragraphs: [
          'AI 思维导图不是把一段文字换成彩色方框，而是先识别内容中的主题、从属关系和关键信息，再把这些关系转换成可以浏览和编辑的树状结构。好的结果应该让读者先看到全局，再逐层进入细节。',
          '传统自动摘要主要压缩文字长度，思维导图则强调信息之间的关系。对于论文、报告、课程视频和规则文档，结构往往比一段更短的文字更有价值。',
        ],
      },
      {
        id: 'quality-criteria',
        title: '如何判断生成的脑图是否可靠',
        paragraphs: ['层级数量并不是越多越好。真正重要的是同一层节点处在相似的抽象程度，而且每个具体结论能够回到来源。'],
        bullets: ['根节点通常保持 4–8 个主要主题', '具体日期、金额和条款不应直接挤在根节点下', '同级主题尽量互不重叠并覆盖全文', '叶子节点应完整表达一个要点', '重要事实应保留页码、时间戳或原文位置'],
      },
      {
        id: 'input-types',
        title: '不同输入类型需要不同的处理方式',
        paragraphs: [
          'PDF 需要保留页码并识别章节；视频需要先获得字幕并绑定时间点；网页需要过滤导航和广告；纯文本则更依赖语义分类。统一的画布不代表背后的提取流程相同。',
          '因此，选择工具时不能只看最终图片是否漂亮，还要检查它是否真的理解了内容来源、是否允许编辑，以及是否能回到原文验证。',
        ],
      },
      {
        id: 'workflow',
        title: '推荐的使用流程',
        paragraphs: ['把 AI 生成结果当作第一版结构，而不是不可修改的答案。先检查一级主题，再核对关键叶子节点，最后根据使用目的调整深度。'],
        bullets: ['先用标准深度了解全局', '折叠到 L2 检查主题分类是否合理', '展开关键分支核对来源', '删除重复节点并补充自己的判断', '导出 Markdown 进入后续写作或项目流程'],
      },
      {
        id: 'limitations',
        title: 'AI 思维导图的边界',
        paragraphs: [
          '模型可能遗漏例外条款、错误合并相近概念，或把不同抽象层次放到一起。涉及法律、医疗、财务等高风险材料时，脑图只能用于导航，不能替代原文和专业判断。',
          '可追溯来源、可编辑节点和清晰的层级控制，是降低这些风险的三个基础能力。',
        ],
      },
    ],
  },
  {
    slug: 'how-to-convert-pdf-to-mind-map',
    title: '如何把 PDF 转成思维导图：从上传到核验的完整流程',
    description: '一步步把论文、报告和电子书转换为可编辑脑图，并通过页码引用检查 AI 提取结果。',
    category: '方法',
    publishedAt: '2026-08-08',
    updatedAt: '2026-08-08',
    readingMinutes: 6,
    author: 'MindMapAny 编辑部',
    primaryKeyword: 'PDF 转思维导图',
    relatedTool: '/tools/pdf-to-mind-map',
    sections: [
      {
        id: 'prepare-pdf',
        title: '第一步：确认 PDF 是否适合解析',
        paragraphs: ['能够选择和复制文字的 PDF 最适合自动处理。扫描件、加密文件和复杂双栏排版可能降低文本提取质量，应先进行 OCR 或检查导出的文本是否完整。'],
      },
      {
        id: 'choose-depth',
        title: '第二步：根据任务选择深度',
        paragraphs: ['快速判断报告内容时使用简洁模式；学习论文和政策文件时使用标准模式；需要保留更多细节时再选择详细模式。深度越高不代表分类一定越好，仍需检查一级主题。'],
      },
      {
        id: 'check-structure',
        title: '第三步：先检查主题，再检查细节',
        paragraphs: ['生成完成后先折叠到 L2。如果中心节点下面仍然直接挂着大量日期、金额和具体句子，说明结构过于扁平。合理的导图会先出现“研究背景、方法、结果”等类别。'],
        bullets: ['一级主题是否处于同一抽象层次', '每个主题是否包含至少一个有效子分支', '是否出现重复或近义主题', '重要章节是否被遗漏'],
      },
      {
        id: 'verify-source',
        title: '第四步：用页码核验关键结论',
        paragraphs: ['对数字、限制条件、结论和例外条款，点击页码回到原文。AI 的作用是缩短定位时间，不是取消核验步骤。对于需要引用的内容，应以 PDF 原文为准。'],
      },
      {
        id: 'reuse-output',
        title: '第五步：把结构用于后续工作',
        paragraphs: ['导出图片适合演示和分享，SVG 适合继续排版，Markdown 则适合写作、复习卡片和知识库。一个好的 PDF 脑图应该成为后续工作的入口，而不是只看一次的图片。'],
      },
    ],
  },
  {
    slug: 'mind-map-vs-summary',
    title: '思维导图和文字摘要有什么区别？如何选择信息整理方式',
    description: '比较思维导图与线性摘要在速读、学习、研究和汇报中的差异，帮助你选择合适的输出形式。',
    category: '对比',
    publishedAt: '2026-08-08',
    updatedAt: '2026-08-08',
    readingMinutes: 5,
    author: 'MindMapAny 编辑部',
    primaryKeyword: '思维导图和摘要的区别',
    relatedTool: '/tools/text-to-mind-map',
    sections: [
      {
        id: 'core-difference',
        title: '核心区别：压缩文字还是呈现关系',
        paragraphs: ['文字摘要把长内容压缩为更短的线性文本，适合连续阅读；思维导图把主题和从属关系放到空间结构中，适合快速定位、比较分支和建立整体认识。'],
      },
      {
        id: 'when-summary',
        title: '什么时候更适合使用文字摘要',
        paragraphs: ['当内容本身按时间或论证顺序推进、需要保留完整语气，或者读者最终仍要连续阅读时，文字摘要通常更自然。新闻简报、邮件和执行摘要都属于这种情况。'],
      },
      {
        id: 'when-mind-map',
        title: '什么时候更适合使用思维导图',
        paragraphs: ['当材料包含多个并列主题、分类规则、概念层级或需要反复复习时，脑图更容易暴露结构。论文综述、课程章节、政策规则和项目计划尤其适合。'],
      },
      {
        id: 'combine',
        title: '更高效的方法是组合使用',
        paragraphs: ['先用思维导图建立全局框架，再对关键分支生成文字说明，通常比只选择一种形式更有效。导图负责导航，摘要负责叙述，原文负责证据。'],
        bullets: ['第一次阅读：用脑图看结构', '深入理解：阅读关键分支对应原文', '输出分享：根据受众选择图片或摘要', '长期复习：保留可折叠的层级与来源'],
      },
    ],
  },
];

export function getToolPage(slug: string): ToolPage | undefined {
  return TOOL_PAGES.find((tool) => tool.slug === slug);
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
