import type { ToolPageCopy } from './registry';

/** 工具页的简体中文文案。关键词是中文页自己的一套，不是英文的直译。 */
export const TOOLS_ZH_CN: Record<string, ToolPageCopy> = {
  'pdf-to-mind-map': {
    eyebrow: 'AI 文档结构化工具',
    title: 'PDF 转思维导图',
    description:
      '上传 PDF，得到一张可编辑的多层思维导图。章节、主题和核心论点会被自动识别，每一条结论都保留它来自的页码。',
    seoTitle: 'PDF 转思维导图 —— AI 提取结构与要点',
    seoDescription:
      '免费试用 AI PDF 转思维导图工具。上传论文、报告或电子书，得到节点带原文页码的多层脑图，支持导出 PNG、SVG 和 Markdown。',
    primaryKeyword: 'PDF 转思维导图',
    relatedKeywords: ['PDF 思维导图生成器', 'AI PDF 摘要', '论文转思维导图', 'PDF 内容可视化'],
    benefits: [
      { title: '先定结构，再挂节点', description: '不是逐段照搬，而是先归纳出主题类别，再把每条事实挂到对应的分支下。' },
      { title: '每个要点都能回溯', description: '节点保留它在 PDF 中的页码，核实一条结论不必再从头翻整份文件。' },
      { title: '生成之后继续编辑', description: '增删节点、折叠层级，并导出为 PNG、SVG 或 Markdown。' },
    ],
    steps: [
      { title: '上传 PDF', description: '请选择文字版 PDF。当前限制为 20MB、200 页。' },
      { title: '选择详细程度和用途', description: '按你是速览、精读还是分析结构，控制脑图展开到几层。' },
      { title: '核对来源并导出', description: '检查页码溯源，调整节点，然后保存或导出结果。' },
    ],
    useCases: ['快速速览研究论文', '啃行业报告和白皮书', '把教材章节整理成复习框架', '梳理合同与规章的条款结构'],
    faq: [
      { question: '扫描版 PDF 能生成思维导图吗？', answer: '当前版本支持文字可以选中复制的 PDF。扫描件的 OCR 支持在后续版本的计划中。' },
      { question: '节点上的页码是怎么来的？', answer: '页码是在文档切块阶段就记录下来的。模型只能引用已经存在的块，因此每个节点都能反查回它的页码，而不是模型编出来的。' },
      { question: '我的 PDF 会被长期保存吗？', answer: '生成流程只在处理你这次请求时读取文件。只有你主动保存脑图，结构化结果才会进入你的个人脑图库。' },
    ],
  },
  'text-to-mind-map': {
    eyebrow: 'AI 内容整理工具',
    title: '长文本转思维导图',
    description: '粘贴文章、笔记或会议纪要，AI 会把主题归纳成层级，把线性文字变成可编辑的知识结构。',
    seoTitle: '文本转思维导图 —— AI 自动生成多层脑图',
    seoDescription:
      '免费试用文本转思维导图工具。粘贴长文本、笔记或会议纪要，AI 自动归类成可编辑、可导出的多层脑图。',
    primaryKeyword: '文本转思维导图',
    relatedKeywords: ['文字生成思维导图', 'AI 思维导图生成器', '笔记转思维导图', '会议纪要思维导图'],
    benefits: [
      { title: '自动提炼主题', description: '先立主干类别再挂细节，不会所有内容都堆在中心节点上。' },
      { title: '三档详细程度', description: '精简、标准、详细三种模式，对应速览到精读的不同需求。' },
      { title: '不是一张死图', description: '生成之后仍然可以改文字、加节点、折叠层级并导出。' },
    ],
    steps: [
      { title: '粘贴文本', description: '放入文章、转写稿、需求文档或任何长文。' },
      { title: '选择目的', description: '按学习、结构分析、会议纪要或通用理解来调整产出方式。' },
      { title: '整理并带走', description: '检查层级，手动微调，然后导出或生成分享链接。' },
    ],
    useCases: ['把读书笔记整理成知识框架', '把会议纪要拆成议题和待办', '梳理产品需求与项目计划', '快速掌握一篇长文的全貌'],
    faq: [
      { question: '一次能粘贴多少文字？', answer: '上限取决于你的套餐和所选的详细程度，具体额度见价格页。较长的内容会消耗更多积分。' },
      { question: '中英混排的文本能处理吗？', answer: '可以。你可以单独指定输出语言，节点语言会被统一成该语言。' },
      { question: '生成之后还能加子节点吗？', answer: '可以。选中节点后按 Tab 添加子节点，按 Enter 添加同级节点。' },
    ],
  },
  'webpage-to-mind-map': {
    eyebrow: 'AI 网页阅读工具',
    title: '网页转思维导图',
    description: '贴上文章链接，我们抓取正文、过滤导航和广告，把主要论点整理成多层脑图。',
    seoTitle: '网页转思维导图 —— AI 抓取正文并生成脑图',
    seoDescription:
      '粘贴网页或文章链接，AI 自动抓取正文并生成结构清晰的思维导图。支持编辑、分享，以及 PNG、SVG、Markdown 导出。',
    primaryKeyword: '网页转思维导图',
    relatedKeywords: ['文章转思维导图', '网页文章总结', '链接转思维导图', '网站内容摘要'],
    benefits: [
      { title: '过滤页面噪音', description: '尽可能排除导航、广告和推荐模块，只留下文章正文。' },
      { title: '保留语义结构', description: '主题来自标题层级、段落和论证脉络，不是按页面顺序机械切分。' },
      { title: '从阅读直接到整理', description: '进去一个链接，出来一张可编辑的脑图 —— 适合调研、收藏和团队分享。' },
    ],
    steps: [
      { title: '粘贴公开链接', description: '输入无需登录即可访问的文章或页面地址。' },
      { title: '抓取并分析', description: '我们识别正文、切块，然后构建主题层级。' },
      { title: '核对并导出', description: '检查要点，编辑后保存或分享。' },
    ],
    useCases: ['整理行业文章与新闻分析', '消化产品文档和知识库', '快速对比多份参考资料', '把收藏的文章变成复习结构'],
    faq: [
      { question: '所有网页都能抓取吗？', answer: '服务器能直接访问的公开页面效果最好。需要登录、有严格反爬保护，或完全依赖客户端渲染的页面可能无法提取。' },
      { question: '页面广告会混进脑图吗？', answer: '正文识别会过滤常见的导航和广告区域，但结构特殊的页面仍可能残留少量噪音。' },
      { question: '新闻站和博客支持吗？', answer: '支持 —— 新闻、博客、百科和公开技术文档都是合适的输入类型。' },
    ],
  },
  'docx-to-mind-map': {
    eyebrow: 'AI 文档结构化工具',
    title: 'Word 文档转思维导图',
    description: '上传 DOCX，我们按顺序提取正文段落和表格文字，整理成可编辑的层级结构。',
    seoTitle: 'Word 转思维导图 —— 把 DOCX 变成可编辑的层级',
    seoDescription:
      '上传 DOCX Word 文档，AI 提取正文并生成结构清晰、可编辑的思维导图。支持长文档分段归纳与多格式导出。',
    primaryKeyword: 'Word 转思维导图',
    relatedKeywords: ['docx 转思维导图', 'Word 文档总结', 'Word 生成思维导图', 'doc 转思维导图'],
    benefits: [
      { title: '读的是文档，不是版式', description: '按文档正文顺序提取段落，包含表格里的文字 —— 保留的是论证本身，不是页眉页脚这些排版附属物。' },
      { title: '长文档不会散架', description: '长文件先分段归纳再合并，60 页的规范不会被压成一串平铺的条目。' },
      { title: '结构可以继续用下去', description: '改节点名、加分支、折叠层级，导出 PNG、SVG 或 Markdown 接着写下一稿。' },
    ],
    steps: [
      { title: '上传 DOCX', description: '文件最大 20MB。不支持旧版 .doc 和带密码保护的文件。' },
      { title: '选择详细程度和用途', description: '决定展开几层，以及你是在学习、分析结构还是速览。' },
      { title: '编辑并导出', description: '在画布上调整层级，然后保存、分享或导出。' },
    ],
    useCases: ['把需求规范变成可评审的结构', '把长报告拆成议题', '论文改稿前先梳理草稿结构', '归纳制度与流程文件'],
    faq: [
      {
        question: 'Word 的节点也带页码吗？',
        answer: '不带。DOCX 存的是段落流而不是固定页面 —— 分页要等 Word 排版之后才存在。我们改为锚定文档顺序。如果你需要页码级溯源，请先导出成 PDF 再用 PDF 工具。',
      },
      { question: '表格里的文字会被读取吗？', answer: '会。表格单元格的文字和普通段落一起读取。特别宽的表格被压平成层级后可能读起来别扭，这类分支建议检查一下。' },
      { question: '页眉页脚、脚注和批注呢？', answer: '不读取。我们只提取文档正文，这样重复出现的版式元素不会混进脑图。需要出现在脑图里的内容，请放在正文中。' },
      { question: '能上传旧的 .doc 文件吗？', answer: '不能。只支持现代的 DOCX 格式。请先用 Word 或兼容编辑器打开并另存为 .docx。' },
    ],
  },
  'epub-to-mind-map': {
    eyebrow: 'AI 电子书结构化工具',
    title: 'EPUB 电子书转思维导图',
    description: '按电子书的阅读顺序提取各章内容，把整本书变成一张结构图。',
    seoTitle: 'EPUB 转思维导图 —— 按章节梳理整本书',
    seoDescription: '上传 EPUB 电子书，AI 按阅读顺序提取正文并生成可编辑的思维导图，节点标注所属章节。',
    primaryKeyword: 'EPUB 转思维导图',
    relatedKeywords: ['书籍转思维导图', '电子书摘要', 'epub 生成思维导图', '书籍章节思维导图'],
    benefits: [
      { title: '遵循这本书的阅读顺序', description: '我们读取 EPUB 的 spine —— 出版方定义的顺序 —— 而不是靠文件名猜，章节因此按你真正阅读的顺序出现。' },
      { title: '节点告诉你出自哪一章', description: '每个内容块保留所属章节标题，脑图里的一个论断可以追回它来自的那一章。' },
      { title: '一本书，一个结构', description: '不是一章一份互不相干的摘要，而是一张统一的层级图，反复出现的主题会归到一起。' },
    ],
    steps: [
      { title: '上传 EPUB', description: '文件最大 20MB。带 DRM 保护的电子书无法打开。' },
      { title: '选择详细程度', description: '精简模式看全书论证脉络，详细模式保留更多支撑材料。' },
      { title: '按章核对并导出', description: '检查关键分支上的章节标注，编辑后导出或分享。' },
    ],
    useCases: ['把教材整理成复习结构', '梳理一本非虚构书的论证', '对比各章如何展开同一主题', '读书会或研讨前准备笔记'],
    faq: [
      { question: '书店买的电子书能打开吗？', answer: '只有无 DRM 的文件可以。主流书店购买的带 DRM 保护的文件是加密的，任何第三方工具都读不了，包括本工具。' },
      {
        question: '节点怎么和书对应起来？',
        answer: '每个提取出的内容块保留它在 EPUB 中所属章节的标题，所以节点是按章节标注的。EPUB 没有固定页码 —— 页码取决于阅读器和字号 —— 章节才是可靠的锚点。',
      },
      { question: '书的长度有限制吗？', answer: '文件需小于 20MB，我们最多读取 spine 中的前 500 个文档，基本覆盖任何正常书籍。特别长的书还可能触及你套餐的字符上限，详见价格页。' },
      { question: '小说适用吗？', answer: '能用，但更适合非虚构。思维导图擅长呈现层级和分类；叙事性小说是时间线推进的，做成脑图往往不如书本身有用。' },
    ],
  },
  'pptx-to-mind-map': {
    eyebrow: 'AI 演示文稿结构化工具',
    title: 'PPT 演示文稿转思维导图',
    description: '逐页提取幻灯片文字，把演示结构和核心论点整理成一张图，每个节点标注所属页。',
    seoTitle: 'PowerPoint 转思维导图 —— 逐页提取并标注页号',
    seoDescription: '上传 PPTX 演示文稿，AI 逐页提取文字并生成可编辑的思维导图，每个节点标注幻灯片序号。',
    primaryKeyword: 'PPT 转思维导图',
    relatedKeywords: ['pptx 转思维导图', '演示文稿总结', '幻灯片转思维导图', 'PowerPoint 生成思维导图'],
    benefits: [
      { title: '每个节点都带幻灯片序号', description: '节点标注"第 1 页""第 2 页"，核实一个论点只需打开那一页，而不是把整份演示翻一遍。' },
      { title: '从幻灯片里还原论证', description: '演示文稿是为了讲而做的，不是为了读。把文字归成层级之后，才看得出这份演示到底在论证什么、哪里在重复。' },
      { title: '快速对比多份演示', description: '把同一主题的两份演示各做一张图，覆盖范围的差异一目了然 —— 这是翻幻灯片做不到的。' },
    ],
    steps: [
      { title: '上传 PPTX', description: '文件最大 20MB。幻灯片按演示顺序读取。' },
      { title: '选择详细程度和用途', description: '精简模式抓主要论点，详细模式保留支撑要点。' },
      { title: '核对页号并导出', description: '对照幻灯片检查关键分支，编辑后导出或分享。' },
    ],
    useCases: ['消化会议演讲的内容', '把培训材料整理成复习结构', '评审提案的论证是否完整', '对比多份同主题演示的覆盖差异'],
    faq: [
      { question: '演讲者备注会被读取吗？', answer: '不会。我们只提取幻灯片上的文字。把要点藏在备注里的演示文稿，生成的脑图会偏薄。' },
      { question: '图片和图表里的文字呢？', answer: '读不到。图片、音频、视频和动画都不会被解析，只有文本框和占位符中的文字会被提取。' },
      { question: '节点上的页号准确吗？', answer: '准确。页号是在切块阶段绑定的，和 PDF 的页码走同一套机制，不是模型生成的。' },
    ],
  },
};
