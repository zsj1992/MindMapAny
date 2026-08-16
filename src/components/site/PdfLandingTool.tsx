'use client';

import { useEffect, useRef, useState, type DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Workspace } from '@/components/Workspace';
import { useSession } from '@/lib/auth/client';
import type { Plan } from '@/lib/credits';
import { trackEvent } from '@/lib/analytics';
import { useEditor } from '@/store/editor';

const MAX_PDF_BYTES = 20 * 1024 * 1024;
const DB_NAME = 'mindmapany-pending-input';
const STORE_NAME = 'files';
const PENDING_PDF_KEY = 'pdf-landing-upload';

export function PdfLandingTool() {
  const { data: session } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [profileReady, setProfileReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const resumed = useRef(false);

  useEffect(() => {
    if (!session?.user) return;
    let active = true;
    fetch('/api/extension/session', { cache: 'no-store' })
      .then((response) => response.json() as Promise<{ signedIn?: boolean; plan?: Plan }>)
      .then((result: { signedIn?: boolean; plan?: Plan }) => {
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

  useEffect(() => {
    if (!session?.user || resumed.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('resume') !== 'pdf') return;
    resumed.current = true;
    takePendingPdf()
      .then((pending) => {
        if (pending) {
          resetLandingEditor();
          setFile(pending);
          trackEvent('pdf_landing_upload_resumed', { source: 'sign_in' });
        }
      })
      .catch(() => setError('Your saved PDF could not be restored. Please choose it again.'))
      .finally(() => window.history.replaceState(null, '', window.location.pathname));
  }, [session?.user]);

  const choose = async (selected: File | null) => {
    const validationError = validatePdf(selected);
    if (validationError) {
      setError(validationError);
      return;
    }
    const pdf = selected!;
    setError(null);
    trackEvent('pdf_landing_file_selected', {
      signed_in: Boolean(session?.user),
      size_band: pdf.size < 1024 * 1024 ? 'under_1mb' : pdf.size < 10 * 1024 * 1024 ? '1_to_10mb' : '10_to_20mb',
    });

    if (session?.user) {
      resetLandingEditor();
      setFile(pdf);
      return;
    }

    try {
      await savePendingPdf(pdf);
      trackEvent('pdf_landing_auth_required', { pending_file_saved: true });
      router.push('/login?next=%2Ftools%2Fpdf-to-mind-map%3Fresume%3Dpdf');
    } catch {
      setError('We could not keep the PDF in this browser. Sign in first, then choose the file again.');
    }
  };

  if (file && session?.user) {
    return (
      <div id="pdf-converter" className="scroll-mt-24 overflow-hidden rounded-[1.8rem] border bg-bg" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-surface px-5 py-3 text-xs text-text-muted" style={{ borderColor: 'var(--border)' }}>
          <span><strong className="text-text">Your PDF is ready.</strong> Choose the map depth, then generate without leaving this page.</span>
          <button type="button" className="font-semibold text-brand-600 hover:underline" onClick={() => {
            resetLandingEditor();
            setFile(null);
          }}>Choose another file</button>
        </div>
        {/*
          必须是确定高度，不能只给 min-height。Workspace 内部用 h-full（百分比高度），
          而百分比无法从 min-height 解析 —— 父元素高度算作 auto，画布那个
          flex-1 min-h-0 的子项就塌成 0，节点全部渲染在可视区之外，看起来是一片空白。
        */}
        <div className="h-[42rem] sm:h-[48rem]">
          {profileReady ? (
            <Workspace mode="pdf" plan={plan} initialFile={file} />
          ) : (
            <div className="flex min-h-[31rem] items-center justify-center text-sm text-text-muted">Loading your account…</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <section id="pdf-converter" className="scroll-mt-24 rounded-[1.8rem] border bg-surface p-4 shadow-xl shadow-brand-900/10 sm:p-6" style={{ borderColor: 'var(--border)' }}>
      <div
        className={`rounded-[1.25rem] border border-dashed bg-bg-subtle px-5 py-9 text-center transition-colors sm:py-11 ${dragging ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/20' : ''}`}
        style={dragging ? undefined : { borderColor: 'var(--border-strong)' }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event: DragEvent<HTMLDivElement>) => {
          event.preventDefault();
          setDragging(false);
          void choose(event.dataTransfer.files?.[0] ?? null);
        }}
      >
        <input ref={fileRef} type="file" accept=".pdf,application/pdf" hidden onChange={(event) => void choose(event.target.files?.[0] ?? null)} />
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
            <path strokeLinecap="round" d="M12 16V4m0 0L8 8m4-4l4 4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-bold tracking-tight">Upload a PDF and build the map here</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">Drop a text-based PDF or choose one from your device. After generation, you can inspect page references, edit branches, collapse levels and export the result.</p>
        <button type="button" className="btn btn-primary mt-5 h-11 px-6" onClick={() => fileRef.current?.click()}>Convert PDF to mind map <span aria-hidden="true">→</span></button>
        <p className="mt-3 text-xs text-text-subtle">Up to 20MB and 200 pages · scanned PDFs need OCR and are not supported yet</p>
        {!session?.user && <p className="mt-2 text-xs text-text-subtle">A free account is required to control model costs. If you choose a file first, it stays in this browser while you sign in.</p>}
      </div>
      {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
    </section>
  );
}

function resetLandingEditor() {
  useEditor.setState({ map: null, dirty: false, selectedId: null, editingId: null, streaming: false, revealAt: null });
}

function validatePdf(file: File | null): string | null {
  if (!file) return 'Choose a PDF file to continue.';
  if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') return 'Only PDF files are supported on this page.';
  if (file.size > MAX_PDF_BYTES) return 'The PDF exceeds the 20MB upload limit.';
  return null;
}

function openPendingDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function savePendingPdf(file: File): Promise<void> {
  const db = await openPendingDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(file, PENDING_PDF_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}

async function takePendingPdf(): Promise<File | null> {
  const db = await openPendingDb();
  const file = await new Promise<File | null>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(PENDING_PDF_KEY);
    request.onsuccess = () => {
      const result = request.result;
      store.delete(PENDING_PDF_KEY);
      resolve(result instanceof File ? result : null);
    };
    request.onerror = () => reject(request.error);
  });
  db.close();
  return file;
}
