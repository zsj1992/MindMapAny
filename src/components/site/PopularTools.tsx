import { TrackedLink } from '@/components/analytics/TrackedLink';
import type { Locale } from '@/lib/i18n/locales';
import { localizedPath } from '@/lib/i18n/routes';

type PopularToolsCopy = {
  heading: string;
  lede: string;
  recommended: string;
  pdfDescription: string;
  pdfAction: string;
  textDescription: string;
  textAction: string;
};

const COPY: Record<Locale, PopularToolsCopy> = {
  en: {
    heading: 'Popular tools',
    lede: 'Start with two focused ways to turn source material into a clear, editable mind map.',
    recommended: 'Recommended',
    pdfDescription: 'Upload a PDF and keep source page numbers attached to the ideas in your map.',
    pdfAction: 'Try PDF to mind map',
    textDescription: 'Paste notes, an outline or a long passage and shape it into an editable hierarchy.',
    textAction: 'Try text to mind map',
  },
  'zh-CN': {
    heading: '热门工具',
    lede: '从两种常用方式开始，把原始内容整理成清晰、可编辑的思维导图。',
    recommended: '推荐',
    pdfDescription: '上传 PDF，并在思维导图节点中保留对应的原文页码。',
    pdfAction: '试用 PDF 转思维导图',
    textDescription: '粘贴笔记、大纲或长文本，将内容整理成可编辑的层级结构。',
    textAction: '试用文本转思维导图',
  },
  ja: {
    heading: '人気のツール',
    lede: 'よく使われる2つの方法から、資料を明確で編集可能なマインドマップに変換できます。',
    recommended: 'おすすめ',
    pdfDescription: 'PDFをアップロードし、各アイデアに元のページ番号を残したまま整理します。',
    pdfAction: 'PDFからマインドマップを作成',
    textDescription: 'メモ、アウトライン、長文を貼り付けて、編集可能な階層に整理します。',
    textAction: 'テキストからマインドマップを作成',
  },
  ko: {
    heading: '인기 도구',
    lede: '자주 쓰는 두 가지 방식으로 원본 자료를 명확하고 편집 가능한 마인드맵으로 바꿔 보세요.',
    recommended: '추천',
    pdfDescription: 'PDF를 업로드하고 각 아이디어에 원본 페이지 번호를 유지하세요.',
    pdfAction: 'PDF를 마인드맵으로 변환',
    textDescription: '메모, 개요 또는 긴 글을 붙여 넣어 편집 가능한 계층으로 정리하세요.',
    textAction: '텍스트를 마인드맵으로 변환',
  },
  es: {
    heading: 'Herramientas populares',
    lede: 'Empieza con dos formas directas de convertir tus fuentes en mapas mentales claros y editables.',
    recommended: 'Recomendado',
    pdfDescription: 'Sube un PDF y conserva los números de página de origen junto a cada idea.',
    pdfAction: 'Probar PDF a mapa mental',
    textDescription: 'Pega notas, un esquema o un texto largo y conviértelo en una jerarquía editable.',
    textAction: 'Probar texto a mapa mental',
  },
  de: {
    heading: 'Beliebte Werkzeuge',
    lede: 'Starte mit zwei direkten Wegen zu einer klaren, bearbeitbaren Mindmap.',
    recommended: 'Empfohlen',
    pdfDescription: 'Lade ein PDF hoch und behalte die ursprünglichen Seitenzahlen bei jeder Idee.',
    pdfAction: 'PDF in Mindmap umwandeln',
    textDescription: 'Füge Notizen, eine Gliederung oder längeren Text ein und erstelle eine bearbeitbare Hierarchie.',
    textAction: 'Text in Mindmap umwandeln',
  },
  fr: {
    heading: 'Outils populaires',
    lede: 'Commencez par deux méthodes directes pour créer une carte mentale claire et modifiable.',
    recommended: 'Recommandé',
    pdfDescription: "Importez un PDF et conservez les numéros de page d'origine avec chaque idée.",
    pdfAction: 'Transformer un PDF en carte mentale',
    textDescription: 'Collez des notes, un plan ou un texte long pour obtenir une hiérarchie modifiable.',
    textAction: 'Transformer un texte en carte mentale',
  },
};

const TOOLS = [
  {
    slug: 'pdf-to-mind-map',
    marker: 'PDF',
    title: 'PDF to Mind Map',
    descriptionKey: 'pdfDescription' as const,
    actionKey: 'pdfAction' as const,
    className: 'bg-[linear-gradient(135deg,var(--surface),color-mix(in_srgb,var(--color-brand-50)_72%,var(--surface)))] dark:bg-[linear-gradient(135deg,var(--surface),color-mix(in_srgb,var(--color-brand-900)_28%,var(--surface)))]',
  },
  {
    slug: 'text-to-mind-map',
    marker: 'Aa',
    title: 'Text to Mind Map',
    descriptionKey: 'textDescription' as const,
    actionKey: 'textAction' as const,
    className: 'bg-[linear-gradient(135deg,var(--surface),color-mix(in_srgb,var(--color-accent-400)_10%,var(--surface)))]',
  },
] as const;

export function PopularTools({ locale, placement }: { locale: Locale; placement: 'home' | 'tools-index' }) {
  const copy = COPY[locale];

  return (
    <section className="border-b px-5 py-12 sm:py-14 lg:px-8" style={{ borderColor: 'var(--border)' }} aria-labelledby={`popular-tools-${placement}`}>
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <h2 id={`popular-tools-${placement}`} className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            {copy.heading}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-text-muted sm:text-base">{copy.lede}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
          {TOOLS.map((tool) => (
            <article
              key={tool.slug}
              className={`group relative overflow-hidden rounded-2xl border border-border-base p-6 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand-300 sm:p-7 ${tool.className}`}
            >
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border bg-surface font-mono text-sm font-bold tracking-[-0.04em] text-brand-700 shadow-sm dark:text-brand-300" style={{ borderColor: 'var(--border-strong)' }}>
                  {tool.marker}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-accent-600 dark:text-accent-400">{copy.recommended}</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                    <TrackedLink
                      href={localizedPath(`/tools/${tool.slug}`, locale)}
                      eventName="popular_tool_clicked"
                      eventParameters={{ page: placement, placement: 'popular-tools', tool: tool.slug, locale }}
                      className="after:absolute after:inset-0 focus-visible:rounded-md"
                    >
                      {tool.title}
                    </TrackedLink>
                  </h3>
                  <p className="mt-3 max-w-[48ch] text-sm leading-6 text-text-muted">{copy[tool.descriptionKey]}</p>
                  <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-colors group-hover:text-brand-700 dark:text-brand-300">
                    {copy[tool.actionKey]} <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
