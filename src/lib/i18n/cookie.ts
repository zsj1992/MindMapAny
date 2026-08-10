'use client';

import { LOCALE_COOKIE, type Locale } from './locales';

/**
 * 界面语言偏好的读写。
 *
 * 用 cookie 而不是 localStorage：工作台是服务端渲染的，首屏就要知道语言，
 * 只有 cookie 会跟着请求一起发过去。
 */

export function readLocaleCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** 一年有效期，SameSite=Lax 足够 —— 这不是凭据，只是显示偏好 */
export function writeLocaleCookie(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
