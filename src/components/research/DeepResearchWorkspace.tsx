'use client';

import { ReactFlowProvider } from '@xyflow/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MindMapCanvas } from '@/components/canvas/MindMapCanvas';
import { trackEvent } from '@/lib/analytics';
import type { MindMap } from '@/lib/mindmap/schema';
import { useT } from '@/lib/i18n/context';
import { useEditor } from '@/store/editor';

interface Source {
  id: number;
  title: string;
  url: string;
  description: string;
}

interface ResearchTask {
  id: string;
  title: string;
}

type ResearchStage = 'planning' | 'researching' | 'mapping';

interface ResearchResponse {
  plan: ResearchTask[];
  report: string;
  sources: Source[];
  map: MindMap;
  creditsCharged: number;
}

type StreamEvent =
  | { type: 'progress'; stage: ResearchStage; message: string; plan?: ResearchTask[]; sourceCount?: number }
  | { type: 'result'; data: ResearchResponse }
  | { type: 'error'; error: { message?: string; code?: string } };

const EXAMPLES = [
  'What are the main business models and competitive dynamics for AI search products in 2026?',
  'How does remote work affect team productivity, collaboration and employee wellbeing?',
  'What are the reliable methods and common biases in systematic literature reviews?',
  'What is driving the growth in global data centre electricity use, and what can be done about it?',
];

// 语言名用各自的写法；'auto' 的文案跟随界面语言，在组件里拼
const LANGUAGES = [
  ['zh-CN', '简体中文'], ['zh-TW', '繁體中文'], ['en', 'English'], ['ja', '日本語'], ['ko', '한국어'], ['es', 'Español'],
] as const;

