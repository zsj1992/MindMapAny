'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { MapSummary } from '@/lib/db/repositories/maps';

const KIND_LABEL: Record<string, string> = { text: 'Text', pdf: 'PDF', web: 'Web', youtube: 'YouTube' };

export function MapLibrary({ initialMaps }: { initialMaps: MapSummary[] }) {
  const [maps, setMaps] = useState(initialMaps);
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return needle ? maps.filter((map) => map.title.toLocaleLowerCase().includes(needle)) : maps;
  }, [maps, query]);

  async function rename(map: MapSummary, title: string) {
    const nextTitle = title.trim();
    setEditingId(null);
    if (!nextTitle || nextTitle === map.title) return;
    setPendingId(map.id);
    setMessage(null);
    try {
      const response = await fetch(`/api/maps/${map.id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: nextTitle }),
      });
      if (!response.ok) throw new Error('rename_failed');
      setMaps((current) => current.map((item) => (item.id === map.id ? { ...item, title: nextTitle } : item)));
    } catch {
      setMessage('Rename failed. Please try again.');
    } finally {
      setPendingId(null);
    }
  }

  async function remove(map: MapSummary) {
    if (!confirm(`Permanently delete "${map.title}"? This cannot be undone.`)) return;
    setPendingId(map.id);
    setMessage(null);
    try {
      const response = await fetch(`/api/maps/${map.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('delete_failed');
      setMaps((current) => current.filter((item) => item.id !== map.id));
      setMessage('Mind map deleted');
    } catch {
      setMessage('Delete failed. Please try again.');
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">My mind maps</h1>
          <p className="mt-1 text-xs text-text-subtle">{maps.length} saved mind maps</p>
        </div>
        <label className="relative block sm:w-64">
          <span className="sr-only">Search mind maps</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles…"
            className="h-10 w-full rounded-xl border bg-surface px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
        </label>
      </div>

      {message && <p role="status" className="mb-3 text-xs text-text-muted">{message}</p>}
      {!filtered.length ? (
        <div className="card px-5 py-12 text-center text-sm text-text-muted">
          {maps.length ? 'No maps match your search' : 'No saved maps yet'}
        </div>
      ) : (
        <ul className="card divide-y" style={{ borderColor: 'var(--border)' }}>
          {filtered.map((map) => (
            <li key={map.id} className="group flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                {editingId === map.id ? (
                  <input
                    autoFocus
                    defaultValue={map.title}
                    maxLength={120}
                    disabled={pendingId === map.id}
                    onBlur={(event) => void rename(map, event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') event.currentTarget.blur();
                      if (event.key === 'Escape') setEditingId(null);
                    }}
                    className="h-8 w-full rounded-lg border bg-bg px-2 text-sm font-medium outline-none focus:border-brand-500"
                    aria-label={`Rename ${map.title}`}
                  />
                ) : (
                  <Link href={`/app/map/${map.id}`} className="block truncate text-sm font-medium hover:text-brand-600">
                    {map.title}
                  </Link>
                )}
                <span className="mt-0.5 block text-xs text-text-subtle">
                  {KIND_LABEL[map.sourceKind] ?? map.sourceKind} · {new Date(map.updatedAt * 1000).toLocaleDateString('zh-CN')}
                </span>
              </div>

              {map.isPublic && map.shareSlug && (
                <Link href={`/m/${map.shareSlug}`} className="hidden text-xs text-text-subtle hover:text-text sm:block">Public link</Link>
              )}
              <button
                type="button"
                onClick={() => setEditingId(map.id)}
                disabled={pendingId === map.id}
                className="btn btn-ghost h-8 px-2 text-xs"
                aria-label={`Rename ${map.title}`}
              >
                Rename
              </button>
              <button
                type="button"
                onClick={() => void remove(map)}
                disabled={pendingId === map.id}
                className="btn btn-ghost h-8 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                aria-label={`Delete ${map.title}`}
              >
                {pendingId === map.id ? 'Working…' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
