import { strFromU8, unzipSync, type Unzipped } from 'fflate';
import { ExtractError, type Block, type ExtractedDoc } from './types';

export const DOCUMENT_MAX_BYTES = 20 * 1024 * 1024;
const ZIP_MAX_UNCOMPRESSED_BYTES = 48 * 1024 * 1024;
const ZIP_MAX_ENTRIES = 1200;

export const DOCUMENT_ACCEPT = '.docx,.epub,.pptx,.txt,.md,.markdown,text/plain,text/markdown';
export const DOCUMENT_FORMAT_LABEL = 'DOCX, EPUB, PPTX, TXT or Markdown';

export interface DocumentInput {
  data: ArrayBuffer;
  filename?: string;
  mimeType?: string;
}

export function documentExtension(filename = ''): string {
  return filename.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? '';
}

export function isSupportedDocument(filename?: string, mimeType?: string): boolean {
  const ext = documentExtension(filename);
  if (['docx', 'epub', 'pptx', 'txt', 'md', 'markdown'].includes(ext)) return true;
  return !ext && (mimeType === 'text/plain' || mimeType === 'text/markdown');
}

export async function extractDocument(input: DocumentInput): Promise<ExtractedDoc> {
  if (input.data.byteLength > DOCUMENT_MAX_BYTES) {
    throw new ExtractError('too_large', 'The file exceeds the 20MB limit');
  }

  const ext = documentExtension(input.filename);
  if (ext === 'txt' || ext === 'md' || ext === 'markdown' || (!ext && (input.mimeType === 'text/plain' || input.mimeType === 'text/markdown'))) {
    return extractPlainText(input);
  }
  if (!['docx', 'epub', 'pptx'].includes(ext)) {
    throw new ExtractError('unsupported', `That file format is not supported. Please upload ${DOCUMENT_FORMAT_LABEL}.`);
  }

  const bytes = new Uint8Array(input.data);
  assertSafeZip(bytes);
  let files: Unzipped;
  try {
    files = unzipSync(bytes);
  } catch {
    throw new ExtractError('unsupported', 'The file could not be unpacked — it may be corrupt or password-protected');
  }

  if (ext === 'docx') return extractDocx(files, input.filename);
  if (ext === 'pptx') return extractPptx(files, input.filename);
  return extractEpub(files, input.filename);
}

function extractPlainText(input: DocumentInput): ExtractedDoc {
  const text = new TextDecoder('utf-8', { fatal: false }).decode(input.data).replace(/^\uFEFF/, '');
  if (text.includes('\0')) throw new ExtractError('unsupported', 'The file is not recognisable UTF-8 text');
  const blocks = paragraphs(text);
  if (!blocks.length) throw new ExtractError('empty', 'The file contains no usable text');
  return {
    kind: 'document',
    title: cleanFilename(input.filename) || blocks[0].text.slice(0, 60),
    blocks,
    notes: [],
  };
}

function extractDocx(files: Unzipped, filename?: string): ExtractedDoc {
  const documentXml = readZipText(files, 'word/document.xml');
  if (!documentXml) throw new ExtractError('unsupported', 'The DOCX has no body content — the file may be corrupt');

  const blocks: Block[] = [];
  for (const match of documentXml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/gi)) {
    const text = extractTaggedText(match[0], 'w:t');
    if (text) blocks.push({ text });
  }
  if (!blocks.length) throw new ExtractError('empty', 'The DOCX contains no usable text');

  const core = readZipText(files, 'docProps/core.xml');
  const metaTitle = core?.match(/<dc:title[^>]*>([\s\S]*?)<\/dc:title>/i)?.[1];
  return {
    kind: 'document',
    title: decodeEntities(metaTitle ?? '').trim() || cleanFilename(filename) || blocks[0].text.slice(0, 60),
    blocks,
    notes: [],
  };
}

