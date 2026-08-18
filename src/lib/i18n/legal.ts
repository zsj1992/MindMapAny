import type { Locale } from './locales';

/**
 * 法务页文案：服务条款、隐私政策、退款与取消政策。
 *
 * 每个非英文版本都必须带 prevails 声明。理由不是形式主义：
 * 一旦出现争议，「用户看的是哪个版本」会直接决定条款怎么解释。
 * 声明写明以英文版为准，译本才只承担可读性的职责，而不是各自成为一份独立合同。
 *
 * 译文缺失时整页回退英文（见 routes.ts 的 TRANSLATED），
 * 绝不允许出现半中半英的法务页 —— 那比全英文更糟。
 */

/**
 * 正文里的内链写成 [文字](/路径)，渲染时按当前语言解析成对应的本地化路径。
 *
 * 不这么做就只能把链接删掉变成纯文本 —— 条款里「见隐私政策」「见退款政策」
 * 这些交叉引用是有实际作用的，读者要能点过去，搜索引擎也靠它们理解页面关系。
 */
export interface LegalSection {
  heading: string;
  /** 段落。数组里每一项渲染成一个 <p> */
  body?: string[];
  /** 项目符号列表，可与 body 同时出现 */
  bullets?: { label?: string; text: string }[];
}

export interface LegalDoc {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
}

export interface LegalCopy {
  /** 非英文版本顶部的效力声明。英文版为 null。 */
  prevails: string | null;
  updated: string;
  terms: LegalDoc;
  privacy: LegalDoc;
  refund: LegalDoc;
}

