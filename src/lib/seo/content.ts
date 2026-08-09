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
    eyebrow: 'AI document structuring tool',
    title: 'PDF to mind map',
    description:
      'Upload a PDF and get an editable, multi-level mind map. Sections, themes and key arguments are identified automatically, and every conclusion keeps the page number it came from.',
    seoTitle: 'PDF to Mind Map — AI that extracts structure and key points',
    seoDescription:
      'Try our free AI PDF to mind map tool. Upload a paper, report or ebook and get a multi-level map whose nodes keep their source page numbers, with PNG, SVG and Markdown export.',
    primaryKeyword: 'PDF to mind map',
    relatedKeywords: ['PDF mind map generator', 'AI PDF summary', 'research paper to mind map', 'PDF content visualisation'],
    benefits: [
      { title: 'Structure first, nodes second', description: 'Rather than copying paragraph by paragraph, we identify the topic categories first and then file each fact under the right branch.' },
      { title: 'Every point traces back', description: 'Nodes keep their PDF page number, so verifying a conclusion does not mean paging through the whole document again.' },
      { title: 'Keep editing after generation', description: 'Add or remove nodes, collapse levels, and export to PNG, SVG or Markdown.' },
    ],
    steps: [
      { title: 'Upload your PDF', description: 'Choose a text-based PDF. Current limits are 20MB and 200 pages.' },
      { title: 'Pick depth and purpose', description: 'Control how many levels the map has, based on whether you are skimming, studying or analysing structure.' },
      { title: 'Check sources and export', description: 'Review the page citations, adjust nodes, then save or export the result.' },
    ],
    useCases: ['Skim research papers quickly', 'Work through industry reports and white papers', 'Turn textbook chapters into a revision framework', 'Extract the topic structure of contracts and rulebooks'],
    faq: [
      { question: 'Can scanned PDFs be turned into mind maps?', answer: 'The current version supports PDFs whose text can be selected and copied. OCR for scanned documents is planned for a future release.' },
      { question: 'Why do the nodes carry page numbers?', answer: 'Page numbers are recorded while the document is being chunked. The model only references chunks that already exist, so each node can be resolved back to its page.' },
      { question: 'Is my PDF stored permanently?', answer: 'The generation pipeline reads the file only to process your request. The structured result enters your personal map library only when you choose to save the map.' },
    ],
  },
  {
    slug: 'text-to-mind-map',
    appPath: '/app/text',
    eyebrow: 'AI content organising tool',
    title: 'Text to mind map',
    description:
      'Paste an article, your notes or meeting minutes, and the AI groups themes into levels, turning linear text into an editable knowledge structure.',
    seoTitle: 'Text to Mind Map — AI that builds multi-level maps automatically',
    seoDescription:
      'Try our free text to mind map tool. Paste long text, notes or meeting minutes and the AI categorises them into an editable, exportable multi-level map.',
    primaryKeyword: 'text to mind map',
    relatedKeywords: ['text mind map generator', 'AI mind map generator', 'notes to mind map', 'meeting minutes mind map'],
    benefits: [
      { title: 'Themes extracted automatically', description: 'Main categories are established first and details filed underneath, so everything does not pile up on the central node.' },
      { title: 'Three levels of detail', description: 'Choose concise, standard or detailed mode to match skimming or deep study.' },
      { title: 'Not a static picture', description: 'After generation you can still edit text, add nodes, collapse levels and export.' },
    ],
    steps: [
      { title: 'Paste your text', description: 'Drop in an article, transcript, specification or any long-form text.' },
      { title: 'Choose your goal', description: 'Tune the output for studying, structural analysis, meetings or general understanding.' },
      { title: 'Tidy up and take it with you', description: 'Check the hierarchy, edit by hand, then export or generate a share link.' },
    ],
    useCases: ['Turn reading notes into a knowledge framework', 'Split meeting minutes into topics and action items', 'Organise product requirements and project plans', 'Get an overview of a long article fast'],
    faq: [
      { question: 'How much text can I paste at once?', answer: 'Anonymous trials suit shorter pieces. Once you sign in, the limit depends on your plan and the generation depth you choose.' },
      { question: 'Does it handle text that mixes languages?', answer: 'Yes. You can specify the output language separately and the node language will be made consistent.' },
      { question: 'Can I add child nodes afterwards?', answer: 'Yes. Select a node and press Tab for a child node, or Enter for a sibling.' },
    ],
  },
  {
    slug: 'webpage-to-mind-map',
    appPath: '/app/web',
    eyebrow: 'AI web reading tool',
    title: 'Web page to mind map',
    description:
      'Paste an article link. We extract the body text, filter out navigation and ads, and organise the main arguments into a multi-level map.',
    seoTitle: 'Web Page to Mind Map — AI extracts the article and maps it',
    seoDescription:
      'Paste a web page or article link and the AI extracts the body text and builds a clearly structured mind map. Supports editing, sharing and PNG, SVG and Markdown export.',
    primaryKeyword: 'web page to mind map',
    relatedKeywords: ['article to mind map', 'web article summary', 'URL to mind map', 'website content summary'],
    benefits: [
      { title: 'Page noise filtered out', description: 'Navigation, ads and recommendation modules are excluded as far as possible, leaving the main article content.' },
      { title: 'Semantic structure preserved', description: 'Topics are derived from headings, paragraphs and argument flow, not chopped up mechanically in page order.' },
      { title: 'Straight from reading to organising', description: 'A link in gives you an editable map out — useful for research, bookmarking and sharing with a team.' },
    ],
    steps: [
      { title: 'Paste a public link', description: 'Enter the URL of an article or page that can be reached without signing in.' },
      { title: 'Extract and analyse', description: 'We identify the main content, chunk it, then build the topic hierarchy.' },
      { title: 'Verify and export', description: 'Check the key points, edit, then save or share.' },
    ],
    useCases: ['Organise industry articles and news analysis', 'Digest product docs and knowledge bases', 'Compare several references quickly', 'Turn bookmarked articles into a revision structure'],
    faq: [
      { question: 'Can every web page be extracted?', answer: 'Public pages reachable from a server work best. Login walls, strict anti-bot protection and purely client-rendered pages may not be extractable.' },
      { question: 'Will page ads end up in the map?', answer: 'Body-text detection filters common navigation and ad regions, though unusually structured pages may still leave a little noise.' },
      { question: 'Do news sites and blogs work?', answer: 'Yes — news, blogs, encyclopedias and public documentation are all good input types.' },
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
  category: 'Guide' | 'How-to' | 'Comparison';
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
    title: 'The complete guide to AI mind maps: from extraction to usable structure',
    description:
      'How AI mind maps turn long text, PDFs, Word files, ebooks and web pages into hierarchies — and practical criteria for judging whether the result is any good.',
    category: 'Guide',
    publishedAt: '2026-08-08',
    updatedAt: '2026-08-08',
    readingMinutes: 8,
    author: 'The MindMapAny team',
    primaryKeyword: 'AI mind map',
    relatedTool: '/tools/text-to-mind-map',
    sections: [
      {
        id: 'what-is-ai-mind-map',
        title: 'What an AI mind map actually is',
        paragraphs: [
          'An AI mind map is not a block of text repackaged into coloured boxes. It identifies the topics, subordinate relationships and key facts in your content first, then turns those relationships into a tree you can browse and edit. A good result shows you the whole picture before you descend into detail.',
          'Traditional automatic summarisation mostly compresses length. A mind map emphasises the relationships between pieces of information. For papers, reports, ebooks and rulebooks, structure is often worth more than a shorter block of prose.',
        ],
      },
      {
        id: 'quality-criteria',
        title: 'How to tell whether a generated map is reliable',
        paragraphs: ['More levels is not better. What matters is that nodes on the same level sit at a similar level of abstraction, and that every concrete conclusion can be traced back to its source.'],
        bullets: [
          'The root usually holds 4–8 main topics',
          'Specific dates, amounts and clauses should not hang directly off the root',
          'Sibling topics should overlap as little as possible while covering the whole text',
          'A leaf node should express one complete point',
          'Important facts should keep their page number, timestamp or source location',
        ],
      },
      {
        id: 'input-types',
        title: 'Different inputs need different handling',
        paragraphs: [
          'PDFs need page numbers preserved and sections detected. EPUBs need to follow the spine reading order. PPTX needs slide-level positioning. Web pages need navigation and ads filtered out. A shared canvas does not mean a shared extraction pipeline behind it.',
          'So when choosing a tool, do not judge only by whether the final picture looks nice. Check whether it really understood the source, whether you can edit the result, and whether you can get back to the original to verify.',
        ],
      },
      {
        id: 'workflow',
        title: 'A workflow we recommend',
        paragraphs: ['Treat the AI output as a first draft of the structure, not an answer set in stone. Check the top-level topics first, then verify the key leaf nodes, then adjust depth for the job at hand.'],
        bullets: [
          'Start at standard depth to get the overview',
          'Collapse to L2 and check whether the categorisation makes sense',
          'Expand the key branches and verify against the source',
          'Delete duplicate nodes and add your own judgement',
          'Export Markdown into your writing or project workflow',
        ],
      },
      {
        id: 'limitations',
        title: 'Where AI mind maps stop',
        paragraphs: [
          'A model can miss exception clauses, wrongly merge similar concepts, or place different levels of abstraction side by side. For high-stakes legal, medical or financial material, a map is for navigation only — it does not replace the source document or professional judgement.',
          'Traceable sources, editable nodes and clear control over hierarchy are the three basic capabilities that keep those risks down.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-convert-pdf-to-mind-map',
    title: 'How to turn a PDF into a mind map: from upload to verification',
    description: 'Step by step: convert papers, reports and ebooks into an editable map, then check the AI output using page citations.',
    category: 'How-to',
    publishedAt: '2026-08-08',
    updatedAt: '2026-08-08',
    readingMinutes: 6,
    author: 'The MindMapAny team',
    primaryKeyword: 'PDF to mind map',
    relatedTool: '/tools/pdf-to-mind-map',
    sections: [
      {
        id: 'prepare-pdf',
        title: 'Step 1: check the PDF can be parsed',
        paragraphs: ['PDFs whose text can be selected and copied work best. Scans, encrypted files and complex two-column layouts can degrade text extraction, so run OCR first or check that the exported text is complete.'],
      },
      {
        id: 'choose-depth',
        title: 'Step 2: pick a depth that matches the task',
        paragraphs: ['Use concise mode to judge quickly what a report contains, standard mode to study papers and policy documents, and detailed mode when you need to keep more of the specifics. More depth does not automatically mean better categorisation — still check the top-level topics.'],
      },
      {
        id: 'check-structure',
        title: 'Step 3: check topics before details',
        paragraphs: ['Once generation finishes, collapse to L2. If dates, amounts and individual sentences still hang directly off the central node, the structure is too flat. A sensible map shows categories such as background, method and results first.'],
        bullets: [
          'Are the top-level topics at the same level of abstraction?',
          'Does each topic contain at least one meaningful sub-branch?',
          'Are there duplicate or near-synonymous topics?',
          'Has any important section been left out?',
        ],
      },
      {
        id: 'verify-source',
        title: 'Step 4: verify key conclusions via page numbers',
        paragraphs: ['For figures, constraints, conclusions and exception clauses, click through the page number to the original. The AI shortens the time it takes to locate something; it does not remove the verification step. Anything you plan to cite should be checked against the PDF itself.'],
      },
      {
        id: 'reuse-output',
        title: 'Step 5: put the structure to work',
        paragraphs: ['Image export suits presentations and sharing, SVG suits further layout work, and Markdown suits writing, revision cards and knowledge bases. A good PDF map should be the entry point to your next piece of work, not a picture you look at once.'],
      },
    ],
  },
  {
    slug: 'mind-map-vs-summary',
    title: 'Mind map or text summary? How to choose the right format',
    description: 'How mind maps and linear summaries differ for skimming, studying, research and reporting — and how to pick the right output.',
    category: 'Comparison',
    publishedAt: '2026-08-08',
    updatedAt: '2026-08-08',
    readingMinutes: 5,
    author: 'The MindMapAny team',
    primaryKeyword: 'mind map vs summary',
    relatedTool: '/tools/text-to-mind-map',
    sections: [
      {
        id: 'core-difference',
        title: 'The core difference: compressing text vs showing relationships',
        paragraphs: ['A text summary compresses long content into shorter linear prose, which suits continuous reading. A mind map places topics and their subordinate relationships into a spatial structure, which suits fast lookup, comparing branches and building an overall picture.'],
      },
      {
        id: 'when-summary',
        title: 'When a text summary is the better choice',
        paragraphs: ['When the content itself advances chronologically or as an argument, when tone needs to be preserved, or when the reader will end up reading continuously anyway, prose usually feels more natural. News briefings, emails and executive summaries all fall into this category.'],
      },
      {
        id: 'when-mind-map',
        title: 'When a mind map is the better choice',
        paragraphs: ['When the material contains several parallel topics, classification rules or conceptual hierarchies, or when you will revisit it repeatedly, a map exposes the structure more readily. Literature reviews, course chapters, policy rules and project plans are especially good fits.'],
      },
      {
        id: 'combine',
        title: 'Combining both works better',
        paragraphs: ['Build the overall framework as a map first, then generate prose for the key branches. That usually beats committing to one format. The map handles navigation, the summary handles narrative, and the source handles evidence.'],
        bullets: [
          'First pass: use the map to see the structure',
          'Going deeper: read the source behind the key branches',
          'Sharing: pick an image or a summary based on your audience',
          'Long term: keep the collapsible hierarchy and its sources',
        ],
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
