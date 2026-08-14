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
    guideLead: string;
    guideLink: string;
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
  support: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    heading: string;
    intro: string;
    topics: { title: string; text: string; subject: string }[];
    sendEmail: string;
    manageHeading: string;
    manageBody: string;
    manageAction: string;
  };
  billing: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    heading: string;
    intro: string;
    steps: string[];
    openPortal: string;
    contactBilling: string;
    afterCancel: string;
    refundLink: string;
    refundTail: string;
  };
  pricing: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    heading: string;
    intro: string;
    badge: string;
    mostPopular: string;
    /** 顶部计费周期切换 */
    toggleMonthly: string;
    toggleAnnual: string;
    saveBadge: string;
    perMonth: string;
    /** 免费档没有周期，价格下方直接写「永久免费」 */
    forever: string;
    billedMonthly: string;
    billedAnnually: string;
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
  support: {
    metaTitle: 'Contact & support',
    metaDescription: 'Contact MindMapAny for help with the product, your account, subscriptions, refunds and privacy.',
    eyebrow: 'Human support',
    heading: 'We are here to sort it out',
    intro: 'Please write from your account email or the address you used at purchase. We usually reply within 3 business days.',
    topics: [
      { title: 'Product & account', text: 'Failed generations, credit issues, sign-in or data problems', subject: 'Product and account support' },
      { title: 'Billing & subscriptions', text: 'Payments, invoices, cancellation, plan changes or refunds', subject: 'Billing and subscription support' },
      { title: 'Privacy & security', text: 'Data access, export, deletion or security concerns', subject: 'Privacy and security support' },
    ],
    sendEmail: 'Send email',
    manageHeading: 'Manage or cancel your subscription',
    manageBody: 'Use your purchase email to open the secure Creem Customer Portal — no waiting on a human.',
    manageAction: 'Go to subscription management',
  },
  billing: {
    metaTitle: 'Subscription management',
    metaDescription: 'Open the Creem Customer Portal to manage your MindMapAny subscription, payment method, invoices and cancellation.',
    eyebrow: 'Secure self-service',
    heading: 'Manage your subscription',
    intro: 'The Creem Customer Portal lets you view orders and invoices, update your payment method, and cancel at any time. Use the email you entered when you purchased MindMapAny to get a secure sign-in link.',
    steps: [
      'Click the button below to open the Creem Customer Portal',
      'Enter the email you used at purchase',
      'Use the secure link in your inbox to manage or cancel the subscription',
    ],
    openPortal: 'Open Creem Customer Portal',
    contactBilling: 'Contact billing support',
    afterCancel: 'After cancelling you normally keep access until the end of the period you have already paid for. See our',
    refundLink: 'Refund & Cancellation Policy',
    refundTail: 'for refund terms.',
  },

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
    guideLead: 'New to this?',
    guideLink: 'Read the guide to AI mind maps',
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
    toggleMonthly: 'Monthly',
    toggleAnnual: 'Annual',
    saveBadge: 'SAVE {pct}%',
    perMonth: '/month',
    forever: 'forever',
    billedMonthly: 'billed monthly',
    billedAnnually: 'billed ${total}/year · save {pct}%',
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
        creditLabel: 'credits on signup',
        extras: ['Text / documents / ebooks / web pages', 'Editing, export and public sharing'],
        action: 'Start free',
      },
      basic: {
        name: 'Basic',
        eyebrow: 'Everyday use',
        description: 'For day-to-day study and work, with a comfortable monthly allowance.',
        creditLabel: 'credits / month',
        extras: ['All available input types', 'Save, share and export in every format'],
        action: 'Get Basic',
      },
      pro: {
        name: 'Pro',
        eyebrow: 'Recommended',
        description: 'Built for deep research and long documents. Unlocks the high-quality model.',
        creditLabel: 'credits / month',
        extras: ['Detailed map mode', 'Handles complex, long documents'],
        action: 'Get Pro',
      },
      unlimited: {
        name: 'Unlimited',
        eyebrow: 'Heavy use',
        description: 'For high-volume creators and researchers. No monthly credit counting.',
        creditLabel: 'unlimited credits',
        extras: ['Everything in Pro', 'Unlimited usage under a fair use policy'],
        action: 'Get Unlimited',
      },
    },
  },
};

const zhCN: MarketingCopy = {
  support: {
    metaTitle: '联系与支持',
    metaDescription: '就产品使用、账号、订阅、退款和隐私问题联系 MindMapAny 获取帮助。',
    eyebrow: '人工支持',
    heading: '我们来帮你解决',
    intro: '请用你的账号邮箱，或购买时使用的邮箱来信。我们通常在 3 个工作日内回复。',
    topics: [
      { title: '产品与账号', text: '生成失败、积分异常、登录或数据问题', subject: '产品与账号支持' },
      { title: '账单与订阅', text: '付款、发票、取消、套餐变更或退款', subject: '账单与订阅支持' },
      { title: '隐私与安全', text: '数据访问、导出、删除或安全方面的疑虑', subject: '隐私与安全支持' },
    ],
    sendEmail: '发送邮件',
    manageHeading: '管理或取消订阅',
    manageBody: '用购买时的邮箱打开 Creem 客户门户，安全自助，不用等人工。',
    manageAction: '前往订阅管理',
  },
  billing: {
    metaTitle: '订阅管理',
    metaDescription: '打开 Creem 客户门户，管理 MindMapAny 的订阅、支付方式、发票与取消。',
    eyebrow: '安全自助',
    heading: '管理你的订阅',
    intro: 'Creem 客户门户可以查看订单和发票、更新支付方式，并随时取消。用你购买 MindMapAny 时填写的邮箱获取安全登录链接。',
    steps: ['点击下方按钮打开 Creem 客户门户', '输入你购买时使用的邮箱', '用收件箱里的安全链接管理或取消订阅'],
    openPortal: '打开 Creem 客户门户',
    contactBilling: '联系账单支持',
    afterCancel: '取消后，通常你仍可使用到已付费周期结束。退款条款见我们的',
    refundLink: '退款与取消政策',
    refundTail: '。',
  },

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
    guideLead: '第一次用？',
    guideLink: '读一读 AI 思维导图指南',
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
    toggleMonthly: '月付',
    toggleAnnual: '年付',
    saveBadge: '省 {pct}%',
    perMonth: '/月',
    forever: '永久免费',
    billedMonthly: '按月支付',
    billedAnnually: '按年支付 ${total} · 省 {pct}%',
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
        creditLabel: '注册赠送积分',
        extras: ['文本 / 文档 / 电子书 / 网页', '编辑、导出与公开分享'],
        action: '免费开始',
      },
      basic: {
        name: '基础版',
        eyebrow: '日常使用',
        description: '适合日常学习和工作，每月额度充裕。',
        creditLabel: '积分 / 月',
        extras: ['全部输入类型', '保存、分享，支持所有导出格式'],
        action: '选择基础版',
      },
      pro: {
        name: '专业版',
        eyebrow: '推荐',
        description: '为深度研究和长文档而设，解锁高质量模型。',
        creditLabel: '积分 / 月',
        extras: ['详细脑图模式', '可处理复杂长文档'],
        action: '选择专业版',
      },
      unlimited: {
        name: '无限版',
        eyebrow: '重度使用',
        description: '面向高频创作者和研究者，不用再算每月积分。',
        creditLabel: '积分无限',
        extras: ['包含专业版全部功能', '在合理使用政策下不限量'],
        action: '选择无限版',
      },
    },
  },
};