const en: LegalCopy = {
  prevails: null,
  updated: 'August 18, 2026',
  terms: {
    metaTitle: 'Terms of Service',
    metaDescription: 'The terms that govern your use of MindMapAny, covering accounts, content, AI output, subscriptions and liability.',
    eyebrow: 'Rules of use',
    title: 'Terms of Service',
    description: 'These terms explain how you may use MindMapAny, and what each side is responsible for when it comes to content, subscriptions and the service itself.',
    sections: [
      {
        heading: '1. Acceptance of these terms',
        body: ['By accessing or using MindMapAny you agree to these terms and to our [Privacy Policy](/privacy). If you are using the service on behalf of an organisation, you confirm that you are authorised to accept these terms for that organisation.'],
      },
      {
        heading: '2. What the service does',
        body: ['MindMapAny turns text, documents and web content into editable mind maps. Available features, allowances and support scope are those listed on the current [pricing page](/pricing). We may continue to improve or adjust features, but we will not retroactively charge you for anything you have not clearly agreed to.'],
      },
      {
        heading: '3. Accounts and security',
        body: ['You agree to provide accurate account information, keep your credentials secure, and take responsibility for activity in your account. Contact support immediately if you notice unauthorised access. You may not share an account in order to work around plan limits.'],
      },
      {
        heading: '4. Your content',
        body: ['You retain your rights in the content you submit and the mind maps you generate. You grant us a limited licence to host, process, display and transmit that content solely in order to provide, maintain and protect the service. You confirm that you have the right to process the content you submit, and you are responsible for your public sharing settings and their consequences.'],
      },
      {
        heading: '5. AI output',
        body: ['AI-generated results may be incomplete, inaccurate or misinterpreted, and do not constitute legal, medical, financial or other professional advice. Verify important information against the original source before relying on it, publishing it or making decisions based on it.'],
      },
      {
        heading: '6. Acceptable use',
        body: ['You may not use the service to infringe the rights of others, distribute malware, circumvent security measures, commit fraud or harassment, generate unlawful content, gain unauthorised automated access to our systems, or place abnormal load on the service in a way that affects other users. Where these rules are broken we may restrict or terminate the account concerned, and cooperate with the competent authorities where the law requires it.'],
      },
      {
        heading: '7. Subscriptions and payment',
        body: ['Paid plans are prepaid monthly or annually and renew automatically until cancelled. The checkout page shows the currency, taxes, billing period and total due before you pay. Waffo acts as Merchant of Record and handles payment, billing and applicable taxes. You can cancel at any time from [subscription management](/billing); unless stated otherwise, access continues until the end of the period you have paid for.'],
      },
      {
        heading: '8. Refunds',
        body: ['Refund eligibility, request windows and processing are set out in our [Refund & Cancellation Policy](/refund-policy). That policy does not limit mandatory consumer rights granted by applicable law.'],
      },
      {
        heading: '9. Availability and limitation of liability',
        body: ['We work to keep the service stable, but we do not guarantee uninterrupted or error-free operation. To the maximum extent permitted by law the service is provided "as is" and "as available", and we are not liable for indirect, incidental or consequential losses. Our total aggregate liability for all claims arising from the service will not exceed the amount you paid for the service in the 12 months before the claim arose.'],
      },
      {
        heading: '10. Termination and changes',
        body: ['You may stop using the service at any time. We may suspend or terminate access in cases of serious violation, security risk or legal requirement. Where these terms change materially we will give reasonable advance notice; continuing to use the service means you accept the updated terms.'],
      },
      {
        heading: '11. Contact',
        body: ['For questions about these terms, your account or the service, email support@mindmapany.com. We usually reply within 3 business days.'],
      },
    ],
  },
  privacy: {
    metaTitle: 'Privacy Policy',
    metaDescription: 'What MindMapAny collects, why, who it is shared with, how long it is kept and the rights you have over it.',
    eyebrow: 'Legal & privacy',
    title: 'Privacy Policy',
    description: 'We collect only what the mind mapping service needs, and we try to keep the purpose of that data clear, limited and under your control.',
    sections: [
      {
        heading: '1. Scope',
        body: ['This policy covers the MindMapAny website, workbench and related services. Using the service means you have read this policy; if you do not agree with it, please stop using the service.'],
      },
      {
        heading: '2. Information we collect',
        bullets: [
          { label: 'Account information:', text: 'login email, display name, avatar, and the identifiers needed for authentication.' },
          { label: 'Content you submit:', text: 'text, documents or web links, along with the mind maps generated, edited and saved from them.' },
          { label: 'Usage and device information:', text: 'IP address, browser type, access times, error logs, feature usage and necessary security records.' },
          { label: 'Transaction information:', text: 'plan, order and subscription status. Full payment card details are handled by our payment provider Waffo; we never store full card numbers.' },
        ],
      },
      {
        heading: '3. How we use information',
        body: ['We use this information to provide and improve the service, generate and store mind maps, maintain accounts and credit balances, process subscriptions, prevent fraud and abuse, respond to support requests, and meet our legal obligations. We do not sell your personal information without your explicit consent.'],
      },
      {
        heading: '4. AI and third-party services',
        body: ['To extract, structure and generate content we may send the portions of your content required for the task to trusted AI model, cloud infrastructure, authentication, analytics and payment providers. We require those providers to process the data only for the agreed purpose. Please do not submit passwords, payment card numbers, medical records or other highly sensitive information that the service does not need.'],
      },
      {
        heading: '5. Cookies and local storage',
        body: ['We use essential cookies and local storage to keep you signed in, remember your theme preference, and maintain security and abuse prevention. If we ever use non-essential analytics or advertising cookies, we will provide the corresponding notice and choices in regions where applicable law requires them.'],
      },
      {
        heading: '6. Retention and security',
        body: ['We keep information only as long as needed to provide the service, resolve disputes and meet legal obligations. When you delete content or your account, the related data is deleted or anonymised in our live systems; residual copies may persist for a limited time due to backup rotation, security investigations and statutory retention requirements. We apply reasonable access controls, encrypted transport and monitoring, but no online service can promise absolute security.'],
      },
      {
        heading: '7. Your rights',
        body: ['You may request access to, correction of, export of or deletion of your personal information, and you may object to or restrict certain processing. We handle requests according to your location and applicable law. Please send requests from your account email so we can verify your identity.'],
      },
      {
        heading: "8. Children's privacy",
        body: ['The service is not directed at children under 13 and we do not knowingly collect their personal information. Minors should use the service with the consent and guidance of a parent or guardian.'],
      },
      {
        heading: '9. Policy updates and contact',
        body: ['We will explain material changes through the website or an account notice. For privacy questions or data rights requests, contact support@mindmapany.com. We usually reply within 3 business days.'],
      },
    ],
  },
  refund: {
    metaTitle: 'Refund & Cancellation Policy',
    metaDescription: 'How to cancel a MindMapAny subscription, who qualifies for a refund, how to request one, and how long it takes.',
    eyebrow: 'Billing protection',
    title: 'Refund & Cancellation Policy',
    description: 'We want billing to be clear, cancellation to be easy, and duplicate charges or service problems to be resolved quickly.',
    sections: [
      {
        heading: '1. Cancel any time',
        body: ['You can cancel your subscription at any time from the [subscription management page](/billing) — sign in and cancel in one click. Cancellation takes effect at the end of the billing period you have already paid for. You keep access to your plan until then, and you will not be charged again.'],
      },
      {
        heading: '2. Refund windows',
        bullets: [
          { label: 'First purchase:', text: 'you may request a refund within 14 days of your first payment.' },
          { label: 'Renewals:', text: 'you may request a refund within 7 days of a renewal charge.' },
          { label: 'Duplicate or incorrect charges:', text: 'refunded in full once verified, with no time limit.' },
        ],
        body: ['To the extent permitted by law, we may decline or pro-rate a refund where an account has consumed a large amount of service, shows signs of abuse, or where the request covers substantial compute already spent. Your mandatory statutory consumer rights are not affected.'],
      },
      {
        heading: '3. How to request a refund',
        body: ['Email support@mindmapany.com from the address you used at purchase, including your order number, purchase email, the reason for the request, and which transaction you would like refunded. Your current plan and status are always visible on the [subscription management page](/billing).'],
      },
      {
        heading: '4. Processing times',
        body: ['We usually reply within 3 business days. Approved refunds are processed by Waffo back to your original payment method and typically appear within 5–10 business days, depending on your bank, region and payment method.'],
      },
      {
        heading: '5. Plan changes',
        body: ['Upgrade, downgrade and pro-rated amounts are shown before you confirm. If the portal does not support a change you need, contact us and we will handle it.'],
      },
      {
        heading: '6. Payment processor',
        body: ['Waffo acts as Merchant of Record and is responsible for payment processing, billing records and applicable taxes. MindMapAny is responsible for delivering the product, account support, and the initial handling of refund requests.'],
      },
    ],
  },
};


