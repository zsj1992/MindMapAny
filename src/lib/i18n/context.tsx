'use client';

import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { translate, type MessageKey } from './messages';
import { writeLocaleCookie } from './cookie';
import { DEFAULT_LOCALE, type Locale } from './locales';

/**
 * 语言由服务端在 /app 布局里定好后传进来。
 * 不在客户端自己读 navigator.language：那样首屏会先渲染英文再跳成中文，
 * 而且服务端和客户端渲染结果不一致会触发 hydration 报错。
 */
const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useT() {
  const locale = useLocale();
  return useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale],
  );
}

/** 切换界面语言：写 cookie 后整页重载，让服务端按新语言重新渲染 */
export function useSetLocale() {
  return useMemo(
    () => (locale: Locale) => {
      writeLocaleCookie(locale);
      window.location.reload();
    },
    [],
  );
}
