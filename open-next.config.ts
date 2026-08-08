import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

/**
 * 预渲染页面（落地页、robots、sitemap）在构建时写进增量缓存，
 * 不配这个的话 Worker 运行时找不到它们，首页会 404。
 *
 * 选 static-assets 而不是 KV/R2：我们的静态页在构建时就定稿，运行时不需要回写，
 * 用 assets binding 读就够了 —— 少两个要开通、要计费的资源。
 * 将来真要做 ISR 再换成 KV。
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
