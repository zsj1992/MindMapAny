'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { MapSummary } from '@/lib/db/repositories/maps';

const KIND_LABEL: Record<string, string> = { text: '文本', pdf: 'PDF', web: '网页', youtube: 'YouTube' };

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
      setMessage('重命名失败，请稍后重试');
    } finally {
      setPendingId(null);
    }
  }

  async function remove(map: MapSummary) {
    if (!confirm(`确定永久删除“${map.title}”吗？此操作无法撤销。`)) return;
    setPendingId(map.id);
    setMessage(null);
    try {
      const response = await fetch(`/api/maps/${map.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('delete_failed');
      setMaps((current) => current.filter((item) => item.id !== map.id));
      setMessage('脑图已删除');
    } catch {
      setMessage('删除失败，请稍后重试');
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">我的脑图</h1>
          <p className="mt-1 text-xs text-text-subtle">{maps.length} 张已保存脑图</p>
        </div>
        <label className="relative block sm:w-64">
          <span className="sr-only">搜索脑图</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题…"
            className="h-10 w-full rounded-xl border bg-surface px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
        </label>
      </div>

      {message && <p role="status" className="mb-3 text-xs text-text-muted">{message}</p>}
      {!filtered.length ? (
        <div className="card px-5 py-12 text-center text-sm text-text-muted">
          {maps.length ? '没有匹配的脑图' : '还没有保存的脑图'}
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
                    aria-label={`重命名 ${map.title}`}
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
                <Link href={`/m/${map.shareSlug}`} className="hidden text-xs text-text-subtle hover:text-text sm:block">公开链接</Link>
              )}
              <button
                type="button"
                onClick={() => setEditingId(map.id)}
                disabled={pendingId === map.id}
                className="btn btn-ghost h-8 px-2 text-xs"
                aria-label={`重命名 ${map.title}`}
              >
                重命名
              </button>
              <button
                type="button"
                onClick={() => void remove(map)}
                disabled={pendingId === map.id}
                className="btn btn-ghost h-8 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                aria-label={`删除 ${map.title}`}
              >
                {pendingId === map.id ? '处理中…' : '删除'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
