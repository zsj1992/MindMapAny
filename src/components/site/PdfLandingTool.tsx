'use client';

import { useEffect, useRef, useState, type DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth/client';
import { trackEvent } from '@/lib/analytics';
import { savePendingPdf, takePendingPdf } from '@/lib/pending-file';
import { useEditor } from '@/store/editor';

const MAX_PDF_BYTES = 20 * 1024 * 1024;

export function PdfLandingTool() {
  const { data: session } = useSession();
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const resumed = useRef(false);


  useEffect(() => {
    if (!session?.user || resumed.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('resume') !== 'pdf') return;
    resumed.current = true;
    takePendingPdf()
      .then((pending) => {
        if (pending) {
          resetLandingEditor();
        void savePendingPdf(pending).then(() => router.push('/app/pdf'));
          trackEvent('pdf_landing_upload_resumed', { source: 'sign_in' });
        }
      })
      .catch(() => setError('Your saved PDF could not be restored. Please choose it again.'))
      .finally(() => window.history.replaceState(null, '', window.location.pathname));
  }, [session?.user, router]);

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

    // 收下文件就交给工作台 —— 和链接、正文走同一条路，落地页不再内嵌画布
    if (session?.user) {
      resetLandingEditor();
      try {
        await savePendingPdf(pdf);
        router.push('/app/pdf');
      } catch {
        setError('We could not hand the PDF to the workbench. Open it there and choose the file again.');
      }
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