export function DeepResearchWorkspace() {
  const router = useRouter();
  const load = useEditor((state) => state.load);
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('auto');
  const [depth, setDepth] = useState<'standard' | 'detailed'>('detailed');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [result, setResult] = useState<ResearchResponse | null>(null);
  const [view, setView] = useState<'report' | 'map'>('map');
  const [stage, setStage] = useState<ResearchStage>('planning');
  const [stageMessage, setStageMessage] = useState<string | null>(null);
  const [plan, setPlan] = useState<ResearchTask[]>([]);
  const [sourceCount, setSourceCount] = useState(0);
  const [activeTask, setActiveTask] = useState(0);
  const t = useT();

  useEffect(() => {
    if (!busy || stage !== 'researching' || plan.length < 2) return;
    const timer = window.setInterval(() => setActiveTask((current) => Math.min(current + 1, plan.length - 1)), 2200);
    return () => window.clearInterval(timer);
  }, [busy, stage, plan.length]);

  const submit = async () => {
    if (query.trim().length < 6 || busy) return;
    trackEvent('deep_research_started', { depth, language });
    setBusy(true);
    setError(null);
    setErrorCode(null);
    setPlan([]);
    setSourceCount(0);
    setActiveTask(0);
    setStage('planning');
    setStageMessage(t('research.breakingDown'));
    let completed = false;

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), language, depth }),
      });
      if (!response.ok) {
        const body = (await response.json()) as { error?: { message?: string; code?: string } };
        throw new ResearchRequestError(body.error?.message ?? t('research.failed'), body.error?.code);
      }
      if (!response.body) throw new Error('Research response could not be read');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as StreamEvent;
          if (event.type === 'progress') {
            setStage(event.stage);
            setStageMessage(event.message);
            if (event.plan) setPlan(event.plan);
            if (event.sourceCount) setSourceCount(event.sourceCount);
          } else if (event.type === 'result') {
            trackEvent('deep_research_completed', {
              depth,
              language,
              source_count: event.data.sources.length,
              task_count: event.data.plan.length,
              credits_charged: event.data.creditsCharged,
            });
            load(event.data.map);
            router.refresh();
            setResult(event.data);
            setPlan(event.data.plan);
            setView('map');
            completed = true;
          } else {
            throw new ResearchRequestError(event.error.message ?? t('research.failed'), event.error.code);
          }
        }
        if (done) break;
      }
      if (!completed) throw new Error('The research result is incomplete');
    } catch (requestError) {
      trackEvent('deep_research_failed', {
        depth,
        language,
        error_code: requestError instanceof ResearchRequestError ? requestError.code ?? 'request_failed' : 'network_error',
      });
      setError(requestError instanceof Error ? requestError.message : t('error.network'));
      setErrorCode(requestError instanceof ResearchRequestError ? requestError.code ?? null : null);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setResult(null);
    setQuery('');
    setPlan([]);
    useEditor.setState({ map: null, dirty: false, selectedId: null, editingId: null });
  };

  if (result) {
    return (
      <ReactFlowProvider>
        <div className="flex h-full min-h-0 flex-col bg-bg">
          <div className="flex h-14 shrink-0 items-center gap-3 border-b bg-surface px-4 sm:px-5">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{result.map.title}</div>
              <div className="text-[10px] text-text-subtle">{result.plan.length} research tasks · {result.sources.length} web sources · {result.creditsCharged} credits used</div>
            </div>
            <div className="ml-auto flex rounded-lg bg-bg-subtle p-1 lg:hidden">
              <ViewButton active={view === 'map'} onClick={() => setView('map')}>{t('research.viewMap')}</ViewButton>
              <ViewButton active={view === 'report'} onClick={() => setView('report')}>{t('research.viewReport')}</ViewButton>
            </div>
            <button type="button" className="btn btn-secondary h-9 px-3 text-xs" onClick={reset}>New research</button>
          </div>
          <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.12fr)_minmax(390px,0.88fr)]">
            <section className={`${view === 'map' ? 'block' : 'hidden'} min-h-0 border-r bg-bg lg:block`} aria-label={t('research.mapRegion')}>
              <MindMapCanvas />
            </section>
            <section className={`${view === 'report' ? 'block' : 'hidden'} min-h-0 bg-surface lg:block`} aria-label={t('research.reportRegion')}>
              <ResearchReport report={result.report} sources={result.sources} />
            </section>
          </div>
        </div>
      </ReactFlowProvider>
    );
  }

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col justify-center overflow-y-auto px-4 py-5 sm:px-6 lg:overflow-hidden">
      {!busy && (
        <div className="mb-5 shrink-0 text-center">
          <span className="mb-2 inline-flex items-center gap-2 rounded-full border bg-surface px-3 py-1 text-[10px] font-semibold text-text-muted shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500" /> {t('research.tagline')}
          </span>
          <h1 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">{t('research.title')}</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-text-muted">{t('research.intro')}</p>
        </div>
      )}

      <div className={`app-panel rounded-2xl border bg-surface ${busy ? 'p-5 sm:p-7' : 'p-3 sm:p-4'}`}>
        {busy ? (
          <ResearchProgressView query={query} stage={stage} message={stageMessage ?? t('research.preparing')} plan={plan} activeTask={activeTask} sourceCount={sourceCount} />
        ) : (
          <>
            <textarea value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('research.queryPlaceholder')} className="field h-28 resize-none border-0 bg-bg-subtle p-4 text-base leading-7 shadow-inner" autoFocus />
            <div className="mt-3 grid gap-2 rounded-xl border bg-bg-subtle p-2.5 sm:grid-cols-[1fr_1fr_auto]">
              <ResearchSelect label={t('research.reportLanguage')} value={language} onChange={setLanguage} options={[['auto', t('research.languageAuto')], ...LANGUAGES]} />
              <ResearchSelect label={t('research.depth')} value={depth} onChange={(value) => setDepth(value as 'standard' | 'detailed')} options={[['standard', t('research.depthStandard')], ['detailed', t('research.depthDetailed')]]} />
              <button type="button" onClick={submit} disabled={query.trim().length < 6} className="btn btn-primary h-10 self-end px-6">{t('research.start')} <span aria-hidden="true">→</span></button>
            </div>
            {error && <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300"><span>{error}</span>{errorCode === 'login_required' && <Link href="/login?next=/app/research" className="shrink-0 font-semibold underline underline-offset-2">{t('account.signIn')}</Link>}</div>}
          </>
        )}
      </div>

      {!busy && <p className="mt-2 text-center text-[10px] text-text-subtle">{t('research.cost')}</p>}
      {!busy && <div className="mt-4 shrink-0"><p className="mb-2 text-[11px] font-medium text-text-subtle">{t('research.examples')}</p><div className="grid gap-2 sm:grid-cols-2">{EXAMPLES.map((example) => <button key={example} type="button" onClick={() => setQuery(example)} className="rounded-xl border bg-surface px-4 py-3 text-left text-xs leading-5 text-text-muted transition-colors hover:border-brand-300 hover:text-text">{example}</button>)}</div></div>}
    </div>
  );
}

