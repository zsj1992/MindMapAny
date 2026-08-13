import type { InputKind } from '@/lib/extract/types';
import type { Locale } from '@/lib/i18n/locales';

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
  slug: 'text' | 'pdf' | 'docx' | 'epub' | 'pptx' | 'web' | 'youtube';
  nav: string;
  title: string;
  subtitle: string;
  /** 页面 <title> 与 meta description，专用页要能单独被搜到 */
  seoTitle: string;
  seoDescription: string;
  hint?: string;
  examples: SourceExample[];
  /**
   * 工作台里显示的中文版本。只翻界面上看得见的三个字段 ——
   * seoTitle / seoDescription 服务于 /tools 落地页的搜索排名，必须保持英文。
   */
  zh?: { title: string; subtitle: string; hint?: string };
}

/**
 * 按界面语言取显示文案。英文界面（以及所有营销页）走原字段，
 * 缺中文翻译时同样回退英文，绝不显示空标题。
 */
export function localizedSourceCopy(copy: SourceCopy, locale: Locale): SourceCopy {
  if (locale !== 'zh-CN' || !copy.zh) return copy;
  return {
    ...copy,
    title: copy.zh.title,
    subtitle: copy.zh.subtitle,
    ...(copy.zh.hint ? { hint: copy.zh.hint } : {}),
  };
}

