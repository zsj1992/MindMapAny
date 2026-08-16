'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth/client';
import { trackEvent } from '@/lib/analytics';
import { storePendingInput } from '@/components/PendingInputStarter';
import { useEditor } from '@/store/editor';

const PENDING_TEXT_KEY = 'text-landing-input';
const MIN_TEXT_LENGTH = 21;

const EXAMPLES = [
  {
    label: 'Product launch notes',
    value: 'Product launch plan: The goal is to release the research workspace in October. Product owns onboarding and the editor flow. Marketing prepares the launch page, customer examples and email sequence. Support writes migration guidance and tracks recurring questions. Key risks are slow imports, unclear plan limits and missing analytics. The team will review readiness every Friday and delay the announcement if generation success falls below the agreed threshold.',
  },
  {
    label: 'Meeting minutes',
    value: 'Weekly planning meeting: The design review is complete, but mobile navigation needs another usability pass. Engineering will finish the import queue and add retry handling before Thursday. Marketing will interview three early users and turn the findings into landing-page examples. Decisions: keep the current pricing, postpone team billing and measure activation from first input to first exported map. Open questions include file limits, multilingual output and the owner of onboarding emails.',
  },
  {
    label: 'Study notes',
    value: 'Photosynthesis converts light energy into chemical energy. Light-dependent reactions take place in the thylakoid membranes, where chlorophyll absorbs light and helps produce ATP and NADPH. The Calvin cycle takes place in the stroma and uses those products to fix carbon dioxide into sugars. The overall rate is affected by light intensity, carbon dioxide concentration and temperature, with each factor becoming limiting under different conditions.',
  },
];

export function TextLandingTool() {
  const { data: session } = useSession();
  const router = useRouter();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputTracked = useRef(false);
  const resumed = useRef(false);


  useEffect(() => {
    if (!session?.user || resumed.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('resume') !== 'text') return;
    resumed.current = true;
    const pending = window.sessionStorage.getItem(PENDING_TEXT_KEY);
    window.sessionStorage.removeItem(PENDING_TEXT_KEY);
    window.history.replaceState(null, '', window.location.pathname);
    if (!pending) return;
    const resumeTimer = window.setTimeout(() => {
      resetLandingEditor();
      trackEvent('text_landing_input_resumed', { source: 'sign_in', character_band: characterBand(pending.length) });
      if (storePendingInput({ kind: 'text', value: pending })) router.push('/app/text');
      else setText(pending);
    }, 0);
    return () => window.clearTimeout(resumeTimer);
  }, [session?.user, router]);

  const updateText = (value: string, source: 'typed' | 'example') => {
    setText(value);
    setError(null);
    if (!inputTracked.current && value.trim().length > 0) {
      inputTracked.current = true;
      trackEvent('text_landing_input_started', { source });
    }
  };

  const continueToGenerator = () => {
    const value = text.trim();
    if (value.length < MIN_TEXT_LENGTH) {
      setError('Paste at least 21 characters so the AI has enough context to build a useful hierarchy.');
      return;
    }
    trackEvent('text_landing_generate_clicked', {
      signed_in: Boolean(session?.user),
      character_band: characterBand(value.length),
    });
    // 收完正文交给工作台，不在落地页里生成 —— 详见 YoutubeLandingTool 里的说明
    if (session?.user) {
      resetLandingEditor();
      if (!storePendingInput({ kind: 'text', value })) {
        setError('This browser blocked session storage. Open the workbench and paste the text there.');
        return;
      }
      router.push('/app/text');
      return;
    }
    try {
      window.sessionStorage.setItem(PENDING_TEXT_KEY, value);
      trackEvent('text_landing_auth_required', { pending_text_saved: true, character_band: characterBand(value.length) });
      router.push('/login?next=%2Ftools%2Ftext-to-mind-map%3Fresume%3Dtext');
    } catch {
      setError('This browser could not keep your text for sign-in. Sign in first, then paste it again.');
    }
  };


  return (
    <section id="text-converter" className="scroll-mt-24 rounded-[1.8rem] border bg-surface p-4 shadow-xl shadow-brand-900/10 sm:p-6" style={{ borderColor: 'var(--border)' }}>
      <div className="rounded-[1.25rem] border bg-bg-subtle p-4 sm:p-5" style={{ borderColor: 'var(--border-strong)' }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Paste text and build the mind map here</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">Use notes, meeting minutes, an article or an AI answer. Your text is sent only when you choose Generate and is never included in analytics.</p>
          </div>
          <span className="rounded-full bg-accent-500/10 px-3 py-1 text-xs font-semibold text-accent-600">Editable output</span>
        </div>
        <textarea
          value={text}
          onChange={(event) => updateText(event.target.value, 'typed')}
          placeholder="Paste the text you want to organise into topics and subtopics…"
          className="field mt-5 h-48 resize-y bg-surface p-4 text-sm leading-7 shadow-none"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-text-subtle">
          <span>{text.length.toLocaleString()} characters · minimum 21</span>
          <span>Nothing you paste is added to the page or experiment record.</span>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold text-text-muted">Try a fixed example:</span>
          {EXAMPLES.map((example) => (
            <button key={example.label} type="button" className="rounded-lg border bg-surface px-3 py-2 text-xs font-semibold text-text-muted transition-colors hover:border-brand-300 hover:text-text" style={{ borderColor: 'var(--border)' }} onClick={() => updateText(example.value, 'example')}>
              {example.label}
            </button>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
          <p className="max-w-2xl text-xs leading-5 text-text-subtle">A free account is required to control model costs. If you paste first, the text stays only in this browser session while you sign in.</p>
          <button type="button" className="btn btn-primary h-11 px-6" onClick={continueToGenerator}>Convert text to mind map <span aria-hidden="true">→</span></button>
        </div>
      </div>
      {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
    </section>
  );
}

function characterBand(length: number): string {
  if (length < 500) return 'under_500';
  if (length < 2_000) return '500_to_1999';
  if (length < 10_000) return '2000_to_9999';
  return '10000_plus';
}

function resetLandingEditor() {
  useEditor.setState({ map: null, dirty: false, selectedId: null, editingId: null, streaming: false, revealAt: null });
}