const ja: MarketingCopy = {
  support: {
    metaTitle: 'お問い合わせとサポート',
    metaDescription: '製品の使い方、アカウント、サブスクリプション、返金、プライバシーに関するお問い合わせは MindMapAny まで。',
    eyebrow: '担当者がお答えします',
    heading: '一緒に解決しましょう',
    intro: 'アカウントのメールアドレス、またはご購入時のアドレスからご連絡ください。通常 3 営業日以内に返信します。',
    topics: [
      { title: '製品とアカウント', text: '生成の失敗、クレジットの不具合、ログインやデータの問題', subject: '製品とアカウントのサポート' },
      { title: '請求とサブスクリプション', text: 'お支払い、請求書、解約、プラン変更、返金', subject: '請求とサブスクリプションのサポート' },
      { title: 'プライバシーとセキュリティ', text: 'データの閲覧、書き出し、削除、セキュリティ上のご懸念', subject: 'プライバシーとセキュリティのサポート' },
    ],
    sendEmail: 'メールを送る',
    manageHeading: 'サブスクリプションの管理・解約',
    manageBody: 'ご購入時のメールアドレスで Creem カスタマーポータルを開けます。担当者を待つ必要はありません。',
    manageAction: 'サブスクリプション管理へ',
  },
  billing: {
    metaTitle: 'サブスクリプション管理',
    metaDescription: 'Creem カスタマーポータルで MindMapAny のサブスクリプション、支払い方法、請求書、解約を管理できます。',
    eyebrow: '安全なセルフサービス',
    heading: 'サブスクリプションの管理',
    intro: 'Creem カスタマーポータルでは、注文と請求書の確認、支払い方法の変更、いつでも解約ができます。MindMapAny のご購入時に入力したメールアドレスで安全なログインリンクを受け取ってください。',
    steps: ['下のボタンから Creem カスタマーポータルを開きます', 'ご購入時に使用したメールアドレスを入力します', '受信したメールの安全なリンクから管理または解約します'],
    openPortal: 'Creem カスタマーポータルを開く',
    contactBilling: '請求サポートに問い合わせる',
    afterCancel: '解約後も、通常はお支払い済みの期間が終わるまでご利用いただけます。返金の条件は',
    refundLink: '返金・キャンセルポリシー',
    refundTail: 'をご覧ください。',
  },

  nav: {
    tools: 'ツール',
    blog: 'ブログ',
    pricing: '料金',
    faq: 'よくある質問',
    signIn: 'ログイン',
    startFree: '無料で始める',
    workbench: 'ワークベンチを開く',
    workbenchShort: 'ワークベンチ',
    toolsGroups: { documents: 'ドキュメント', textWeb: 'テキストとウェブ' },
    deepResearch: 'ディープリサーチ',
    deepResearchHint: '複数ソースを調査し、出典付きのレポートに',
    allTools: 'すべてのツール',
    allToolsHint: '入力形式の一覧を見る',
    toolLabels: [
      'PDFをマインドマップに',
      'Wordをマインドマップに',
      'PowerPointをマインドマップに',
      'EPUBをマインドマップに',
      'テキストをマインドマップに',
      'ウェブページをマインドマップに',
    ],
    switchTo: '日本語',
  },
  footer: {
    tagline: '複雑な内容を、編集でき、出典まで辿れる明快な知識構造に変えます。',
    columns: [
      { title: 'プロダクト', labels: ['ツール', '料金', 'マイマインドマップ', 'よくある質問'] },
      {
        title: 'ツールと資料',
        labels: [
          'PDFをマインドマップに',
          'Wordをマインドマップに',
          'EPUBをマインドマップに',
          'PowerPointをマインドマップに',
          'テキストをマインドマップに',
          'ウェブページをマインドマップに',
          'ブログ',
        ],
      },
      {
        title: 'サポートと規約',
        labels: ['サポートに問い合わせ', 'サブスクリプション管理', 'プライバシーポリシー', '利用規約', '返金とキャンセル'],
      },
    ],
    legal: '決済は Merchant of Record である Creem が処理します',
  },
  home: {
    metaTitle: 'MindMapAny — あらゆる内容を、出典まで辿れる明快なマインドマップに',
    metaDescription:
      'テキストを貼り付けるか、PDF・Word・EPUB・PPTX・ウェブ記事をアップロードするだけ。編集でき、出典まで辿れるマインドマップが数秒で手に入ります。',
    eyebrow: 'MINDMAPANY / コンテンツの構造化',
    headingLead: '長い内容は',
    headingHighlight: '構造',
    lede:
      '論文、レポート、Word ファイル、電子書籍、ウェブページを、本物の階層を持つマインドマップに変えます。短くした要約ではなく、自分で編集し、原文と照らして検証できる「内容の地図」です。',
    ctaPrimary: '無料でマインドマップを作る',
    ctaSecondary: '要約では足りない理由',
    worksWith: '対応している形式',
    guideLead: 'はじめてですか？',
    guideLink: 'AI マインドマップ入門を読む',
    inputLabels: ['長文テキスト', 'PDF', 'Word', 'EPUB', 'PPTX', 'ウェブ記事'],
    sourceDocLabel: '元の文書',
    sourceDocPages: '48ページの PDF',
    panelTitle: 'AI 研究レポート / 手法と結論',
    panelNodes: '42 ノード',
    panelTrace: 'すべてのノードが原文に辿れます',
    panelFooter: ['ノード編集可', 'ページ出典', 'PNG / SVG / MD'],
    stats: [
      ['7', '種類の入力形式'],
      ['30+', '種類の出力言語'],
      ['110', '1枚あたり最大ノード数'],
      ['追跡可能', 'ページと章の位置'],
    ],
    ctaEyebrow: 'いつでも始められます',
    ctaHeading: '長い文書を1ページ目から読み始めるのは、もうやめましょう。',
    ctaBody:
      '内容をアップロードし、まず全体の構造を把握してから、どの節をじっくり読むか決める。無料アカウントを作れば 30 クレジットがすぐに使えます。',
    ctaButton: '最初のマップを作る',
  },
  features: {
    eyebrow: '主な機能',
    lede: '長い内容を丁寧に読み、検証し、整理する必要がある人のために作りました。',
    headingA: '要約は「何が書かれていたか」を教えます。',
    headingB: '構造は「なぜそうなのか」を教えます。',
    items: [
      {
        title: '入力は多様、処理は一本',
        body: 'テキストの貼り付け、PDF / DOCX / EPUB / PPTX のアップロード、ウェブリンクの入力。抽出方法は形式ごとに異なりますが、出てくる構造の明快さは変わりません。',
        detail: '7 種類のソース',
      },
      {
        title: 'すべてのノードが原文に辿れる',
        body: 'PDF のノードにはページ番号、PPTX のノードにはスライド番号が付きます。位置はチャンク化の時点で紐づけられており、モデルが後から作り出したものではありません。',
        detail: '確定的な出典',
      },
      {
        title: '平らな箇条書きではなく、安定した階層',
        body: '長い文書は節ごとに要約してから統合します。重複する話題はまとめられ、孤立したノードは削られます。3 段階の詳細度が、階層数とノード数の上限に対応します。',
        detail: '最大 5 階層',
      },
      {
        title: '生成後も編集できる',
        body: 'ダブルクリックで名前を変更、Tab で子ノード、Enter で兄弟ノード、Space で折りたたみ。眺めるだけの静止画ではありません。',
        detail: 'キーボード編集',
      },
      {
        title: '書き出しと共有',
        body: 'PNG、SVG、Markdown にワンクリックで書き出し。公開リンクを有効にすれば、相手は登録なしで閲覧できます。',
        detail: '3 つの書き出し形式',
      },
      {
        title: '30 以上の出力言語',
        body: 'ある言語の論文を読んで、別の言語のマップを得る。原文の言語と出力の言語は独立しています。',
        detail: '言語をまたぐ',
      },
    ],
    pipelineLabel: '同じ処理の流れ',
    pipelineStages: ['抽出', 'チャンク化と位置付け', '階層の構築', '編集'],
    pipelineNote:
      '形式によって違うのは最初の一歩だけです。その後はすべて共通なので、スライド資料も研究論文も同じように整った構造で出てきます。',
  },
  inputTypes: {
    eyebrow: '入力形式から選ぶ',
    lede: '形式ごとに抽出方法が異なり、ノードが紐づく対象も異なります。',
    heading: '手元にあるのは、どんな内容ですか？',
    items: [
      {
        name: 'PDF',
        anchor: 'ページ番号',
        body: '論文、レポート、ホワイトペーパー。各ノードは元のページ番号を保持するので、数値を確認するのに1ページ開くだけで済み、ファイルを読み直す必要がありません。テキスト版の PDF のみ対応、スキャンには先に OCR が必要です。',
        linkLabel: 'PDFをマインドマップに',
      },
      {
        name: 'Word',
        anchor: '文書内の順序',
        body: '仕様書、下書き、長いレポート。本文の段落と表内のテキストを順に読み取ります。DOCX は Word が描画するまで固定ページを持たないため、ノードはページ番号ではなく文書内の位置に紐づきます。',
        linkLabel: 'Wordをマインドマップに',
      },
      {
        name: 'EPUB',
        anchor: '章タイトル',
        body: '一冊まるごとを、出版社が定めた順序で読み取ります。ノードは出典の章を保持します。電子書籍ではページ番号が文字サイズで変わるため、章こそが安定した手がかりです。DRM 付きファイルは開けません。',
        linkLabel: 'EPUBをマインドマップに',
      },
      {
        name: 'PowerPoint',
        anchor: 'スライド番号',
        body: '講演、研修資料、提案書。スライドのテキストを順に抽出し、各ノードにスライド番号を付けます。発表者ノートと画像は読み取らないため、要点をノートに隠した資料は薄いマップになります。',
        linkLabel: 'PowerPointをマインドマップに',
      },
      {
        name: '長文テキスト',
        anchor: '貼るだけ',
        body: '議事録、文字起こし、調査メモなど、選択してコピーできるものすべて。散らばった文章に一貫した筋が通っているかを確かめる、いちばん速い方法です。',
        linkLabel: 'テキストをマインドマップに',
      },
      {
        name: 'ウェブページ',
        anchor: '見出しの位置',
        body: '記事、技術ドキュメント、百科事典の項目。本文を抽出し、ナビゲーションと広告を取り除きます。ログインが必要なページ、ボット対策のあるページ、完全にクライアント側で描画されるページは読み取れません。',
        linkLabel: 'ウェブページをマインドマップに',
      },
    ],
  },
  howItWorks: {
    eyebrow: '使い方',
    heading: '読む内容は同じ。順序が変わります。',
    steps: [
      { title: '内容を入れる', body: 'テキスト、文書、電子書籍、ウェブリンク。出力言語、詳細度、目的を選びます。' },
      { title: '数秒待つ', body: '本文を抽出してチャンクに分け、それぞれを元の位置に紐づけたうえで、モデルに階層を作らせます。' },
      { title: '編集して持ち出す', body: 'キャンバス上で直接編集し、PNG / SVG / Markdown に書き出すか、公開リンクを作成します。' },
    ],
  },
  faq: {
    eyebrow: 'よくある質問',
    headingA: '始める前に、',
    headingB: 'いくつかお伝えします。',
    lede: 'ほかにご質問があれば support@mindmapany.com までご連絡ください。通常 3 営業日以内に返信します。',
    items: [
      {
        q: '対応している入力形式は？',
        a: '貼り付けたテキスト、PDF、DOCX、EPUB、PPTX、TXT、Markdown、公開されたウェブリンクです。1 ファイルあたり最大 20MB。スキャンした PDF、音声、動画、旧形式の DOC は現時点では未対応です。',
      },
      {
        q: 'ノードのページ番号は正確ですか？',
        a: '正確です。各チャンクは分割の時点でページ番号や章の位置に紐づけられます。モデルはチャンクの ID を参照するだけで、位置は照合によって解決され、モデルが生成することはありません。',
      },
      {
        q: '読み取れないウェブページがあるのはなぜ？',
        a: 'ログインが必要なページ、ボット対策の内側にあるページ、完全に JavaScript で描画されるページは現在のバージョンでは抽出できません。通常の記事ページ、技術ドキュメント、ブログはおおむね問題ありません。',
      },
      {
        q: '生成したマインドマップの権利は誰にありますか？',
        a: 'あなたにあります。いつでも書き出しや削除ができます。共有リンクは既定でオフで、自分で公開共有を有効にするまで他の人はアクセスできません。',
      },
      {
        q: '無料プランでどこまでできますか？',
        a: '登録すると 30 クレジットが付与され、テキストとウェブページの入力をひと通り試せます。長い文書と高品質モデルは、プランとクレジット残高から消費されます。',
      },
      {
        q: '登録せずに試せますか？',
        a: 'いいえ。マップの生成にはアカウントが必要です。登録は無料で、Google かメールアドレスで数秒で完了し、すぐに 30 クレジットが付与されます。共有されたマップを見るだけならアカウントは不要です。',
      },
      {
        q: 'クレジットはどう消費されますか？',
        a: '生成ごとに消費され、入力形式、モデルの種類、内容の長さで決まります。短い記事は 200 ページのレポートのごく一部で済みます。残高はワークベンチに表示され、生成に失敗した場合はクレジットが返却されます。',
      },
      {
        q: '生成後に編集できますか、それとも固定された画像ですか？',
        a: '編集できます。ノードをダブルクリックで改名、Tab で子ノード、Enter で兄弟ノード、Space で折りたたみ、Delete で削除。レイアウト、配色、書体、枝の番号付けも調整でき、書式はマップとともに保存されます。',
      },
      {
        q: '書き出し形式は？アカウントのない相手に共有できますか？',
        a: 'PNG、SVG、Markdown に書き出せます。公開リンクを有効にすれば、登録なしで誰でも閲覧専用で開けます。共有は既定でオフで、いつでも再びオフにできます。',
      },
    ],
  },
  toolsIndex: {
    metaTitle: 'AI マインドマップツール',
    metaDescription:
      'PDF、Word ファイル、電子書籍、ウェブ記事、長文テキストを、編集でき出典まで辿れる多階層マインドマップに変換します。',
    eyebrow: '内容の種類からツールを選ぶ',
    heading: 'AI マインドマップツール',
    lede: '内容の種類ごとに抽出の流れがあり、最終的にはすべて同じ「編集でき、折りたため、原文に辿れる」構造になります。',
    viewDetails: 'ツールの詳細を見る',
  },
  toolPage: {
    startFree: '無料で始める',
    goodFor: 'こんな用途に',
    benefitsHeading: '要約ではなく、使い続けられる構造',
    stepsHeading: '3 ステップ',
    faqHeading: 'よくある質問',
    ctaHeading: 'あなたの内容を、明快なマップに',
    ctaBody: 'インストール不要。ブラウザを開くだけで試せます。',
    relatedHeading: '関連ガイド',
    breadcrumbHome: 'ホーム',
    breadcrumbTools: 'ツール',
    seePlans: 'プランと上限を見る',
  },
  pricing: {
    metaTitle: '料金とプラン',
    metaDescription:
      'MindMapAny の無料・ベーシック・プロ・無制限プランについて、クレジット、モデル、文書の上限を比較できます。',
    eyebrow: 'シンプルで明快。必要になったら上げるだけ',
    heading: '無料で始める',
    intro: '価格はすべて米ドル表示です。月払いなら柔軟に、年払いなら 40% お得に。税額は決済前に明示されます。',
    badge: '登録で 30 クレジット — すべての入力形式を試せます',
    mostPopular: '人気',
    toggleMonthly: '月払い',
    toggleAnnual: '年払い',
    saveBadge: '{pct}% おトク',
    perMonth: '/月',
    forever: 'ずっと無料',
    billedMonthly: '毎月のお支払い',
    billedAnnually: '年額 ${total} · {pct}% おトク',
    limitFastOnly: '高速モデル',
    limitBoth: '高速モデル + 高品質モデル',
    limitChars: '最大 {n} 文字',
    limitPdfPages: 'PDF は最大 {n} ページ',
    teamHeading: 'チームや教育機関でもっと使いたい場合',
    teamBody: 'クレジットの共有、調達手続き、専用サポートについてご相談ください。通常 3 営業日以内に返信します。',
    teamAction: 'サポートに問い合わせ',
    footnoteEmail: 'MindMapAny のアカウントと同じメールアドレスで決済してください。支払い後にプランが自動で有効になります。',
    footnoteRenewal:
      'サブスクリプションは、解約するまで選択した請求期間ごとに自動更新されます。決済は Merchant of Record である Creem が処理します。',
    footnoteCancel: '解約はいつでも',
    footnoteRefund: '返金・キャンセルポリシー',
    plans: {
      free: {
        name: '無料',
        eyebrow: '無料で始める',
        description: '主な入力形式を試せます。記事や資料をときどき扱う方に。',
        creditLabel: '登録時のクレジット',
        extras: ['テキスト / 文書 / 電子書籍 / ウェブページ', '編集、書き出し、公開共有'],
        action: '無料で始める',
      },
      basic: {
        name: 'ベーシック',
        eyebrow: '日常使い',
        description: '日々の学習と仕事に。月あたりの余裕ある枠付き。',
        creditLabel: 'クレジット / 月',
        extras: ['すべての入力形式', '保存・共有・全形式での書き出し'],
        action: 'ベーシックにする',
      },
      pro: {
        name: 'プロ',
        eyebrow: 'おすすめ',
        description: '深い調査と長い文書のために。高品質モデルを解放します。',
        creditLabel: 'クレジット / 月',
        extras: ['詳細マップモード', '複雑で長い文書にも対応'],
        action: 'プロにする',
      },
      unlimited: {
        name: '無制限',
        eyebrow: 'ヘビーユース',
        description: '大量に扱う制作者や研究者に。毎月のクレジット計算が不要です。',
        creditLabel: 'クレジット無制限',
        extras: ['プロのすべてを含む', '公正利用ポリシーのもとで無制限'],
        action: '無制限にする',
      },
    },
  },
};