const zhCN: LegalCopy = {
  prevails:
    '本页面为英文原版的中文译本，仅供阅读方便。如中英文表述存在任何差异，以英文版本为准。',
  updated: '2026 年 8 月 18 日',
  terms: {
    metaTitle: '服务条款',
    metaDescription: '管辖你使用 MindMapAny 的条款，涵盖账号、内容、AI 输出、订阅与责任限制。',
    eyebrow: '使用规则',
    title: '服务条款',
    description: '本条款说明你可以如何使用 MindMapAny，以及在内容、订阅和服务本身上双方各自承担什么责任。',
    sections: [
      {
        heading: '1. 条款的接受',
        body: ['访问或使用 MindMapAny，即表示你同意本条款以及我们的[隐私政策](/privacy)。如果你代表某个组织使用本服务，即表示你确认自己有权代表该组织接受本条款。'],
      },
      {
        heading: '2. 服务内容',
        body: ['MindMapAny 把文本、文档和网页内容转换成可编辑的思维导图。可用功能、额度和支持范围以当前[价格页](/pricing)所列为准。我们可能持续改进或调整功能，但不会就你未明确同意的事项追溯收费。'],
      },
      {
        heading: '3. 账号与安全',
        body: ['你同意提供准确的账号信息、妥善保管登录凭据，并对账号内发生的活动负责。如发现未经授权的访问，请立即联系客服。你不得通过共享账号来规避套餐限制。'],
      },
      {
        heading: '4. 你的内容',
        body: ['你保留对所提交内容以及所生成脑图的各项权利。你授予我们一项有限许可，仅为提供、维护和保护本服务之目的托管、处理、展示和传输该等内容。你确认自己有权处理所提交的内容，并对你的公开分享设置及其后果负责。'],
      },
      {
        heading: '5. AI 输出',
        body: ['AI 生成的结果可能不完整、不准确或存在误读，且不构成法律、医疗、财务或其他专业建议。在依赖、发布或据以作出决策之前，请对照原始来源核实重要信息。'],
      },
      {
        heading: '6. 可接受使用',
        body: ['你不得利用本服务侵犯他人权利、传播恶意软件、规避安全措施、实施欺诈或骚扰、生成违法内容、以未经授权的自动化方式访问我们的系统，或以影响其他用户的方式对服务造成异常负载。违反上述规则的，我们可能限制或终止相关账号，并在法律要求时配合主管机关。'],
      },
      {
        heading: '7. 订阅与付款',
        body: ['付费套餐按月或按年预付，并在取消前自动续费。结账页面会在付款前显示币种、税费、计费周期和应付总额。Waffo 作为登记商户（Merchant of Record）处理付款、账单和适用税费。你可以随时在[订阅管理](/billing)中取消；除非另有说明，你的访问权限将持续到已付费周期结束。'],
      },
      {
        heading: '8. 退款',
        body: ['退款资格、申请时限和处理流程载于我们的[退款与取消政策](/refund-policy)。该政策不限制适用法律赋予你的强制性消费者权利。'],
      },
      {
        heading: '9. 可用性与责任限制',
        body: ['我们努力保持服务稳定，但不保证服务不中断或无差错。在法律允许的最大范围内，本服务按「现状」和「现有」提供，我们不对间接、附带或后果性损失承担责任。就因本服务引起的全部主张，我们的累计责任总额不超过你在主张发生前 12 个月内为本服务支付的金额。'],
      },
      {
        heading: '10. 终止与变更',
        body: ['你可以随时停止使用本服务。在发生严重违规、安全风险或法律要求的情况下，我们可能暂停或终止你的访问权限。本条款发生重大变更时，我们会提前合理通知；继续使用本服务即表示你接受更新后的条款。'],
      },
      {
        heading: '11. 联系我们',
        body: ['关于本条款、你的账号或本服务的问题，请发送邮件至 support@mindmapany.com。我们通常在 3 个工作日内回复。'],
      },
    ],
  },
  privacy: {
    metaTitle: '隐私政策',
    metaDescription: 'MindMapAny 收集哪些信息、为什么收集、与谁共享、保留多久，以及你对这些信息享有的权利。',
    eyebrow: '法律与隐私',
    title: '隐私政策',
    description: '我们只收集脑图服务所必需的信息，并努力让这些数据的用途保持清晰、有限，且在你的掌控之中。',
    sections: [
      {
        heading: '1. 适用范围',
        body: ['本政策适用于 MindMapAny 网站、工作台及相关服务。使用本服务即表示你已阅读本政策；如果你不同意本政策，请停止使用本服务。'],
      },
      {
        heading: '2. 我们收集的信息',
        bullets: [
          { label: '账号信息：', text: '登录邮箱、显示名称、头像，以及身份验证所需的标识符。' },
          { label: '你提交的内容：', text: '文本、文档或网页链接，以及由此生成、编辑和保存的脑图。' },
          { label: '使用与设备信息：', text: 'IP 地址、浏览器类型、访问时间、错误日志、功能使用情况和必要的安全记录。' },
          { label: '交易信息：', text: '套餐、订单和订阅状态。完整的支付卡信息由支付服务商 Waffo 处理，我们从不存储完整卡号。' },
        ],
      },
      {
        heading: '3. 信息的使用方式',
        body: ['我们使用这些信息来提供和改进服务、生成与存储脑图、维护账号与积分余额、处理订阅、防范欺诈与滥用、响应支持请求，以及履行法定义务。未经你的明确同意，我们不会出售你的个人信息。'],
      },
      {
        heading: '4. AI 与第三方服务',
        body: ['为了提取、结构化和生成内容，我们可能将完成任务所需的内容片段发送给受信任的 AI 模型、云基础设施、身份验证、分析和支付服务商。我们要求这些服务商仅为约定目的处理数据。请不要提交密码、支付卡号、医疗记录或其他本服务并不需要的高度敏感信息。'],
      },
      {
        heading: '5. Cookie 与本地存储',
        body: ['我们使用必要的 Cookie 和本地存储来保持登录状态、记住主题偏好，并维持安全与防滥用能力。如果我们将来使用非必要的分析或广告类 Cookie，我们会在适用法律要求的地区提供相应告知与选择。'],
      },
      {
        heading: '6. 保留与安全',
        body: ['我们仅在提供服务、解决争议和履行法定义务所需的期间内保留信息。当你删除内容或账号时，相关数据会在我们的在线系统中被删除或匿名化；由于备份轮换、安全调查和法定留存要求，残留副本可能在有限时间内继续存在。我们采取合理的访问控制、加密传输和监控措施，但任何在线服务都无法承诺绝对安全。'],
      },
      {
        heading: '7. 你的权利',
        body: ['你可以要求访问、更正、导出或删除你的个人信息，也可以反对或限制某些处理活动。我们会根据你所在地区和适用法律处理相关请求。请使用你的账号邮箱发送请求，以便我们核实身份。'],
      },
      {
        heading: '8. 儿童隐私',
        body: ['本服务并非面向 13 岁以下儿童，我们不会在知情的情况下收集他们的个人信息。未成年人应在父母或监护人的同意和指导下使用本服务。'],
      },
      {
        heading: '9. 政策更新与联系方式',
        body: ['发生重大变更时，我们会通过网站或账号通知加以说明。关于隐私问题或数据权利请求，请联系 support@mindmapany.com。我们通常在 3 个工作日内回复。'],
      },
    ],
  },
  refund: {
    metaTitle: '退款与取消政策',
    metaDescription: '如何取消 MindMapAny 订阅、哪些情形可以退款、如何申请，以及需要多长时间。',
    eyebrow: '账单保障',
    title: '退款与取消政策',
    description: '我们希望账单清晰、取消便捷，重复扣款或服务问题能够快速解决。',
    sections: [
      {
        heading: '1. 随时可以取消',
        body: ['你可以随时在[订阅管理页面](/billing)登录后一键取消订阅。取消将在你已付费的计费周期结束时生效。在此之前你仍可使用所购套餐，并且不会再次被扣款。'],
      },
      {
        heading: '2. 退款时限',
        bullets: [
          { label: '首次购买：', text: '你可以在首次付款后 14 天内申请退款。' },
          { label: '续费：', text: '你可以在续费扣款后 7 天内申请退款。' },
          { label: '重复或错误扣款：', text: '经核实后全额退还，不设时间限制。' },
        ],
        body: ['在法律允许的范围内，如果某个账号已消耗大量服务、存在滥用迹象，或者申请所涉及的算力已被大量占用，我们可能拒绝退款或按比例退款。你依法享有的强制性消费者权利不受影响。'],
      },
      {
        heading: '3. 如何申请退款',
        body: ['请使用购买时的邮箱发送邮件至 support@mindmapany.com，并注明订单号、购买邮箱、申请原因，以及希望退款的具体交易。你的当前套餐和订阅状态始终可以在[订阅管理页面](/billing)查看。'],
      },
      {
        heading: '4. 处理时长',
        body: ['我们通常在 3 个工作日内回复。获批的退款由 Waffo 原路退回你的付款方式，通常在 5 至 10 个工作日内到账，具体取决于你的银行、所在地区和支付方式。'],
      },
      {
        heading: '5. 套餐变更',
        body: ['升级、降级和按比例折算的金额会在你确认之前显示。如果门户不支持你需要的变更方式，请联系我们，我们会为你处理。'],
      },
      {
        heading: '6. 支付服务商',
        body: ['Waffo 作为登记商户（Merchant of Record），负责支付处理、账单记录和适用税费。MindMapAny 负责交付产品、账号支持，以及退款申请的初步处理。'],
      },
    ],
  },
};

const LEGAL: Partial<Record<Locale, LegalCopy>> = { en, 'zh-CN': zhCN };

/** 只有译文齐全的语言才会出现在这里；其余语言整页回退英文 */
export function legalCopy(locale: Locale): LegalCopy {
  return LEGAL[locale] ?? en;
}

export function hasLegalTranslation(locale: Locale): boolean {
  return locale === 'en' || locale in LEGAL;
}

export { en as LEGAL_EN, LEGAL };
