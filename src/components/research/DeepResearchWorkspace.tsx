'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { MindMap } from '@/lib/mindmap/schema';
import { Workspace } from '@/components/Workspace';
import { useEditor } from '@/store/editor';

interface Source {
  id: number;
  title: string;
  url: string;
  description: string;
}

interface ResearchResponse {
  report: string;
  sources: Source[];
  map: MindMap;
  creditsCharged: number;
}

const EXAMPLES = [
  'AI 搜索产品在 2026 年的主要商业模式与竞争格局是什么？',
  '远程办公如何影响团队生产力、协作和员工幸福感？',
  '系统性文献综述有哪些可靠的方法和常见偏差？',
  '全球数据中心用电增长的主要驱动因素和应对方案是什么？',
];

const LANGUAGES = [
  ['zh-CN', '简体中文'], ['zh-TW', '繁體中文'], ['en', 'English'], ['ja', '日本語'], ['ko', '한국어'], ['es', 'Español'],
] as const;

export function DeepResearchWorkspace() {
  const load = useEditor((state) => state.load);
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('zh-CN');
  const [depth, setDepth] = useState<'standard' | 'detailed'>('detailed');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [result, setResult] = useState<ResearchResponse | null>(null);
  const [view, setView] = useState<'report' | 'map'>('report');

  const submit = async () => {
    if (query.trim().length < 6 || busy) return;
    setBusy(true);
    setError(null);
    setErrorCode(null);
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), language, depth }),
      });
      const body = (await response.json()) as Partial<ResearchResponse> & { error?: { message?: string; code?: string } };
      if (!response.ok || !body.map || !body.report || !body.sources) {
        setError(body.error?.message ?? '深度研究失败，请重试');
        setErrorCode(body.error?.code ?? null);
        return;
      }
      const data = body as ResearchResponse;
      load(data.map);
      setResult(data);
      setView('report');
    } catch {
      setError('网络异常，请重试');
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex h-14 shrink-0 items-center gap-3 border-b bg-surface px-4 sm:px-5">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{result.map.title}</div>
            <div className="text-[10px] text-text-subtle">{result.sources.length} 个网页来源 · 消耗 {result.creditsCharged} 积分</div>
          </div>
          <div className="ml-auto flex rounded-lg bg-bg-subtle p-1">
            <ViewButton active={view === 'report'} onClick={() => setView('report')}>研究报告</ViewButton>
            <ViewButton active={view === 'map'} onClick={() => setView('map')}>思维导图</ViewButton>
          </div>
          <button type="button" className="btn btn-secondary h-9 px-3 text-xs" onClick={() => {
            setResult(null);
            setQuery('');
            useEditor.setState({ map: null, dirty: false, selectedId: null, editingId: null });
          }}>新研究</button>
        </div>
        <div className="min-h-0 flex-1">
          {view === 'map' ? <Workspace initialMap={result.map} /> : <ResearchReport report={result.report} sources={result.sources} />}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col justify-center overflow-y-auto px-4 py-5 sm:px-6 lg:overflow-hidden">
      <div className="mb-5 shrink-0 text-center">
        <span className="mb-2 inline-flex items-center gap-2 rounded-full border bg-surface px-3 py-1 text-[10px] font-semibold text-text-muted shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" /> 多来源检索 · 带引用报告
        </span>
        <h1 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">深度研究</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-text-muted">输入一个问题，AI 会检索并阅读多个网页，生成可核验的研究报告和多层级脑图。</p>
      </div>

      <div className="app-panel rounded-2xl border bg-surface p-3 sm:p-4">
        {busy ? (
          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6 animate-pulse"><circle cx="10" cy="10" r="6" /><path d="M14.5 14.5L20 20" /></svg>
            </span>
            <h2 className="mt-4 text-base font-bold">正在检索、阅读和交叉整理</h2>
            <p className="mt-2 text-xs leading-5 text-text-muted">这通常需要 30–90 秒，请不要关闭页面</p>
          </div>
        ) : (
          <>
            <textarea
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="输入你想深入研究的问题或主题…"
              className="field h-28 resize-none border-0 bg-bg-subtle p-4 text-base leading-7 shadow-inner"
              autoFocus
            />
            <div className="mt-3 grid gap-2 rounded-xl border bg-bg-subtle p-2.5 sm:grid-cols-[1fr_1fr_auto]">
              <ResearchSelect label="报告语言" value={language} onChange={setLanguage} options={LANGUAGES} />
              <ResearchSelect label="研究深度" value={depth} onChange={(value) => setDepth(value as 'standard' | 'detailed')} options={[["standard", "标准 · 约 5 个来源"], ["detailed", "详细 · 最多 8 个来源"]]} />
              <button type="button" onClick={submit} disabled={query.trim().length < 6} className="btn btn-primary h-10 self-end px-6">开始研究 <span aria-hidden="true">→</span></button>
            </div>
            {error && <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300"><span>{error}</span>{errorCode === 'login_required' && <Link href="/login?next=/app/research" className="shrink-0 font-semibold underline underline-offset-2">立即登录</Link>}</div>}
          </>
        )}
      </div>

      {!busy && <p className="mt-2 text-center text-[10px] text-text-subtle">每次研究消耗 10 积分 · 仅在成功生成后扣除</p>}

      {!busy && (
        <div className="mt-4 shrink-0">
          <p className="mb-2 text-[11px] font-medium text-text-subtle">研究示例</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {EXAMPLES.map((example) => <button key={example} type="button" onClick={() => setQuery(example)} className="rounded-xl border bg-surface px-4 py-3 text-left text-xs leading-5 text-text-muted transition-colors hover:border-brand-300 hover:text-text">{example}</button>)}
          </div>
        </div>
      )}
    </div>
  );
}

function ViewButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return <button type="button" onClick={onClick} className={`rounded-md px-3 py-1.5 text-xs font-medium ${active ? 'bg-surface text-text shadow-sm' : 'text-text-muted'}`}>{children}</button>;
}

function ResearchSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly (readonly [string, string])[] }) {
  return <label><span className="mb-1 block text-[10px] text-text-muted">{label}</span><select className="field h-10 py-0 text-xs" value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select></label>;
}

function ResearchReport({ report, sources }: { report: string; sources: Source[] }) {
  const blocks = report.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  return (
    <div className="h-full overflow-y-auto bg-bg">
      <article className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <div className="rounded-2xl border bg-surface p-6 shadow-sm sm:p-10">
          {blocks.map((block, index) => <ReportBlock key={`${index}-${block.slice(0, 20)}`} block={block} sources={sources} />)}
          <section className="mt-10 border-t pt-8">
            <h2 className="text-xl font-bold">网页来源</h2>
            <ol className="mt-4 space-y-3">
              {sources.map((source) => <li key={source.id} id={`source-${source.id}`} className="rounded-xl border bg-bg-subtle p-4"><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand-600 hover:text-brand-700">[{source.id}] {source.title} ↗</a>{source.description && <p className="mt-1 text-xs leading-5 text-text-muted">{source.description}</p>}<p className="mt-1 truncate text-[10px] text-text-subtle">{source.url}</p></li>)}
            </ol>
          </section>
        </div>
      </article>
    </div>
  );
}

function ReportBlock({ block, sources }: { block: string; sources: Source[] }) {
  const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
  const first = lines[0];
  if (first.startsWith('# ')) return <h1 className="mb-6 text-3xl font-bold tracking-[-0.035em]">{first.slice(2)}</h1>;
  if (first.startsWith('## ')) return <><h2 className="mt-9 text-xl font-bold tracking-tight">{first.slice(3)}</h2>{lines.slice(1).map((line, i) => <p key={i} className="mt-3 text-sm leading-7 text-text-muted"><CitedText text={line} sources={sources} /></p>)}</>;
  if (lines.every((line) => /^[-*]\s/.test(line))) return <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-7 text-text-muted">{lines.map((line, i) => <li key={i}><CitedText text={line.replace(/^[-*]\s+/, '')} sources={sources} /></li>)}</ul>;
  return <p className="mt-4 text-sm leading-7 text-text-muted"><CitedText text={lines.join(' ')} sources={sources} /></p>;
}

function CitedText({ text, sources }: { text: string; sources: Source[] }) {
  return text.split(/(\[\d+])/g).map((part, index) => {
    const match = part.match(/^\[(\d+)]$/);
    const source = match ? sources[Number(match[1]) - 1] : undefined;
    return source ? <a key={index} href={`#source-${source.id}`} className="mx-0.5 font-semibold text-brand-600 hover:text-brand-700">{part}</a> : part;
  });
}