function ResearchProgressView({ query, stage, message, plan, activeTask, sourceCount }: { query: string; stage: ResearchStage; message: string; plan: ResearchTask[]; activeTask: number; sourceCount: number }) {
  const t = useT();
  const stages: Array<[ResearchStage, string]> = [['planning', t('research.stage.planning')], ['researching', t('research.stage.researching')], ['mapping', t('research.stage.mapping')]];
  const stageIndex = stages.findIndex(([key]) => key === stage);
  return (
    <div className="mx-auto flex min-h-[390px] max-w-3xl flex-col justify-center">
      <div className="text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">{t('research.inProgress')}</p><h2 className="mx-auto mt-3 max-w-2xl text-lg font-bold leading-7">{query}</h2></div>
      <div className="mx-auto mt-6 flex items-center gap-2">{stages.map(([key, label], index) => <div key={key} className="flex items-center gap-2"><span className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${index < stageIndex ? 'border-brand-600 bg-brand-600 text-white' : index === stageIndex ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30' : 'border-border text-text-subtle'}`}>{index < stageIndex ? '✓' : index + 1}</span><span className={`hidden text-xs sm:inline ${index === stageIndex ? 'font-semibold text-text' : 'text-text-subtle'}`}>{label}</span>{index < stages.length - 1 && <span className="h-px w-6 bg-border sm:w-10" />}</div>)}</div>
      <p className="mt-4 text-center text-xs text-text-muted">{message}{sourceCount ? t('research.sourcesSelected', { n: sourceCount }) : ''}</p>
      <div className="mt-5 rounded-2xl border bg-brand-50/60 p-4 dark:bg-brand-950/20">
        <div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold">{t('research.tasks')}</span><span className="text-[10px] text-text-subtle">{plan.length ? t('research.taskCount', { n: plan.length }) : t('research.planning')}</span></div>
        <div className="space-y-2.5">
          {(plan.length ? plan : [{ id: 'placeholder-1', title: t('research.placeholderTask1') }, { id: 'placeholder-2', title: t('research.placeholderTask2') }, { id: 'placeholder-3', title: t('research.placeholderTask3') }]).map((task, index) => {
            const done = stage === 'mapping' || (stage === 'researching' && index < activeTask);
            const active = stage === 'researching' && index === activeTask;
            return <div key={task.id} className="flex items-start gap-3 text-xs leading-5"><span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] ${done ? 'bg-brand-600 text-white' : active ? 'border-2 border-brand-500 bg-surface' : 'border border-border bg-surface text-transparent'}`}>{done ? '✓' : '•'}</span><span className={active ? 'font-semibold text-text' : 'text-text-muted'}>{task.title}</span></div>;
          })}
        </div>
      </div>
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
  const t = useT();
  const blocks = report.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  return (
    <div className="h-full overflow-y-auto bg-surface">
      <article className="mx-auto max-w-3xl px-6 py-8 sm:px-8">
        {blocks.map((block, index) => <ReportBlock key={`${index}-${block.slice(0, 20)}`} block={block} sources={sources} />)}
        <section className="mt-10 border-t pt-8"><h2 className="text-xl font-bold">{t('research.sources')}</h2><ol className="mt-4 space-y-3">{sources.map((source) => <li key={source.id} id={`source-${source.id}`} className="rounded-xl border bg-bg-subtle p-4"><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand-600 hover:text-brand-700">[{source.id}] {source.title} ↗</a>{source.description && <p className="mt-1 text-xs leading-5 text-text-muted">{source.description}</p>}<p className="mt-1 truncate text-[10px] text-text-subtle">{source.url}</p></li>)}</ol></section>
      </article>
    </div>
  );
}

function ReportBlock({ block, sources }: { block: string; sources: Source[] }) {
  const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
  const first = lines[0];
  if (first.startsWith('# ')) return <h1 className="mb-6 text-3xl font-bold tracking-[-0.035em]">{first.slice(2)}</h1>;
  if (first.startsWith('### ')) return <><h3 className="mt-7 text-base font-bold">{first.slice(4)}</h3>{lines.slice(1).map((line, index) => <p key={index} className="mt-3 text-sm leading-7 text-text-muted"><CitedText text={line} sources={sources} /></p>)}</>;
  if (first.startsWith('## ')) return <><h2 className="mt-9 text-xl font-bold tracking-tight">{first.slice(3)}</h2>{lines.slice(1).map((line, index) => <p key={index} className="mt-3 text-sm leading-7 text-text-muted"><CitedText text={line} sources={sources} /></p>)}</>;
  if (lines.every((line) => /^[-*]\s/.test(line))) return <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-7 text-text-muted">{lines.map((line, index) => <li key={index}><CitedText text={line.replace(/^[-*]\s+/, '')} sources={sources} /></li>)}</ul>;
  return <p className="mt-4 text-sm leading-7 text-text-muted"><CitedText text={lines.join(' ')} sources={sources} /></p>;
}

function CitedText({ text, sources }: { text: string; sources: Source[] }) {
  return text.split(/(\[(?:\d+(?:,\s*)?)+])/g).map((part, index) => {
    const ids = part.match(/\d+/g)?.map(Number) ?? [];
    if (!ids.length) return part;
    return <span key={index} className="mx-1 inline-flex gap-1">{ids.map((id) => sources[id - 1] ? <a key={id} href={`#source-${id}`} className="rounded-full bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300">{id}</a> : null)}</span>;
  });
}

class ResearchRequestError extends Error {
  constructor(message: string, readonly code?: string) {
    super(message);
  }
}
