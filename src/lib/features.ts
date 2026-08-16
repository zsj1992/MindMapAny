/**
 * YouTube 输入的对外入口开关。
 *
 * 后端整条链路已经就绪（字幕抓取、30 秒分段、时间戳溯源、可点跳转），
 * 唯一缺的是 Supadata 的 API 密钥 —— 没有它，线上只会返回
 * provider_unconfigured。
 *
 * 开启条件（两件都做完再翻 true）：
 *   1. 注册 Supadata 拿到密钥，填进 .env.local 的 YOUTUBE_TRANSCRIPT_API_KEY
 *   2. `npx wrangler secret put YOUTUBE_TRANSCRIPT_API_KEY` 写进生产
 *
 * 这是个手动开关，而手动开关会烂 —— 上一个（CHROME_EXTENSION_PUBLIC）就因为
 * 条件早已满足却没人去翻，把插件入口藏了好几天。所以条件写在上面，别只写「TODO」。
 */
export const YOUTUBE_INPUT_LIVE = true;
