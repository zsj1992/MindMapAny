'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { marketingCopy } from '@/lib/i18n/marketing';
import { basePath, hasTranslation, localizedPath } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/locales';

/**
 * 语言切换。切到当前页面的对应语言版本，而不是一律回首页 ——
 * 在定价页点「中文」却被丢回首页，用户还得自己找回来。
 *
 * 当前页没有对应译文时整个按钮不显示：给一个指向英文原页的「中文」按钮，
 * 点了语言没变，比没有按钮更让人困惑。
 */
export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const english = basePath(pathname);
  if (!hasTranslation(english)) return null;

  const target: Locale = locale === 'en' ? 'zh-CN' : 'en';
  return (
    <Link
      href={localizedPath(english, target)}
      hrefLang={target}
      aria-label={marketingCopy(target).nav.switchTo}
      className="btn btn-ghost h-9 whitespace-nowrap px-2 text-xs sm:text-sm"
    >
      {marketingCopy(locale).nav.switchTo}
    </Link>
  );
}
