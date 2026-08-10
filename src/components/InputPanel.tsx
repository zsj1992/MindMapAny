'use client';

import { useRef, useState, type DragEvent, type ReactNode } from 'react';
import { estimateCredits, type Plan } from '@/lib/credits';
import type { InputKind } from '@/lib/extract/types';
import { detectLanguage } from '@/lib/mindmap/detect-language';
import { languageName } from '@/lib/mindmap/prompt';
import { DEPTHS, PURPOSES, type Depth, type Purpose } from '@/lib/mindmap/schema';

export interface GenerateParams {
  text?: string;
  url?: string;
  file?: File;
  language: string;
  depth: Depth;
  purpose: Purpose;
  tier: 'fast' | 'quality';
}

const icon = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
    {path}
  </svg>
);

const TABS = [
  {
    id: 'text',
    label: 'Paste text',
    icon: icon(<path strokeLinecap="round" d="M5 6h14M5 11h14M5 16h9" />),
  },
  {
    id: 'url',
    label: 'Web link',
    icon: icon(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 010 18a15 15 0 010-18z" />
      </>,
    ),
  },
  {
    id: 'pdf',
    label: 'Upload file',
    icon: icon(
      <>
        <path strokeLinejoin="round" d="M14 3v5h5" />
        <path strokeLinejoin="round" d="M19 8v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5z" />
      </>,
    ),
  },
] as const;
type Tab = (typeof TABS)[number]['id'];

const DEPTH_LABEL: Record<Depth, string> = { concise: 'Concise', standard: 'Standard', detailed: 'Detailed' };
const PURPOSE_LABEL: Record<Purpose, string> = {
  study: 'Study notes',
  structure: 'Article structure',
  meeting: 'Meeting notes',
  general: 'General',
};
const LANGUAGES = [
  // 默认项。真正的判定在服务端做 —— 链接和文件的正文，浏览器这边根本看不到。
  { value: 'auto', label: 'Auto (match source)' },
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'es', label: 'Español' },
];

/** 来源页只放一种输入，快速开始页保留三个 tab */
export type InputMode = 'all' | 'text' | 'pdf' | 'docx' | 'epub' | 'pptx' | 'web';

const MODE_TAB: Record<Exclude<InputMode, 'all'>, Tab> = {
  text: 'text',
  pdf: 'pdf',
  docx: 'pdf',
  epub: 'pdf',
  pptx: 'pdf',
  web: 'url',
};

export interface InputPanelCopy {
  hint?: string;
  examples?: { label: string; value: string }[];
}