function extractPptx(files: Unzipped, filename?: string): ExtractedDoc {
  const slideNames = Object.keys(files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
    .sort((a, b) => slideNumber(a) - slideNumber(b));

  const blocks: Block[] = [];
  for (const name of slideNames) {
    const xml = readZipText(files, name);
    if (!xml) continue;
    const text = extractTaggedText(xml, 'a:t');
    if (text) blocks.push({ text, location: `Slide ${slideNumber(name)}` });
  }
  if (!blocks.length) throw new ExtractError('empty', 'The PPTX contains no extractable text');
  return {
    kind: 'document',
    title: cleanFilename(filename) || blocks[0].text.slice(0, 60),
    blocks,
    notes: ['仅提取幻灯片中的文字，不读取图片、音视频与动画'],
  };
}

function extractEpub(files: Unzipped, filename?: string): ExtractedDoc {
  const container = readZipText(files, 'META-INF/container.xml');
  const opfPath = container?.match(/<rootfile[^>]+full-path=["']([^"']+)["']/i)?.[1];
  if (!opfPath) throw new ExtractError('unsupported', 'EPUB 缺少内容清单，文件可能已损坏');
  const opf = readZipText(files, opfPath);
  if (!opf) throw new ExtractError('unsupported', 'EPUB 内容清单无法读取');

  const manifest = new Map<string, string>();
  for (const item of opf.matchAll(/<item\b[^>]*>/gi)) {
    const id = attr(item[0], 'id');
    const href = attr(item[0], 'href');
    if (id && href) manifest.set(id, resolveZipPath(opfPath, href));
  }
  const readingOrder = Array.from(opf.matchAll(/<itemref\b[^>]*>/gi))
    .map((item) => attr(item[0], 'idref'))
    .filter((id): id is string => Boolean(id))
    .map((id) => manifest.get(id))
    .filter((path): path is string => Boolean(path));

  const candidates = readingOrder.length
    ? readingOrder
    : Object.keys(files).filter((name) => /\.(xhtml|html|htm)$/i.test(name)).sort();
  const blocks: Block[] = [];
  for (const path of candidates.slice(0, 500)) {
    const markup = readZipText(files, path);
    if (!markup) continue;
    const chapterTitle = decodeEntities(markup.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '')
      .replace(/<[^>]+>/g, '')
      .trim();
    const body = markup.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? markup;
    const text = htmlToText(body);
    if (text) blocks.push({ text, ...(chapterTitle ? { location: chapterTitle.slice(0, 80) } : {}) });
  }
  if (!blocks.length) throw new ExtractError('empty', 'EPUB 中没有可提取的正文');

  const metaTitle = opf.match(/<dc:title[^>]*>([\s\S]*?)<\/dc:title>/i)?.[1];
  return {
    kind: 'document',
    title: decodeEntities(metaTitle ?? '').replace(/<[^>]+>/g, '').trim() || cleanFilename(filename) || blocks[0].text.slice(0, 60),
    blocks,
    notes: [],
  };
}

function paragraphs(text: string): Block[] {
  return text
    .replace(/\r/g, '')
    .split(/\n{2,}/)
    .map((value) => value.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
    .map((value) => ({ text: value }));
}

function extractTaggedText(xml: string, tag: string): string {
  return Array.from(xml.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi')))
    .map((match) => decodeEntities(match[1]).replace(/<[^>]+>/g, '').trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function htmlToText(markup: string): string {
  return decodeEntities(
    markup
      .replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, '')
      .replace(/<br\s*\/?\s*>/gi, '\n')
      .replace(/<\/(p|div|h[1-6]|li|blockquote|section|article|tr)>/gi, '\n\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim();
}

function decodeEntities(value: string): string {
  const named: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_, entity: string) => {
    if (entity[0] === '#') {
      const hex = entity[1]?.toLowerCase() === 'x';
      const code = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : '';
    }
    return named[entity.toLowerCase()] ?? `&${entity};`;
  });
}

function readZipText(files: Unzipped, name: string): string | null {
  const exact = files[name] ?? files[safeDecodeURIComponent(name)];
  return exact ? strFromU8(exact) : null;
}

function attr(tag: string, name: string): string | null {
  return decodeEntities(tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, 'i'))?.[1] ?? '').trim() || null;
}

function resolveZipPath(opfPath: string, href: string): string {
  const base = opfPath.includes('/') ? opfPath.slice(0, opfPath.lastIndexOf('/') + 1) : '';
  const parts: string[] = [];
  for (const part of `${base}${href.split('#')[0]}`.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') parts.pop();
    else parts.push(part);
  }
  return safeDecodeURIComponent(parts.join('/'));
}

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function cleanFilename(filename?: string): string {
  return (filename ?? '').replace(/\.(docx|epub|pptx|txt|md|markdown)$/i, '').trim();
}

function slideNumber(name: string): number {
  return Number(name.match(/slide(\d+)\.xml$/i)?.[1] ?? 0);
}

/** 在解压前读取 ZIP 中央目录，拦截压缩炸弹和异常文件数量。 */
function assertSafeZip(bytes: Uint8Array): void {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let eocd = -1;
  for (let i = Math.max(0, bytes.length - 65_557); i <= bytes.length - 22; i++) {
    if (view.getUint32(i, true) === 0x06054b50) eocd = i;
  }
  if (eocd < 0) throw new ExtractError('unsupported', '文件不是有效的 ZIP 文档');
  const entries = view.getUint16(eocd + 10, true);
  let offset = view.getUint32(eocd + 16, true);
  if (!entries || entries > ZIP_MAX_ENTRIES || offset >= bytes.length) {
    throw new ExtractError('too_large', '文件内部条目过多或格式不受支持');
  }
  let total = 0;
  for (let i = 0; i < entries; i++) {
    if (offset + 46 > bytes.length || view.getUint32(offset, true) !== 0x02014b50) {
      throw new ExtractError('unsupported', '文件中央目录已损坏');
    }
    total += view.getUint32(offset + 24, true);
    if (total > ZIP_MAX_UNCOMPRESSED_BYTES) throw new ExtractError('too_large', '文件解压后超过 48MB 安全限制');
    offset += 46 + view.getUint16(offset + 28, true) + view.getUint16(offset + 30, true) + view.getUint16(offset + 32, true);
  }
}
