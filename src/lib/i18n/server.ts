import { cookies, headers } from 'next/headers';
import { LOCALE_COOKIE, resolveLocale, type Locale } from './locales';

/**
 * 服务端组件里取当前界面语言。
 *
 * 只能在 /app 下用 —— 读 cookie 和请求头会让页面变成动态渲染，
 * 营销页要静态预渲染进 CDN，用了就废掉缓存了。
 */
export async function appLocale(): Promise<Locale> {
  const [cookieStore, headerList] = await Promise.all([cookies(), headers()]);
  return resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value, headerList.get('accept-language'));
}
