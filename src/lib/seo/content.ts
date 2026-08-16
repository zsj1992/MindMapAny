import type { Locale } from '@/lib/i18n/locales';
import { TOOL_COPY } from './tools/registry';
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

export const ALL_TOOL_PAGES: ToolPage[] = [
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
      { question: 'Is my PDF stored permanently?', answer: 'The uploaded PDF is read to process the request and is not kept as a file. The generated structured map is automatically saved to your personal map library so you can edit it later.' },
      { question: 'What are the PDF size and page limits?', answer: 'Uploads can be up to 20MB, and the parser processes up to 200 pages from a text-based PDF.' },
      { question: 'Can I edit and export the generated map?', answer: 'Yes. Rename or add nodes, collapse branches, and export the finished map as PNG, SVG or Markdown.' },
    ],
  },
  {
    slug: 'text-to-mind-map',
    appPath: '/app/text',
    eyebrow: 'AI content organising tool',
    title: 'Text to mind map',
    description:
      'Paste an article, your notes or meeting minutes, and the AI groups themes into levels, turning linear text into an editable knowledge structure.',
    seoTitle: 'Text to Mind Map: Free AI Generator',
    seoDescription:
      'Paste notes, articles or meeting minutes into our free text to mind map generator. Create an editable multi-level map you can refine, share and export.',
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
      { question: 'How much text can I paste at once?', answer: 'The limit depends on your plan and the generation depth you choose — see the pricing page for the exact character allowance. Longer content costs more credits.' },
      { question: 'Does it handle text that mixes languages?', answer: 'Yes. You can specify the output language separately and the node language will be made consistent.' },
      { question: 'Can I add child nodes afterwards?', answer: 'Yes. Select a node and press Tab for a child node, or Enter for a sibling.' },
      { question: 'Can I turn a single paragraph into a mind map?', answer: 'Yes. A focused paragraph can become a small map, although inputs with several distinct ideas usually produce a more useful hierarchy. The input needs at least 21 characters.' },
      { question: 'Is this different from a normal AI summary?', answer: 'Yes. A summary returns another linear passage. This tool returns parent topics, child ideas and supporting details that you can collapse, rearrange and edit on a canvas.' },
      { question: 'What can I do with the map after it is generated?', answer: 'You can rename nodes, add or remove branches, change the visual format, save or share the map, and export it as PNG, SVG or Markdown.' },
      { question: 'Is the text I paste sent to analytics?', answer: 'No. Analytics records workflow events such as starting or completing a generation and broad character-count bands, but it does not include the pasted text or generated node content.' },
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
  {
    slug: 'youtube-to-mind-map',
    appPath: '/app/youtube',
    eyebrow: 'AI video summarising tool',
    title: 'YouTube video to mind map',
    description:
      'Paste a video link. We read its captions and lay out the argument as a map where every node carries the timestamp it came from — click one and the video opens at that second.',
    seoTitle: 'YouTube to Mind Map — Free AI Video Summarizer',
    seoDescription:
      'Turn any YouTube video into a mind map. Every node carries a timestamp that jumps back to that second, so you can check it against the video.',
    primaryKeyword: 'youtube to mind map',
    relatedKeywords: ['youtube video summary', 'summarize youtube video', 'video to mind map', 'youtube transcript summary'],
    benefits: [
      { title: 'A YouTube to mind map tool that shows its working', description: 'Timestamps are not decoration — click one and the video opens at that moment, so you can check what was actually said.' },
      { title: 'An hour of talk, laid out flat', description: 'Long lectures and conference talks become a structure you can scan, instead of a progress bar you have to scrub through.' },
      { title: 'Find the part you actually need', description: 'Read the map first, then watch only the sections that matter to you.' },
    ],
    steps: [
      { title: 'Paste the video link', description: 'A normal watch link, a youtu.be short link or a Shorts URL all work.' },
      { title: 'Captions are read and grouped', description: 'Captions are merged into short passages so the meaning stays intact, each keeping its start time.' },
      { title: 'Check by clicking a timestamp', description: 'Any node you doubt takes one click to verify against the video itself.' },
    ],
    useCases: ['Take notes from lectures and course videos', 'Digest conference talks and interviews', 'Pull the argument out of a long review or explainer', 'Decide whether an hour-long video is worth watching'],
    faq: [
      { question: 'Do videos without captions work?', answer: 'No. We read captions rather than listening to audio, so a video with no captions at all cannot be mapped. Auto-generated captions are fine.' },
      { question: 'How accurate are the timestamps?', answer: 'Captions are grouped into roughly 30-second passages and the timestamp points at the start of the passage, so you land just before the point is made rather than in the middle of it.' },
      { question: 'Can it handle videos in other languages?', answer: 'Yes, wherever captions exist. If the captions are not in the language you asked for, the map is translated and the map notes say so.' },
      { question: 'What about very long videos?', answer: 'Long videos work but cost more credits, and the character limits of your plan apply the same way they do to documents.' },
      { question: 'Do Shorts and youtu.be links work?', answer: 'Yes. Normal watch links, youtu.be short links and Shorts URLs are all accepted, as long as the video has captions.' },
      { question: 'Why did my video fail?', answer: 'Almost always because it has no captions at all. We read captions rather than listening to the audio, so a video with none cannot be mapped — the error says so explicitly rather than returning a map built on nothing.' },
      { question: 'Can I edit the map afterwards?', answer: 'Yes. Rename and restructure nodes directly, or describe the change in plain language, and the timestamps survive the rewrite. Export to PNG, SVG or Markdown, or share a link.' },
    ],
  },
  {
    slug: 'docx-to-mind-map',
    appPath: '/app/docx',
    eyebrow: 'AI document structuring tool',
    title: 'Word document to mind map',
    description:
      'Upload a DOCX and we read the body text paragraph by paragraph — including text inside tables — and organise it into an editable hierarchy.',
    seoTitle: 'Word to Mind Map — turn a DOCX into an editable hierarchy',
    seoDescription:
      'Upload a Word DOCX file and get a clearly structured, editable mind map. Body paragraphs and table text are extracted, with export to PNG, SVG and Markdown.',
    primaryKeyword: 'word to mind map',
    relatedKeywords: ['docx to mind map', 'word document summary', 'convert word to mind map', 'doc to mind map'],
    benefits: [
      { title: 'Reads the document, not the layout', description: 'Paragraphs are taken from the document body in order, including text inside tables, so a report keeps its argument rather than its page furniture.' },
      { title: 'Long documents stay coherent', description: 'Long files are summarised section by section and then merged, so a 60-page specification does not collapse into one flat list.' },
      { title: 'Structure you can keep working in', description: 'Rename nodes, add branches, collapse levels, and export to PNG, SVG or Markdown for your next draft.' },
    ],
    steps: [
      { title: 'Upload your DOCX', description: 'Files up to 20MB. Legacy .doc and password-protected files are not supported.' },
      { title: 'Pick depth and purpose', description: 'Choose how many levels you want and whether you are studying, analysing structure or skimming.' },
      { title: 'Edit and export', description: 'Adjust the hierarchy on the canvas, then save, share or export it.' },
    ],
    useCases: ['Turn a specification into a reviewable structure', 'Break a long report into topics', 'Organise a thesis draft before revising', 'Summarise policy and process documents'],
    faq: [
      {
        question: 'Do Word nodes carry page numbers like PDF nodes do?',
        answer: 'No. A DOCX stores a flow of paragraphs, not fixed pages — page breaks only exist once Word renders the file. We anchor to the document order instead. If you need page-level citations, export to PDF first and use the PDF tool.',
      },
      {
        question: 'Is text inside tables included?',
        answer: 'Yes. Table cell text is read along with normal paragraphs. Very wide tables can read oddly once flattened into a hierarchy, so check those branches.',
      },
      {
        question: 'What about headers, footers, footnotes and comments?',
        answer: 'They are not read. We extract the main document body only, which keeps recurring page furniture out of the map. Anything you need in the map should be in the body text.',
      },
      {
        question: 'Can I upload an old .doc file?',
        answer: 'No. Only the modern DOCX format is supported. Open the file in Word or a compatible editor and save it as .docx first.',
      },
    ],
  },
  {
    slug: 'epub-to-mind-map',
    appPath: '/app/epub',
    eyebrow: 'AI ebook structuring tool',
    title: 'EPUB ebook to mind map',
    description:
      'Upload an EPUB and we follow the book’s own reading order, labelling nodes with the chapter they came from, so a whole book becomes one navigable structure.',
    seoTitle: 'EPUB to Mind Map — map a whole book by chapter',
    seoDescription:
      'Upload an EPUB ebook and get an editable mind map that follows the book’s reading order, with nodes labelled by chapter and export to PNG, SVG and Markdown.',
    primaryKeyword: 'epub to mind map',
    relatedKeywords: ['book to mind map', 'ebook summary', 'convert epub to mind map', 'book chapter mind map'],
    benefits: [
      { title: 'Follows the book’s reading order', description: 'We read the EPUB spine — the order the publisher defined — rather than guessing from filenames, so chapters appear in the order you would actually read them.' },
      { title: 'Nodes tell you which chapter', description: 'Each block keeps its chapter title, so a claim in the map can be traced back to the chapter it came from.' },
      { title: 'One book, one structure', description: 'Instead of chapter-by-chapter summaries that never connect, you get a single hierarchy where recurring themes sit together.' },
    ],
    steps: [
      { title: 'Upload your EPUB', description: 'Files up to 20MB. DRM-protected ebooks cannot be opened.' },
      { title: 'Choose depth', description: 'Concise for an overview of the argument, detailed to keep more of the supporting material.' },
      { title: 'Review by chapter and export', description: 'Check the chapter labels on key branches, edit, then export or share.' },
    ],
    useCases: ['Build a revision structure from a textbook', 'Map the argument of a non-fiction book', 'Compare how chapters develop one theme', 'Prepare notes before a book club or seminar'],
    faq: [
      {
        question: 'Can you open ebooks bought from a store?',
        answer: 'Only if the file is DRM-free. DRM-protected purchases from most major stores are encrypted and cannot be read by any third-party tool, including this one.',
      },
      {
        question: 'How are nodes linked back to the book?',
        answer: 'Each extracted block keeps the chapter title from that section of the EPUB, so nodes are labelled by chapter. EPUB has no fixed page numbers — page numbers depend on the reader and font size — so chapter is the reliable anchor.',
      },
      {
        question: 'Is there a limit on book length?',
        answer: 'The file must be under 20MB, and we read up to the first 500 documents in the spine, which covers essentially any normal book. Very long books may also hit your plan’s character limit, shown on the pricing page.',
      },
      {
        question: 'Does it work for fiction?',
        answer: 'It works, but it suits non-fiction far better. Mind maps expose hierarchy and classification; narrative fiction is chronological, and a map of it tends to be less useful than the book itself.',
      },
    ],
  },
  {
    slug: 'pptx-to-mind-map',
    appPath: '/app/pptx',
    eyebrow: 'AI presentation structuring tool',
    title: 'PowerPoint deck to mind map',
    description:
      'Upload a PPTX and we pull the text from every slide in order, labelling each node with its slide number so you can jump straight back to the original.',
    seoTitle: 'PowerPoint to Mind Map — slide-by-slide, with slide numbers',
    seoDescription:
      'Upload a PPTX deck and get an editable mind map. Text is extracted slide by slide and every node keeps its slide number, with export to PNG, SVG and Markdown.',
    primaryKeyword: 'powerpoint to mind map',
    relatedKeywords: ['pptx to mind map', 'presentation summary', 'slides to mind map', 'convert powerpoint to mind map'],
    benefits: [
      { title: 'Every node keeps its slide number', description: 'Nodes are labelled Slide 1, Slide 2 and so on, so verifying a point means opening one slide rather than clicking through the deck.' },
      { title: 'Recovers the argument from the slides', description: 'Decks are built for presenting, not reading. Grouping the text into a hierarchy shows what the deck actually argues, including where it repeats itself.' },
      { title: 'Compare decks quickly', description: 'Map two decks on the same topic and the differences in coverage become obvious in a way that skimming slides does not deliver.' },
    ],
    steps: [
      { title: 'Upload your PPTX', description: 'Files up to 20MB. Slides are read in their deck order.' },
      { title: 'Choose depth and purpose', description: 'Concise for the headline argument, detailed to keep supporting bullets.' },
      { title: 'Check slide numbers and export', description: 'Verify the key branches against their slides, edit, then export or share.' },
    ],
    useCases: ['Digest a conference deck fast', 'Turn a training deck into a study structure', 'Audit what a pitch deck actually claims', 'Compare competing proposals side by side'],
    faq: [
      {
        question: 'Are speaker notes included?',
        answer: 'No. Only the text on the slides themselves is read. If the substance of your deck lives in the notes, the map will be thinner than you expect — move that text onto the slides, or paste the notes in as text instead.',
      },
      {
        question: 'What about images, charts, audio and animations?',
        answer: 'They are not read. Any figure that exists only as an image will not appear in the map. Chart titles and labels are only picked up when they are real text boxes on the slide.',
      },
      {
        question: 'How accurate are the slide numbers?',
        answer: 'They come from the deck’s own slide order, recorded during extraction rather than generated by the model, so they point at the right slide. Hidden slides are included if they contain text.',
      },
      {
        question: 'Can I upload an old .ppt file?',
        answer: 'No. Only the modern PPTX format is supported. Open the deck in PowerPoint or a compatible editor and save it as .pptx first.',
      },
    ],
  },
];

export const TOOL_PAGES: ToolPage[] = ALL_TOOL_PAGES;

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
    primaryKeyword: 'how to convert PDF to mind map',
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

/**
 * 按界面语言取工具页文案。没有译文时回退英文原文 ——
 * 宁可显示一页英文，也不能显示空白标题。
 */
export function localizedToolPage(tool: ToolPage, locale: Locale): ToolPage {
  const copy = TOOL_COPY[locale]?.[tool.slug];
  return copy ? { ...tool, ...copy } : tool;
}