export const SOURCE_COPY: Record<SourceCopy['slug'], SourceCopy> = {
  pdf: {
    kind: 'pdf',
    slug: 'pdf',
    nav: 'PDF',
    title: 'PDF to mind map',
    subtitle: 'Pull the structure and key points out of a long PDF, with every node carrying its source page number.',
    seoTitle: 'PDF to Mind Map — upload and generate, with page-level traceability',
    seoDescription: 'Upload a PDF and get a clearly structured mind map in seconds. Every node is labelled with its source page, editable and exportable to PNG / SVG / Markdown.',
    hint: '20MB / 200 pages max. Scanned and encrypted files are not supported yet.',
    zh: {
      title: 'PDF 转思维导图',
      subtitle: '从长篇 PDF 中提炼结构和要点，每个节点都标注来源页码。',
      hint: '最大 20MB / 200 页。暂不支持扫描件和加密文件。',
    },
    examples: [
      { label: 'Attention Is All You Need', value: 'https://arxiv.org/pdf/1706.03762' },
      { label: 'The BERT paper', value: 'https://arxiv.org/pdf/1810.04805' },
    ],
  },
  docx: {
    kind: 'text',
    slug: 'docx',
    nav: 'Word document',
    title: 'Word document to mind map',
    subtitle: 'Upload a DOCX and we extract paragraph and table text into an editable hierarchy.',
    seoTitle: 'Word to Mind Map — automatic DOCX summarisation',
    seoDescription: 'Upload a DOCX Word document and we extract the body text and build a clearly structured, editable mind map.',
    hint: 'DOCX up to 20MB. Legacy .doc and password-protected files are not supported.',
    zh: {
      title: 'Word 文档转思维导图',
      subtitle: '上传 DOCX，自动提取段落和表格文字，生成可编辑的层级结构。',
      hint: 'DOCX 最大 20MB。不支持旧版 .doc 和带密码保护的文件。',
    },
    examples: [],
  },
  epub: {
    kind: 'text',
    slug: 'epub',
    nav: 'Ebook',
    title: 'EPUB ebook to mind map',
    subtitle: 'Chapters are extracted in the ebook reading order, turning a whole book into a structured map.',
    seoTitle: 'EPUB to Mind Map — chapter-by-chapter summarisation',
    seoDescription: 'Upload an EPUB ebook and we extract the text in reading order and build an editable mind map.',
    hint: 'EPUB up to 20MB. DRM-protected ebooks cannot be read.',
    zh: {
      title: 'EPUB 电子书转思维导图',
      subtitle: '按电子书的阅读顺序提取各章内容，把整本书变成一张结构图。',
      hint: 'EPUB 最大 20MB。带 DRM 保护的电子书无法读取。',
    },
    examples: [],
  },
  pptx: {
    kind: 'text',
    slug: 'pptx',
    nav: 'PowerPoint deck',
    title: 'PowerPoint deck to mind map',
    subtitle: 'Text is extracted slide by slide, turning the deck structure and key arguments into a map.',
    seoTitle: 'PowerPoint to Mind Map — slide-by-slide extraction',
    seoDescription: 'Upload a PPTX deck and we extract the text slide by slide and build an editable mind map.',
    hint: 'PPTX up to 20MB. Images, audio, video and animations are not read.',
    zh: {
      title: 'PPT 演示文稿转思维导图',
      subtitle: '逐页提取幻灯片文字，把演示结构和核心论点整理成一张图。',
      hint: 'PPTX 最大 20MB。图片、音频、视频和动画不会被读取。',
    },
    examples: [],
  },
  text: {
    kind: 'text',
    slug: 'text',
    nav: 'Long text',
    title: 'Long text to mind map',
    subtitle: 'Meeting notes, reading notes, any long piece of writing — paste it in and get the skeleton.',
    seoTitle: 'Long Text to Mind Map — paste and get structure',
    seoDescription: 'Paste any long text and get a clearly structured mind map in seconds. 30+ output languages, editable and exportable.',
    zh: {
      title: '长文本转思维导图',
      subtitle: '会议记录、读书笔记，任何长文本 —— 粘贴进来就能得到骨架。',
    },
    examples: [
      {
        label: 'A short passage about AI',
        value: `The three main branches of artificial intelligence are machine learning, natural language processing and computer vision.

Machine learning divides into supervised, unsupervised and reinforcement learning. Supervised learning requires labelled data, with common algorithms including linear regression and decision trees. Unsupervised learning needs no labels; its typical tasks are clustering and dimensionality reduction. Reinforcement learning learns a policy from reward signals and is widely used in games and robotic control.

Natural language processing concerns understanding and generating text, and in recent years has been dominated by large pre-trained models. Computer vision handles images and video, with classification, detection and segmentation as its core tasks.`,
      },
    ],
  },
  youtube: {
    kind: 'youtube',
    slug: 'youtube',
    nav: 'YouTube video',
    title: 'YouTube video to mind map',
    subtitle: 'Paste a video link. We read its captions and every node links back to the second it came from.',
    seoTitle: 'YouTube to Mind Map — turn any video into a map you can check',
    seoDescription: 'Paste a YouTube link and get an editable mind map from the video captions. Every node carries a timestamp that jumps straight back to that moment.',
    hint: 'Videos without captions cannot be mapped — auto-generated captions are fine, but something has to exist to read.',
    zh: {
      title: 'YouTube 视频转思维导图',
      subtitle: '贴上视频链接。我们读取它的字幕，每个节点都能跳回它出自的那一秒。',
      hint: '没有字幕的视频做不了——自动生成的字幕可以，但总得有字幕可读。',
    },
    examples: [
      { label: 'Andrej Karpathy: Intro to LLMs', value: 'https://www.youtube.com/watch?v=zjkBMFhNj_g' },
      { label: '3Blue1Brown: Neural networks', value: 'https://www.youtube.com/watch?v=aircAruvnKk' },
    ],
  },
  web: {
    kind: 'web',
    slug: 'web',
    nav: 'Web article',
    title: 'Web article to mind map',
    subtitle: 'Drop in a link and we pull the body text, strip the ads, and lay out a clear hierarchy.',
    seoTitle: 'Web Page to Mind Map — paste a link, get the article',
    seoDescription: 'Paste a web link and we extract the body text and build a mind map. Nodes keep their section anchors, editable and exportable.',
    hint: 'Pages requiring a login, behind anti-bot protection, or rendered purely in JavaScript are not supported yet.',
    zh: {
      title: '网页文章转思维导图',
      subtitle: '贴上链接，我们抓取正文、剔除广告，整理出清晰的层级。',
      hint: '需要登录、有反爬保护，或完全依赖 JavaScript 渲染的页面暂不支持。',
    },
    examples: [
      { label: 'Wikipedia: Mind map', value: 'https://en.wikipedia.org/wiki/Mind_map' },
      { label: 'Wikipedia: Transformer', value: 'https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)' },
    ],
  },
};

export const SOURCE_SLUGS = Object.keys(SOURCE_COPY) as SourceCopy['slug'][];
