import { extractText, getDocumentProxy } from 'unpdf';
import { ExtractError, type Block, type ExtractedDoc } from './types';

/** MVP 硬限制：超出直接拒绝，比生成到一半失败体验好，也是成本闸门 */
export const PDF_MAX_BYTES = 20 * 1024 * 1024;
export const PDF_MAX_PAGES = 200;
/** 单页文本少于这个数视为图片页，很可能是扫描件 */
const SCANNED_PAGE_CHARS = 40;

// pdf.js 会调 Math.sumPrecise（TC39 提案，Node 24 尚未实现），缺失时会刷满警告
if (typeof (Math as { sumPrecise?: unknown }).sumPrecise !== 'function') {
  (Math as unknown as { sumPrecise: (v: Iterable<number>) => number }).sumPrecise = (values) => {
    let sum = 0;
    for (const v of values) sum += v;
    return sum;
  };
}

export interface PdfInput {
  data: ArrayBuffer;
  filename?: string;
}

export async function extractPdf(input: PdfInput): Promise<ExtractedDoc> {
  if (input.data.byteLength > PDF_MAX_BYTES) {
    throw new ExtractError('too_large', `The PDF exceeds the ${PDF_MAX_BYTES / 1024 / 1024}MB limit`);
  }

  const notes: string[] = [];
  const bytes = new Uint8Array(input.data);

  let pdf;
  try {
    pdf = await getDocumentProxy(bytes);
  } catch {
    throw new ExtractError('unsupported', 'The PDF could not be parsed — it may be encrypted or corrupt');
  }

  if (pdf.numPages > PDF_MAX_PAGES) {
    notes.push(`The document has ${pdf.numPages} pages; only the first ${PDF_MAX_PAGES} were processed`);
  }

  // mergePages: false —— 拿到逐页文本，页码映射就是数组下标，不用再猜
  const { text: pages } = await extractText(pdf, { mergePages: false });
  const limited = pages.slice(0, PDF_MAX_PAGES);

  const blocks: Block[] = [];
  let scannedPages = 0;
  limited.forEach((raw, i) => {
    const cleaned = cleanPageText(raw);
    if (cleaned.length < SCANNED_PAGE_CHARS) {
      scannedPages++;
      if (!cleaned) return;
    }
    // 按空行拆段，段落是最小溯源单位，同页多段共享页码
    for (const para of cleaned.split(/\n{2,}/)) {
      const t = para.trim();
      if (t) blocks.push({ text: t, page: i + 1 });
    }
  });

  if (!blocks.length) {
    throw new ExtractError('empty', 'No text could be extracted. Scanned PDFs are not supported yet — OCR is not available in this version.');
  }
  if (scannedPages > limited.length * 0.5) {
    notes.push('Most pages have almost no text layer, so this may be a scan and the result may be incomplete');
  }

  return {
    kind: 'pdf',
    title: await resolveTitle(pdf, input.filename, blocks),
    blocks,
    notes,
  };
}

function cleanPageText(text: string): string {
  return text
    .replace(/\r/g, '')
    // 断词连字符：跨行的 "informa-\ntion" 拼回去
    .replace(/([A-Za-z])-\n([A-Za-z])/g, '$1$2')
    // 中文之间的换行是排版换行，不是段落
    .replace(/([一-龥])\n([一-龥])/g, '$1$2')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function resolveTitle(
  pdf: Awaited<ReturnType<typeof getDocumentProxy>>,
  filename: string | undefined,
  blocks: Block[],
): Promise<string> {
  try {
    const meta = await pdf.getMetadata();
    const info = meta.info as { Title?: string } | undefined;
    const t = info?.Title?.trim();
    // 很多 PDF 的 Title 是生成工具留下的路径或乱码，做一次合理性检查
    if (t && t.length > 1 && t.length < 120 && !/\.(indd|docx?|tex)$/i.test(t)) return t;
  } catch {
    // metadata 缺失不算错误
  }
  if (filename) return filename.replace(/\.pdf$/i, '');
  return blocks[0].text.slice(0, 60);
}
