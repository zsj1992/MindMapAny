'use client';

import { ReactFlowProvider } from '@xyflow/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MindMapCanvas } from '@/components/canvas/MindMapCanvas';
import type { MindMap } from '@/lib/mindmap/schema';
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
  const [view, setView] = useState<'report' | 'map'>('map');
  const [stage, setStage] = useState<ResearchStage>('planning');
  const [stageMessage, setStageMessage] = useState('正在准备研究任务');
  const [plan, setPlan] = useState<ResearchTask[]>([]);
  const [sourceCount, setSourceCount] = useState(0);
  const [activeTask, setActiveTask] = useState(0);

  useEffect(() => {
    if (!busy || stage !== 'researching' || plan.length < 2) return;
    const timer = window.setInterval(() => setActiveTask((current) => Math.min(current + 1, plan.length - 1)), 2200);
    return () => window.clearInterval(timer);
  }, [busy, stage, plan.length]);

  const submit = async () => {
    if (query.trim().length < 6 || busy) return;
    setBusy(true);
    setError(null);
    setErrorCode(null);
    setPlan([]);
    setSourceCount(0);
    setActiveTask(0);
    setStage('planning');
    setStageMessage('正在把问题拆解为可验证的研究任务');
    let completed = false;

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), language, depth }),
      });
      if (!response.ok) {
        const body = (await response.json()) as { error?: { message?: string; code?: string } };
        throw new ResearchRequestError(body.error?.message ?? '深度研究失败，请重试', body.error?.code);
      }
      if (!response.body) throw new Error('研究响应不可读取');

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
            load(event.data.map);
            setResult(event.data);
            setPlan(event.data.plan);
            setView('map');
            completed = true;
          } else {
            throw new ResearchRequestError(event.error.message ?? '深度研究失败，请重试', event.error.code);
          }
        }
        if (done) break;
      }
      if (!completed) throw new Error('研究结果生成不完整');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '网络异常，请重试');
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
              <div className="text-[10px] text-text-subtle">{result.plan.length} 个研究任务 · {result.sources.length} 个网页来源 · 消耗 {result.creditsCharged} 积分</div>
            </div>
            <div className="ml-auto flex rounded-lg bg-bg-subtle p-1 lg:hidden">
              <ViewButton active={view === 'map'} onClick={() => setView('map')}>思维导图</ViewButton>
              <ViewButton active={view === 'report'} onClick={() => setView('report')}>研究报告</ViewButton>
            </div>
            <button type="button" className="btn btn-secondary h-9 px-3 text-xs" onClick={reset}>新研究</button>
          </div>
          <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.12fr)_minmax(390px,0.88fr)]">
            <section className={`${view === 'map' ? 'block' : 'hidden'} min-h-0 border-r bg-bg lg:block`} aria-label="研究脑图">
              <MindMapCanvas />
            </section>
            <section className={`${view === 'report' ? 'block' : 'hidden'} min-h-0 bg-surface lg:block`} aria-label="研究报告">
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
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500" /> 研究计划 · 多来源检索 · 报告与脑图
          </span>
          <h1 className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl">深度研究</h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-text-muted">先把问题拆成研究任务，再检索证据，生成一份可核验的报告和多层级脑图。</p>
        </div>
      )}

      <div className={`app-panel rounded-2xl border bg-surface ${busy ? 'p-5 sm:p-7' : 'p-3 sm:p-4'}`}>
        {busy ? (
          <ResearchProgressView query={query} stage={stage} message={stageMessage} plan={plan} activeTask={activeTask} sourceCount={sourceCount} />
        ) : (
          <>
            <textarea value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入你想深入研究的问题或主题…" className="field h-28 resize-none border-0 bg-bg-subtle p-4 text-base leading-7 shadow-inner" autoFocus />
            <div className="mt-3 grid gap-2 rounded-xl border bg-bg-subtle p-2.5 sm:grid-cols-[1fr_1fr_auto]">
              <ResearchSelect label="报告语言" value={language} onChange={setLanguage} options={LANGUAGES} />
              <ResearchSelect label="研究深度" value={depth} onChange={(value) => setDepth(value as 'standard' | 'detailed')} options={[["standard", "标准 · 4 个研究任务"], ["detailed", "详细 · 5 个研究任务"]]} />
              <button type="button" onClick={submit} disabled={query.trim().length < 6} className="btn btn-primary h-10 self-end px-6">开始研究 <span aria-hidden="true">→</span></button>
            </div>
            {error && <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300"><span>{error}</span>{errorCode === 'login_required' && <Link href="/login?next=/app/research" className="shrink-0 font-semibold underline underline-offset-2">立即登录</Link>}</div>}
          </>
        )}
      </div>

      {!busy && <p className="mt-2 text-center text-[10px] text-text-subtle">每次研究消耗 10 积分 · 仅在成功生成后扣除</p>}
      {!busy && <div className="mt-4 shrink-0"><p className="mb-2 text-[11px] font-medium text-text-subtle">研究示例</p><div className="grid gap-2 sm:grid-cols-2">{EXAMPLES.map((example) => <button key={example} type="button" onClick={() => setQuery(example)} className="rounded-xl border bg-surface px-4 py-3 text-left text-xs leading-5 text-text-muted transition-colors hover:border-brand-300 hover:text-text">{example}</button>)}</div></div>}
    </div>
  );
}

