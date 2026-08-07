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
  slug: 'text' | 'pdf' | 'web' | 'youtube';
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
  youtube: {
    kind: 'youtube',
    slug: 'youtube',
    nav: 'YouTube',
    title: 'YouTube 视频转思维导图',
    subtitle: '把一小时的视频压成一屏结构，点节点直接跳到对应时间点。',
    seoTitle: 'YouTube 视频转思维导图 — 带时间戳的视频总结',
    seoDescription: '粘贴 YouTube 链接，自动读取字幕生成思维导图。每个节点带时间戳，可跳回视频对应位置。',
    hint: '仅支持已有字幕的公开视频，暂不支持语音转录',
    examples: [
      { label: 'MIT 线性代数公开课', value: 'https://www.youtube.com/watch?v=ZK3O402wf1c' },
      { label: 'TED：拖延症心理学', value: 'https://www.youtube.com/watch?v=arj7oStGLkU' },
    ],
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