const ko: MarketingCopy = {
  support: {
    metaTitle: '문의와 지원',
    metaDescription: '제품 사용, 계정, 구독, 환불, 개인정보에 관한 도움이 필요하시면 MindMapAny로 문의해 주세요.',
    eyebrow: '사람이 답합니다',
    heading: '함께 해결해 드리겠습니다',
    intro: '계정 이메일 또는 구매하실 때 사용한 주소로 보내 주세요. 보통 영업일 기준 3일 안에 답장합니다.',
    topics: [
      { title: '제품과 계정', text: '생성 실패, 크레딧 문제, 로그인 또는 데이터 문제', subject: '제품 및 계정 지원' },
      { title: '결제와 구독', text: '결제, 영수증, 해지, 요금제 변경, 환불', subject: '결제 및 구독 지원' },
      { title: '개인정보와 보안', text: '데이터 열람, 내보내기, 삭제 또는 보안 관련 문의', subject: '개인정보 및 보안 지원' },
    ],
    sendEmail: '이메일 보내기',
    manageHeading: '구독 관리 또는 해지',
    manageBody: '구매하실 때 쓴 이메일로 Creem 고객 포털을 여세요. 상담원을 기다릴 필요가 없습니다.',
    manageAction: '구독 관리로 이동',
  },
  billing: {
    metaTitle: '구독 관리',
    metaDescription: 'Creem 고객 포털에서 MindMapAny 구독과 결제 수단, 영수증, 해지를 관리하세요.',
    eyebrow: '안전한 셀프 서비스',
    heading: '구독 관리하기',
    intro: 'Creem 고객 포털에서는 주문과 영수증을 확인하고 결제 수단을 바꾸며 언제든 해지할 수 있습니다. MindMapAny를 구매할 때 입력한 이메일로 안전한 로그인 링크를 받으세요.',
    steps: ['아래 버튼을 눌러 Creem 고객 포털을 엽니다', '구매할 때 사용한 이메일을 입력합니다', '받은 편지함의 안전한 링크로 관리하거나 해지합니다'],
    openPortal: 'Creem 고객 포털 열기',
    contactBilling: '결제 지원 문의',
    afterCancel: '해지한 뒤에도 보통 이미 결제한 기간이 끝날 때까지 이용할 수 있습니다. 환불 조건은',
    refundLink: '환불 및 취소 정책',
    refundTail: '을 참고하세요.',
  },

  nav: {
    tools: '도구',
    blog: '블로그',
    pricing: '요금',
    faq: '자주 묻는 질문',
    signIn: '로그인',
    startFree: '무료로 시작',
    workbench: '작업공간 열기',
    workbenchShort: '작업공간',
    toolsGroups: { documents: '문서', textWeb: '텍스트와 웹' },
    deepResearch: '심층 리서치',
    deepResearchHint: '여러 출처를 조사해 인용 포함 보고서로',
    allTools: '모든 도구',
    allToolsHint: '입력 형식 전체 보기',
    toolLabels: [
      'PDF를 마인드맵으로',
      'Word를 마인드맵으로',
      'PowerPoint를 마인드맵으로',
      'EPUB을 마인드맵으로',
      '텍스트를 마인드맵으로',
      '웹페이지를 마인드맵으로',
    ],
    switchTo: '한국어',
  },
  footer: {
    tagline: '복잡한 내용을 편집할 수 있고 출처까지 되짚을 수 있는 명확한 지식 구조로 바꿉니다.',
    columns: [
      { title: '제품', labels: ['도구', '요금', '내 마인드맵', '자주 묻는 질문'] },
      {
        title: '도구와 자료',
        labels: [
          'PDF를 마인드맵으로',
          'Word를 마인드맵으로',
          'EPUB을 마인드맵으로',
          'PowerPoint를 마인드맵으로',
          '텍스트를 마인드맵으로',
          '웹페이지를 마인드맵으로',
          '블로그',
        ],
      },
      {
        title: '지원과 약관',
        labels: ['고객지원 문의', '구독 관리', '개인정보 처리방침', '이용약관', '환불 및 취소'],
      },
    ],
    legal: '결제는 등록 판매자(Merchant of Record)인 Creem이 처리합니다',
  },
  home: {
    metaTitle: 'MindMapAny — 어떤 내용이든 출처까지 되짚을 수 있는 명확한 마인드맵으로',
    metaDescription:
      '텍스트를 붙여넣거나 PDF, Word, EPUB, PPTX, 웹 기사를 올리면 편집 가능하고 출처를 되짚을 수 있는 마인드맵이 몇 초 만에 완성됩니다.',
    eyebrow: 'MINDMAPANY / 콘텐츠 구조화',
    headingLead: '긴 내용은',
    headingHighlight: '구조',
    lede:
      '논문, 보고서, Word 파일, 전자책, 웹페이지를 진짜 위계가 있는 마인드맵으로 바꿉니다. 짧게 줄인 요약이 아니라, 직접 편집하고 원문과 대조해 확인할 수 있는 내용의 지도입니다.',
    ctaPrimary: '무료로 마인드맵 만들기',
    ctaSecondary: '요약만으로는 왜 부족한가',
    worksWith: '바로 지원하는 형식',
    guideLead: '처음이신가요?',
    guideLink: 'AI 마인드맵 가이드 읽기',
    inputLabels: ['긴 텍스트', 'PDF', 'Word', 'EPUB', 'PPTX', '웹 기사'],
    sourceDocLabel: '원본 문서',
    sourceDocPages: '48쪽 PDF',
    panelTitle: 'AI 연구 보고서 / 방법과 결론',
    panelNodes: '노드 42개',
    panelTrace: '모든 노드가 원문으로 이어집니다',
    panelFooter: ['노드 편집 가능', '쪽 출처', 'PNG / SVG / MD'],
    stats: [
      ['7', '가지 입력 형식'],
      ['30+', '가지 출력 언어'],
      ['110', '맵당 최대 노드 수'],
      ['추적 가능', '쪽과 장 위치'],
    ],
    ctaEyebrow: '언제든 시작할 수 있습니다',
    ctaHeading: '긴 문서를 1쪽부터 읽기 시작하지 마세요.',
    ctaBody:
      '내용을 올리고 전체 구조부터 파악한 뒤, 어느 절을 자세히 읽을지 정하세요. 무료 계정을 만들면 30크레딧이 바로 지급됩니다.',
    ctaButton: '첫 마인드맵 만들기',
  },
  features: {
    eyebrow: '주요 기능',
    lede: '긴 내용을 꼼꼼히 읽고 확인하고 정리해야 하는 사람을 위해 만들었습니다.',
    headingA: '요약은 무엇이 쓰였는지 알려줍니다.',
    headingB: '구조는 왜 그런지 알려줍니다.',
    items: [
      {
        title: '입력은 다양하게, 처리는 하나로',
        body: '텍스트 붙여넣기, PDF / DOCX / EPUB / PPTX 업로드, 웹 링크 입력. 추출 방식은 형식마다 다르지만 나오는 구조의 명확함은 같습니다.',
        detail: '7가지 소스',
      },
      {
        title: '모든 노드가 원문으로 이어짐',
        body: 'PDF 노드에는 쪽 번호가, PPTX 노드에는 슬라이드 번호가 붙습니다. 위치는 청크로 나눌 때 함께 묶은 것이지, 모델이 나중에 지어낸 것이 아닙니다.',
        detail: '확정적 출처',
      },
      {
        title: '나열이 아니라 안정된 위계',
        body: '긴 문서는 절 단위로 요약한 뒤 합칩니다. 중복된 주제는 하나로 묶이고 고립된 노드는 걸러집니다. 세 단계의 상세도가 각각 다른 계층 수와 노드 수 한도에 대응합니다.',
        detail: '최대 5단계',
      },
      {
        title: '생성 후에도 편집 가능',
        body: '더블클릭으로 이름 변경, Tab으로 하위 노드, Enter로 같은 단계 노드, Space로 접기. 바라보기만 하는 정지 이미지가 아닙니다.',
        detail: '키보드 편집',
      },
      {
        title: '내보내기와 공유',
        body: 'PNG, SVG, Markdown으로 한 번에 내보내기. 공개 링크를 켜면 상대는 가입 없이 볼 수 있습니다.',
        detail: '3가지 내보내기 형식',
      },
      {
        title: '30개 이상의 출력 언어',
        body: '한 언어로 된 논문을 읽고 다른 언어로 된 맵을 얻습니다. 원문 언어와 출력 언어는 서로 묶여 있지 않습니다.',
        detail: '언어 간 변환',
      },
    ],
    pipelineLabel: '하나의 처리 흐름',
    pipelineStages: ['추출', '청크와 위치 연결', '위계 구성', '편집'],
    pipelineNote:
      '형식에 따라 달라지는 것은 첫 단계뿐입니다. 그 뒤는 모두 공통이라, 발표 자료든 연구 논문이든 똑같이 정돈된 구조로 나옵니다.',
  },
  inputTypes: {
    eyebrow: '입력 형식별',
    lede: '형식마다 추출 방식이 다르고, 노드가 이어지는 대상도 다릅니다.',
    heading: '지금 가진 자료는 무엇인가요?',
    items: [
      {
        name: 'PDF',
        anchor: '쪽 번호',
        body: '논문, 보고서, 백서. 각 노드가 원래 쪽 번호를 지니고 있어, 수치를 확인할 때 파일을 다시 읽는 대신 한 쪽만 펼치면 됩니다. 텍스트 기반 PDF만 지원하며 스캔본은 먼저 OCR이 필요합니다.',
        linkLabel: 'PDF를 마인드맵으로',
      },
      {
        name: 'Word',
        anchor: '문서 순서',
        body: '사양서, 초안, 긴 보고서. 본문 단락과 표 안의 텍스트를 순서대로 읽습니다. DOCX는 Word가 배치하기 전까지 고정된 쪽이 없어, 노드는 쪽 번호가 아니라 문서 내 위치에 연결됩니다.',
        linkLabel: 'Word를 마인드맵으로',
      },
      {
        name: 'EPUB',
        anchor: '장 제목',
        body: '책 한 권을 출판사가 정한 순서대로 읽습니다. 노드는 출처가 된 장을 지닙니다. 전자책은 글자 크기에 따라 쪽 번호가 달라지므로 장이 안정적인 기준입니다. DRM이 걸린 파일은 열 수 없습니다.',
        linkLabel: 'EPUB을 마인드맵으로',
      },
      {
        name: 'PowerPoint',
        anchor: '슬라이드 번호',
        body: '발표, 교육 자료, 제안서. 슬라이드 텍스트를 순서대로 뽑고 각 노드에 슬라이드 번호를 붙입니다. 발표자 노트와 이미지는 읽지 않으므로, 핵심을 노트에 숨긴 자료는 맵이 얇게 나옵니다.',
        linkLabel: 'PowerPoint를 마인드맵으로',
      },
      {
        name: '긴 텍스트',
        anchor: '붙여넣기만',
        body: '회의록, 녹취록, 조사 메모 등 선택해서 복사할 수 있는 모든 것. 흩어진 글에 하나의 논리가 서 있는지 확인하는 가장 빠른 방법입니다.',
        linkLabel: '텍스트를 마인드맵으로',
      },
      {
        name: '웹페이지',
        anchor: '섹션 위치',
        body: '기사, 기술 문서, 백과사전 항목. 본문을 뽑고 내비게이션과 광고는 걷어냅니다. 로그인이 필요하거나 봇 차단이 있거나 전적으로 클라이언트에서 그려지는 페이지는 읽을 수 없습니다.',
        linkLabel: '웹페이지를 마인드맵으로',
      },
    ],
  },
  howItWorks: {
    eyebrow: '작동 방식',
    heading: '읽는 내용은 같고, 순서가 달라집니다.',
    steps: [
      { title: '내용을 넣기', body: '텍스트, 문서, 전자책, 웹 링크. 출력 언어와 상세도, 목적을 고릅니다.' },
      { title: '몇 초 기다리기', body: '본문을 뽑아 청크로 나누고 각 청크를 원래 위치에 연결한 뒤, 모델이 위계를 만듭니다.' },
      { title: '편집해서 가져가기', body: '캔버스에서 바로 편집하고 PNG / SVG / Markdown으로 내보내거나 공개 링크를 만듭니다.' },
    ],
  },
  faq: {
    eyebrow: '자주 묻는 질문',
    headingA: '시작하기 전에',
    headingB: '몇 가지 알려드립니다.',
    lede: '더 궁금한 점이 있으면 support@mindmapany.com으로 보내주세요. 보통 영업일 기준 3일 안에 답장합니다.',
    items: [
      {
        q: '어떤 입력 형식을 지원하나요?',
        a: '붙여넣은 텍스트, PDF, DOCX, EPUB, PPTX, TXT, Markdown, 공개된 웹 링크입니다. 파일당 최대 20MB. 스캔한 PDF, 오디오, 동영상, 구형 DOC 파일은 아직 지원하지 않습니다.',
      },
      {
        q: '노드에 붙은 쪽 번호는 정확한가요?',
        a: '정확합니다. 각 청크는 나눌 때 쪽 번호나 장 위치와 함께 묶입니다. 모델은 청크 ID만 참조하고 위치는 조회로 확정되므로, 모델이 지어내는 일이 없습니다.',
      },
      {
        q: '읽지 못하는 웹페이지가 있는 이유는?',
        a: '로그인이 필요하거나 봇 차단 뒤에 있거나 전적으로 JavaScript로 그려지는 페이지는 현재 버전에서 추출할 수 없습니다. 일반 기사, 기술 문서, 블로그는 대체로 문제없습니다.',
      },
      {
        q: '생성한 마인드맵의 권리는 누구에게 있나요?',
        a: '사용자에게 있습니다. 언제든 내보내거나 삭제할 수 있습니다. 공유 링크는 기본으로 꺼져 있어, 직접 공개 공유를 켜기 전에는 아무도 접근할 수 없습니다.',
      },
      {
        q: '무료 요금제로 얼마나 쓸 수 있나요?',
        a: '가입하면 30크레딧이 지급되어 텍스트와 웹페이지 입력을 충분히 시험해 볼 수 있습니다. 긴 문서와 고품질 모델은 요금제와 크레딧 잔액에서 차감됩니다.',
      },
      {
        q: '가입하지 않고 써볼 수 있나요?',
        a: '아니요. 맵 생성에는 계정이 필요합니다. 가입은 무료이고 Google이나 이메일로 몇 초면 끝나며 30크레딧이 바로 지급됩니다. 공유받은 맵을 보는 데는 계정이 필요 없습니다.',
      },
      {
        q: '크레딧은 어떻게 차감되나요?',
        a: '생성할 때마다 차감되며, 입력 형식과 모델 등급, 내용 길이에 따라 달라집니다. 짧은 기사는 200쪽 보고서의 일부만 듭니다. 잔액은 작업공간에서 볼 수 있고, 생성에 실패하면 크레딧은 되돌려 드립니다.',
      },
      {
        q: '생성한 뒤 편집할 수 있나요, 고정된 이미지인가요?',
        a: '편집할 수 있습니다. 노드를 더블클릭해 이름을 바꾸고, Tab으로 하위 노드, Enter로 같은 단계 노드를 더하고, Space로 접고, Delete로 지웁니다. 배치와 색, 서체, 가지 번호까지 조정할 수 있고 서식은 맵과 함께 저장됩니다.',
      },
      {
        q: '어떤 형식으로 내보내나요? 계정 없는 사람에게 공유할 수 있나요?',
        a: 'PNG, SVG, Markdown으로 내보냅니다. 공개 링크를 켜면 누구나 가입 없이 읽기 전용으로 열 수 있습니다. 공유는 기본으로 꺼져 있고 언제든 다시 끌 수 있습니다.',
      },
    ],
  },
  toolsIndex: {
    metaTitle: 'AI 마인드맵 도구',
    metaDescription: 'PDF, Word 파일, 전자책, 웹 기사, 긴 텍스트를 편집 가능하고 출처를 되짚을 수 있는 다단계 마인드맵으로 바꿉니다.',
    eyebrow: '내용 유형으로 도구 고르기',
    heading: 'AI 마인드맵 도구',
    lede: '내용 유형마다 추출 흐름이 따로 있고, 마지막에는 모두 편집·접기·원문 추적이 되는 같은 구조로 모입니다.',
    viewDetails: '도구 자세히 보기',
  },
  toolPage: {
    startFree: '무료로 시작',
    goodFor: '이럴 때 좋습니다',
    benefitsHeading: '요약이 아니라, 계속 쓸 수 있는 구조',
    stepsHeading: '3단계',
    faqHeading: '자주 묻는 질문',
    ctaHeading: '가진 내용을 명확한 맵으로',
    ctaBody: '설치할 것 없이 브라우저만 열면 됩니다.',
    relatedHeading: '관련 가이드',
    breadcrumbHome: '홈',
    breadcrumbTools: '도구',
    seePlans: '요금제와 한도 보기',
  },
  pricing: {
    metaTitle: '요금과 플랜',
    metaDescription: 'MindMapAny 무료, 베이직, 프로, 무제한 플랜의 크레딧과 모델, 문서 한도를 비교해 보세요.',
    eyebrow: '단순하고 투명하게, 필요할 때 올리세요',
    heading: '무료로 시작',
    intro: '모든 가격은 미국 달러 기준입니다. 월 결제는 유연하게, 연 결제는 40% 절약. 세금은 결제 전에 명확히 표시됩니다.',
    badge: '가입 시 30크레딧 — 모든 입력 형식을 시험해 보세요',
    mostPopular: '인기',
    toggleMonthly: '월간',
    toggleAnnual: '연간',
    saveBadge: '{pct}% 할인',
    perMonth: '/월',
    forever: '계속 무료',
    billedMonthly: '매월 청구',
    billedAnnually: '연 ${total} 청구 · {pct}% 할인',
    limitFastOnly: '빠른 모델',
    limitBoth: '빠른 모델 + 고품질 모델',
    limitChars: '최대 {n}자',
    limitPdfPages: 'PDF 최대 {n}쪽',
    teamHeading: '팀이나 기관에서 더 필요하신가요?',
    teamBody: '크레딧 공유, 구매 절차, 전담 지원에 대해 문의해 주세요. 보통 영업일 기준 3일 안에 답장합니다.',
    teamAction: '고객지원 문의',
    footnoteEmail: 'MindMapAny 계정과 같은 이메일로 결제해 주세요. 결제 후 플랜이 자동으로 활성화됩니다.',
    footnoteRenewal:
      '구독은 해지하기 전까지 선택한 결제 주기로 자동 갱신됩니다. 결제는 등록 판매자(Merchant of Record)인 Creem이 처리합니다.',
    footnoteCancel: '언제든 해지할 수 있습니다 —',
    footnoteRefund: '환불 및 취소 정책',
    plans: {
      free: {
        name: '무료',
        eyebrow: '무료로 시작',
        description: '주요 입력 형식을 시험해 보세요. 기사와 자료를 가끔 다루는 분께.',
        creditLabel: '가입 시 크레딧',
        extras: ['텍스트 / 문서 / 전자책 / 웹페이지', '편집, 내보내기, 공개 공유'],
        action: '무료로 시작',
      },
      basic: {
        name: '베이직',
        eyebrow: '일상 사용',
        description: '매일의 학습과 업무에. 월 사용량이 넉넉합니다.',
        creditLabel: '크레딧 / 월',
        extras: ['모든 입력 형식', '저장, 공유, 모든 형식 내보내기'],
        action: '베이직 선택',
      },
      pro: {
        name: '프로',
        eyebrow: '추천',
        description: '심층 리서치와 긴 문서를 위해. 고품질 모델이 열립니다.',
        creditLabel: '크레딧 / 월',
        extras: ['상세 맵 모드', '복잡하고 긴 문서도 처리'],
        action: '프로 선택',
      },
      unlimited: {
        name: '무제한',
        eyebrow: '집중 사용',
        description: '많이 만드는 창작자와 연구자를 위해. 매달 크레딧을 세지 않아도 됩니다.',
        creditLabel: '크레딧 무제한',
        extras: ['프로의 모든 기능 포함', '공정 사용 정책 아래 무제한'],
        action: '무제한 선택',
      },
    },
  },
};