function ResearchProgressView({ query, stage, message, plan, activeTask, sourceCount }: { query: string; stage: ResearchStage; message: string; plan: ResearchTask[]; activeTask: number; sourceCount: number }) {
  const stages: Array<[ResearchStage, string]> = [['planning', '拆解问题'], ['researching', '检索证据'], ['mapping', '生成脑图']];
  const stageIndex = stages.findIndex(([key]) => key === stage);
  return (
    <div className="mx-auto flex min-h-[390px] max-w-3xl flex-col justify-center">
      <div className="text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">Deep Research in progress</p><h2 className="mx-auto mt-3 max-w-2xl text-lg font-bold leading-7">{query}</h2></div>
      <div className="mx-auto mt-6 flex items-center gap-2">{stages.map(([key, label], index) => <div key={key} className="flex items-center gap-2"><span className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${index < stageIndex ? 'border-brand-600 bg-brand-600 text-white' : index === stageIndex ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30' : 'border-border text-text-subtle'}`}>{index < stageIndex ? '✓' : index + 1}</span><span className={`hidden text-xs sm:inline ${index === stageIndex ? 'font-semibold text-text' : 'text-text-subtle'}`}>{label}</span>{index < stages.length - 1 && <span className="h-px w-6 bg-border sm:w-10" />}</div>)}</div>
      <p className="mt-4 text-center text-xs text-text-muted">{message}{sourceCount ? ` · 已筛选 ${sourceCount} 个来源` : ''}</p>
      <div className="mt-5 rounded-2xl border bg-brand-50/60 p-4 dark:bg-brand-950/20">
        <div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold">研究任务</span><span className="text-[10px] text-text-subtle">{plan.length ? `${plan.length} 个方向` : '正在规划…'}</span></div>
        <div className="space-y-2.5">
          {(plan.length ? plan : [{ id: 'placeholder-1', title: '分析问题范围与关键概念' }, { id: 'placeholder-2', title: '确定需要验证的数据与案例' }, { id: 'placeholder-3', title: '识别风险、限制与争议' }]).map((task, index) => {
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
  const blocks = report.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  return (
    <div className="h-full overflow-y-auto bg-surface">
      <article className="mx-auto max-w-3xl px-6 py-8 sm:px-8">
        {blocks.map((block, index) => <ReportBlock key={`${index}-${block.slice(0, 20)}`} block={block} sources={sources} />)}
        <section className="mt-10 border-t pt-8"><h2 className="text-xl font-bold">网页来源</h2><ol className="mt-4 space-y-3">{sources.map((source) => <li key={source.id} id={`source-${source.id}`} className="rounded-xl border bg-bg-subtle p-4"><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand-600 hover:text-brand-700">[{source.id}] {source.title} ↗</a>{source.description && <p className="mt-1 text-xs leading-5 text-text-muted">{source.description}</p>}<p className="mt-1 truncate text-[10px] text-text-subtle">{source.url}</p></li>)}</ol></section>
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
