'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Workspace } from '@/components/Workspace';
import { useSession } from '@/lib/auth/client';
import type { Plan } from '@/lib/credits';
import { trackEvent } from '@/lib/analytics';
import { parseVideoId } from '@/lib/extract/youtube';
import { useEditor } from '@/store/editor';

/**
 * 落地页内嵌的 YouTube 工具。
 *
 * 和 TextLandingTool 同一套形状，只有两点不同：
 *   1. 输入是链接不是正文，所以能在提交前就校验（能不能解析出 11 位视频 id）。
 *      这比让用户跳过去、等半天、再被告诉「链接不对」好得多。
 *   2. 未登录时把链接存进 sessionStorage 再去登录，回来自动接上 ——
 *      链接比整段文本短，但丢了同样让人恼火。
 *
 * 示例视频是写死的公开视频：每次都能复现，也不会因为某个视频下架而失效。
 */

const PENDING_URL_KEY = 'youtube-landing-input';

const EXAMPLES = [
  { label: 'Lecture', value: 'https://www.youtube.com/watch?v=aircAruvnKk' },
  { label: 'Conference talk', value: 'https://www.youtube.com/watch?v=zjkBMFhNj_g' },
];

export function YoutubeLandingTool() {
  const { data: session } = useSession();
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [started, setStarted] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [profileReady, setProfileReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputTracked = useRef(false);
  const resumed = useRef(false);

  useEffect(() => {
    if (!session?.user) return;
    let active = true;
    fetch('/api/extension/session', { cache: 'no-store' })
      .then((response) => response.json() as Promise<{ signedIn?: boolean; plan?: Plan }>)
      .then((result) => {
        if (active) setPlan(result.signedIn ? (result.plan ?? null) : null);
      })
      .catch(() => {
        if (active) setPlan(null);
      })
      .finally(() => {
        if (active) setProfileReady(true);
      });
    return () => {
      active = false;
    };
  }, [session?.user]);

  // 登录回来后把存着的链接接上
  useEffect(() => {
    if (!session?.user || resumed.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('resume') !== 'youtube') return;
    resumed.current = true;
    const pending = window.sessionStorage.getItem(PENDING_URL_KEY);
    window.sessionStorage.removeItem(PENDING_URL_KEY);
    window.history.replaceState(null, '', window.location.pathname);
    if (!pending) return;
    const timer = window.setTimeout(() => {
      resetLandingEditor();
      setUrl(pending);
      setStarted(true);
      trackEvent('youtube_landing_input_resumed', { source: 'sign_in' });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [session?.user]);

  const updateUrl = (value: string, source: 'typed' | 'example') => {
    setUrl(value);
    setError(null);
    if (!inputTracked.current && value.trim().length > 0) {
      inputTracked.current = true;
      trackEvent('youtube_landing_input_started', { source });
    }
  };

  const continueToGenerator = () => {
    const value = url.trim();
    // 提交前就挡掉认不出的链接：跳转、登录、等待之后再报错，那三步全白费
    if (!parseVideoId(value)) {
      setError('That does not look like a YouTube link. Paste a watch, youtu.be or Shorts URL.');
      return;
    }
    trackEvent('youtube_landing_generate_clicked', { signed_in: Boolean(session?.user) });
    if (session?.user) {
      resetLandingEditor();
      setUrl(value);
      setStarted(true);
      return;
    }
    try {
      window.sessionStorage.setItem(PENDING_URL_KEY, value);
      trackEvent('youtube_landing_auth_required', { pending_url_saved: true });
      router.push('/login?next=%2Ftools%2Fyoutube-to-mind-map%3Fresume%3Dyoutube');
    } catch {
      setError('This browser could not keep your link for sign-in. Sign in first, then paste it again.');
    }
  };

  if (started && session?.user) {
    return (
      <div id="youtube-converter" className="scroll-mt-24 overflow-hidden rounded-[1.8rem] border bg-bg" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-surface px-5 py-3 text-xs text-text-muted" style={{ borderColor: 'var(--border)' }}>
          <span>
            <strong className="text-text">Your video is ready.</strong> Choose the map depth and purpose, then generate without leaving this page.
          </span>
          <button
            type="button"
            className="font-semibold text-brand-600 hover:underline"
            onClick={() => {
              resetLandingEditor();
              setStarted(false);
            }}
          >
            Use a different video
          </button>
        </div>
        {/*
          必须是确定高度，不能只给 min-height。Workspace 内部用 h-full（百分比高度），
          而百分比无法从 min-height 解析 —— 父元素高度算作 auto，画布那个
          flex-1 min-h-0 的子项就塌成 0，节点全部渲染在可视区之外，看起来是一片空白。
        */}
        <div className="h-[42rem] sm:h-[48rem]">
          {profileReady ? (
            <Workspace mode="youtube" plan={plan} initialUrl={url} />
          ) : (
            <div className="flex min-h-[31rem] items-center justify-center text-sm text-text-muted">Loading your account…</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <section
      id="youtube-converter"
      className="scroll-mt-24 rounded-[1.8rem] border bg-surface p-4 shadow-xl shadow-brand-900/10 sm:p-6"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="rounded-[1.25rem] border bg-bg-subtle p-4 sm:p-5" style={{ borderColor: 'var(--border-strong)' }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Turn a YouTube video into a mind map here</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
              Paste a link to a lecture, talk, review or tutorial. We read its captions, so the video needs to have them —
              auto-generated ones are fine.
            </p>
          </div>
          <span className="rounded-full bg-accent-500/10 px-3 py-1 text-xs font-semibold text-accent-600">Timestamped</span>
        </div>

        <input
          type="url"
          inputMode="url"
          value={url}
          onChange={(event) => updateUrl(event.target.value, 'typed')}
          onKeyDown={(event) => {
            if (event.key === 'Enter') continueToGenerator();
          }}
          placeholder="https://www.youtube.com/watch?v=…"
          className="field mt-5 h-12 bg-surface px-4 text-sm shadow-none"
        />

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold text-text-muted">Try a fixed example:</span>
          {EXAMPLES.map((example) => (
            <button
              key={example.label}
              type="button"
              className="rounded-lg border bg-surface px-3 py-2 text-xs font-semibold text-text-muted transition-colors hover:border-brand-300 hover:text-text"
              style={{ borderColor: 'var(--border)' }}
              onClick={() => updateUrl(example.value, 'example')}
            >
              {example.label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
          <p className="max-w-2xl text-xs leading-5 text-text-subtle">
            A free account is required to control model costs. If you paste first, the link stays only in this browser
            session while you sign in.
          </p>
          <button type="button" className="btn btn-primary h-11 px-6" onClick={continueToGenerator}>
            Build my mind map <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}
    </section>
  );
}

function resetLandingEditor() {
  useEditor.setState({ map: null, dirty: false, selectedId: null, editingId: null, streaming: false, revealAt: null });
}
