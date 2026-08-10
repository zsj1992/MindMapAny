import type { Locale } from './locales';

/**
 * 营销页文案。按语言整块给，而不是拆成几百个扁平 key ——
 * 长文案要判断译得对不对，得能整段对照着读；散成 key 之后没人看得出上下文。
 *
 * 价格、货币、产品名不进这里：那些不该随语言变。
 */

export interface PricingPlanCopy {
  name: string;
  eyebrow: string;
  description: string;
  price: string;
  annualPrice: string;
  creditLabel: string;
  extras: string[];
  action: string;
}

export interface SectionItem {
  title: string;
  body: string;
  detail: string;
}

export interface MarketingCopy {
  home: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    headingLead: string;
    headingHighlight: string;
    lede: string;
    ctaPrimary: string;
    ctaSecondary: string;
    worksWith: string;
    inputLabels: string[];
    sourceDocLabel: string;
    sourceDocPages: string;
    panelTitle: string;
    panelNodes: string;
    panelTrace: string;
    panelFooter: string[];
    stats: [string, string][];
    ctaEyebrow: string;
    ctaHeading: string;
    ctaBody: string;
    ctaButton: string;
  };
  features: {
    eyebrow: string;
    lede: string;
    headingA: string;
    headingB: string;
    items: SectionItem[];
    pipelineLabel: string;
    pipelineStages: string[];
    pipelineNote: string;
  };
  inputTypes: {
    eyebrow: string;
    lede: string;
    heading: string;
    items: { name: string; anchor: string; body: string; linkLabel: string }[];
  };
  howItWorks: {
    eyebrow: string;
    heading: string;
    steps: { title: string; body: string }[];
  };
  faq: {
    eyebrow: string;
    headingA: string;
    headingB: string;
    lede: string;
    items: { q: string; a: string }[];
  };
  nav: {
    tools: string;
    blog: string;
    pricing: string;
    faq: string;
    signIn: string;
    startFree: string;
    workbench: string;
    workbenchShort: string;
    toolsGroups: { documents: string; textWeb: string };
    deepResearch: string;
    deepResearchHint: string;
    allTools: string;
    allToolsHint: string;
    toolLabels: string[];
    switchTo: string;
  };
  footer: {
    tagline: string;
    columns: { title: string; labels: string[] }[];
    legal: string;
  };
  toolsIndex: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    heading: string;
    lede: string;
    viewDetails: string;
  };
  toolPage: {
    startFree: string;
    goodFor: string;
    benefitsHeading: string;
    stepsHeading: string;
    faqHeading: string;
    ctaHeading: string;
    ctaBody: string;
    relatedHeading: string;
    breadcrumbHome: string;
    breadcrumbTools: string;
    seePlans: string;
  };
  pricing: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    heading: string;
    intro: string;
    badge: string;
    mostPopular: string;
    subscribeYearly: string;
    subscribeMonthly: string;
    limitFastOnly: string;
    limitBoth: string;
    limitChars: string;
    limitPdfPages: string;
    teamHeading: string;
    teamBody: string;
    teamAction: string;
    footnoteEmail: string;
    footnoteRenewal: string;
    footnoteCancel: string;
    footnoteRefund: string;
    plans: Record<'free' | 'basic' | 'pro' | 'unlimited', PricingPlanCopy>;
  };
}

