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

export async function extractYoutube(url: string, preferredLang?: string): Promise<ExtractedDoc> {
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

async function fetchTranscript(videoId: string, lang?: string): Promise<TranscriptResult> {
  const key = process.env.YOUTUBE_TRANSCRIPT_API_KEY;
  if (key) return fetchViaSupadata(videoId, lang, key);

  if (process.env.NODE_ENV === 'production') {
    throw new ExtractError(
      'provider_unconfigured',
      'The YouTube caption service is not configured (YOUTUBE_TRANSCRIPT_API_KEY is missing)',
    );
  }
  const result = await fetchDirect(videoId, lang ?? 'en');
  return { ...result, note: 'Captions were fetched directly; production needs the caption API configured' };
}

/** Supadata：/v1/transcript 返回 { content: [{ text, offset(ms), duration }], lang } */
async function fetchViaSupadata(videoId: string, lang: string | undefined, key: string): Promise<TranscriptResult> {
  const endpoint = new URL(process.env.YOUTUBE_TRANSCRIPT_API_URL ?? 'https://api.supadata.ai/v1/transcript');
  endpoint.searchParams.set('url', `https://www.youtube.com/watch?v=${videoId}`);
  /*
   * 带上首选语言。不带的话对方返回的是按字母序排在最前的那条轨 ——
   * 一个英文视频挂着三十多条翻译字幕时，拿回来的会是阿拉伯语。
   * 要不到就退回原生（见上面 202 的处理），不会卡住。
   */
  if (lang) endpoint.searchParams.set('lang', lang);

  const res = await fetch(endpoint, { headers: { 'x-api-key': key } });
  if (res.status === 404 || res.status === 206) {
    throw new ExtractError('no_transcript', 'This video has no captions available');
  }
  /*
   * 202 = 转成了异步任务（通常是要翻译或需要 AI 转写）。它属于 res.ok，
   * 之前直接往下走，读到空的 content，最后报成「没有字幕」—— 一个有字幕的
   * 视频被判了死刑。必须单独处理。
   */
  /*
   * 202 = 转成了异步任务，意味着我们要的那种语言的字幕不存在，对方打算去翻译。
   *
   * 不等它：翻译要排队，而视频原生字幕是现成的，我们本来也不需要它翻 ——
   * 输出语言由生成阶段决定，取到什么语种的原文都能出目标语言的图。
   * 所以直接改成不指定语言再取一次，拿原生轨，快且准。
   */
  if (res.status === 202) {
    if (lang) return fetchViaSupadata(videoId, undefined, key);
    const { jobId } = (await res.json()) as { jobId?: string };
    if (!jobId) throw new ExtractError('fetch_failed', 'The caption service queued the request but returned no job id');
    return pollSupadataJob(jobId, key);
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
  // 没指定语言时拿到什么就是什么，只记一笔字幕语种；指定了才谈得上「会被翻译」
  const note = !data.lang
    ? undefined
    : lang && !data.lang.startsWith(lang)
      ? `Captions are in ${data.lang} and will be translated`
      : `Captions are in ${data.lang}`;
  return { cues, title: data.title, ...(note ? { note } : {}) };
}


/**
 * 轮询异步字幕任务。
 *
 * 只等有限的时间：整个生成本来就要几十秒，字幕再等一分钟用户就该以为卡死了。
 * 等不到就明确说「还在处理，请稍后重试」，而不是含糊地说没有字幕 ——
 * 后者会让用户以为这个视频永远做不了，其实过一会儿就好了。
 */
const JOB_POLL_INTERVAL_MS = 1500;
const JOB_POLL_MAX_MS = 45_000;

async function pollSupadataJob(jobId: string, key: string): Promise<TranscriptResult> {
  const deadline = Date.now() + JOB_POLL_MAX_MS;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, JOB_POLL_INTERVAL_MS));
    const res = await fetch(`https://api.supadata.ai/v1/transcript/${jobId}`, { headers: { 'x-api-key': key } });
    if (!res.ok) continue;
    const data = (await res.json()) as {
      status?: string;
      content?: { text: string; offset: number }[];
      lang?: string;
      error?: string;
    };
    if (data.status === 'failed' || data.error) {
      throw new ExtractError('no_transcript', 'The captions for this video could not be retrieved');
    }
    if (data.content?.length) {
      return {
        cues: data.content.map((c) => ({ text: c.text, startSec: c.offset / 1000 })),
        ...(data.lang ? { note: `Captions are in ${data.lang}` } : {}),
      };
    }
  }
  throw new ExtractError('fetch_failed', 'The captions are still being prepared. Please try again in a moment.');
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
