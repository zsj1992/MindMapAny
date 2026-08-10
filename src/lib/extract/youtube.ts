import { ExtractError, type Block, type ExtractedDoc } from './types';

/**
 * YouTube 字幕。
 *
 * 这是四种输入里平台风险最高的一条：YouTube 会按 IP 段封锁，
 * Vercel / AWS 出口 IP 基本都在黑名单里 —— 本地跑通、线上必挂是标准剧本。
 * 所以默认走第三方字幕 API（住宅代理池），直连方式只作为本地开发的兜底。
 * 配好 YOUTUBE_TRANSCRIPT_API_KEY 即启用 provider 模式。
 */

export interface TranscriptCue {
  text: string;
  startSec: number;
}

const ID_PATTERNS = [
  /(?:youtube\.com\/watch\?(?:.*&)?v=)([A-Za-z0-9_-]{11})/,
  /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
  /(?:youtube\.com\/(?:embed|shorts|live)\/)([A-Za-z0-9_-]{11})/,
];

export function parseVideoId(url: string): string | null {
  for (const re of ID_PATTERNS) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return /^[A-Za-z0-9_-]{11}$/.test(url.trim()) ? url.trim() : null;
}

export function isYoutubeUrl(url: string): boolean {
  return parseVideoId(url) !== null;
}

export async function extractYoutube(url: string, preferredLang = 'en'): Promise<ExtractedDoc> {
  const videoId = parseVideoId(url);
  if (!videoId) throw new ExtractError('unsupported', 'That YouTube link could not be recognised');

  const { cues, title, note } = await fetchTranscript(videoId, preferredLang);
  if (!cues.length) {
    throw new ExtractError('no_transcript', 'This video has no captions available, and videos without captions are not supported yet');
  }

  return {
    kind: 'youtube',
    title: title || `YouTube ${videoId}`,
    blocks: groupCues(cues),
    url: `https://www.youtube.com/watch?v=${videoId}`,
    notes: note ? [note] : [],
  };
}

/**
 * 字幕按 30 秒窗口合并成段：单条 cue 只有几个词，直接喂给模型会切碎语义；
 * 时间戳取窗口起点，节点跳转落在这一段开头。
 */
const CUE_WINDOW_SEC = 30;

export function groupCues(cues: TranscriptCue[]): Block[] {
  const blocks: Block[] = [];
  let buf: string[] = [];
  let windowStart = cues[0]?.startSec ?? 0;

  for (const cue of cues) {
    if (buf.length && cue.startSec - windowStart >= CUE_WINDOW_SEC) {
      blocks.push({ text: buf.join(' ').replace(/\s+/g, ' ').trim(), startSec: Math.floor(windowStart) });
      buf = [];
      windowStart = cue.startSec;
    }
    const t = cue.text.trim();
    if (t) buf.push(t);
  }
  if (buf.length) {
    blocks.push({ text: buf.join(' ').replace(/\s+/g, ' ').trim(), startSec: Math.floor(windowStart) });
  }
  return blocks.filter((b) => b.text);
}

interface TranscriptResult {
  cues: TranscriptCue[];
  title?: string;
  note?: string;
}

async function fetchTranscript(videoId: string, lang: string): Promise<TranscriptResult> {
  const key = process.env.YOUTUBE_TRANSCRIPT_API_KEY;
  if (key) return fetchViaSupadata(videoId, lang, key);

  if (process.env.NODE_ENV === 'production') {
    throw new ExtractError(
      'provider_unconfigured',
      'The YouTube caption service is not configured (YOUTUBE_TRANSCRIPT_API_KEY is missing)',
    );
  }
  const result = await fetchDirect(videoId, lang);
  return { ...result, note: 'Captions were fetched directly; production needs the caption API configured' };
}

/** Supadata：/v1/transcript 返回 { content: [{ text, offset(ms), duration }], lang } */
async function fetchViaSupadata(videoId: string, lang: string, key: string): Promise<TranscriptResult> {
  const endpoint = new URL(process.env.YOUTUBE_TRANSCRIPT_API_URL ?? 'https://api.supadata.ai/v1/transcript');
  endpoint.searchParams.set('url', `https://www.youtube.com/watch?v=${videoId}`);
  endpoint.searchParams.set('lang', lang);

  const res = await fetch(endpoint, { headers: { 'x-api-key': key } });
  if (res.status === 404 || res.status === 206) {
    throw new ExtractError('no_transcript', 'This video has no captions available');
  }
  if (!res.ok) {
    throw new ExtractError('fetch_failed', `The caption service returned ${res.status}`);
  }

  const data = (await res.json()) as {
    content?: { text: string; offset: number }[];
    title?: string;
    lang?: string;
  };
  const cues = (data.content ?? []).map((c) => ({ text: c.text, startSec: c.offset / 1000 }));
  const note = data.lang && !data.lang.startsWith(lang) ? `Captions are in ${data.lang} and will be translated` : undefined;
  return { cues, title: data.title, ...(note ? { note } : {}) };
}

/** 本地兜底：从播放页拿 captionTracks，线上大概率被 YouTube 拒绝 */
async function fetchDirect(videoId: string, lang: string): Promise<TranscriptResult> {
  const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: { 'user-agent': 'Mozilla/5.0', 'accept-language': `${lang},en;q=0.9` },
  });
  if (!res.ok) throw new ExtractError('fetch_failed', `Could not load the video page (${res.status})`);
  const html = await res.text();

  const title = html.match(/<meta name="title" content="([^"]*)"/)?.[1];
  const tracksRaw = html.match(/"captionTracks":(\[.*?\])/)?.[1];
  if (!tracksRaw) throw new ExtractError('no_transcript', 'This video has no captions available');

  const tracks = JSON.parse(tracksRaw) as { baseUrl: string; languageCode: string }[];
  const track = tracks.find((t) => t.languageCode.startsWith(lang)) ?? tracks[0];
  if (!track) throw new ExtractError('no_transcript', 'This video has no captions available');

  const xml = await (await fetch(track.baseUrl)).text();
  const cues: TranscriptCue[] = [];
  for (const m of xml.matchAll(/<text start="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g)) {
    cues.push({ startSec: Number(m[1]), text: decodeXml(m[2]) });
  }
  return { cues, ...(title ? { title } : {}) };
}

function decodeXml(s: string): string {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&amp;quot;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&amp;#39;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;lt;/g, '<')
    .replace(/&lt;/g, '<')
    .replace(/&amp;gt;/g, '>')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}
