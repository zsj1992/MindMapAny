import assert from 'node:assert/strict';
import { detectLanguage, resolveLanguage } from './detect-language';

const cases: { code: string; label: string; text: string }[] = [
  {
    code: 'zh-CN',
    label: '简体中文',
    text: '根据数字化管理师、大数据工程技术人员、人工智能工程技术人员的职业技术标准开展师资培训。'
      + '我市企事业单位、高校以及行业协会中从事数字技术技能领域相关工作、并且符合申报条件的专业技术人员均可报名参加。'
      + '本次师资培训共七天，培训费用为每人两千八百元，食宿和交通费用由参训人员自理。',
  },
  {
    code: 'zh-TW',
    label: '繁體中文',
    text: '為配合數位技術人才培育政策，本會將依照職業技術標準開辦師資培訓課程。'
      + '凡本市企業、學校與產業協會中從事數位技術相關工作，並且符合報名條件的專業技術人員皆可提出申請。'
      + '本次培訓共計七天，費用為每人兩千八百元，住宿與交通費用請自行負擔。',
  },
  {
    code: 'ja',
    label: '日本語',
    text: 'このたび、デジタル技術に関する職業技術標準にもとづいて指導者育成研修を実施いたします。'
      + '市内の企業や大学、業界団体においてデジタル技術分野の業務に従事している専門技術者の方が対象です。'
      + '研修期間は七日間で、費用は一人あたり二千八百元となります。宿泊費と交通費は自己負担です。',
  },
  {
    code: 'ko',
    label: '한국어',
    text: '이번 교육은 디지털 기술 분야의 직업 기술 표준에 따라 강사 양성을 목적으로 진행됩니다.'
      + '시내 기업과 대학, 산업 협회에서 디지털 기술 관련 업무를 담당하고 있는 전문 기술 인력이 대상입니다.'
      + '교육 기간은 7일이며 비용은 1인당 2800위안이고 숙박비와 교통비는 본인이 부담합니다.',
  },
  {
    code: 'en',
    label: 'English',
    text: 'The training programme is delivered in line with the occupational standards that apply to digital '
      + 'technology roles. It is open to the technical specialists who work for companies, universities and '
      + 'industry associations in the city, provided that they meet the published conditions. The course runs '
      + 'for seven days and the fee is 2,800 yuan per person, which does not include travel or accommodation.',
  },
  {
    code: 'es',
    label: 'Español',
    text: 'La formación se imparte de acuerdo con las normas profesionales que se aplican a los puestos de '
      + 'tecnología digital. Está abierta a los especialistas técnicos que trabajan para las empresas, las '
      + 'universidades y las asociaciones del sector en la ciudad, siempre que cumplan con las condiciones '
      + 'publicadas. El curso dura siete días y el precio es de 2.800 yuanes por persona, pero no incluye '
      + 'los gastos de viaje ni de alojamiento para los participantes.',
  },
  {
    code: 'ru',
    label: 'Русский',
    text: 'Обучение проводится в соответствии с профессиональными стандартами, которые применяются к '
      + 'специалистам в области цифровых технологий. Участвовать могут технические специалисты предприятий, '
      + 'университетов и отраслевых ассоциаций города, если они отвечают опубликованным требованиям.',
  },
];

for (const { code, label, text } of cases) {
  const got = detectLanguage(text);
  assert.equal(got, code, `${label}: expected ${code}, got ${got}`);
}

// 用户显式选了语言 → 永远以用户为准，哪怕和原文完全不符
assert.equal(resolveLanguage('en', cases[0].text), 'en');
assert.equal(resolveLanguage('ja', cases[4].text), 'ja');
assert.equal(resolveLanguage('auto', cases[0].text), 'zh-CN');

// 深度研究的提问可能很短，但字符集本身就够判：十来个字不能退回英文
assert.equal(detectLanguage('人工智能芯片的发展趋势'), 'zh-CN');
assert.equal(detectLanguage('生成AI市場の動向について'), 'ja');
assert.equal(detectLanguage('What is the outlook for AI chips'), 'en');

// 证据不足时回退英文，而不是拿几个字符硬猜
assert.equal(detectLanguage(''), 'en');
assert.equal(detectLanguage('OK'), 'en');
assert.equal(detectLanguage('2026-08-10 / v1.2.0 / SKU-4471 / 98.6%'), 'en');

// 英文正文里夹一句中文引用，不该把整张图翻成中文
const mostlyEnglish = `${cases[4].text} One participant wrote 培训很有帮助 in the feedback form.`;
assert.equal(detectLanguage(mostlyEnglish), 'en');

console.log('✓ language detection: script, stopword and fallback cases passed');
