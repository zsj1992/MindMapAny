import Link from 'next/link';
import type { ReactNode } from 'react';
import { PolicyPage } from '@/components/site/PolicyPage';
import { legalCopy, type LegalDoc } from '@/lib/i18n/legal';
import { localizedPath } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/locales';

/**
 * 法务页正文。三份文档、7 种语言共用一个组件。
 *
 * 非英文版本顶部会显示效力声明 —— 译本只承担可读性，
 * 一旦发生争议以英文版为准。这不是可选项：
 * 没有这句话，每个译本都会变成一份各自独立的合同。
 */

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

/** 把 [文字](/路径) 解析成本地化链接，其余部分原样输出 */
function withLinks(text: string, locale: Locale): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    const [whole, label, href] = match;
    const at = match.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    out.push(
      <Link key={`${href}-${at}`} href={localizedPath(href, locale)}>
        {label}
      </Link>,
    );
    last = at + whole.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function LegalContent({ locale, doc }: { locale: Locale; doc: 'terms' | 'privacy' | 'refund' }) {
  const copy = legalCopy(locale);
  const page: LegalDoc = copy[doc];

  return (
    <PolicyPage eyebrow={page.eyebrow} title={page.title} description={page.description} updated={copy.updated}>
      {copy.prevails && (
        <p className="rounded-xl border bg-bg-subtle px-4 py-3 text-sm leading-6 text-text-muted" style={{ borderColor: 'var(--border)' }}>
          {copy.prevails}
        </p>
      )}
      {page.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.bullets && (
            <ul>
              {section.bullets.map((item) => (
                <li key={item.text}>
                  {item.label && <strong>{item.label}</strong>} {withLinks(item.text, locale)}
                </li>
              ))}
            </ul>
          )}
          {section.body?.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{withLinks(paragraph, locale)}</p>
          ))}
        </section>
      ))}
    </PolicyPage>
  );
}
