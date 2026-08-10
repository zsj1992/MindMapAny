import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  /**
   * www 永久跳主域。
   *
   * wrangler.jsonc 里两个域名都是 custom domain，谁也不跳谁 —— 两边都返回 200
   * 且内容逐字节相同。canonical 指向主域能缓解，但 Google 仍会两边都抓，
   * 浪费抓取预算，外链权重也会分散到两个主机名上。
   *
   * 用 next.config 的 host 匹配而不是中间件：Next 16 的 proxy 只能跑 Node.js runtime，
   * OpenNext 在构建阶段直接拒绝。redirects 会编进路由清单，在边缘就完成跳转。
   */
  async redirects() {
    const host = [{ type: 'host' as const, value: 'www.mindmapany.com' }];
    return [
      // 根路径单列一条：':path*' 匹配空串时不会被替换，Location 里会原样吐出
      // "https://mindmapany.com/:path*" 这个字面量 —— 实测确实如此。
      { source: '/', has: host, destination: 'https://mindmapany.com/', permanent: true },
      { source: '/:path+', has: host, destination: 'https://mindmapany.com/:path+', permanent: true },
    ];
  },
  async headers() {
    const scriptPolicy = process.env.NODE_ENV === 'development'
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com"
      : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com";
    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self' https://www.creem.io https://checkout.creem.io",
      "frame-ancestors 'none'",
      "object-src 'none'",
      scriptPolicy,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
      "worker-src 'self' blob:",
      "upgrade-insecure-requests",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(self "https://www.creem.io")' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
        ],
      },
    ];
  },
};

export default nextConfig;
