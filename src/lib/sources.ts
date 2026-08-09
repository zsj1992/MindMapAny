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
    title: 'PDF to mind map',
    subtitle: 'Pull the structure and key points out of a long PDF, with every node carrying its source page number.',
    seoTitle: 'PDF to Mind Map — upload and generate, with page-level traceability',
    seoDescription: 'Upload a PDF and get a clearly structured mind map in seconds. Every node is labelled with its source page, editable and exportable to PNG / SVG / Markdown.',
    hint: '20MB / 200 pages max. Scanned and encrypted files are not supported yet.',
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
    examples: [
      {
        label: 'A short passage about AI',
        value: `The three main branches of artificial intelligence are machine learning, natural language processing and computer vision.

Machine learning divides into supervised, unsupervised and reinforcement learning. Supervised learning requires labelled data, with common algorithms including linear regression and decision trees. Unsupervised learning needs no labels; its typical tasks are clustering and dimensionality reduction. Reinforcement learning learns a policy from reward signals and is widely used in games and robotic control.

Natural language processing concerns understanding and generating text, and in recent years has been dominated by large pre-trained models. Computer vision handles images and video, with classification, detection and segmentation as its core tasks.`,
      },
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
    examples: [
      { label: 'Wikipedia: Mind map', value: 'https://en.wikipedia.org/wiki/Mind_map' },
      { label: 'Wikipedia: Transformer', value: 'https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)' },
    ],
  },
};

export const SOURCE_SLUGS = Object.keys(SOURCE_COPY) as SourceCopy['slug'][];
