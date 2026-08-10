/**
 * 从原文猜输出语言。
 *
 * 存在的理由：默认输出英文时，中文文档会被整篇翻译成英文 —— 用户多半只是想要
 * 一张中文脑图。默认值改成 'auto' 之后，这里负责把 'auto' 解析成具体语言码。
 *
 * 只在用户没有显式选语言时调用；一旦用户选了，永远以用户为准。
 *
 * 刻意做得保守：字符集能确定的（中日韩、西里尔、阿拉伯……）直接判；
 * 拉丁字母各语种之间靠虚词频率区分，拿不准就回退 'en'，
 * 因为猜错语言的代价（整篇翻译成用户不认识的语言）远大于回退的代价。
 */

/** prompt.ts 认识的语言码，返回值不能超出这个集合 */
export type LanguageCode =
  | 'en' | 'zh-CN' | 'zh-TW' | 'ja' | 'ko' | 'es' | 'fr' | 'de'
  | 'pt' | 'ru' | 'it' | 'ar' | 'hi' | 'vi' | 'th' | 'id';

/** 取样上限。长文只看开头足够判语言，全文扫一遍纯属浪费 */
const SAMPLE_CHARS = 4000;
/** 某个字符集要占到样本的这个比例才算数，挡掉正文里零星的外语引用 */
const SCRIPT_RATIO = 0.05;

const SCRIPTS: { code: LanguageCode; re: RegExp }[] = [
  { code: 'ko', re: /[가-힯ᄀ-ᇿ]/g },   // 谚文
  { code: 'ja', re: /[぀-ゟ゠-ヿ]/g },   // 假名：混着汉字也仍是日语
  { code: 'th', re: /[฀-๿]/g },
  { code: 'ar', re: /[؀-ۿ]/g },
  { code: 'hi', re: /[ऀ-ॿ]/g },
  { code: 'ru', re: /[Ѐ-ӿ]/g },
];

const HAN = /[一-鿿㐀-䶿]/g;

/**
 * 简繁判定：只看两边独有的高频字，共用字（中国、教育……）没有区分度。
 * 目的不是精确的简繁转换，只是决定 prompt 里写「简体」还是「繁体」。
 */
const SIMPLIFIED_ONLY = /[们这个国说时会来对开发经济产业务实现么与传统级别应该讲网络办电脑]/g;
const TRADITIONAL_ONLY = /[們這個國說時會來對開發經濟產業務實現麼與傳統級別應該講義務網絡辦電腦]/g;

/**
 * 越南语特有字母。只用预组合形式：越南语文本几乎总是 NFC，
 * 而组合音标符号写进源码既看不出来，也容易在复制粘贴中丢掉。
 */
const VIETNAMESE = /[ăâđêôơưáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụýỳỷỹỵ]/gi;

/**
 * 拉丁语种的虚词。选的都是高频且跨语种不重叠的词 ——
 * 比如 "de" 西葡都有就不单独作数，靠其余词拉开差距。
 */
const STOPWORDS: Record<Exclude<LanguageCode, 'ko' | 'ja' | 'th' | 'ar' | 'hi' | 'ru' | 'zh-CN' | 'zh-TW' | 'vi'>, string[]> = {
  en: ['the', 'and', 'that', 'with', 'for', 'this', 'from', 'are', 'was', 'have', 'not', 'you'],
  es: ['que', 'los', 'las', 'una', 'con', 'por', 'para', 'como', 'pero', 'sus', 'del', 'más'],
  fr: ['les', 'des', 'une', 'dans', 'pour', 'que', 'qui', 'sur', 'pas', 'avec', 'est', 'aux'],
  de: ['der', 'die', 'das', 'und', 'den', 'nicht', 'mit', 'sich', 'auf', 'für', 'ist', 'dem'],
  pt: ['que', 'não', 'uma', 'com', 'para', 'como', 'mais', 'dos', 'das', 'por', 'são', 'foi'],
  it: ['che', 'per', 'con', 'una', 'sono', 'non', 'nel', 'alla', 'gli', 'dei', 'come', 'più'],
  id: ['yang', 'dan', 'dengan', 'untuk', 'dari', 'pada', 'tidak', 'ini', 'itu', 'akan', 'dalam', 'adalah'],
};

function count(sample: string, re: RegExp): number {
  return sample.match(re)?.length ?? 0;
}

/**
 * @param text 原文（会自动取样，调用方不必截断）
 * @returns 具体语言码；判不出来时回退 'en'
 */
export function detectLanguage(text: string): LanguageCode {
  const sample = text.slice(0, SAMPLE_CHARS);
  // 分母只算字母类字符：空白和标点在中英文里占比差别很大，混进来会让阈值失真
  const letters = count(sample, /[\p{L}]/gu);
  // 门槛压得很低，因为字符集判定几个字就够了 —— 深度研究的提问可能只有十来个字。
  // 拉丁字母那条路另有虚词数量的门槛把关。
  if (letters < 4) return 'en';

  for (const { code, re } of SCRIPTS) {
    if (count(sample, re) / letters >= SCRIPT_RATIO) return code;
  }

  // 汉字判定放在假名和谚文之后：日文里汉字比例往往比假名还高
  if (count(sample, HAN) / letters >= SCRIPT_RATIO) {
    return count(sample, TRADITIONAL_ONLY) > count(sample, SIMPLIFIED_ONLY) ? 'zh-TW' : 'zh-CN';
  }

  if (count(sample, VIETNAMESE) / letters >= SCRIPT_RATIO) return 'vi';

  const words = sample.toLowerCase().match(/[\p{L}']+/gu) ?? [];
  if (words.length < 20) return 'en';
  const freq = new Map<string, number>();
  for (const word of words) freq.set(word, (freq.get(word) ?? 0) + 1);

  let best: LanguageCode = 'en';
  let bestScore = 0;
  for (const [code, list] of Object.entries(STOPWORDS)) {
    const score = list.reduce((sum, word) => sum + (freq.get(word) ?? 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = code as LanguageCode;
    }
  }
  // 虚词太少说明证据不足（术语表、代码、名词罗列），别硬猜
  return bestScore / words.length >= 0.02 ? best : 'en';
}

/** 用户选了就听用户的；只有 'auto' 才去猜 */
export function resolveLanguage(requested: string, text: string): string {
  return requested === 'auto' ? detectLanguage(text) : requested;
}
