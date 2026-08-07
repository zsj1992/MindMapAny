'use client';

import { useRef, useState, type DragEvent, type ReactNode } from 'react';
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
    label: '粘贴文本',
    icon: icon(<path strokeLinecap="round" d="M5 6h14M5 11h14M5 16h9" />),
  },
  {
    id: 'url',
    label: '网页 / YouTube',
    icon: icon(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 010 18a15 15 0 010-18z" />
      </>,
    ),
  },
  {
    id: 'pdf',
    label: 'PDF',
    icon: icon(
      <>
        <path strokeLinejoin="round" d="M14 3v5h5" />
        <path strokeLinejoin="round" d="M19 8v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5z" />
      </>,
    ),
  },
] as const;
type Tab = (typeof TABS)[number]['id'];

const DEPTH_LABEL: Record<Depth, string> = { concise: '简洁', standard: '标准', detailed: '详细' };
const PURPOSE_LABEL: Record<Purpose, string> = {
  study: '学习总结',
  structure: '文章结构',
  meeting: '会议整理',
  general: '通用',
};
const LANGUAGES = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'es', label: 'Español' },
];

/** 来源页只放一种输入，快速开始页保留三个 tab */
export type InputMode = 'all' | 'text' | 'pdf' | 'web' | 'youtube';

const MODE_TAB: Record<Exclude<InputMode, 'all'>, Tab> = {
  text: 'text',
  pdf: 'pdf',
  web: 'url',
  youtube: 'url',
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
}: {
  onGenerate: (params: GenerateParams) => void;
  busy: boolean;
  error?: string | null;
  mode?: InputMode;
  copy?: InputPanelCopy;
}) {
  const [tab, setTab] = useState<Tab>(mode === 'all' ? 'text' : MODE_TAB[mode]);
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [language, setLanguage] = useState('zh-CN');
  const [depth, setDepth] = useState<Depth>('standard');
  const [purpose, setPurpose] = useState<Purpose>('general');
  const fileRef = useRef<HTMLInputElement>(null);

  // PDF 示例是链接，当前版本不能直接当文件用，先不在 PDF 页展示
  const examples = mode === 'pdf' ? [] : (copy?.examples ?? []);

  const ready = tab === 'text' ? text.trim().length > 20 : tab === 'url' ? /^https?:\/\//.test(url.trim()) : !!file;

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
    if (dropped?.type === 'application/pdf') {
      setFile(dropped);
      setTab('pdf');
    }
  };

  return (
    <div
      className="card mx-auto w-full max-w-2xl p-2 shadow-xl shadow-brand-900/[0.06] dark:shadow-black/30"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      {mode === 'all' && (
      <div className="rounded-xl bg-bg-muted p-1">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                tab === t.id
                  ? 'bg-surface font-medium text-text shadow-sm'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      )}

      <div className="p-3 sm:p-4">
        {tab === 'text' && (
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="粘贴文章、笔记或任意长文本…"
              rows={8}
              className="field resize-none leading-relaxed"
            />
            <span className="pointer-events-none absolute bottom-3 right-3 text-xs tabular-nums text-text-subtle">
              {text.length > 0 && `${text.length} 字`}
            </span>
          </div>
        )}

        {tab === 'url' && (
          <div>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder={
                mode === 'youtube'
                  ? '粘贴 YouTube 视频链接…'
                  : mode === 'web'
                    ? '粘贴网页文章链接…'
                    : 'https://example.com/article 或 YouTube 链接'
              }
              className="field"
            />
            <p className="mt-2 text-xs text-text-subtle">
              {copy?.hint ?? '暂不支持需要登录的页面、纯 JS 渲染的页面，以及没有字幕的视频'}
            </p>
          </div>
        )}

        {tab === 'pdf' && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={`flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-sm transition-colors ${
              dragging ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20' : 'text-text-muted'
            }`}
            style={dragging ? undefined : { borderColor: 'var(--border-strong)' }}
          >
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-text-subtle">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4" />
              <path strokeLinecap="round" d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
            {file ? (
              <>
                <span className="font-medium text-text">{file.name}</span>
                <span className="text-xs text-text-subtle">
                  {(file.size / 1024 / 1024).toFixed(1)} MB · 点击更换
                </span>
              </>
            ) : (
              <>
                <span>拖入 PDF，或点击选择文件</span>
                <span className="text-xs text-text-subtle">{copy?.hint ?? '最大 20MB / 200 页，暂不支持扫描件'}</span>
              </>
            )}
          </button>
        )}

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select label="输出语言" value={language} onChange={setLanguage} options={LANGUAGES} />
          <Select
            label="深度"
            value={depth}
            onChange={(v) => setDepth(v as Depth)}
            options={DEPTHS.map((d) => ({ value: d, label: DEPTH_LABEL[d] }))}
          />
          <Select
            label="用途"
            value={purpose}
            onChange={(v) => setPurpose(v as Purpose)}
            options={PURPOSES.map((p) => ({ value: p, label: PURPOSE_LABEL[p] }))}
          />
        </div>

        {error && (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4 w-4 shrink-0">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M12 8v5m0 3h.01" />
            </svg>
            {error}
          </p>
        )}

        <button type="button" onClick={submit} disabled={!ready || busy} className="btn btn-primary mt-4 h-12 w-full text-[15px]">
          {busy ? (
            <>
              <Spinner />
              生成中…
            </>
          ) : (
            '生成脑图'
          )}
        </button>

        {!busy && !text && !url && !file && examples.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs text-text-subtle">试试这些示例</p>
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
                  className="flex items-center gap-2 rounded-xl border bg-bg-subtle px-3 py-2.5 text-left text-xs text-text-muted transition-colors hover:border-brand-300 hover:text-text"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <span className="truncate">{ex.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
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
    <label className="block">
      <span className="mb-1.5 block text-xs text-text-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="field cursor-pointer py-2.5">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
