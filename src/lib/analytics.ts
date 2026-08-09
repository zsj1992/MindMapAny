'use client';

type AnalyticsValue = string | number | boolean | undefined;

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, parameters?: Record<string, AnalyticsValue>) => void;
  }
}

/**
 * 只发送产品行为和聚合属性，不发送用户输入、文档内容或 URL 参数。
 * gtag 尚未加载、被广告拦截器拦截或处于本地开发环境时静默跳过。
 */
export function trackEvent(eventName: string, parameters?: Record<string, AnalyticsValue>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, parameters);
}