const es: MarketingCopy = {
  support: {
    metaTitle: 'Contacto y soporte',
    metaDescription: 'Escribe a MindMapAny si necesitas ayuda con el producto, tu cuenta, las suscripciones, los reembolsos o la privacidad.',
    eyebrow: 'Atención de personas',
    heading: 'Estamos aquí para resolverlo',
    intro: 'Escríbenos desde el correo de tu cuenta o desde el que usaste al comprar. Solemos responder en 3 días laborables.',
    topics: [
      { title: 'Producto y cuenta', text: 'Generaciones fallidas, problemas con los créditos, con el acceso o con tus datos', subject: 'Soporte de producto y cuenta' },
      { title: 'Facturación y suscripciones', text: 'Pagos, facturas, cancelación, cambios de plan o reembolsos', subject: 'Soporte de facturación y suscripciones' },
      { title: 'Privacidad y seguridad', text: 'Acceso, exportación o eliminación de datos y dudas de seguridad', subject: 'Soporte de privacidad y seguridad' },
    ],
    sendEmail: 'Enviar correo',
    manageHeading: 'Gestiona o cancela tu suscripción',
    manageBody: 'Usa el correo de tu compra para abrir el Portal de Clientes de Creem, sin esperar a nadie.',
    manageAction: 'Ir a la gestión de la suscripción',
  },
  billing: {
    metaTitle: 'Gestión de la suscripción',
    metaDescription: 'Abre el Portal de Clientes de Creem para gestionar tu suscripción a MindMapAny, el método de pago, las facturas y la cancelación.',
    eyebrow: 'Autogestión segura',
    heading: 'Gestiona tu suscripción',
    intro: 'El Portal de Clientes de Creem te permite consultar pedidos y facturas, cambiar el método de pago y cancelar cuando quieras. Usa el correo que indicaste al comprar MindMapAny para recibir un enlace de acceso seguro.',
    steps: ['Pulsa el botón de abajo para abrir el Portal de Clientes de Creem', 'Introduce el correo que usaste al comprar', 'Usa el enlace seguro que recibas para gestionar o cancelar la suscripción'],
    openPortal: 'Abrir el Portal de Clientes de Creem',
    contactBilling: 'Contactar con soporte de facturación',
    afterCancel: 'Tras cancelar, normalmente conservas el acceso hasta el final del periodo que ya has pagado. Consulta nuestra',
    refundLink: 'Política de reembolso y cancelación',
    refundTail: 'para conocer las condiciones.',
  },

  nav: {
    tools: 'Herramientas',
    blog: 'Blog',
    pricing: 'Precios',
    faq: 'Preguntas frecuentes',
    signIn: 'Iniciar sesión',
    startFree: 'Empezar gratis',
    workbench: 'Abrir el espacio de trabajo',
    workbenchShort: 'Espacio de trabajo',
    toolsGroups: { documents: 'Documentos', textWeb: 'Texto y web' },
    deepResearch: 'Investigación profunda',
    deepResearchHint: 'Informe con citas a partir de varias fuentes',
    allTools: 'Todas las herramientas',
    allToolsHint: 'Ver todos los tipos de entrada',
    toolLabels: [
      'PDF a mapa mental',
      'Word a mapa mental',
      'PowerPoint a mapa mental',
      'EPUB a mapa mental',
      'Texto a mapa mental',
      'Página web a mapa mental',
    ],
    switchTo: 'Español',
  },
  footer: {
    tagline: 'Convierte contenido complejo en estructuras de conocimiento claras, editables y verificables.',
    columns: [
      { title: 'Producto', labels: ['Herramientas', 'Precios', 'Mis mapas mentales', 'Preguntas frecuentes'] },
      {
        title: 'Herramientas y recursos',
        labels: [
          'PDF a mapa mental',
          'Word a mapa mental',
          'EPUB a mapa mental',
          'PowerPoint a mapa mental',
          'Texto a mapa mental',
          'Página web a mapa mental',
          'Blog',
        ],
      },
      {
        title: 'Soporte y legal',
        labels: ['Contactar con soporte', 'Gestionar suscripción', 'Política de privacidad', 'Términos del servicio', 'Reembolsos y cancelación'],
      },
    ],
    legal: 'Pagos procesados por Creem como Merchant of Record',
  },
  home: {
    metaTitle: 'MindMapAny — Convierte cualquier contenido en un mapa mental claro y verificable',
    metaDescription:
      'Pega texto o sube un PDF, un Word, un EPUB, un PPTX o un artículo web y obtén en segundos un mapa mental editable que puedes contrastar con el original.',
    eyebrow: 'MINDMAPANY / INTELIGENCIA DE CONTENIDO',
    headingLead: 'El contenido largo empieza por la',
    headingHighlight: 'estructura',
    lede:
      'Convierte artículos, informes, archivos de Word, libros electrónicos y páginas web en mapas mentales con jerarquía real. No es un resumen más corto: es un mapa del contenido que puedes editar y verificar contra el original.',
    ctaPrimary: 'Crear un mapa mental gratis',
    ctaSecondary: 'Por qué un resumen no basta',
    worksWith: 'FUNCIONA DIRECTAMENTE CON',
    guideLead: '¿Es tu primera vez?',
    guideLink: 'Lee la guía de mapas mentales con IA',
    inputLabels: ['Texto largo', 'PDF', 'Word', 'EPUB', 'PPTX', 'Artículos web'],
    sourceDocLabel: 'Documento original',
    sourceDocPages: 'PDF de 48 páginas',
    panelTitle: 'Informe de investigación de IA / métodos y conclusiones',
    panelNodes: '42 nodos',
    panelTrace: 'Cada nodo lleva de vuelta al original',
    panelFooter: ['Nodos editables', 'Citas por página', 'PNG / SVG / MD'],
    stats: [
      ['7', 'formatos de entrada'],
      ['30+', 'idiomas de salida'],
      ['110', 'nodos máx. por mapa'],
      ['Verificable', 'anclas de página y sección'],
    ],
    ctaEyebrow: 'CUANDO QUIERAS',
    ctaHeading: 'Deja de empezar los documentos largos por la página uno.',
    ctaBody:
      'Sube tu contenido, mira primero la estructura completa y decide después qué secciones merecen una lectura atenta. Crea una cuenta gratuita y tendrás 30 créditos esperándote.',
    ctaButton: 'Crea tu primer mapa',
  },
  features: {
    eyebrow: 'CAPACIDADES',
    lede: 'Pensado para quien necesita leer, verificar y organizar contenido largo con cuidado.',
    headingA: 'Un resumen te dice qué se dijo.',
    headingB: 'La estructura te dice por qué.',
    items: [
      {
        title: 'Muchas entradas, un solo proceso',
        body: 'Pega texto, sube un PDF / DOCX / EPUB / PPTX o introduce un enlace. La extracción cambia según el formato; la claridad de la estructura resultante, no.',
        detail: '7 fuentes',
      },
      {
        title: 'Cada nodo es rastreable',
        body: 'Los nodos de un PDF llevan número de página y los de un PPTX, número de diapositiva. La ubicación se fija al trocear el texto, no la inventa el modelo después.',
        detail: 'Citas deterministas',
      },
      {
        title: 'Jerarquía estable, no una lista plana',
        body: 'Los documentos largos se resumen sección por sección y luego se fusionan; los temas repetidos se agrupan y los nodos huérfanos se descartan. Tres niveles de detalle con distintos límites de profundidad y de nodos.',
        detail: 'Hasta 5 niveles',
      },
      {
        title: 'Editable después de generarlo',
        body: 'Doble clic para renombrar, Tab para un nodo hijo, Intro para uno hermano, Espacio para plegar. No es una imagen fija que solo puedes mirar.',
        detail: 'Edición por teclado',
      },
      {
        title: 'Exportar y compartir',
        body: 'Exporta a PNG, SVG o Markdown con un clic. Activa el enlace público y otros podrán verlo sin registrarse.',
        detail: '3 formatos de exportación',
      },
      {
        title: 'Más de 30 idiomas de salida',
        body: 'Lee un artículo en un idioma y obtén el mapa en otro. El idioma de origen y el de salida son independientes.',
        detail: 'Entre idiomas',
      },
    ],
    pipelineLabel: 'UN SOLO PROCESO',
    pipelineStages: ['Extraer', 'Trocear y anclar', 'Construir la jerarquía', 'Editar'],
    pipelineNote:
      'Solo el primer paso cambia según el formato. Todo lo demás es común, y por eso una presentación y un artículo científico salen igual de estructurados.',
  },
  inputTypes: {
    eyebrow: 'POR TIPO DE ENTRADA',
    lede: 'Cada formato se extrae de manera distinta y ancla sus nodos a algo distinto.',
    heading: '¿De qué partes?',
    items: [
      {
        name: 'PDF',
        anchor: 'Números de página',
        body: 'Artículos, informes y libros blancos. Cada nodo conserva la página de la que salió, así que comprobar un dato es abrir una página y no releer el archivo. Solo PDF con texto: los escaneados necesitan OCR antes.',
        linkLabel: 'PDF a mapa mental',
      },
      {
        name: 'Word',
        anchor: 'Orden del documento',
        body: 'Especificaciones, borradores e informes largos. Se leen en orden los párrafos del cuerpo y el texto de las tablas. Un DOCX no tiene páginas fijas hasta que Word lo maqueta, así que los nodos se anclan a la posición en el documento, no a una página.',
        linkLabel: 'Word a mapa mental',
      },
      {
        name: 'EPUB',
        anchor: 'Títulos de capítulo',
        body: 'Libros completos, leídos en el orden que definió la editorial. Los nodos conservan su capítulo, que es el ancla estable de un libro electrónico: los números de página cambian con el tamaño de letra. Los archivos con DRM no se pueden abrir.',
        linkLabel: 'EPUB a mapa mental',
      },
      {
        name: 'PowerPoint',
        anchor: 'Números de diapositiva',
        body: 'Ponencias, materiales de formación y propuestas. El texto se extrae en el orden de la presentación y cada nodo se etiqueta con su diapositiva. Las notas del ponente y las imágenes no se leen, así que una presentación que esconde el fondo en las notas dará un mapa pobre.',
        linkLabel: 'PowerPoint a mapa mental',
      },
      {
        name: 'Texto largo',
        anchor: 'Pegar y listo',
        body: 'Actas de reuniones, transcripciones, notas de investigación: cualquier cosa que puedas seleccionar y copiar. La forma más rápida de ver si un montón de texto suelto sostiene realmente un argumento coherente.',
        linkLabel: 'Texto a mapa mental',
      },
      {
        name: 'Páginas web',
        anchor: 'Anclas de sección',
        body: 'Artículos, documentación y entradas de enciclopedia. Extraemos el cuerpo del texto y descartamos la navegación y los anuncios. No se pueden leer las páginas tras un inicio de sesión, con protección antibot o renderizadas por completo en el cliente.',
        linkLabel: 'Página web a mapa mental',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'CÓMO FUNCIONA',
    heading: 'La misma lectura. Mejor orden.',
    steps: [
      { title: 'Aporta tu contenido', body: 'Texto, un documento, un libro electrónico o un enlace. Elige el idioma de salida, la profundidad y el propósito.' },
      { title: 'Espera unos segundos', body: 'Extraemos el cuerpo del texto, lo troceamos y anclamos cada fragmento a su ubicación; después el modelo construye la jerarquía.' },
      { title: 'Edita y llévatelo', body: 'Edita directamente en el lienzo, exporta a PNG / SVG / Markdown o genera un enlace público.' },
    ],
  },
  faq: {
    eyebrow: 'PREGUNTAS FRECUENTES',
    headingA: 'Algunas cosas',
    headingB: 'antes de empezar.',
    lede: '¿Te queda alguna duda? Escribe a support@mindmapany.com; solemos responder en 3 días laborables.',
    items: [
      {
        q: '¿Qué formatos de entrada admite?',
        a: 'Texto pegado, PDF, DOCX, EPUB, PPTX, TXT, Markdown y enlaces web públicos. Máximo 20 MB por archivo. Los PDF escaneados, el audio, el vídeo y los archivos DOC antiguos aún no son compatibles.',
      },
      {
        q: '¿Son exactos los números de página de los nodos?',
        a: 'Sí. Cada fragmento se vincula a su página o posición de sección al trocear el documento. El modelo solo referencia identificadores de fragmento; la ubicación se resuelve por consulta y nunca la genera el modelo.',
      },
      {
        q: '¿Por qué hay páginas web que no se pueden leer?',
        a: 'Las páginas que exigen iniciar sesión, están tras protección antibot o se renderizan por completo con JavaScript no se pueden extraer en la versión actual. Los artículos normales, la documentación y los blogs suelen funcionar bien.',
      },
      {
        q: '¿De quién son los mapas mentales que genero?',
        a: 'Tuyos. Puedes exportarlos o borrarlos cuando quieras. Los enlaces para compartir están desactivados por defecto: nadie más puede acceder a un mapa hasta que actives tú la publicación.',
      },
      {
        q: '¿Cuánto puedo hacer con el plan gratuito?',
        a: 'Al registrarte recibes 30 créditos, suficientes para probar a fondo las entradas de texto y de páginas web. Los documentos largos y el modelo de alta calidad se cobran de tu plan y tu saldo de créditos.',
      },
      {
        q: '¿Hace falta registrarse para probarlo?',
        a: 'Sí: generar un mapa requiere una cuenta. Registrarse es gratis, se hace en segundos con Google o un correo electrónico y otorga 30 créditos al instante. Ver un mapa que alguien ha compartido contigo no requiere cuenta alguna.',
      },
      {
        q: '¿Cómo funcionan los créditos?',
        a: 'Se cobran por generación y el coste depende del tipo de entrada, del modelo y de la longitud del contenido: un artículo breve cuesta una fracción de un informe de 200 páginas. El saldo se muestra en el espacio de trabajo y, si una generación falla, los créditos se devuelven a tu cuenta.',
      },
      {
        q: '¿Puedo editar el mapa después de generarlo o es una imagen fija?',
        a: 'Puedes editarlo. Doble clic en un nodo para renombrarlo, Tab añade un hijo, Intro añade un hermano, Espacio pliega una rama y Supr la elimina. La disposición, los colores, la tipografía y la numeración de ramas son ajustables, y el formato se guarda con el mapa.',
      },
      {
        q: '¿Qué puedo exportar y puedo compartirlo con alguien sin cuenta?',
        a: 'Los mapas se exportan a PNG, SVG y Markdown. También puedes activar un enlace público que permite abrir una vista de solo lectura sin registrarse. Compartir está desactivado por defecto y puedes volver a desactivarlo cuando quieras.',
      },
    ],
  },
  toolsIndex: {
    metaTitle: 'Herramientas de mapas mentales con IA',
    metaDescription:
      'Usa la IA para convertir PDF, archivos de Word, libros electrónicos, artículos web y texto largo en mapas mentales de varios niveles, editables y verificables.',
    eyebrow: 'Elige una herramienta según tu contenido',
    heading: 'Herramientas de mapas mentales con IA',
    lede: 'Cada tipo de contenido tiene su propio proceso de extracción, y todos acaban en la misma estructura editable, plegable y enlazada al original.',
    viewDetails: 'Ver detalles de la herramienta',
  },
  toolPage: {
    startFree: 'Empezar gratis',
    goodFor: 'Ideal para',
    benefitsHeading: 'No es un resumen: es una estructura que puedes seguir usando',
    stepsHeading: 'Tres pasos',
    faqHeading: 'Preguntas frecuentes',
    ctaHeading: 'Convierte tu contenido en un mapa claro',
    ctaBody: 'Nada que instalar: abre el navegador y pruébalo.',
    relatedHeading: 'Guías relacionadas',
    breadcrumbHome: 'Inicio',
    breadcrumbTools: 'Herramientas',
    seePlans: 'Ver planes y límites',
  },
  pricing: {
    metaTitle: 'Precios y planes',
    metaDescription:
      'Compara créditos, modelos y límites de documentos entre los planes Gratis, Básico, Pro e Ilimitado de MindMapAny.',
    eyebrow: 'Sencillo y transparente; sube de plan cuando lo necesites',
    heading: 'Empieza gratis',
    intro:
      'Todos los precios están en dólares estadounidenses. Paga al mes para tener flexibilidad o al año y ahorra un 40%. Los impuestos se muestran con claridad antes de pagar.',
    badge: '30 créditos gratis al registrarte: prueba todos los tipos de entrada',
    mostPopular: 'MÁS POPULAR',
    toggleMonthly: 'Mensual',
    toggleAnnual: 'Anual',
    saveBadge: 'AHORRA {pct}%',
    perMonth: '/mes',
    forever: 'para siempre',
    billedMonthly: 'facturación mensual',
    billedAnnually: 'facturado ${total}/año · ahorra {pct}%',
    limitFastOnly: 'Modelo rápido',
    limitBoth: 'Modelo rápido + modelo de alta calidad',
    limitChars: 'Hasta {n} caracteres',
    limitPdfPages: 'PDF de hasta {n} páginas',
    teamHeading: '¿Necesitas más para un equipo o una institución?',
    teamBody:
      'Escríbenos sobre créditos compartidos, procesos de compra y soporte dedicado. Solemos responder en 3 días laborables.',
    teamAction: 'Contactar con soporte',
    footnoteEmail:
      'Paga con el mismo correo electrónico de tu cuenta de MindMapAny para que el plan se active automáticamente tras el pago.',
    footnoteRenewal:
      'Las suscripciones se renuevan automáticamente según el periodo de facturación que elijas hasta que las canceles. Los pagos los procesa Creem como Merchant of Record.',
    footnoteCancel: 'Puedes cancelar cuando quieras desde',
    footnoteRefund: 'Política de reembolso y cancelación',
    plans: {
      free: {
        name: 'Gratis',
        eyebrow: 'Empieza gratis',
        description: 'Prueba los tipos de entrada habituales. Bien para artículos y material de consulta ocasionales.',
        creditLabel: 'créditos al registrarte',
        extras: ['Texto / documentos / libros electrónicos / páginas web', 'Edición, exportación y publicación'],
        action: 'Empezar gratis',
      },
      basic: {
        name: 'Básico',
        eyebrow: 'Uso diario',
        description: 'Para el estudio y el trabajo del día a día, con una asignación mensual holgada.',
        creditLabel: 'créditos / mes',
        extras: ['Todos los tipos de entrada', 'Guardar, compartir y exportar en todos los formatos'],
        action: 'Elegir Básico',
      },
      pro: {
        name: 'Pro',
        eyebrow: 'Recomendado',
        description: 'Pensado para investigación a fondo y documentos largos. Desbloquea el modelo de alta calidad.',
        creditLabel: 'créditos / mes',
        extras: ['Modo de mapa detallado', 'Maneja documentos largos y complejos'],
        action: 'Elegir Pro',
      },
      unlimited: {
        name: 'Ilimitado',
        eyebrow: 'Uso intensivo',
        description: 'Para creadores e investigadores de alto volumen. Sin contar créditos cada mes.',
        creditLabel: 'créditos ilimitados',
        extras: ['Todo lo de Pro', 'Uso ilimitado sujeto a una política de uso razonable'],
        action: 'Elegir Ilimitado',
      },
    },
  },
};

const de: MarketingCopy = {
  support: {
    metaTitle: 'Kontakt und Support',
    metaDescription: 'Wenden Sie sich an MindMapAny bei Fragen zum Produkt, zu Ihrem Konto, zu Abonnements, Rückerstattungen und Datenschutz.',
    eyebrow: 'Persönlicher Support',
    heading: 'Wir kümmern uns darum',
    intro: 'Bitte schreiben Sie von der E-Mail-Adresse Ihres Kontos oder der beim Kauf verwendeten Adresse. Wir antworten meist innerhalb von 3 Werktagen.',
    topics: [
      { title: 'Produkt und Konto', text: 'Fehlgeschlagene Generierungen, Probleme mit Credits, Anmeldung oder Daten', subject: 'Support zu Produkt und Konto' },
      { title: 'Abrechnung und Abonnements', text: 'Zahlungen, Rechnungen, Kündigung, Tarifwechsel oder Rückerstattungen', subject: 'Support zu Abrechnung und Abonnement' },
      { title: 'Datenschutz und Sicherheit', text: 'Datenzugriff, Export, Löschung oder Sicherheitsfragen', subject: 'Support zu Datenschutz und Sicherheit' },
    ],
    sendEmail: 'E-Mail senden',
    manageHeading: 'Abonnement verwalten oder kündigen',
    manageBody: 'Öffnen Sie mit Ihrer Kauf-E-Mail das sichere Creem-Kundenportal — ohne auf jemanden zu warten.',
    manageAction: 'Zur Abonnementverwaltung',
  },
  billing: {
    metaTitle: 'Abonnementverwaltung',
    metaDescription: 'Öffnen Sie das Creem-Kundenportal, um Ihr MindMapAny-Abonnement, die Zahlungsart, Rechnungen und die Kündigung zu verwalten.',
    eyebrow: 'Sichere Selbstverwaltung',
    heading: 'Ihr Abonnement verwalten',
    intro: 'Im Creem-Kundenportal sehen Sie Bestellungen und Rechnungen, ändern die Zahlungsart und kündigen jederzeit. Verwenden Sie die beim Kauf von MindMapAny angegebene E-Mail-Adresse, um einen sicheren Anmeldelink zu erhalten.',
    steps: ['Klicken Sie unten, um das Creem-Kundenportal zu öffnen', 'Geben Sie die beim Kauf verwendete E-Mail-Adresse ein', 'Verwalten oder kündigen Sie über den sicheren Link in Ihrem Postfach'],
    openPortal: 'Creem-Kundenportal öffnen',
    contactBilling: 'Support zur Abrechnung kontaktieren',
    afterCancel: 'Nach der Kündigung behalten Sie den Zugang in der Regel bis zum Ende des bereits bezahlten Zeitraums. Die Bedingungen stehen in unserer',
    refundLink: 'Rückerstattungs- und Kündigungsrichtlinie',
    refundTail: '.',
  },

  nav: {
    tools: 'Werkzeuge',
    blog: 'Blog',
    pricing: 'Preise',
    faq: 'Häufige Fragen',
    signIn: 'Anmelden',
    startFree: 'Kostenlos starten',
    workbench: 'Arbeitsbereich öffnen',
    workbenchShort: 'Arbeitsbereich',
    toolsGroups: { documents: 'Dokumente', textWeb: 'Text und Web' },
    deepResearch: 'Tiefenrecherche',
    deepResearchHint: 'Bericht mit Quellenangaben aus mehreren Quellen',
    allTools: 'Alle Werkzeuge',
    allToolsHint: 'Alle Eingabeformate ansehen',
    toolLabels: [
      'PDF zur Mindmap',
      'Word zur Mindmap',
      'PowerPoint zur Mindmap',
      'EPUB zur Mindmap',
      'Text zur Mindmap',
      'Webseite zur Mindmap',
    ],
    switchTo: 'Deutsch',
  },
  footer: {
    tagline: 'Verwandelt komplexe Inhalte in klare, bearbeitbare und nachprüfbare Wissensstrukturen.',
    columns: [
      { title: 'Produkt', labels: ['Werkzeuge', 'Preise', 'Meine Mindmaps', 'Häufige Fragen'] },
      {
        title: 'Werkzeuge und Ressourcen',
        labels: [
          'PDF zur Mindmap',
          'Word zur Mindmap',
          'EPUB zur Mindmap',
          'PowerPoint zur Mindmap',
          'Text zur Mindmap',
          'Webseite zur Mindmap',
          'Blog',
        ],
      },
      {
        title: 'Support und Rechtliches',
        labels: ['Support kontaktieren', 'Abo verwalten', 'Datenschutzerklärung', 'Nutzungsbedingungen', 'Rückerstattung und Kündigung'],
      },
    ],
    legal: 'Zahlungen werden von Creem als Merchant of Record abgewickelt',
  },
  home: {
    metaTitle: 'MindMapAny — Aus beliebigen Inhalten eine klare, nachprüfbare Mindmap',
    metaDescription:
      'Text einfügen oder ein PDF, Word-Dokument, EPUB, PPTX oder einen Webartikel hochladen — in Sekunden entsteht eine bearbeitbare Mindmap, deren Knoten sich bis zur Quelle zurückverfolgen lassen.',
    eyebrow: 'MINDMAPANY / INHALTE STRUKTURIEREN',
    headingLead: 'Lange Inhalte beginnen mit',
    headingHighlight: 'Struktur',
    lede:
      'Verwandeln Sie Fachartikel, Berichte, Word-Dateien, E-Books und Webseiten in Mindmaps mit echter Hierarchie. Keine gekürzte Zusammenfassung, sondern eine Karte des Inhalts, die Sie bearbeiten und am Original überprüfen können.',
    ctaPrimary: 'Kostenlos eine Mindmap erstellen',
    ctaSecondary: 'Warum eine Zusammenfassung nicht reicht',
    worksWith: 'FUNKTIONIERT DIREKT MIT',
    guideLead: 'Zum ersten Mal hier?',
    guideLink: 'Leitfaden für KI-Mindmaps lesen',
    inputLabels: ['Langer Text', 'PDF', 'Word', 'EPUB', 'PPTX', 'Webartikel'],
    sourceDocLabel: 'Ausgangsdokument',
    sourceDocPages: 'PDF mit 48 Seiten',
    panelTitle: 'KI-Forschungsbericht / Methoden und Ergebnisse',
    panelNodes: '42 Knoten',
    panelTrace: 'Jeder Knoten führt zurück zur Quelle',
    panelFooter: ['Knoten bearbeitbar', 'Seitenangaben', 'PNG / SVG / MD'],
    stats: [
      ['7', 'Eingabeformate'],
      ['30+', 'Ausgabesprachen'],
      ['110', 'Knoten pro Mindmap (max.)'],
      ['Nachprüfbar', 'Seiten- und Abschnittsanker'],
    ],
    ctaEyebrow: 'BEREIT, WENN SIE ES SIND',
    ctaHeading: 'Hören Sie auf, lange Dokumente auf Seite eins zu beginnen.',
    ctaBody:
      'Laden Sie Ihren Inhalt hoch, verschaffen Sie sich zuerst einen Überblick über die Struktur und entscheiden Sie dann, welche Abschnitte eine genaue Lektüre verdienen. Für ein kostenloses Konto liegen 30 Credits bereit.',
    ctaButton: 'Erste Mindmap erstellen',
  },
  features: {
    eyebrow: 'FUNKTIONEN',
    lede: 'Gemacht für alle, die lange Inhalte sorgfältig lesen, prüfen und ordnen müssen.',
    headingA: 'Eine Zusammenfassung sagt Ihnen, was gesagt wurde.',
    headingB: 'Die Struktur sagt Ihnen, warum.',
    items: [
      {
        title: 'Viele Eingaben, ein Verfahren',
        body: 'Text einfügen, ein PDF / DOCX / EPUB / PPTX hochladen oder einen Link angeben. Die Extraktion unterscheidet sich je Format; die Klarheit der entstehenden Struktur nicht.',
        detail: '7 Quellen',
      },
      {
        title: 'Jeder Knoten ist rückverfolgbar',
        body: 'Knoten aus einem PDF tragen Seitenzahlen, Knoten aus einem PPTX die Foliennummer. Die Position wird beim Zerlegen des Textes festgehalten und nicht nachträglich vom Modell erfunden.',
        detail: 'Deterministische Belege',
      },
      {
        title: 'Stabile Hierarchie statt flacher Liste',
        body: 'Lange Dokumente werden abschnittsweise zusammengefasst und dann zusammengeführt; doppelte Themen fallen zusammen, verwaiste Knoten entfallen. Drei Detailstufen entsprechen unterschiedlichen Grenzen für Ebenen und Knoten.',
        detail: 'Bis zu 5 Ebenen',
      },
      {
        title: 'Nach der Erstellung bearbeitbar',
        body: 'Doppelklick zum Umbenennen, Tab für einen Unterknoten, Enter für einen Nachbarknoten, Leertaste zum Einklappen. Kein statisches Bild, das man nur ansehen kann.',
        detail: 'Bearbeiten per Tastatur',
      },
      {
        title: 'Exportieren und teilen',
        body: 'Mit einem Klick als PNG, SVG oder Markdown exportieren. Mit einem öffentlichen Link können andere die Mindmap ohne Registrierung ansehen.',
        detail: '3 Exportformate',
      },
      {
        title: 'Über 30 Ausgabesprachen',
        body: 'Lesen Sie einen Fachartikel in einer Sprache und erhalten Sie die Mindmap in einer anderen. Ausgangs- und Ausgabesprache sind unabhängig voneinander.',
        detail: 'Sprachübergreifend',
      },
    ],
    pipelineLabel: 'EIN VERFAHREN',
    pipelineStages: ['Extrahieren', 'Zerlegen und verankern', 'Hierarchie aufbauen', 'Bearbeiten'],
    pipelineNote:
      'Nur der erste Schritt hängt vom Format ab. Alles danach ist identisch — deshalb kommen eine Präsentation und ein Fachartikel gleich gut strukturiert heraus.',
  },
  inputTypes: {
    eyebrow: 'NACH EINGABEFORMAT',
    lede: 'Jedes Format wird anders extrahiert, und jedes verankert seine Knoten an etwas anderem.',
    heading: 'Womit fangen Sie an?',
    items: [
      {
        name: 'PDF',
        anchor: 'Seitenzahlen',
        body: 'Fachartikel, Berichte und Whitepaper. Jeder Knoten behält die Seite, aus der er stammt — eine Zahl zu prüfen heißt eine Seite zu öffnen statt die Datei erneut zu lesen. Nur textbasierte PDFs; Scans brauchen zuerst OCR.',
        linkLabel: 'PDF zur Mindmap',
      },
      {
        name: 'Word',
        anchor: 'Dokumentreihenfolge',
        body: 'Spezifikationen, Entwürfe und lange Berichte. Absätze des Fließtexts und Tabelleninhalte werden der Reihe nach gelesen. Ein DOCX hat keine festen Seiten, solange Word es nicht setzt — Knoten verankern sich deshalb an der Position im Dokument.',
        linkLabel: 'Word zur Mindmap',
      },
      {
        name: 'EPUB',
        anchor: 'Kapiteltitel',
        body: 'Ganze Bücher, gelesen in der vom Verlag festgelegten Reihenfolge. Knoten führen ihr Kapitel mit — der verlässliche Anker bei E-Books, denn Seitenzahlen verschieben sich mit der Schriftgröße. DRM-geschützte Dateien lassen sich nicht öffnen.',
        linkLabel: 'EPUB zur Mindmap',
      },
      {
        name: 'PowerPoint',
        anchor: 'Foliennummern',
        body: 'Vorträge, Schulungsunterlagen und Angebote. Der Folientext wird in der Reihenfolge der Präsentation gelesen, jeder Knoten trägt seine Folie. Notizen und Bilder werden nicht gelesen — Präsentationen, die das Wesentliche in den Notizen verstecken, ergeben eine dünne Mindmap.',
        linkLabel: 'PowerPoint zur Mindmap',
      },
      {
        name: 'Langer Text',
        anchor: 'Einfügen und los',
        body: 'Protokolle, Transkripte, Recherchenotizen — alles, was sich markieren und kopieren lässt. Der schnellste Weg zu sehen, ob viel unstrukturierter Text wirklich eine schlüssige Argumentation trägt.',
        linkLabel: 'Text zur Mindmap',
      },
      {
        name: 'Webseiten',
        anchor: 'Abschnittsanker',
        body: 'Artikel, Dokumentationen und Lexikoneinträge. Wir holen den Fließtext heraus und lassen Navigation und Werbung weg. Seiten hinter einer Anmeldung, mit Bot-Schutz oder rein clientseitig gerendert lassen sich nicht lesen.',
        linkLabel: 'Webseite zur Mindmap',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'SO FUNKTIONIERT ES',
    heading: 'Dieselbe Lektüre. Bessere Reihenfolge.',
    steps: [
      { title: 'Inhalt hinzufügen', body: 'Text, ein Dokument, ein E-Book oder ein Link. Wählen Sie Ausgabesprache, Detailtiefe und Zweck.' },
      { title: 'Ein paar Sekunden warten', body: 'Wir extrahieren den Fließtext, zerlegen ihn und verankern jedes Stück an seiner Position; anschließend baut das Modell die Hierarchie.' },
      { title: 'Bearbeiten und mitnehmen', body: 'Direkt auf der Arbeitsfläche bearbeiten, als PNG / SVG / Markdown exportieren oder einen öffentlichen Link erzeugen.' },
    ],
  },
  faq: {
    eyebrow: 'HÄUFIGE FRAGEN',
    headingA: 'Ein paar Dinge,',
    headingB: 'bevor Sie loslegen.',
    lede: 'Noch eine Frage offen? Schreiben Sie an support@mindmapany.com — wir antworten meist innerhalb von 3 Werktagen.',
    items: [
      {
        q: 'Welche Eingabeformate werden unterstützt?',
        a: 'Eingefügter Text, PDF, DOCX, EPUB, PPTX, TXT, Markdown und öffentliche Weblinks. Maximal 20 MB je Datei. Gescannte PDFs, Audio, Video und alte DOC-Dateien werden noch nicht unterstützt.',
      },
      {
        q: 'Stimmen die Seitenzahlen an den Knoten?',
        a: 'Ja. Jedes Textstück wird beim Zerlegen an seine Seitenzahl oder Abschnittsposition gebunden. Das Modell verweist nur auf Kennungen von Textstücken; die Position wird nachgeschlagen und niemals vom Modell erzeugt.',
      },
      {
        q: 'Warum lassen sich manche Webseiten nicht lesen?',
        a: 'Seiten, die eine Anmeldung verlangen, hinter Bot-Schutz liegen oder vollständig per JavaScript gerendert werden, lassen sich in der aktuellen Version nicht auslesen. Gewöhnliche Artikelseiten, Dokumentationen und Blogs funktionieren in der Regel.',
      },
      {
        q: 'Wem gehören die erstellten Mindmaps?',
        a: 'Ihnen. Sie können sie jederzeit exportieren oder löschen. Freigabelinks sind standardmäßig deaktiviert — niemand sonst hat Zugriff, bis Sie die öffentliche Freigabe selbst einschalten.',
      },
      {
        q: 'Wie viel ist im kostenlosen Tarif möglich?',
        a: 'Mit der Registrierung erhalten Sie 30 Credits — genug, um Text- und Webseiteneingaben ausgiebig zu testen. Lange Dokumente und das hochwertige Modell werden von Ihrem Tarif und Guthaben abgezogen.',
      },
      {
        q: 'Muss ich mich registrieren, um es auszuprobieren?',
        a: 'Ja — für das Erstellen einer Mindmap ist ein Konto nötig. Die Registrierung ist kostenlos, dauert mit Google oder einer E-Mail-Adresse nur Sekunden und bringt sofort 30 Credits. Für das Ansehen einer geteilten Mindmap brauchen Sie kein Konto.',
      },
      {
        q: 'Wie funktionieren Credits?',
        a: 'Credits werden je Erstellung berechnet; die Höhe hängt von Eingabeformat, Modellstufe und Länge des Inhalts ab — ein kurzer Artikel kostet einen Bruchteil eines 200-seitigen Berichts. Ihr Guthaben sehen Sie im Arbeitsbereich; scheitert eine Erstellung, werden die Credits zurückgebucht.',
      },
      {
        q: 'Kann ich die Mindmap danach bearbeiten oder ist sie ein festes Bild?',
        a: 'Sie können sie bearbeiten. Doppelklick auf einen Knoten zum Umbenennen, Tab fügt einen Unterknoten hinzu, Enter einen Nachbarknoten, Leertaste klappt einen Zweig ein, Entf löscht ihn. Layout, Farbschema, Typografie und Zweignummerierung sind einstellbar und werden mit der Mindmap gespeichert.',
      },
      {
        q: 'Was kann ich exportieren, und kann ich ohne Konto teilen?',
        a: 'Mindmaps lassen sich als PNG, SVG und Markdown exportieren. Zusätzlich können Sie einen öffentlichen Link aktivieren, über den jede Person eine reine Leseansicht ohne Registrierung öffnen kann. Das Teilen ist standardmäßig aus und jederzeit wieder abschaltbar.',
      },
    ],
  },
  toolsIndex: {
    metaTitle: 'KI-Werkzeuge für Mindmaps',
    metaDescription:
      'Mit KI aus PDFs, Word-Dateien, E-Books, Webartikeln und langen Texten bearbeitbare, nachprüfbare mehrstufige Mindmaps erstellen.',
    eyebrow: 'Werkzeug nach Inhaltstyp wählen',
    heading: 'KI-Werkzeuge für Mindmaps',
    lede: 'Jeder Inhaltstyp hat sein eigenes Extraktionsverfahren, und alle münden in dieselbe bearbeitbare, einklappbare und mit der Quelle verknüpfte Struktur.',
    viewDetails: 'Details zum Werkzeug',
  },
  toolPage: {
    startFree: 'Kostenlos starten',
    goodFor: 'Gut geeignet für',
    benefitsHeading: 'Keine Zusammenfassung — eine Struktur, mit der Sie weiterarbeiten',
    stepsHeading: 'Drei Schritte',
    faqHeading: 'Häufige Fragen',
    ctaHeading: 'Machen Sie aus Ihrem Inhalt eine klare Mindmap',
    ctaBody: 'Nichts zu installieren — einfach den Browser öffnen und ausprobieren.',
    relatedHeading: 'Passende Leitfäden',
    breadcrumbHome: 'Startseite',
    breadcrumbTools: 'Werkzeuge',
    seePlans: 'Tarife und Grenzen ansehen',
  },
  pricing: {
    metaTitle: 'Preise und Tarife',
    metaDescription:
      'Vergleichen Sie Credits, Modelle und Dokumentgrenzen der Tarife Kostenlos, Basis, Pro und Unbegrenzt von MindMapAny.',
    eyebrow: 'Einfach und transparent — höherstufen, wenn Sie es brauchen',
    heading: 'Kostenlos starten',
    intro:
      'Alle Preise in US-Dollar. Monatlich zahlen bleibt flexibel, jährlich zahlen spart 40%. Steuern werden vor dem Bezahlen klar ausgewiesen.',
    badge: '30 Gratis-Credits bei der Registrierung — testen Sie jedes Eingabeformat',
    mostPopular: 'AM BELIEBTESTEN',
    toggleMonthly: 'Monatlich',
    toggleAnnual: 'Jährlich',
    saveBadge: '{pct}% SPAREN',
    perMonth: '/Monat',
    forever: 'dauerhaft',
    billedMonthly: 'monatliche Abrechnung',
    billedAnnually: 'jährlich ${total} · {pct}% sparen',
    limitFastOnly: 'Schnelles Modell',
    limitBoth: 'Schnelles und hochwertiges Modell',
    limitChars: 'Bis zu {n} Zeichen',
    limitPdfPages: 'PDFs bis {n} Seiten',
    teamHeading: 'Mehr für ein Team oder eine Einrichtung?',
    teamBody:
      'Sprechen Sie uns zu gemeinsamen Credits, Beschaffung und dediziertem Support an. Wir antworten meist innerhalb von 3 Werktagen.',
    teamAction: 'Support kontaktieren',
    footnoteEmail:
      'Bitte mit derselben E-Mail-Adresse bezahlen wie bei Ihrem MindMapAny-Konto, damit der Tarif nach der Zahlung automatisch aktiv wird.',
    footnoteRenewal:
      'Abonnements verlängern sich automatisch für den gewählten Abrechnungszeitraum, bis Sie kündigen. Zahlungen werden von Creem als Merchant of Record abgewickelt.',
    footnoteCancel: 'Sie können jederzeit kündigen unter',
    footnoteRefund: 'Rückerstattungs- und Kündigungsrichtlinie',
    plans: {
      free: {
        name: 'Kostenlos',
        eyebrow: 'Kostenlos starten',
        description: 'Probieren Sie die gängigen Eingabeformate aus. Gut für gelegentliche Artikel und Nachschlagematerial.',
        creditLabel: 'Credits bei Registrierung',
        extras: ['Text / Dokumente / E-Books / Webseiten', 'Bearbeiten, Exportieren und öffentlich Teilen'],
        action: 'Kostenlos starten',
      },
      basic: {
        name: 'Basis',
        eyebrow: 'Täglicher Gebrauch',
        description: 'Für Studium und Arbeit im Alltag, mit komfortablem Monatskontingent.',
        creditLabel: 'Credits / Monat',
        extras: ['Alle verfügbaren Eingabeformate', 'Speichern, Teilen und Export in jedem Format'],
        action: 'Basis wählen',
      },
      pro: {
        name: 'Pro',
        eyebrow: 'Empfohlen',
        description: 'Für Tiefenrecherche und lange Dokumente. Schaltet das hochwertige Modell frei.',
        creditLabel: 'Credits / Monat',
        extras: ['Detaillierter Mindmap-Modus', 'Bewältigt komplexe, lange Dokumente'],
        action: 'Pro wählen',
      },
      unlimited: {
        name: 'Unbegrenzt',
        eyebrow: 'Intensive Nutzung',
        description: 'Für Vielschreibende und Forschende. Kein monatliches Zählen von Credits.',
        creditLabel: 'unbegrenzte Credits',
        extras: ['Alles aus Pro', 'Unbegrenzte Nutzung im Rahmen der Fair-Use-Richtlinie'],
        action: 'Unbegrenzt wählen',
      },
    },
  },
};

const fr: MarketingCopy = {
  support: {
    metaTitle: 'Contact et assistance',
    metaDescription: "Contactez MindMapAny pour toute question sur le produit, votre compte, les abonnements, les remboursements et la confidentialité.",
    eyebrow: 'Une réponse humaine',
    heading: 'Nous sommes là pour régler cela',
    intro: "Écrivez-nous depuis l'adresse de votre compte ou celle utilisée lors de l'achat. Nous répondons généralement sous 3 jours ouvrés.",
    topics: [
      { title: 'Produit et compte', text: "Générations en échec, problèmes de crédits, de connexion ou de données", subject: 'Assistance produit et compte' },
      { title: 'Facturation et abonnements', text: 'Paiements, factures, résiliation, changement de formule ou remboursements', subject: 'Assistance facturation et abonnement' },
      { title: 'Confidentialité et sécurité', text: "Accès, export ou suppression des données et questions de sécurité", subject: 'Assistance confidentialité et sécurité' },
    ],
    sendEmail: 'Envoyer un e-mail',
    manageHeading: 'Gérer ou résilier votre abonnement',
    manageBody: "Ouvrez le portail client Creem avec l'e-mail de votre achat, sans attendre personne.",
    manageAction: "Aller à la gestion de l'abonnement",
  },
  billing: {
    metaTitle: "Gestion de l'abonnement",
    metaDescription: "Ouvrez le portail client Creem pour gérer votre abonnement MindMapAny, votre moyen de paiement, vos factures et la résiliation.",
    eyebrow: 'Libre-service sécurisé',
    heading: 'Gérer votre abonnement',
    intro: "Le portail client Creem permet de consulter commandes et factures, de changer de moyen de paiement et de résilier à tout moment. Utilisez l'adresse e-mail indiquée lors de votre achat pour recevoir un lien de connexion sécurisé.",
    steps: ['Cliquez sur le bouton ci-dessous pour ouvrir le portail client Creem', "Saisissez l'e-mail utilisé lors de l'achat", 'Utilisez le lien sécurisé reçu pour gérer ou résilier votre abonnement'],
    openPortal: 'Ouvrir le portail client Creem',
    contactBilling: "Contacter l'assistance facturation",
    afterCancel: "Après résiliation, vous conservez normalement l'accès jusqu'à la fin de la période déjà payée. Les conditions figurent dans notre",
    refundLink: 'Politique de remboursement et de résiliation',
    refundTail: '.',
  },

  nav: {
    tools: 'Outils',
    blog: 'Blog',
    pricing: 'Tarifs',
    faq: 'Questions fréquentes',
    signIn: 'Se connecter',
    startFree: 'Commencer gratuitement',
    workbench: "Ouvrir l'espace de travail",
    workbenchShort: 'Espace de travail',
    toolsGroups: { documents: 'Documents', textWeb: 'Texte et web' },
    deepResearch: 'Recherche approfondie',
    deepResearchHint: 'Un rapport sourcé à partir de plusieurs références',
    allTools: 'Tous les outils',
    allToolsHint: "Parcourir tous les formats d'entrée",
    toolLabels: [
      'PDF en carte mentale',
      'Word en carte mentale',
      'PowerPoint en carte mentale',
      'EPUB en carte mentale',
      'Texte en carte mentale',
      'Page web en carte mentale',
    ],
    switchTo: 'Français',
  },
  footer: {
    tagline: 'Transformez des contenus complexes en structures de connaissance claires, modifiables et vérifiables.',
    columns: [
      { title: 'Produit', labels: ['Outils', 'Tarifs', 'Mes cartes mentales', 'Questions fréquentes'] },
      {
        title: 'Outils et ressources',
        labels: [
          'PDF en carte mentale',
          'Word en carte mentale',
          'EPUB en carte mentale',
          'PowerPoint en carte mentale',
          'Texte en carte mentale',
          'Page web en carte mentale',
          'Blog',
        ],
      },
      {
        title: 'Assistance et mentions légales',
        labels: ["Contacter l'assistance", "Gérer l'abonnement", 'Politique de confidentialité', "Conditions d'utilisation", 'Remboursement et résiliation'],
      },
    ],
    legal: 'Paiements traités par Creem en qualité de Merchant of Record',
  },
  home: {
    metaTitle: "MindMapAny — Transformez n'importe quel contenu en une carte mentale claire et vérifiable",
    metaDescription:
      "Collez du texte ou importez un PDF, un fichier Word, un EPUB, un PPTX ou un article web : vous obtenez en quelques secondes une carte mentale modifiable dont chaque nœud renvoie à la source.",
    eyebrow: 'MINDMAPANY / STRUCTURATION DE CONTENU',
    headingLead: 'Un contenu long commence par la',
    headingHighlight: 'structure',
    lede:
      "Transformez articles, rapports, fichiers Word, livres numériques et pages web en cartes mentales dotées d'une véritable hiérarchie. Pas un résumé plus court : une carte du contenu que vous pouvez modifier et vérifier face à l'original.",
    ctaPrimary: 'Créer une carte mentale gratuitement',
    ctaSecondary: 'Pourquoi un résumé ne suffit pas',
    worksWith: 'FONCTIONNE DIRECTEMENT AVEC',
    guideLead: 'Une première ?',
    guideLink: 'Lire le guide des cartes mentales IA',
    inputLabels: ['Texte long', 'PDF', 'Word', 'EPUB', 'PPTX', 'Articles web'],
    sourceDocLabel: "Document d'origine",
    sourceDocPages: 'PDF de 48 pages',
    panelTitle: 'Rapport de recherche en IA / méthodes et conclusions',
    panelNodes: '42 nœuds',
    panelTrace: 'Chaque nœud renvoie à la source',
    panelFooter: ['Nœuds modifiables', 'Références de page', 'PNG / SVG / MD'],
    stats: [
      ['7', "formats d'entrée"],
      ['30+', 'langues de sortie'],
      ['110', 'nœuds max. par carte'],
      ['Vérifiable', 'ancres de page et de section'],
    ],
    ctaEyebrow: 'QUAND VOUS VOULEZ',
    ctaHeading: "Cessez d'aborder les longs documents par la page un.",
    ctaBody:
      "Importez votre contenu, prenez d'abord la mesure de la structure, puis décidez quelles sections méritent une lecture attentive. Créez un compte gratuit : 30 crédits vous attendent.",
    ctaButton: 'Créer votre première carte',
  },
  features: {
    eyebrow: 'FONCTIONNALITÉS',
    lede: 'Conçu pour celles et ceux qui doivent lire, vérifier et organiser des contenus longs avec soin.',
    headingA: 'Un résumé vous dit ce qui a été dit.',
    headingB: 'La structure vous dit pourquoi.',
    items: [
      {
        title: 'Des entrées variées, un seul traitement',
        body: "Collez du texte, importez un PDF / DOCX / EPUB / PPTX, ou indiquez un lien. L'extraction diffère selon le format ; la clarté de la structure obtenue, non.",
        detail: '7 sources',
      },
      {
        title: 'Chaque nœud reste traçable',
        body: "Les nœuds issus d'un PDF portent un numéro de page, ceux d'un PPTX un numéro de diapositive. La position est fixée au moment du découpage, elle n'est pas inventée après coup par le modèle.",
        detail: 'Références déterministes',
      },
      {
        title: 'Une hiérarchie stable, pas une liste à plat',
        body: "Les documents longs sont résumés section par section puis fusionnés ; les thèmes redondants se rejoignent et les nœuds isolés sont écartés. Trois niveaux de détail correspondent à des limites différentes de profondeur et de nombre de nœuds.",
        detail: "Jusqu'à 5 niveaux",
      },
      {
        title: 'Modifiable après génération',
        body: "Double-clic pour renommer, Tab pour un nœud enfant, Entrée pour un nœud voisin, Espace pour replier. Ce n'est pas une image figée que l'on se contente de regarder.",
        detail: 'Édition au clavier',
      },
      {
        title: 'Exporter et partager',
        body: "Export en PNG, SVG ou Markdown en un clic. Activez le lien public et vos interlocuteurs consultent la carte sans créer de compte.",
        detail: "3 formats d'export",
      },
      {
        title: 'Plus de 30 langues de sortie',
        body: "Lisez un article dans une langue et obtenez la carte dans une autre. La langue source et la langue de sortie sont indépendantes.",
        detail: 'Multilingue',
      },
    ],
    pipelineLabel: 'UN SEUL TRAITEMENT',
    pipelineStages: ['Extraire', 'Découper et ancrer', 'Construire la hiérarchie', 'Modifier'],
    pipelineNote:
      "Seule la première étape dépend du format. Tout le reste est commun : c'est pourquoi une présentation et un article scientifique ressortent aussi bien structurés l'un que l'autre.",
  },
  inputTypes: {
    eyebrow: "PAR FORMAT D'ENTRÉE",
    lede: "Chaque format s'extrait différemment et ancre ses nœuds à un repère différent.",
    heading: 'De quoi partez-vous ?',
    items: [
      {
        name: 'PDF',
        anchor: 'Numéros de page',
        body: "Articles, rapports et livres blancs. Chaque nœud conserve la page dont il provient : vérifier un chiffre revient à ouvrir une page plutôt qu'à relire le fichier. PDF textuels uniquement — les documents scannés demandent d'abord une OCR.",
        linkLabel: 'PDF en carte mentale',
      },
      {
        name: 'Word',
        anchor: 'Ordre du document',
        body: "Cahiers des charges, brouillons et longs rapports. Les paragraphes du corps et le texte des tableaux sont lus dans l'ordre. Un DOCX n'a pas de pages fixes tant que Word ne l'a pas mis en page : les nœuds s'ancrent donc à la position dans le document.",
        linkLabel: 'Word en carte mentale',
      },
      {
        name: 'EPUB',
        anchor: 'Titres de chapitre',
        body: "Des livres entiers, lus dans l'ordre défini par l'éditeur. Les nœuds portent leur chapitre, l'ancre fiable d'un livre numérique — les numéros de page varient avec la taille de police. Les fichiers protégés par DRM ne peuvent pas être ouverts.",
        linkLabel: 'EPUB en carte mentale',
      },
      {
        name: 'PowerPoint',
        anchor: 'Numéros de diapositive',
        body: "Conférences, supports de formation et propositions. Le texte des diapositives est repris dans l'ordre et chaque nœud porte sa diapositive. Les notes du présentateur et les images ne sont pas lues : un support qui cache l'essentiel dans les notes donnera une carte pauvre.",
        linkLabel: 'PowerPoint en carte mentale',
      },
      {
        name: 'Texte long',
        anchor: 'Coller et partir',
        body: "Comptes rendus de réunion, transcriptions, notes de recherche — tout ce que vous pouvez sélectionner et copier. Le moyen le plus rapide de voir si un amas de texte tient réellement un raisonnement cohérent.",
        linkLabel: 'Texte en carte mentale',
      },
      {
        name: 'Pages web',
        anchor: 'Ancres de section',
        body: "Articles, documentations et notices encyclopédiques. Nous extrayons le corps du texte et écartons la navigation et la publicité. Les pages derrière une connexion, protégées contre les robots ou rendues entièrement côté client ne peuvent pas être lues.",
        linkLabel: 'Page web en carte mentale',
      },
    ],
  },
  howItWorks: {
    eyebrow: 'COMMENT ÇA MARCHE',
    heading: 'La même lecture. Un meilleur ordre.',
    steps: [
      { title: 'Ajoutez votre contenu', body: "Du texte, un document, un livre numérique ou un lien. Choisissez la langue de sortie, la profondeur et l'objectif." },
      { title: 'Patientez quelques secondes', body: "Nous extrayons le corps du texte, le découpons et ancrons chaque fragment à sa position, puis le modèle construit la hiérarchie." },
      { title: 'Modifiez et emportez', body: "Modifiez directement sur le plan de travail, exportez en PNG / SVG / Markdown ou générez un lien public." },
    ],
  },
  faq: {
    eyebrow: 'QUESTIONS FRÉQUENTES',
    headingA: 'Quelques précisions',
    headingB: 'avant de commencer.',
    lede: "Une autre question ? Écrivez à support@mindmapany.com : nous répondons généralement sous 3 jours ouvrés.",
    items: [
      {
        q: "Quels formats d'entrée sont pris en charge ?",
        a: "Texte collé, PDF, DOCX, EPUB, PPTX, TXT, Markdown et liens web publics. 20 Mo au maximum par fichier. Les PDF scannés, l'audio, la vidéo et les anciens fichiers DOC ne sont pas encore pris en charge.",
      },
      {
        q: 'Les numéros de page des nœuds sont-ils exacts ?',
        a: "Oui. Chaque fragment est lié à sa page ou à sa position de section au moment du découpage. Le modèle ne référence que des identifiants de fragment ; la position est résolue par recherche et n'est jamais générée par le modèle.",
      },
      {
        q: 'Pourquoi certaines pages web ne peuvent-elles pas être lues ?',
        a: "Les pages qui exigent une connexion, sont protégées contre les robots ou sont rendues entièrement en JavaScript ne peuvent pas être extraites dans la version actuelle. Les pages d'articles courantes, les documentations et les blogs fonctionnent généralement bien.",
      },
      {
        q: 'À qui appartiennent les cartes que je génère ?',
        a: "À vous. Vous pouvez les exporter ou les supprimer à tout moment. Les liens de partage sont désactivés par défaut : personne d'autre n'y a accès tant que vous n'activez pas vous-même le partage public.",
      },
      {
        q: 'Que puis-je faire avec la formule gratuite ?',
        a: "L'inscription donne 30 crédits, de quoi tester à fond les entrées texte et page web. Les documents longs et le modèle haute qualité sont décomptés de votre formule et de votre solde de crédits.",
      },
      {
        q: "Faut-il s'inscrire pour essayer ?",
        a: "Oui : générer une carte nécessite un compte. L'inscription est gratuite, prend quelques secondes avec Google ou une adresse e-mail, et donne immédiatement 30 crédits. Consulter une carte partagée avec vous ne demande aucun compte.",
      },
      {
        q: 'Comment fonctionnent les crédits ?',
        a: "Les crédits sont décomptés à chaque génération ; le coût dépend du format d'entrée, du modèle et de la longueur du contenu — un article court coûte une fraction d'un rapport de 200 pages. Votre solde apparaît dans l'espace de travail et, si une génération échoue, les crédits vous sont restitués.",
      },
      {
        q: "Puis-je modifier la carte après coup, ou est-ce une image figée ?",
        a: "Vous pouvez la modifier. Double-cliquez sur un nœud pour le renommer, Tab ajoute un enfant, Entrée un voisin, Espace replie une branche et Suppr la supprime. Disposition, palette, typographie et numérotation des branches sont réglables, et la mise en forme est enregistrée avec la carte.",
      },
      {
        q: "Que puis-je exporter, et puis-je partager avec quelqu'un sans compte ?",
        a: "Les cartes s'exportent en PNG, SVG et Markdown. Vous pouvez aussi activer un lien public permettant à quiconque d'ouvrir une vue en lecture seule sans s'inscrire. Le partage est désactivé par défaut et peut être coupé à tout moment.",
      },
    ],
  },
  toolsIndex: {
    metaTitle: 'Outils de cartes mentales par IA',
    metaDescription:
      "Utilisez l'IA pour transformer PDF, fichiers Word, livres numériques, articles web et textes longs en cartes mentales multiniveaux, modifiables et vérifiables.",
    eyebrow: 'Choisissez un outil selon votre contenu',
    heading: 'Outils de cartes mentales par IA',
    lede: "Chaque type de contenu a son propre traitement d'extraction, et tous aboutissent à la même structure modifiable, repliable et reliée à la source.",
    viewDetails: "Voir le détail de l'outil",
  },
  toolPage: {
    startFree: 'Commencer gratuitement',
    goodFor: 'Utile pour',
    benefitsHeading: "Pas un résumé — une structure que vous continuez d'utiliser",
    stepsHeading: 'Trois étapes',
    faqHeading: 'Questions fréquentes',
    ctaHeading: 'Transformez votre contenu en une carte claire',
    ctaBody: "Rien à installer : ouvrez votre navigateur et essayez.",
    relatedHeading: 'Guides associés',
    breadcrumbHome: 'Accueil',
    breadcrumbTools: 'Outils',
    seePlans: 'Voir les formules et les limites',
  },
  pricing: {
    metaTitle: 'Tarifs et formules',
    metaDescription:
      'Comparez les crédits, les modèles et les limites de documents des formules Gratuite, Basique, Pro et Illimitée de MindMapAny.',
    eyebrow: 'Simple et transparent — montez en formule quand vous en avez besoin',
    heading: 'Commencer gratuitement',
    intro:
      "Tous les prix sont en dollars américains. Payez au mois pour rester souple, ou à l'année et économisez 40%. Les taxes sont indiquées clairement avant le paiement.",
    badge: "30 crédits offerts à l'inscription — essayez tous les formats d'entrée",
    mostPopular: 'LE PLUS CHOISI',
    toggleMonthly: 'Mensuel',
    toggleAnnual: 'Annuel',
    saveBadge: 'ÉCONOMISEZ {pct}%',
    perMonth: '/mois',
    forever: 'pour toujours',
    billedMonthly: 'facturation mensuelle',
    billedAnnually: 'facturé ${total}/an · économisez {pct}%',
    limitFastOnly: 'Modèle rapide',
    limitBoth: 'Modèle rapide + modèle haute qualité',
    limitChars: "Jusqu'à {n} caractères",
    limitPdfPages: "PDF jusqu'à {n} pages",
    teamHeading: 'Besoin de plus pour une équipe ou un établissement ?',
    teamBody:
      "Écrivez-nous au sujet des crédits mutualisés, des achats et d'une assistance dédiée. Nous répondons généralement sous 3 jours ouvrés.",
    teamAction: "Contacter l'assistance",
    footnoteEmail:
      "Réglez avec la même adresse e-mail que votre compte MindMapAny afin que la formule s'active automatiquement après le paiement.",
    footnoteRenewal:
      "Les abonnements se renouvellent automatiquement selon la période de facturation choisie, jusqu'à résiliation. Les paiements sont traités par Creem en qualité de Merchant of Record.",
    footnoteCancel: 'Vous pouvez résilier à tout moment depuis',
    footnoteRefund: 'Politique de remboursement et de résiliation',
    plans: {
      free: {
        name: 'Gratuite',
        eyebrow: 'Commencer gratuitement',
        description: "Essayez les formats d'entrée courants. Adapté aux articles et documents de référence occasionnels.",
        creditLabel: "crédits à l'inscription",
        extras: ['Texte / documents / livres numériques / pages web', 'Modification, export et partage public'],
        action: 'Commencer gratuitement',
      },
      basic: {
        name: 'Basique',
        eyebrow: 'Usage quotidien',
        description: "Pour les études et le travail au quotidien, avec une enveloppe mensuelle confortable.",
        creditLabel: 'crédits / mois',
        extras: ["Tous les formats d'entrée", 'Enregistrement, partage et export dans tous les formats'],
        action: 'Choisir Basique',
      },
      pro: {
        name: 'Pro',
        eyebrow: 'Recommandée',
        description: 'Pensée pour la recherche approfondie et les documents longs. Débloque le modèle haute qualité.',
        creditLabel: 'crédits / mois',
        extras: ['Mode carte détaillée', 'Gère les documents longs et complexes'],
        action: 'Choisir Pro',
      },
      unlimited: {
        name: 'Illimitée',
        eyebrow: 'Usage intensif',
        description: "Pour les créateurs et chercheurs à fort volume. Plus besoin de compter les crédits chaque mois.",
        creditLabel: 'crédits illimités',
        extras: ['Tout ce que contient Pro', "Usage illimité dans le cadre d'une politique d'usage raisonnable"],
        action: 'Choisir Illimitée',
      },
    },
  },
};

const COPY: Record<Locale, MarketingCopy> = { en, 'zh-CN': zhCN, ja, ko, es, de, fr };

export function marketingCopy(locale: Locale): MarketingCopy {
  return COPY[locale] ?? en;
}

/** 文案里的 {n} 占位符替换。营销文案只有数字需要插值，不引入完整的 i18n 运行时。 */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, name: string) => (name in vars ? String(vars[name]) : whole));
}
