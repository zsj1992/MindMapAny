'use client';

import { THEME_COLORS } from '@/lib/branchColors';
import type { ReactNode } from 'react';
import {
  formatOf,
  type MapFont,
  type MapLayout,
  type MapTheme,
} from '@/lib/mindmap/schema';
import { useEditor } from '@/store/editor';

const LAYOUTS: { value: MapLayout; label: string }[] = [
  { value: 'balanced', label: 'Balanced' },
  { value: 'right', label: 'Rightward' },
  { value: 'left', label: 'Leftward' },
];

const THEMES: { value: MapTheme; label: string }[] = [
  { value: 'indigo', label: 'Brand' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'coral', label: 'Warm' },
  { value: 'forest', label: 'Forest' },
  { value: 'violet', label: 'Violet' },
  { value: 'mono', label: 'Neutral' },
];

const FONTS: { value: MapFont; label: string }[] = [
  { value: 'sans', label: 'Modern sans' },
  { value: 'serif', label: 'Reading serif' },
  { value: 'mono', label: 'Monospace' },
];

export function FormatPanel({ onClose }: { onClose: () => void }) {
  const map = useEditor((s) => s.map);
  const updateFormat = useEditor((s) => s.updateFormat);
  if (!map) return null;
  const format = formatOf(map);

  return (
    <aside
      aria-label="Mind map format"
      className="absolute inset-y-3 right-3 z-20 flex w-[min(22rem,calc(100%-1.5rem))] flex-col overflow-hidden rounded-2xl border border-border-base bg-surface/95 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between border-b border-border-base px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-text">Map format</h2>
          <p className="mt-0.5 text-[11px] text-text-subtle">Changes are saved with the map</p>
        </div>
        <button type="button" onClick={onClose} className="btn btn-ghost h-8 w-8 p-0" aria-label="Close format panel">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <Section title="Layout" subtitle="Change which way branches expand">
          <div className="grid grid-cols-3 gap-2">
            {LAYOUTS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => updateFormat({ layout: item.value })}
                aria-pressed={format.layout === item.value}
                className={`group rounded-xl border px-2 py-3 transition-all ${
                  format.layout === item.value
                    ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-950/40 dark:text-brand-200'
                    : 'border-border-base bg-bg-subtle text-text-muted hover:border-border-strong hover:bg-surface'
                }`}
              >
                <LayoutPreview layout={item.value} />
                <span className="mt-2 block text-[10px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Colour" subtitle="Top-level branches inherit the theme colour">
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map((item) => {
              const palette = THEME_COLORS[item.value];
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => updateFormat({ theme: item.value })}
                  aria-label={item.label}
                  aria-pressed={format.theme === item.value}
                  className={`rounded-xl border p-2.5 transition-all ${
                    format.theme === item.value ? 'border-brand-500 bg-brand-50 shadow-sm dark:bg-brand-950/40' : 'border-border-base hover:border-border-strong'
                  }`}
                >
                  <span className="flex h-5 overflow-hidden rounded-md">
                    {palette.slice(0, 4).map((color) => <span key={color} className="flex-1" style={{ background: color }} />)}
                  </span>
                  <span className="mt-1.5 block text-[10px] font-medium text-text-muted">{item.label}</span>
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="Typography" subtitle="Applies to every node">
          <label className="block text-[11px] font-medium text-text-muted">
            Font
            <select
              value={format.font}
              onChange={(e) => updateFormat({ font: e.target.value as MapFont })}
              className="mt-2 h-10 w-full rounded-lg border border-border-base bg-bg px-3 text-xs text-text outline-none focus:border-brand-500"
            >
              {FONTS.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}
            </select>
          </label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <SelectControl label="Size" value={format.fontSize} values={[12, 14, 16]} suffix=" px" onChange={(value) => updateFormat({ fontSize: value as 12 | 14 | 16 })} />
            <SelectControl label="Weight" value={format.fontWeight} values={[400, 500, 600]} onChange={(value) => updateFormat({ fontWeight: value as 400 | 500 | 600 })} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <StyleButton label="Italic" active={format.italic} onClick={() => updateFormat({ italic: !format.italic })}><em>I</em></StyleButton>
            <StyleButton label="Underline" active={format.underline} onClick={() => updateFormat({ underline: !format.underline })}><span className="underline">U</span></StyleButton>
            <StyleButton label="Strikethrough" active={format.strikethrough} onClick={() => updateFormat({ strikethrough: !format.strikethrough })}><span className="line-through">S</span></StyleButton>
          </div>
        </Section>

        <Section title="Presentation" subtitle="Improve readability on complex maps" last>
          <Toggle label="Auto-number branches" description="Shows 1, 1.1, 1.2 by level" checked={format.numbering} onChange={(numbering) => updateFormat({ numbering })} />
          <div className="mt-3">
            <Toggle label="Face topics inward" description="Right-aligns text on the left side for a clearer reading path" checked={format.alignTopics} onChange={(alignTopics) => updateFormat({ alignTopics })} />
          </div>
        </Section>
      </div>
    </aside>
  );
}

function Section({ title, subtitle, children, last = false }: { title: string; subtitle: string; children: ReactNode; last?: boolean }) {
  return (
    <section className={last ? '' : 'mb-5 border-b border-border-base pb-5'}>
      <h3 className="text-xs font-semibold text-text">{title}</h3>
      <p className="mb-3 mt-0.5 text-[10px] text-text-subtle">{subtitle}</p>
      {children}
    </section>
  );
}

function LayoutPreview({ layout }: { layout: MapLayout }) {
  const left = layout !== 'right';
  const right = layout !== 'left';
  return (
    <svg viewBox="0 0 72 36" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto h-8 w-full" aria-hidden="true">
      <rect x="30" y="13" width="12" height="10" rx="3" />
      {left && <><path d="M30 18H21l-5-8M21 18l-5 8" /><path d="M16 10H7M16 26H7" /></>}
      {right && <><path d="M42 18h9l5-8M51 18l5 8" /><path d="M56 10h9M56 26h9" /></>}
    </svg>
  );
}

function SelectControl({ label, value, values, suffix = '', onChange }: { label: string; value: number; values: number[]; suffix?: string; onChange: (value: number) => void }) {
  return (
    <label className="text-[11px] font-medium text-text-muted">
      {label}
      <select value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 h-9 w-full rounded-lg border border-border-base bg-bg px-2 text-xs text-text outline-none focus:border-brand-500">
        {values.map((item) => <option key={item} value={item}>{item}{suffix}</option>)}
      </select>
    </label>
  );
}

function StyleButton({ label, active, onClick, children }: { label: string; active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" title={label} aria-pressed={active} onClick={onClick} className={`h-9 rounded-lg border text-xs font-semibold transition-colors ${active ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-200' : 'border-border-base text-text-muted hover:bg-bg-subtle'}`}>
      {children}
    </button>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border-base bg-bg-subtle px-3 py-3">
      <span><span className="block text-xs font-medium text-text">{label}</span><span className="mt-0.5 block text-[10px] leading-4 text-text-subtle">{description}</span></span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="relative h-5 w-9 shrink-0 rounded-full bg-border-strong transition-colors peer-checked:bg-brand-600 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-4" />
    </label>
  );
}