export function InputPanel({
  onGenerate,
  busy,
  error,
  mode = 'all',
  copy,
  plan = null,
}: {
  onGenerate: (params: GenerateParams) => void;
  busy: boolean;
  error?: string | null;
  mode?: InputMode;
  copy?: InputPanelCopy;
  plan?: Plan | null;
}) {
  const [tab, setTab] = useState<Tab>(mode === 'all' ? 'text' : MODE_TAB[mode]);
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [language, setLanguage] = useState('auto');
  const [depth, setDepth] = useState<Depth>('standard');
  const [purpose, setPurpose] = useState<Purpose>('general');
  const fileRef = useRef<HTMLInputElement>(null);

  // PDF 示例是链接，当前版本不能直接当文件用，先不在 PDF 页展示
  const examples = ['pdf', 'docx', 'epub', 'pptx'].includes(mode) ? [] : (copy?.examples ?? []);
  const fileAccept = mode === 'pdf'
    ? '.pdf,application/pdf'
    : mode === 'docx'
      ? '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : mode === 'epub'
        ? '.epub,application/epub+zip'
        : mode === 'pptx'
          ? '.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation'
          : '.pdf,.docx,.epub,.pptx,.txt,.md,.markdown,application/pdf,text/plain,text/markdown';

  const ready = tab === 'text' ? text.trim().length > 20 : tab === 'url' ? /^https?:\/\//.test(url.trim()) : !!file;

  /**
   * 生成前的费用预估。文本能精确算；链接和文件在提取完成前拿不到字数，
   * 只能按最小体量给下限，所以文案必须写成「起」而不是精确值。
   */
  const kind: InputKind = tab === 'text' ? 'text' : tab === 'url' ? 'web' : isPdfUpload(file, mode) ? 'pdf' : 'text';
  const knownChars = tab === 'text'
    ? text.split(/\n{2,}/).reduce((n, block) => n + block.trim().length, 0)
    : null;
  // plan 为 null 只可能出现在登录态刚失效的瞬间；/app 需要登录，正常路径拿得到套餐
  const freeRun = plan === 'unlimited';
  const cost = plan === null || freeRun ? 0 : estimateCredits({ kind, tier: 'fast', depth, chars: knownChars ?? 0 });
  const costLabel = freeRun
    ? 'Unlimited plan — no credits are used'
    : plan === null
      ? 'Sign in to generate'
      : knownChars !== null
      ? `Estimated cost: ${cost} ${cost === 1 ? 'credit' : 'credits'}`
      : `From ${cost} ${cost === 1 ? 'credit' : 'credits'}, depending on length`;

  /**
   * 粘贴文本时把判定结果显示在选项上（"Auto · 简体中文"），让用户在点生成之前
   * 就知道会输出什么语言，不合意可以直接改。链接和文件这边看不到正文，
   * 只能等服务端提取完再判，所以保持中性文案，不许诺具体语言。
   */
  const detected = tab === 'text' && text.trim().length > 20 ? detectLanguage(text) : null;
  const languageOptions = detected
    ? LANGUAGES.map((opt) =>
        opt.value === 'auto'
          ? { ...opt, label: `Auto · ${LANGUAGES.find((l) => l.value === detected)?.label ?? languageName(detected)}` }
          : opt,
      )
    : LANGUAGES;

  const submit = () => {
    if (!ready || busy) return;
    onGenerate({
      language,
      depth,
      purpose,
      tier: 'fast',
      ...(tab === 'text' ? { text } : {}),
      ...(tab === 'url' ? { url: url.trim() } : {}),
      ...(tab === 'pdf' && file ? { file } : {}),
    });
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && isAcceptedFile(dropped, mode)) {
      setFile(dropped);
      setTab('pdf');
    }
  };

  return (
    <section
      className="input-composer mx-auto w-full max-w-4xl shrink-0 overflow-hidden rounded-[1.6rem] border bg-surface"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      {mode === 'all' && (
      <div className="border-b px-3" style={{ borderColor: 'var(--border)' }}>
        <div className="flex gap-4 sm:gap-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative flex h-12 items-center justify-center gap-2 px-1 text-[13px] font-medium transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:transition-transform ${
                tab === t.id
                  ? 'font-semibold text-text after:scale-x-100 after:bg-brand-600'
                  : 'text-text-muted after:scale-x-0 hover:text-text'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      )}

      <div className="p-4 sm:p-5">
        {tab === 'text' && (
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste an article, your notes, or any long text…"
              className="field h-40 resize-none border-0 bg-bg-subtle p-4 text-sm leading-7 shadow-none sm:h-44"
            />
            <span className="pointer-events-none absolute bottom-3 right-3 text-xs tabular-nums text-text-subtle">
              {text.length > 0 && `${text.length} characters`}
            </span>
          </div>
        )}

        {tab === 'url' && (
          <div>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder={mode === 'web' ? 'Paste a link to a web article…' : 'https://example.com/article'}
              className="field h-14 border-0 bg-bg-subtle px-4 text-sm shadow-none"
            />
            <p className="mt-2 truncate px-1 text-[11px] text-text-subtle">
              {copy?.hint ?? 'Pages requiring a login, behind anti-bot protection, or rendered purely in JavaScript are not supported yet'}
            </p>
          </div>
        )}

        {tab === 'pdf' && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={`flex h-36 w-full flex-col items-center justify-center gap-2 rounded-[1rem] border border-dashed bg-bg-subtle text-[13px] transition-all duration-200 active:scale-[0.995] sm:h-40 ${
              dragging ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20' : 'text-text-muted'
            }`}
            style={dragging ? undefined : { borderColor: 'var(--border-strong)' }}
          >
            <input
              ref={fileRef}
              type="file"
              accept={fileAccept}
              hidden
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-text-subtle">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4" />
              <path strokeLinecap="round" d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
            {file ? (
              <>
                <span className="font-medium text-text">{file.name}</span>
                <span className="text-xs text-text-subtle">
                  {(file.size / 1024 / 1024).toFixed(1)} MB · click to replace
                </span>
              </>
            ) : (
              <>
                <span>Drop a file here, or click to choose</span>
                <span className="text-xs text-text-subtle">{copy?.hint ?? 'PDF, DOCX, EPUB, PPTX, TXT, Markdown · 20MB max'}</span>
              </>
            )}
          </button>
        )}

        {error && (
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4 w-4 shrink-0">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M12 8v5m0 3h.01" />
            </svg>
            {error}
          </p>
        )}

        {!busy && !text && !url && !file && examples.length > 0 && (
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] text-text-subtle">Try an example</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {examples.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={() => {
                    if (ex.value.startsWith('http')) {
                      setUrl(ex.value);
                      if (mode === 'all') setTab('url');
                    } else {
                      setText(ex.value);
                      if (mode === 'all') setTab('text');
                    }
                  }}
                  className="flex items-center gap-2 rounded-lg bg-bg-subtle px-3 py-2 text-left text-xs text-text-muted transition-colors hover:bg-bg-muted hover:text-text"
                >
                  <span className="truncate">{ex.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="grid gap-3 border-t bg-bg-subtle/70 px-4 py-3.5 sm:grid-cols-[repeat(3,minmax(0,1fr))_auto] sm:items-end sm:px-5" style={{ borderColor: 'var(--border)' }}>
        <Select label="Output language" value={language} onChange={setLanguage} options={languageOptions} />
        <Select
          label="Detail level"
          value={depth}
          onChange={(v) => setDepth(v as Depth)}
          options={DEPTHS.map((d) => ({ value: d, label: DEPTH_LABEL[d] }))}
        />
        <Select
          label="Organise for"
          value={purpose}
          onChange={(v) => setPurpose(v as Purpose)}
          options={PURPOSES.map((p) => ({ value: p, label: PURPOSE_LABEL[p] }))}
        />
        <div className="sm:text-right">
          <button type="button" onClick={submit} disabled={!ready || busy} className="btn btn-primary h-11 w-full px-6 text-sm sm:w-auto">
            {busy ? (
              <>
                <Spinner />
                Generating…
              </>
            ) : (
              <>
                Generate mind map
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>
          <p className="mt-1.5 text-[11px] leading-4 text-text-subtle sm:whitespace-nowrap">
            {costLabel}
            {!freeRun && <span className="hidden sm:inline"> · charged only if it succeeds</span>}
          </p>
        </div>
      </footer>
    </section>
  );
}

function isPdfUpload(file: File | null, mode: InputMode): boolean {
  if (mode === 'pdf') return true;
  if (!file) return false;
  return file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
}

function isAcceptedFile(file: File, mode: InputMode): boolean {
  const ext = file.name.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? '';
  const allowed = mode === 'pdf'
    ? ['pdf']
    : mode === 'docx'
      ? ['docx']
      : mode === 'epub'
        ? ['epub']
        : mode === 'pptx'
          ? ['pptx']
          : ['pdf', 'docx', 'epub', 'pptx', 'txt', 'md', 'markdown'];
  return allowed.includes(ext);
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-0.5 block text-[10px] font-medium text-text-subtle">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-7 w-full cursor-pointer bg-transparent pr-2 text-[13px] font-semibold text-text outline-none">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
