import type { InputKind } from '@/lib/extract/types';

/**
 * 每种来源一份文案与示例。工作台侧栏、专用页面、落地页共用这一份，
 * 改文案只改这里，不用满项目找字符串。
 */

export interface SourceExample {
  label: string;
  /** 文本类给正文，其余给 URL */
  value: string;
}

export interface SourceCopy {
  kind: InputKind;
  slug: 'text' | 'pdf' | 'docx' | 'epub' | 'pptx' | 'web';
  nav: string;
  title: string;
  subtitle: string;
  /** 页面 <title> 与 meta description，专用页要能单独被搜到 */
  seoTitle: string;
  seoDescription: string;
  hint?: string;
  examples: SourceExample[];
}

export const SOURCE_COPY: Record<SourceCopy['slug'], SourceCopy> = {
  pdf: {
    kind: 'pdf',
    slug: 'pdf',
    nav: 'PDF',
    title: 'PDF 转思维导图',
    subtitle: '从长篇 PDF 中提炼结构与要点，每个节点都标着原文页码。',
    seoTitle: 'PDF 转思维导图 — 上传即生成，节点可回溯页码',
    seoDescription: '上传 PDF，几秒生成层级清晰的思维导图。每个节点标注原文页码，可编辑并导出 PNG / SVG / Markdown。',
    hint: '最大 20MB / 200 页，暂不支持扫描件与加密文件',
    examples: [
      { label: 'Attention Is All You Need', value: 'https://arxiv.org/pdf/1706.03762' },
      { label: 'BERT 论文', value: 'https://arxiv.org/pdf/1810.04805' },
    ],
  },
  docx: {
    kind: 'text',
    slug: 'docx',
    nav: 'Word 文档',
    title: 'Word 文档转思维导图',
    subtitle: '上传 DOCX，提取段落与表格文字，整理成可编辑的层级结构。',
    seoTitle: 'Word 文档转思维导图 — DOCX 自动总结',
    seoDescription: '上传 DOCX Word 文档，自动提取正文并生成层级清晰、可编辑的思维导图。',
    hint: '支持 DOCX，最大 20MB；暂不支持旧版 .doc 与密码保护文件',
    examples: [],
  },
  epub: {
    kind: 'text',
    slug: 'epub',
    nav: '电子书',
    title: 'EPUB 电子书转思维导图',
    subtitle: '按电子书阅读顺序提取章节，把整本书整理成结构化脑图。',
    seoTitle: 'EPUB 电子书转思维导图 — 按章节自动总结',
    seoDescription: '上传 EPUB 电子书，按章节阅读顺序提取正文并生成可编辑思维导图。',
    hint: '支持 EPUB，最大 20MB；不读取 DRM 保护电子书',
    examples: [],
  },
  pptx: {
    kind: 'text',
    slug: 'pptx',
    nav: 'PPT 演示文稿',
    title: 'PPT 演示文稿转思维导图',
    subtitle: '逐页提取 PPTX 文字，把演示结构和关键论点整理成脑图。',
    seoTitle: 'PPT 转思维导图 — PPTX 逐页提取与总结',
    seoDescription: '上传 PPTX 演示文稿，逐页提取文字并生成可编辑思维导图。',
    hint: '支持 PPTX，最大 20MB；图片、音视频与动画不会被读取',
    examples: [],
  },
  text: {
    kind: 'text',
    slug: 'text',
    nav: '长文本',
    title: '长文本转思维导图',
    subtitle: '会议纪要、读书笔记、任意长文，粘进来就能理出骨架。',
    seoTitle: '长文本转思维导图 — 粘贴即生成结构',
    seoDescription: '粘贴任意长文本，几秒生成层级清晰的思维导图。支持 30+ 语言输出，可编辑并导出。',
    examples: [
      {
        label: '一段 AI 概念文本',
        value: `人工智能的三个主要分支是机器学习、自然语言处理和计算机视觉。

机器学习又分为监督学习、无监督学习和强化学习。监督学习需要标注数据，常见算法包括线性回归和决策树。无监督学习不需要标签，典型任务是聚类和降维。强化学习通过奖励信号学习策略，广泛用于游戏和机器人控制。

自然语言处理关注文本的理解与生成，近年来由大规模预训练模型主导。计算机视觉处理图像与视频，核心任务包括分类、检测和分割。`,
      },
    ],
  },
  web: {
    kind: 'web',
    slug: 'web',
    nav: '网页文章',
    title: '网页文章转思维导图',
    subtitle: '丢一个链接进来，自动抽正文、去广告，理成清晰的层级。',
    seoTitle: '网页转思维导图 — 输入链接自动提取正文',
    seoDescription: '粘贴网页链接，自动提取正文并生成思维导图。节点保留原文章节锚点，可编辑并导出。',
    hint: '暂不支持需要登录、有反爬保护或纯 JS 渲染的页面',
    examples: [
      { label: '维基百科：心智图', value: 'https://zh.wikipedia.org/wiki/心智图' },
      { label: 'Wikipedia: Transformer', value: 'https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)' },
    ],
  },
};

export const SOURCE_SLUGS = Object.keys(SOURCE_COPY) as SourceCopy['slug'][];