const en: MarketingCopy = {
  toolPage: {
    startFree: 'Start free',
    goodFor: 'Good for',
    benefitsHeading: 'Not just a summary — a structure you can keep using',
    stepsHeading: 'Three steps',
    faqHeading: 'Frequently asked questions',
    ctaHeading: 'Turn your content into a clear map',
    ctaBody: 'Nothing to install — just open your browser and try it.',
    relatedHeading: 'Related guides',
    breadcrumbHome: 'Home',
    breadcrumbTools: 'Tools',
    seePlans: 'See plans & limits',
  },
  toolsIndex: {
    metaTitle: 'AI mind map tools',
    metaDescription:
      'Use AI to turn PDFs, Word files, ebooks, web articles and long text into editable, traceable multi-level mind maps.',
    eyebrow: 'Pick a tool by content type',
    heading: 'AI mind map tools',
    lede: 'Each content type gets its own extraction pipeline, and they all end in the same editable, collapsible, source-linked structure.',
    viewDetails: 'View tool details',
  },
  nav: {
    tools: 'Tools',
    blog: 'Blog',
    pricing: 'Pricing',
    faq: 'FAQ',
    signIn: 'Sign in',
    startFree: 'Start free',
    workbench: 'Open workbench',
    workbenchShort: 'Workbench',
    toolsGroups: { documents: 'Documents', textWeb: 'Text & web' },
    deepResearch: 'Deep research',
    deepResearchHint: 'Multi-source report with citations',
    allTools: 'All tools',
    allToolsHint: 'Browse every input type',
    toolLabels: [
      'PDF to mind map',
      'Word to mind map',
      'PowerPoint to mind map',
      'EPUB to mind map',
      'Text to mind map',
      'Web page to mind map',
    ],
    switchTo: '中文',
  },
  footer: {
    tagline: 'Turn complex content into clear, editable, traceable knowledge structures.',
    columns: [
      { title: 'Product', labels: ['Tools', 'Pricing', 'My mind maps', 'FAQ'] },
      {
        title: 'Tools & resources',
        labels: [
          'PDF to mind map',
          'Word to mind map',
          'EPUB to mind map',
          'PowerPoint to mind map',
          'Text to mind map',
          'Web page to mind map',
          'Blog',
        ],
      },
      {
        title: 'Support & legal',
        labels: ['Contact support', 'Manage subscription', 'Privacy Policy', 'Terms of Service', 'Refunds & cancellation'],
      },
    ],
    legal: 'Payments processed by Creem as Merchant of Record',
  },
  home: {
    metaTitle: 'MindMapAny — Turn any content into a clear, traceable mind map',
    metaDescription:
      'Paste text, or upload a PDF, Word, EPUB, PPTX or web article, and get an editable, source-traceable mind map in seconds.',
    eyebrow: 'MINDMAPANY / CONTENT INTELLIGENCE',
    headingLead: 'Long content starts with',
    headingHighlight: 'structure',
    lede:
      'Turn papers, reports, Word files, ebooks and web pages into mind maps with real hierarchy. Not a shorter summary — a map of the content you can edit and verify against the original.',
    ctaPrimary: 'Create a mind map free',
    ctaSecondary: 'Why not just a summary',
    worksWith: 'WORKS DIRECTLY WITH',
    inputLabels: ['Long text', 'PDF', 'Word', 'EPUB', 'PPTX', 'Web articles'],
    sourceDocLabel: 'Source document',
    sourceDocPages: '48-page PDF',
    panelTitle: 'AI research report / methods & findings',
    panelNodes: '42 nodes',
    panelTrace: 'Every node traces back to the source',
    panelFooter: ['Editable nodes', 'Page citations', 'PNG / SVG / MD'],
    stats: [
      ['7', 'input formats'],
      ['30+', 'output languages'],
      ['110', 'max nodes per map'],
      ['Traceable', 'page & section anchors'],
    ],
    ctaEyebrow: 'READY WHEN YOU ARE',
    ctaHeading: 'Stop starting long documents on page one.',
    ctaBody:
      'Upload your content, see the whole structure first, then decide which sections are worth reading closely. Create a free account and 30 credits are waiting.',
    ctaButton: 'Create your first map',
  },
  features: {
    eyebrow: 'CAPABILITIES',
    lede: 'Built for people who need to read, verify and organise long content carefully.',
    headingA: 'A summary tells you what was said.',
    headingB: 'Structure tells you why.',
    items: [
      {
        title: 'Many inputs, one pipeline',
        body: 'Paste text, upload a PDF / DOCX / EPUB / PPTX, or drop in a web link. Extraction differs per format; the structure that comes out is equally clean.',
        detail: '7 sources',
      },
      {
        title: 'Every node traces back',
        body: 'PDF nodes carry page numbers, PPTX nodes carry slide positions. Locations are anchored during chunking, not invented by the model after the fact.',
        detail: 'Deterministic citations',
      },
      {
        title: 'Stable hierarchy, not a flat list',
        body: 'Long documents are summarised section by section and then merged; duplicate topics collapse and orphan nodes are dropped. Three depth settings map to different level and node budgets.',
        detail: 'Up to 5 levels',
      },
      {
        title: 'Editable after generation',
        body: 'Double-click to rename, Tab for a child node, Enter for a sibling, Space to collapse. Not a static image you can only look at.',
        detail: 'Keyboard editing',
      },
      {
        title: 'Export and share',
        body: 'One-click export to PNG, SVG or Markdown. Turn on a public link and others can view it without signing up.',
        detail: '3 export formats',
      },
      {
        title: '30+ output languages',
        body: 'Read a paper in one language and get the map in another. Source language and output language are independent.',
        detail: 'Cross-language',
      },
    ],
    pipelineLabel: 'ONE PIPELINE',
    pipelineStages: ['Extract', 'Chunk & anchor', 'Build hierarchy', 'Edit'],
    pipelineNote:
      'Only the first step differs per format. Everything after it is shared, which is why a slide deck and a research paper come out equally structured.',
  },
  inputTypes: {
    eyebrow: 'BY INPUT TYPE',
    lede: 'Each format is extracted differently, and each one anchors its nodes to something different.',
    heading: 'What are you starting from?',
    items: [
      {
        name: 'PDF',
        anchor: 'Page numbers',
        body: 'Papers, reports and white papers. Every node keeps the page it came from, so checking a figure means opening one page rather than re-reading the file. Text-based PDFs only — scans need OCR first.',
        linkLabel: 'PDF to mind map',
      },
      {
        name: 'Word',
        anchor: 'Document order',
        body: 'Specifications, drafts and long reports. Body paragraphs and table text are read in order. A DOCX has no fixed pages until Word renders it, so nodes anchor to position in the document rather than a page number.',
        linkLabel: 'Word to mind map',
      },
      {
        name: 'EPUB',
        anchor: 'Chapter titles',
        body: 'Whole books, read in the order the publisher defined. Nodes carry the chapter they came from, which is the stable anchor for an ebook — page numbers shift with font size. DRM-protected files cannot be opened.',
        linkLabel: 'EPUB to mind map',
      },
      {
        name: 'PowerPoint',
        anchor: 'Slide numbers',
        body: 'Conference talks, training decks and proposals. Slide text is pulled in deck order and every node is labelled with its slide. Speaker notes and images are not read, so decks that hide the substance in notes will map thin.',
        linkLabel: 'PowerPoint to mind map',
      },
      {
        name: 'Long text',
        anchor: 'Paste and go',
        body: 'Meeting minutes, transcripts, research notes, anything you can select and copy. The fastest way to see whether a pile of unstructured writing actually holds a coherent argument.',
        linkLabel: 'Long text to mind map',
      },
      {
        name: 'Web pages',
        anchor: 'Section anchors',
        body: 'Articles, documentation and encyclopedia entries. We pull the body text and drop the navigation and ads. Pages behind a login, anti-bot protection or pure client-side rendering cannot be read.',
        linkLabel: 'Web pages to mind map',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'HOW IT WORKS',
    heading: 'Same reading. Better order.',
    steps: [
      { title: 'Drop in your content', body: 'Text, a document, an ebook or a web link. Pick the output language, depth and purpose.' },
      { title: 'Wait a few seconds', body: 'We extract the body text, chunk it and anchor each chunk to its location, then have the model produce the hierarchy.' },
      { title: 'Edit and take it with you', body: 'Edit directly on the canvas, export to PNG / SVG / Markdown, or generate a public link.' },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    headingA: 'A few things',
    headingB: 'before you start.',
    lede: 'Still have a question? Email support@mindmapany.com and we usually reply within 3 business days.',
    items: [
      {
        q: 'Which input formats are supported?',
        a: 'Pasted text, PDF, DOCX, EPUB, PPTX, TXT, Markdown and public web links. Maximum 20MB per file. Scanned PDFs, audio, video and legacy DOC files are not supported yet.',
      },
      {
        q: 'Are the page numbers on nodes accurate?',
        a: 'Yes. Each chunk is bound to its page number or section position during chunking. The model only references chunk IDs; the location is resolved by lookup, never generated by the model.',
      },
      {
        q: 'Why can some web pages not be read?',
        a: 'Pages that require a login, sit behind anti-bot protection, or render entirely through JavaScript cannot be extracted in the current version. Ordinary article pages, documentation sites and blogs are generally fine.',
      },
      {
        q: 'Who owns the mind maps I generate?',
        a: 'You do. You can export or delete them at any time. Share links are off by default — nobody else can access a map until you turn public sharing on yourself.',
      },
      {
        q: 'How much can I do on the free plan?',
        a: 'Signing up grants 30 credits, enough to fully try text and web page inputs. Long documents and the high-quality model are charged against your plan and credit balance.',
      },
      {
        q: 'Do I have to sign up to try it?',
        a: 'Yes — generating a map requires an account. Signing up is free, takes seconds with Google or an email address, and grants 30 credits straight away. Viewing a map someone shared with you needs no account at all.',
      },
      {
        q: 'How do credits work?',
        a: 'Credits are charged per generation, and the cost depends on the input type, the model tier and how long the content is — a short article costs a fraction of a 200-page report. Your remaining balance is shown in the workbench, and if a generation fails the credits are returned to your account.',
      },
      {
        q: 'Can I edit the map after it is generated, or is it a fixed image?',
        a: 'You can edit it. Double-click a node to rename it, Tab adds a child, Enter adds a sibling, Space collapses a branch, and Delete removes one. Layout, colour theme, typography and branch numbering are all adjustable, and the formatting is saved with the map.',
      },
      {
        q: 'What can I export, and can I share a map with someone who has no account?',
        a: 'Maps export to PNG, SVG and Markdown. You can also switch on a public link, which lets anyone open a read-only view without signing up. Sharing is off by default and you can turn it off again at any time.',
      },
    ],
  },
  pricing: {
    metaTitle: 'Pricing & plans',
    metaDescription:
      'Compare credits, models and document limits across the MindMapAny Free, Basic, Pro and Unlimited plans.',
    eyebrow: 'Simple, transparent, upgrade when you need to',
    heading: 'Start free',
    intro:
      'All prices are in USD. Pay monthly to stay flexible, or pay annually and save 40%. Taxes are shown clearly before checkout.',
    badge: '30 free credits on signup — try every available input type',
    mostPopular: 'MOST POPULAR',
    subscribeYearly: 'Subscribe yearly',
    subscribeMonthly: 'Subscribe monthly',
    limitFastOnly: 'Fast AI model',
    limitBoth: 'Fast + high-quality AI models',
    limitChars: 'Up to {n} characters',
    limitPdfPages: 'PDFs up to {n} pages',
    teamHeading: 'Need more for a team or institution?',
    teamBody:
      'Get in touch about pooled credits, procurement and dedicated support. We usually reply within 3 business days.',
    teamAction: 'Contact support',
    footnoteEmail:
      'Please check out with the same email as your MindMapAny account so your plan activates automatically after payment.',
    footnoteRenewal:
      'Subscriptions renew automatically for the billing period you choose until you cancel. Payments are processed by Creem as Merchant of Record.',
    footnoteCancel: 'You can cancel any time from',
    footnoteRefund: 'Refund & Cancellation Policy',
    plans: {
      free: {
        name: 'Free',
        eyebrow: 'Start free',
        description: 'Try the common input types. Good for occasional articles and reference material.',
        price: '$0',
        annualPrice: 'Free forever',
        creditLabel: 'credits on signup',
        extras: ['Text / documents / ebooks / web pages', 'Editing, export and public sharing'],
        action: 'Start free',
      },
      basic: {
        name: 'Basic',
        eyebrow: 'Everyday use',
        description: 'For day-to-day study and work, with a comfortable monthly allowance.',
        price: '$8.99 / month',
        annualPrice: '$64.68 / year (works out to $5.39 / month)',
        creditLabel: 'credits / month',
        extras: ['All available input types', 'Save, share and export in every format'],
        action: 'Get Basic',
      },
      pro: {
        name: 'Pro',
        eyebrow: 'Recommended',
        description: 'Built for deep research and long documents. Unlocks the high-quality model.',
        price: '$17.99 / month',
        annualPrice: '$129.48 / year (works out to $10.79 / month)',
        creditLabel: 'credits / month',
        extras: ['Detailed map mode', 'Handles complex, long documents'],
        action: 'Get Pro',
      },
      unlimited: {
        name: 'Unlimited',
        eyebrow: 'Heavy use',
        description: 'For high-volume creators and researchers. No monthly credit counting.',
        price: '$26.99 / month',
        annualPrice: '$194.28 / year (works out to $16.19 / month)',
        creditLabel: 'unlimited credits',
        extras: ['Everything in Pro', 'Unlimited usage under a fair use policy'],
        action: 'Get Unlimited',
      },
    },
  },
};

const zhCN: MarketingCopy = {
  toolPage: {
    startFree: '免费开始',
    goodFor: '适合用来',
    benefitsHeading: '不只是摘要 —— 是一个能继续用下去的结构',
    stepsHeading: '三步搞定',
    faqHeading: '常见问题',
    ctaHeading: '把你的内容变成一张清晰的图',
    ctaBody: '无需安装，打开浏览器就能试。',
    relatedHeading: '相关指南',
    breadcrumbHome: '首页',
    breadcrumbTools: '工具',
    seePlans: '查看套餐与额度',
  },
  toolsIndex: {
    metaTitle: 'AI 思维导图工具',
    metaDescription: '用 AI 把 PDF、Word 文件、电子书、网页文章和长文本变成可编辑、可溯源的多层思维导图。',
    eyebrow: '按内容类型选择工具',
    heading: 'AI 思维导图工具',
    lede: '每种内容类型有各自的提取流程，最终都汇入同一套可编辑、可折叠、可回溯原文的结构。',
    viewDetails: '查看工具详情',
  },
  nav: {
    tools: '工具',
    blog: '博客',
    pricing: '价格',
    faq: '常见问题',
    signIn: '登录',
    startFree: '免费开始',
    workbench: '打开工作台',
    workbenchShort: '工作台',
    toolsGroups: { documents: '文档', textWeb: '文本与网页' },
    deepResearch: '深度研究',
    deepResearchHint: '多来源检索，带引用的报告',
    allTools: '全部工具',
    allToolsHint: '浏览所有输入类型',
    toolLabels: [
      'PDF 转思维导图',
      'Word 转思维导图',
      'PowerPoint 转思维导图',
      'EPUB 转思维导图',
      '长文本转思维导图',
      '网页转思维导图',
    ],
    switchTo: 'English',
  },
  footer: {
    tagline: '把复杂内容变成清晰、可编辑、可溯源的知识结构。',
    columns: [
      { title: '产品', labels: ['工具', '价格', '我的脑图', '常见问题'] },
      {
        title: '工具与资源',
        labels: [
          'PDF 转思维导图',
          'Word 转思维导图',
          'EPUB 转思维导图',
          'PowerPoint 转思维导图',
          '长文本转思维导图',
          '网页转思维导图',
          '博客',
        ],
      },
      {
        title: '支持与条款',
        labels: ['联系客服', '管理订阅', '隐私政策', '服务条款', '退款与取消'],
      },
    ],
    legal: '付款由 Creem 作为登记商户（Merchant of Record）处理',
  },
  home: {
    metaTitle: 'MindMapAny — 把任何内容变成清晰、可溯源的思维导图',
    metaDescription:
      '粘贴文本，或上传 PDF、Word、EPUB、PPTX 与网页文章，几秒钟得到一张可编辑、可回溯原文的思维导图。',
    eyebrow: 'MINDMAPANY / 内容结构化',
    headingLead: '长内容，始于',
    headingHighlight: '结构',
    lede:
      '把论文、报告、Word 文件、电子书和网页变成真正有层级的思维导图。不是更短的摘要 —— 而是一张你能编辑、能对着原文逐条核实的内容地图。',
    ctaPrimary: '免费生成思维导图',
    ctaSecondary: '为什么不用摘要就够了',
    worksWith: '直接支持',
    inputLabels: ['长文本', 'PDF', 'Word', 'EPUB', 'PPTX', '网页文章'],
    sourceDocLabel: '原始文档',
    sourceDocPages: '48 页 PDF',
    panelTitle: 'AI 研究报告 / 方法与结论',
    panelNodes: '42 个节点',
    panelTrace: '每个节点都能回到原文',
    panelFooter: ['节点可编辑', '页码溯源', 'PNG / SVG / MD'],
    stats: [
      ['7', '种输入格式'],
      ['30+', '种输出语言'],
      ['110', '单图最大节点数'],
      ['可溯源', '页码与章节锚点'],
    ],
    ctaEyebrow: '随时可以开始',
    ctaHeading: '别再从第一页开始啃长文档。',
    ctaBody:
      '上传内容，先看清整体结构，再决定哪几节值得精读。注册免费账号，30 积分已经在等你。',
    ctaButton: '生成第一张脑图',
  },
  features: {
    eyebrow: '核心能力',
    lede: '为那些需要认真读、逐条核实、动手整理长内容的人而做。',
    headingA: '摘要告诉你说了什么。',
    headingB: '结构告诉你为什么。',
    items: [
      {
        title: '多种输入，同一条流水线',
        body: '粘贴文本、上传 PDF / DOCX / EPUB / PPTX，或者贴一个网页链接。每种格式的提取方式不同，产出的结构同样干净。',
        detail: '7 种来源',
      },
      {
        title: '每个节点都能回溯',
        body: 'PDF 节点带页码，PPTX 节点带幻灯片序号。位置是在切块阶段就绑定好的，不是模型事后编出来的。',
        detail: '确定性溯源',
      },
      {
        title: '稳定的层级，不是一串平铺',
        body: '长文档先分段归纳再合并，重复主题会被折叠，孤立节点会被丢弃。三档详细程度对应不同的层数和节点预算。',
        detail: '最多 5 层',
      },
      {
        title: '生成之后可以改',
        body: '双击改名，Tab 加子节点，Enter 加同级，空格折叠。不是一张只能看的静态图。',
        detail: '键盘编辑',
      },
      {
        title: '导出与分享',
        body: '一键导出 PNG、SVG 或 Markdown。打开公开链接，别人不注册也能查看。',
        detail: '3 种导出格式',
      },
      {
        title: '30+ 种输出语言',
        body: '读一种语言的论文，得到另一种语言的脑图。原文语言和输出语言互不绑定。',
        detail: '跨语言',
      },
    ],
    pipelineLabel: '同一条流水线',
    pipelineStages: ['提取', '切块并锚定', '构建层级', '编辑'],
    pipelineNote:
      '只有第一步因格式而异，之后的每一步都是共用的 —— 所以一份幻灯片和一篇论文，产出的结构同样规整。',
  },
  inputTypes: {
    eyebrow: '按输入类型',
    lede: '每种格式的提取方式不同，节点锚定的东西也不同。',
    heading: '你手上是什么内容？',
    items: [
      {
        name: 'PDF',
        anchor: '页码',
        body: '论文、报告和白皮书。每个节点都记着自己来自第几页，核对一个数据只需要翻开一页，而不是重读整份文件。仅支持文字版 PDF —— 扫描件需要先做 OCR。',
        linkLabel: 'PDF 转思维导图',
      },
      {
        name: 'Word',
        anchor: '文档顺序',
        body: '规范、草稿和长报告。正文段落和表格文字按顺序读取。DOCX 在 Word 排版之前没有固定页码，所以节点锚定的是文档中的位置，不是页码。',
        linkLabel: 'Word 转思维导图',
      },
      {
        name: 'EPUB',
        anchor: '章节标题',
        body: '整本书，按出版方定义的顺序读取。节点带着所属章节 —— 这才是电子书稳定的锚点，页码会随字号变化。带 DRM 保护的文件无法打开。',
        linkLabel: 'EPUB 转思维导图',
      },
      {
        name: 'PowerPoint',
        anchor: '幻灯片序号',
        body: '会议演讲、培训材料和提案。幻灯片文字按顺序提取，每个节点标注所属页。备注和图片不会被读取，所以把要点藏在备注里的演示文稿，产出会偏薄。',
        linkLabel: 'PowerPoint 转思维导图',
      },
      {
        name: '长文本',
        anchor: '粘贴即用',
        body: '会议纪要、转写稿、研究笔记，任何你能选中复制的内容。想知道一堆零散文字里到底有没有一条完整的逻辑线，这是最快的办法。',
        linkLabel: '长文本转思维导图',
      },
      {
        name: '网页',
        anchor: '章节锚点',
        body: '文章、技术文档和百科词条。我们抓取正文，剔除导航和广告。需要登录、有反爬保护，或完全依赖客户端渲染的页面读不了。',
        linkLabel: '网页转思维导图',
      },
    ],
  },
  howItWorks: {
    eyebrow: '工作原理',
    heading: '读的是同样的内容，顺序更好。',
    steps: [
      { title: '放入你的内容', body: '文本、文档、电子书或网页链接。选好输出语言、详细程度和用途。' },
      { title: '等几秒钟', body: '我们提取正文，切块并把每一块锚定到它的位置，再让模型产出层级。' },
      { title: '编辑并带走', body: '直接在画布上编辑，导出 PNG / SVG / Markdown，或生成一个公开链接。' },
    ],
  },
  faq: {
    eyebrow: '常见问题',
    headingA: '开始之前，',
    headingB: '先说清几件事。',
    lede: '还有问题？发邮件到 support@mindmapany.com，我们通常在 3 个工作日内回复。',
    items: [
      {
        q: '支持哪些输入格式？',
        a: '粘贴文本、PDF、DOCX、EPUB、PPTX、TXT、Markdown 以及公开网页链接。单个文件最大 20MB。扫描版 PDF、音频、视频和旧版 DOC 文件暂不支持。',
      },
      {
        q: '节点上的页码准确吗？',
        a: '准确。每一块内容在切块阶段就绑定了页码或章节位置。模型只引用块的编号，位置是查表得到的，从来不是模型生成的。',
      },
      {
        q: '为什么有些网页读不了？',
        a: '需要登录、有反爬保护，或者完全依赖 JavaScript 渲染的页面，当前版本无法提取。普通文章页、技术文档站和博客通常没问题。',
      },
      {
        q: '我生成的脑图归谁？',
        a: '归你。你随时可以导出或删除。分享链接默认关闭 —— 在你自己打开公开分享之前，没有其他人能访问。',
      },
      {
        q: '免费套餐能做多少？',
        a: '注册即获得 30 积分，足够把文本和网页两类输入完整试一遍。长文档和高质量模型会按你的套餐和积分余额计费。',
      },
      {
        q: '不注册能试用吗？',
        a: '不能 —— 生成脑图需要账号。注册是免费的，用 Google 或邮箱几秒钟就能完成，并立即获得 30 积分。查看别人分享给你的脑图则完全不需要账号。',
      },
      {
        q: '积分是怎么算的？',
        a: '按每次生成计费，消耗取决于输入类型、模型档位和内容长度 —— 一篇短文章的花费只是 200 页报告的零头。余额在工作台里能看到，生成失败时积分会退回你的账户。',
      },
      {
        q: '生成之后能编辑吗，还是一张固定的图？',
        a: '能编辑。双击节点改名，Tab 加子节点，Enter 加同级节点，空格折叠分支，Delete 删除。布局、配色、字体和分支编号都可以调，样式会随脑图一起保存。',
      },
      {
        q: '能导出什么格式？能分享给没有账号的人吗？',
        a: '支持导出 PNG、SVG 和 Markdown。你也可以打开公开链接，任何人不注册就能以只读方式查看。分享默认关闭，随时可以再关掉。',
      },
    ],
  },
  pricing: {
    metaTitle: '价格与套餐',
    metaDescription: '对比 MindMapAny 免费版、基础版、专业版和无限版的积分额度、可用模型与文档上限。',
    eyebrow: '定价简单透明，需要时再升级',
    heading: '免费开始',
    intro: '所有价格均以美元计价。按月付款更灵活，按年付款可省 40%。结账前会明确列出税费。',
    badge: '注册即送 30 积分 —— 所有输入类型都能试',
    mostPopular: '最受欢迎',
    subscribeYearly: '按年订阅',
    subscribeMonthly: '按月订阅',
    limitFastOnly: '快速模型',
    limitBoth: '快速模型 + 高质量模型',
    limitChars: '单次最多 {n} 字符',
    limitPdfPages: 'PDF 最多 {n} 页',
    teamHeading: '团队或机构需要更多额度？',
    teamBody: '关于积分共享、采购流程和专属支持，欢迎联系我们。我们通常在 3 个工作日内回复。',
    teamAction: '联系客服',
    footnoteEmail: '请使用与 MindMapAny 账号相同的邮箱结账，付款后套餐才会自动生效。',
    footnoteRenewal:
      '订阅会按你选择的计费周期自动续费，直到你取消为止。付款由 Creem 作为登记商户（Merchant of Record）处理。',
    footnoteCancel: '你可以随时在',
    footnoteRefund: '退款与取消政策',
    plans: {
      free: {
        name: '免费版',
        eyebrow: '免费开始',
        description: '试用常见的输入类型，适合偶尔处理文章和参考资料。',
        price: '$0',
        annualPrice: '永久免费',
        creditLabel: '注册赠送积分',
        extras: ['文本 / 文档 / 电子书 / 网页', '编辑、导出与公开分享'],
        action: '免费开始',
      },
      basic: {
        name: '基础版',
        eyebrow: '日常使用',
        description: '适合日常学习和工作，每月额度充裕。',
        price: '$8.99 / 月',
        annualPrice: '$64.68 / 年（合 $5.39 / 月）',
        creditLabel: '积分 / 月',
        extras: ['全部输入类型', '保存、分享，支持所有导出格式'],
        action: '选择基础版',
      },
      pro: {
        name: '专业版',
        eyebrow: '推荐',
        description: '为深度研究和长文档而设，解锁高质量模型。',
        price: '$17.99 / 月',
        annualPrice: '$129.48 / 年（合 $10.79 / 月）',
        creditLabel: '积分 / 月',
        extras: ['详细脑图模式', '可处理复杂长文档'],
        action: '选择专业版',
      },
      unlimited: {
        name: '无限版',
        eyebrow: '重度使用',
        description: '面向高频创作者和研究者，不用再算每月积分。',
        price: '$26.99 / 月',
        annualPrice: '$194.28 / 年（合 $16.19 / 月）',
        creditLabel: '积分无限',
        extras: ['包含专业版全部功能', '在合理使用政策下不限量'],
        action: '选择无限版',
      },
    },
  },
};

const COPY: Record<Locale, MarketingCopy> = { en, 'zh-CN': zhCN };

export function marketingCopy(locale: Locale): MarketingCopy {
  return COPY[locale] ?? en;
}

/** 文案里的 {n} 占位符替换。营销文案只有数字需要插值，不引入完整的 i18n 运行时。 */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, name: string) => (name in vars ? String(vars[name]) : whole));
}
