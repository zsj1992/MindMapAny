import type { Locale } from './locales';
import { DEFAULT_LOCALE } from './locales';

/**
 * 工作台文案表。两种语言并排放，缺翻译一眼看得出来 ——
 * 拆成 en.json / zh.json 两个文件的话，漏掉一条要等用户报错才知道。
 *
 * 只收 /app 下面的界面文字。营销页、博客、工具落地页仍然是硬编码英文，
 * 那些页面要进搜索索引，改语言是另一回事（见 locales.ts 的说明）。
 */
const MESSAGES = {
  // ── 侧栏 ──
  'nav.quickStart': { en: 'Quick start', 'zh-CN': '快速开始' },
  'nav.askAnything': { en: 'Ask Anything', 'zh-CN': '直接提问' },
  'nav.deepResearch': { en: 'Deep research', 'zh-CN': '深度研究' },
  'nav.myMaps': { en: 'My mind maps', 'zh-CN': '我的脑图' },
  'nav.new': { en: 'New', 'zh-CN': '新' },
  'nav.uploadFile': { en: 'Upload a file', 'zh-CN': '上传文件' },
  'nav.pdf': { en: 'PDF', 'zh-CN': 'PDF' },
  'nav.docx': { en: 'Word document', 'zh-CN': 'Word 文档' },
  'nav.epub': { en: 'EPUB ebook', 'zh-CN': 'EPUB 电子书' },
  'nav.pptx': { en: 'PowerPoint deck', 'zh-CN': 'PPT 演示文稿' },
  'nav.pasteContent': { en: 'Paste content', 'zh-CN': '粘贴内容' },
  'nav.longText': { en: 'Long text', 'zh-CN': '长文本' },
  'nav.webArticle': { en: 'Web article', 'zh-CN': '网页文章' },
  'nav.open': { en: 'Open navigation', 'zh-CN': '打开导航' },
  'nav.close': { en: 'Close navigation', 'zh-CN': '关闭导航' },

  // ── 顶栏与账号 ──
  'account.creditsRemaining': { en: 'Credits remaining', 'zh-CN': '剩余积分' },
  'account.signInToSeeCredits': { en: 'Sign in to see your credits', 'zh-CN': '登录后查看积分' },
  'account.unlimited': { en: 'Unlimited', 'zh-CN': '无限' },
  'account.unlimitedCredits': { en: 'Unlimited credits', 'zh-CN': '积分无限' },
  'account.credits': { en: '{n} credits', 'zh-CN': '{n} 积分' },
  'account.upgrade': { en: 'Upgrade', 'zh-CN': '升级' },
  'account.openMenu': { en: 'Open account menu', 'zh-CN': '打开账号菜单' },
  'account.signOut': { en: 'Sign out', 'zh-CN': '退出登录' },
  'account.signingOut': { en: 'Signing out…', 'zh-CN': '正在退出…' },
  'account.signIn': { en: 'Sign in', 'zh-CN': '登录' },
  'account.defaultName': { en: 'MindMapAny user', 'zh-CN': 'MindMapAny 用户' },
  'account.billing': { en: 'Plans & billing', 'zh-CN': '套餐与账单' },
  'account.interfaceLanguage': { en: 'Interface language', 'zh-CN': '界面语言' },
  'account.upgradePlan': { en: 'Upgrade plan', 'zh-CN': '升级套餐' },
  'account.nav': { en: 'Account navigation', 'zh-CN': '账号导航' },
  'account.subscription': { en: 'Subscription', 'zh-CN': '订阅' },
  'account.help': { en: 'Help & feedback', 'zh-CN': '帮助与反馈' },
  'account.faq': { en: 'FAQ', 'zh-CN': '常见问题' },
  'plan.free': { en: 'Free', 'zh-CN': '免费版' },
  'plan.basic': { en: 'Basic', 'zh-CN': '基础版' },
  'plan.pro': { en: 'Pro', 'zh-CN': '专业版' },
  'plan.unlimited': { en: 'Unlimited', 'zh-CN': '无限版' },

  // ── 输入面板 ──
  'input.tab.text': { en: 'Paste text', 'zh-CN': '粘贴文本' },
  'input.tab.url': { en: 'Web link', 'zh-CN': '网页链接' },
  'input.tab.file': { en: 'Upload file', 'zh-CN': '上传文件' },
  'input.textPlaceholder': { en: 'Paste an article, your notes, or any long text…', 'zh-CN': '粘贴一篇文章、你的笔记，或任何长文本…' },
  'input.characters': { en: '{n} characters', 'zh-CN': '{n} 字' },
  'input.urlPlaceholder': { en: 'Paste a link to a web article…', 'zh-CN': '粘贴网页文章链接…' },
  'input.urlHint': {
    en: 'Pages requiring a login, behind anti-bot protection, or rendered purely in JavaScript are not supported yet',
    'zh-CN': '需要登录、有反爬保护，或完全依赖 JavaScript 渲染的页面暂不支持',
  },
  'input.dropFile': { en: 'Drop a file here, or click to choose', 'zh-CN': '把文件拖到这里，或点击选择' },
  'input.fileHint': { en: 'PDF, DOCX, EPUB, PPTX, TXT, Markdown · 20MB max', 'zh-CN': 'PDF、DOCX、EPUB、PPTX、TXT、Markdown · 最大 20MB' },
  'input.clickToReplace': { en: 'click to replace', 'zh-CN': '点击更换' },
  'input.tryExample': { en: 'Try an example', 'zh-CN': '试试示例' },
  'input.outputLanguage': { en: 'Output language', 'zh-CN': '输出语言' },
  'input.languageAuto': { en: 'Auto (match source)', 'zh-CN': '自动（跟随原文）' },
  'input.languageAutoDetected': { en: 'Auto · {name}', 'zh-CN': '自动 · {name}' },
  'input.detailLevel': { en: 'Detail level', 'zh-CN': '详细程度' },
  'input.organiseFor': { en: 'Organise for', 'zh-CN': '组织方式' },
  'input.generate': { en: 'Generate mind map', 'zh-CN': '生成脑图' },
  'input.generating': { en: 'Generating…', 'zh-CN': '正在生成…' },
  'input.chargedOnSuccess': { en: ' · charged only if it succeeds', 'zh-CN': ' · 仅在成功时扣费' },
  'input.costUnlimited': { en: 'Unlimited plan — no credits are used', 'zh-CN': '无限套餐 — 不消耗积分' },
  'input.costSignIn': { en: 'Sign in to generate', 'zh-CN': '登录后生成' },
  'input.costExact': { en: 'Estimated cost: {n} credits', 'zh-CN': '预计消耗 {n} 积分' },
  'input.costFrom': { en: 'From {n} credits, depending on length', 'zh-CN': '{n} 积分起，按长度计算' },
  'depth.concise': { en: 'Concise', 'zh-CN': '精简' },
  'depth.standard': { en: 'Standard', 'zh-CN': '标准' },
  'depth.detailed': { en: 'Detailed', 'zh-CN': '详细' },
  'purpose.study': { en: 'Study notes', 'zh-CN': '学习笔记' },
  'purpose.structure': { en: 'Article structure', 'zh-CN': '文章结构' },
  'purpose.meeting': { en: 'Meeting notes', 'zh-CN': '会议纪要' },
  'purpose.general': { en: 'General', 'zh-CN': '通用' },

  // ── 生成过程 ──
  'gen.extracting': { en: 'Extracting content…', 'zh-CN': '正在提取内容…' },
  'gen.chunking': { en: 'Chunking and anchoring to the source…', 'zh-CN': '正在切块并建立原文溯源…' },
  'gen.hierarchy': { en: 'Building the hierarchy…', 'zh-CN': '正在构建层级…' },
  'gen.longContent': { en: 'Long content — summarising section by section…', 'zh-CN': '内容较长 — 正在逐段归纳…' },
  'gen.merging': { en: 'Merging duplicate topics…', 'zh-CN': '正在合并重复主题…' },
  'gen.elapsed': { en: '{n}s elapsed', 'zh-CN': '已用时 {n} 秒' },

  // ── 工具栏 ──
  'toolbar.nodes': { en: '{n} nodes', 'zh-CN': '{n} 个节点' },
  'toolbar.expandAll': { en: 'Expand everything', 'zh-CN': '展开全部' },
  'toolbar.expandToLevel': { en: 'Expand to level {n} only', 'zh-CN': '只展开到第 {n} 层' },
  'toolbar.levelAll': { en: 'All', 'zh-CN': '全部' },
  'toolbar.format': { en: 'Format', 'zh-CN': '样式' },
  'toolbar.exporting': { en: 'Exporting', 'zh-CN': '导出中' },
  'toolbar.share': { en: 'Share', 'zh-CN': '分享' },
  'toolbar.copyLink': { en: 'Copy link', 'zh-CN': '复制链接' },
  'toolbar.copied': { en: 'Copied', 'zh-CN': '已复制' },
  'toolbar.saved': { en: 'Saved', 'zh-CN': '已保存' },
  'toolbar.save': { en: 'Save', 'zh-CN': '保存' },
  'toolbar.saving': { en: 'Saving…', 'zh-CN': '保存中…' },
  'toolbar.new': { en: 'New', 'zh-CN': '新建' },

  // ── 生成后对话改图 ──
  'refine.concise': { en: 'More concise', 'zh-CN': '更精简' },
  'refine.detail': { en: 'Add details', 'zh-CN': '补充细节' },
  'refine.translate': { en: 'Translate to', 'zh-CN': '翻译成' },
  'refine.regenerate': { en: 'Reorganise', 'zh-CN': '重新组织' },
  'refine.placeholder': { en: 'Ask for a change to this mind map…', 'zh-CN': '说说想怎么改这张脑图…' },
  'refine.working': { en: 'Applying…', 'zh-CN': '正在修改…' },
  'refine.cost': { en: 'Each change costs 1 credit', 'zh-CN': '每次修改消耗 1 积分' },
  'refine.undo': { en: 'Undo', 'zh-CN': '撤销' },
  'refine.failed': { en: 'Could not apply that change. Please try again.', 'zh-CN': '这次修改没成功，请重试。' },

  // ── 样式面板 ──
  'format.title': { en: 'Mind map format', 'zh-CN': '脑图样式' },
  'format.layout': { en: 'Layout', 'zh-CN': '布局' },
  'format.layoutHint': { en: 'Change which way branches expand', 'zh-CN': '调整分支的展开方向' },
  'format.layout.balanced': { en: 'Balanced', 'zh-CN': '左右均衡' },
  'format.layout.right': { en: 'Rightward', 'zh-CN': '向右展开' },
  'format.layout.left': { en: 'Leftward', 'zh-CN': '向左展开' },
  'format.colour': { en: 'Colour', 'zh-CN': '配色' },
  'format.colourHint': { en: 'Top-level branches inherit the theme colour', 'zh-CN': '一级分支跟随主题色' },
  'format.theme.indigo': { en: 'Brand', 'zh-CN': '品牌色' },
  'format.theme.ocean': { en: 'Ocean', 'zh-CN': '海洋' },
  'format.theme.coral': { en: 'Warm', 'zh-CN': '暖色' },
  'format.theme.forest': { en: 'Forest', 'zh-CN': '森林' },
  'format.theme.violet': { en: 'Violet', 'zh-CN': '紫罗兰' },
  'format.theme.mono': { en: 'Neutral', 'zh-CN': '中性灰' },
  'format.typography': { en: 'Typography', 'zh-CN': '字体' },
  'format.typographyHint': { en: 'Applies to every node', 'zh-CN': '对所有节点生效' },
  'format.font.sans': { en: 'Modern sans', 'zh-CN': '现代无衬线' },
  'format.font.serif': { en: 'Reading serif', 'zh-CN': '阅读衬线' },
  'format.font.mono': { en: 'Monospace', 'zh-CN': '等宽' },
  'format.presentation': { en: 'Presentation', 'zh-CN': '呈现' },
  'format.presentationHint': { en: 'Improve readability on complex maps', 'zh-CN': '让复杂脑图更易读' },
  'format.panelTitle': { en: 'Map format', 'zh-CN': '脑图样式' },
  'format.panelHint': { en: 'Changes are saved with the map', 'zh-CN': '样式会随脑图一起保存' },
  'format.close': { en: 'Close format panel', 'zh-CN': '关闭样式面板' },
  'format.font': { en: 'Font', 'zh-CN': '字体' },
  'format.size': { en: 'Size', 'zh-CN': '字号' },
  'format.weight': { en: 'Weight', 'zh-CN': '字重' },
  'format.italic': { en: 'Italic', 'zh-CN': '斜体' },
  'format.underline': { en: 'Underline', 'zh-CN': '下划线' },
  'format.strikethrough': { en: 'Strikethrough', 'zh-CN': '删除线' },
  'format.numbering': { en: 'Auto-number branches', 'zh-CN': '分支自动编号' },
  'format.numberingHint': { en: 'Shows 1, 1.1, 1.2 by level', 'zh-CN': '按层级显示 1、1.1、1.2' },
  'format.alignTopics': { en: 'Face topics inward', 'zh-CN': '主题向内对齐' },
  'format.alignTopicsHint': {
    en: 'Right-aligns text on the left side for a clearer reading path',
    'zh-CN': '左侧文字改为右对齐，阅读动线更清晰',
  },

  // ── 脑图列表 ──
  'maps.searchPlaceholder': { en: 'Search titles…', 'zh-CN': '搜索标题…' },
  'maps.noMatch': { en: 'No maps match your search', 'zh-CN': '没有匹配的脑图' },
  'maps.empty': { en: 'No saved maps yet', 'zh-CN': '还没有保存的脑图' },
  'maps.delete': { en: 'Delete', 'zh-CN': '删除' },
  'maps.working': { en: 'Working…', 'zh-CN': '处理中…' },
  'maps.deleted': { en: 'Mind map deleted', 'zh-CN': '脑图已删除' },
  'maps.renameFailed': { en: 'Rename failed. Please try again.', 'zh-CN': '重命名失败，请重试。' },
  'maps.deleteFailed': { en: 'Delete failed. Please try again.', 'zh-CN': '删除失败，请重试。' },
  'maps.savedCount': { en: '{n} saved mind maps', 'zh-CN': '已保存 {n} 张脑图' },
  'maps.searchLabel': { en: 'Search mind maps', 'zh-CN': '搜索脑图' },
  'maps.rename': { en: 'Rename', 'zh-CN': '重命名' },
  'maps.renameLabel': { en: 'Rename {title}', 'zh-CN': '重命名 {title}' },
  'maps.deleteLabel': { en: 'Delete {title}', 'zh-CN': '删除 {title}' },
  'maps.publicLink': { en: 'Public link', 'zh-CN': '公开链接' },
  'maps.confirmDelete': {
    en: 'Permanently delete "{title}"? This cannot be undone.',
    'zh-CN': '确定永久删除「{title}」吗？此操作无法撤销。',
  },
  'maps.kind.text': { en: 'Text', 'zh-CN': '文本' },
  'maps.kind.pdf': { en: 'PDF', 'zh-CN': 'PDF' },
  'maps.kind.web': { en: 'Web', 'zh-CN': '网页' },
  'maps.kind.youtube': { en: 'YouTube', 'zh-CN': 'YouTube' },

  // ── 工作区 ──
  'workspace.step1': { en: 'Add content', 'zh-CN': '添加内容' },
  'workspace.step1Hint': { en: 'Text, a file or a link', 'zh-CN': '文本、文件或链接' },
  'workspace.step2': { en: 'Find the structure', 'zh-CN': '梳理结构' },
  'workspace.step2Hint': { en: 'Topics and hierarchy extracted', 'zh-CN': '自动提取主题与层级' },
  'workspace.step3': { en: 'Edit and export', 'zh-CN': '编辑与导出' },
  'workspace.step3Hint': { en: 'Sources kept, ready to export', 'zh-CN': '保留溯源，随时导出' },
  'workspace.createTitle': { en: 'Create a mind map', 'zh-CN': '创建思维导图' },
  'workspace.createSubtitle': {
    en: 'Paste text, upload a document, or drop in a web link.',
    'zh-CN': '粘贴文本、上传文档，或贴一个网页链接。',
  },
  'maps.emptyCta': { en: 'Create your first map', 'zh-CN': '创建第一张脑图' },
  'workspace.howItWorks': { en: 'How generation works', 'zh-CN': '生成流程' },
  'research.mapRegion': { en: 'Research mind map', 'zh-CN': '研究脑图' },
  'research.reportRegion': { en: 'Research report', 'zh-CN': '研究报告' },
  'workspace.confirmNew': { en: 'This map has not been saved. Start a new one anyway?', 'zh-CN': '当前脑图尚未保存，仍要新建吗？' },
  'workspace.confirmLeave': { en: 'This map has not been saved. Leave anyway?', 'zh-CN': '当前脑图尚未保存，仍要离开吗？' },

  // ── 错误 ──
  // 服务端也会返回一份英文文案。这里按错误码覆盖，是为了让中文界面下的报错也是中文；
  // 遇到没收录的码就退回服务端原文，宁可显示英文也不能把错误吞掉。
  'error.generic': { en: 'Generation failed. Please try again.', 'zh-CN': '生成失败，请重试。' },
  'error.network': { en: 'Network error. Please try again.', 'zh-CN': '网络错误，请重试。' },
  'error.saveSignIn': { en: 'Please sign in before saving', 'zh-CN': '请先登录再保存' },
  'error.saveFailed': { en: 'Could not save', 'zh-CN': '保存失败' },
  'error.saveLimit': {
    en: 'This map was not saved — your library is full at {n} maps. Delete a few in My mind maps to make room.',
    'zh-CN': '这张图没有保存 —— 脑图库已满（{n} 张上限）。到「我的脑图」删掉几张再试。',
  },
  'error.saveFailedNetwork': { en: 'Could not save. Check your connection and try again.', 'zh-CN': '保存失败，请检查网络后重试。' },
  'error.shareFailed': { en: 'Could not create a share link', 'zh-CN': '无法创建分享链接' },
  'error.shareFailedNetwork': { en: 'Sharing failed. Check your connection and try again.', 'zh-CN': '分享失败，请检查网络后重试。' },
  'error.code.login_required': { en: 'Please sign in to generate a mind map', 'zh-CN': '请登录后生成脑图' },
  'error.code.insufficient_credits': { en: 'Not enough credits for this run', 'zh-CN': '积分不足，无法完成本次生成' },
  'error.code.rate_limited': { en: 'Too many requests right now. Please try again shortly.', 'zh-CN': '请求过于频繁，请稍后再试。' },
  'error.code.empty': { en: 'No usable content could be extracted', 'zh-CN': '没有提取到可用的正文内容' },
  'error.code.too_large': { en: 'The file exceeds the 20MB limit', 'zh-CN': '文件超过 20MB 限制' },
  'error.code.unsupported': { en: 'That format is not supported yet', 'zh-CN': '暂不支持这种格式' },
  'error.code.bad_request': { en: 'Please provide text, a link, or a supported file', 'zh-CN': '请提供文本、链接或受支持的文件' },

  // ── Ask Anything ──
  'ask.title': { en: 'Ask Anything', 'zh-CN': '直接提问' },
  'ask.lede': {
    en: 'No document needed. Ask a question and we search the web, then lay the answer out as a mind map you can check against its sources.',
    'zh-CN': '不需要准备任何素材。提一个问题，我们联网检索，再把答案铺成一张可以对着来源核实的脑图。',
  },
  'ask.placeholder': { en: 'Ask a question, or name a topic to map…', 'zh-CN': '提一个问题，或写下想梳理的主题…' },
  'ask.submit': { en: 'Build the map', 'zh-CN': '生成脑图' },
  'ask.cost': { en: 'Costs {n} credits · charged only if it succeeds', 'zh-CN': '消耗 {n} 积分 · 仅在成功时扣费' },
  'ask.searching': { en: 'Searching the web…', 'zh-CN': '正在联网检索…' },
  'ask.mapping': { en: 'Laying out the map…', 'zh-CN': '正在生成脑图…' },
  'ask.stop': { en: 'Stop', 'zh-CN': '停止' },
  'ask.sources': { en: 'Sources', 'zh-CN': '来源' },
  'ask.examples': { en: 'Try one of these', 'zh-CN': '试试这些' },
  'ask.example1': { en: 'Analyse the trade-offs of remote work', 'zh-CN': '分析远程办公的利弊权衡' },
  'ask.example2': { en: 'How does spaced repetition actually work?', 'zh-CN': '间隔重复记忆法到底是怎么起作用的' },
  'ask.example3': { en: 'What drives data centre electricity use?', 'zh-CN': '数据中心的耗电量主要由什么决定' },
  'ask.grounded': {
    en: 'Every answer is built from live web sources, so each branch can be checked.',
    'zh-CN': '每个回答都基于实时检索到的网页来源，每条分支都能核实。',
  },
  'ask.modeGrounded': { en: 'With sources', 'zh-CN': '联网找来源' },
  'ask.modeQuick': { en: 'Quick draft', 'zh-CN': '快速草稿' },
  'ask.modeGroundedHint': { en: 'Searches the web first. Slower, and every branch cites where it came from.', 'zh-CN': '先联网检索。慢一些，但每条分支都标明出处。' },
  'ask.modeQuickHint': { en: 'Straight from the model. Faster and cheaper, with nothing to check it against.', 'zh-CN': '模型直接写。更快更便宜，但没有任何东西可以核对。' },
  'ask.thinking': { en: 'Writing the outline…', 'zh-CN': '正在梳理结构…' },
  'ask.quickWarning': {
    en: 'Written from the model’s own knowledge — no sources, so check anything that matters before you rely on it.',
    'zh-CN': '这张图由模型凭自身知识写成，没有来源。要紧的内容请自行核实后再使用。',
  },
  'ask.addSources': { en: 'Rebuild it with sources', 'zh-CN': '重做一张带来源的' },

  // ── 深度研究 ──
  'research.reportLanguage': { en: 'Report language', 'zh-CN': '报告语言' },
  'research.languageAuto': { en: 'Auto (match question)', 'zh-CN': '自动（跟随提问）' },
  'research.title': { en: 'Deep research', 'zh-CN': '深度研究' },
  'research.tagline': {
    en: 'Research plan · multi-source retrieval · report and map',
    'zh-CN': '研究计划 · 多来源检索 · 报告与脑图',
  },
  'research.intro': {
    en: 'We break your question into research tasks, retrieve evidence, then produce a verifiable report and a multi-level mind map.',
    'zh-CN': '我们把你的问题拆成若干研究任务，检索证据，再产出一份可核查的报告和一张多层脑图。',
  },
  'research.queryPlaceholder': {
    en: 'Enter the question or topic you want researched in depth…',
    'zh-CN': '输入你想深入研究的问题或主题…',
  },
  'research.depth': { en: 'Research depth', 'zh-CN': '研究深度' },
  'research.depthStandard': { en: 'Standard · 4 research tasks', 'zh-CN': '标准 · 4 个研究任务' },
  'research.depthDetailed': { en: 'Detailed · 5 research tasks', 'zh-CN': '详细 · 5 个研究任务' },
  'research.start': { en: 'Start research', 'zh-CN': '开始研究' },
  'research.cost': {
    en: 'Each research run costs 10 credits, charged only on success',
    'zh-CN': '每次深度研究消耗 10 积分，仅在成功时扣费',
  },
  'research.examples': { en: 'Example questions', 'zh-CN': '示例问题' },
  'research.viewMap': { en: 'Mind map', 'zh-CN': '脑图' },
  'research.viewReport': { en: 'Report', 'zh-CN': '报告' },
  'research.inProgress': { en: 'Deep Research in progress', 'zh-CN': '深度研究进行中' },
  'research.stage.planning': { en: 'Planning', 'zh-CN': '规划' },
  'research.stage.researching': { en: 'Retrieving evidence', 'zh-CN': '检索证据' },
  'research.stage.mapping': { en: 'Building the map', 'zh-CN': '生成脑图' },
  'research.preparing': { en: 'Preparing the research plan', 'zh-CN': '正在准备研究计划' },
  'research.breakingDown': {
    en: 'Breaking your question into verifiable research tasks',
    'zh-CN': '正在把问题拆解成可核查的研究任务',
  },
  'research.failed': { en: 'Deep research failed. Please try again.', 'zh-CN': '深度研究失败，请重试。' },
  'research.sources': { en: 'Web sources', 'zh-CN': '网络来源' },
  'research.sourcesSelected': { en: ' · {n} sources selected', 'zh-CN': ' · 已选取 {n} 个来源' },
  'research.tasks': { en: 'Research tasks', 'zh-CN': '研究任务' },
  'research.taskCount': { en: '{n} tasks', 'zh-CN': '{n} 个任务' },
  'research.planning': { en: 'Planning…', 'zh-CN': '规划中…' },
  'research.placeholderTask1': { en: 'Analyse the scope and key concepts', 'zh-CN': '梳理范围与核心概念' },
  'research.placeholderTask2': { en: 'Identify the data and cases to verify', 'zh-CN': '确定需要核实的数据与案例' },
  'research.placeholderTask3': { en: 'Surface risks, limits and disagreements', 'zh-CN': '呈现风险、局限与分歧' },
} as const satisfies Record<string, LocalisedText>;

/**
 * 每条文案至少要有英文，其余语言可以缺。
 *
 * 营销页支持 5 种语言，工作台目前只译了中英 —— 强行要求每条都齐全，
 * 只会逼出一堆把英文原文抄进 ja/ko/es 的假翻译，那比明确的回退更难发现问题。
 */
type LocalisedText = Partial<Record<Locale, string>> & { en: string };

export type MessageKey = keyof typeof MESSAGES;

/**
 * 取文案并填入变量。占位符写成 {name}。
 * 缺 key 时返回 key 本身：界面上会显得很扎眼，比静默显示空字符串好排查。
 */
export function translate(locale: Locale, key: MessageKey, vars?: Record<string, string | number>): string {
  const entry = MESSAGES[key] as LocalisedText | undefined;
  const template = entry?.[locale] ?? entry?.[DEFAULT_LOCALE] ?? key;
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in vars ? String(vars[name]) : whole,
  );
}
