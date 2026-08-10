'use client';

import { useEffect } from 'react';
import { readLocaleCookie, writeLocaleCookie } from '@/lib/i18n/cookie';
import type { Locale } from '@/lib/i18n/locales';

/**
 * 把「你正在看的营销页是什么语言」记下来，供工作台使用。
 *
 * 存在的理由：营销页的语言来自 URL 前缀，工作台的语言来自 cookie / Accept-Language ——
 * 两套判定互不相通。中文浏览器的用户打开英文首页，再点进工作台就会看到中文界面，
 * 两边各自都「对」，合起来却是错的。
 *
 * 只在 cookie 不存在时写入。已经有 cookie 说明用户在某个切换器里明确选过，
 * 那时候再覆盖，就成了「我在账号菜单里选了中文，逛一圈英文首页又被改回英文」。
 */
export function LocaleSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    if (!readLocaleCookie()) writeLocaleCookie(locale);
  }, [locale]);
  return null;
}
