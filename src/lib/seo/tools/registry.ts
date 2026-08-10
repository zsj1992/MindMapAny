import type { ToolPage } from '../content';
import type { Locale } from '@/lib/i18n/locales';
import { TOOLS_JA } from './ja';
import { TOOLS_ZH_CN } from './zh-CN';

/**
 * 工具落地页的多语言文案。
 *
 * 一种语言一个文件：全部堆进 content.ts 的话，七种语言 × 六个工具页
 * 会让那个文件涨到两千行以上，没人愿意打开，改错了也看不出来。
 *
 * slug 和 appPath 不在这里 —— 路径不随语言变。
 * relatedKeywords 各语言自成一套，不是英文的直译：日语用户搜的是
 * 「PDF マインドマップ 変換」，不是 "PDF to mind map" 的字面翻译。
 */
export type ToolPageCopy = Pick<
  ToolPage,
  'eyebrow' | 'title' | 'description' | 'seoTitle' | 'seoDescription' | 'primaryKeyword' | 'relatedKeywords' | 'benefits' | 'steps' | 'useCases' | 'faq'
>;

/** 已有译文的语言。没列进来的语言，工具页仍走英文原文。 */
export const TOOL_COPY: Partial<Record<Locale, Record<string, ToolPageCopy>>> = {
  'zh-CN': TOOLS_ZH_CN,
  ja: TOOLS_JA,
};
