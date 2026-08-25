'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Tool } from '@/lib/types';

export default function ComparePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const [selected, setSelected] = useState<Tool[]>([]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const handle = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setResults(data.results ?? []));
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  function addTool(tool: Tool) {
    if (selected.length >= 3 || selected.some((t) => t.id === tool.id)) return;
    setSelected((s) => [...s, tool]);
    setQuery('');
    setResults([]);
  }

  function removeTool(id: number) {
    setSelected((s) => s.filter((t) => t.id !== id));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-2 font-display text-3xl font-bold">Compare tools</h1>
      <p className="mb-6 text-sm text-[var(--text-muted)]">Pick up to 3 tools to compare side by side.</p>

      {selected.length < 3 && (
        <div className="relative mb-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools to add…"
            className="w-full rounded-lg border px-3 py-2"
            style={{ borderColor: 'var(--border)' }}
          />
          {results.length > 0 && (
            <ul
              className="absolute z-10 mt-1 w-full rounded-lg border shadow-lg"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
            >
              {results.map((tool) => (
                <li key={tool.id}>
                  <button
                    onClick={() => addTool(tool)}
                    className="w-full px-3 py-2 text-left hover:bg-sage-50"
                  >
                    {tool.name} <span className="text-xs text-[var(--text-muted)]">{tool.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {selected.length === 0 ? (
        <p className="text-[var(--text-muted)]">Search above to start comparing.</p>
      ) : (
        <div
          className={`grid grid-cols-1 gap-4 ${
            { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3' }[selected.length]
          }`}
        >
          {selected.map((tool) => (
            <div
              key={tool.id}
              className="rounded-2xl border p-5"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {tool.logo_url ? (
                    <Image src={tool.logo_url} alt={tool.name} width={32} height={32} className="rounded-md" />
                  ) : (
                    <div className="h-8 w-8 rounded-md bg-sage-100" />
                  )}
                  <h3 className="font-display font-semibold">{tool.name}</h3>
                </div>
                <button onClick={() => removeTool(tool.id)} className="text-xs text-red-600 hover:underline">
                  Remove
                </button>
              </div>
              <dl className="flex flex-col gap-2 text-sm">
                <div>
                  <dt className="text-[var(--text-muted)]">Category</dt>
                  <dd>{tool.category}</dd>
                </div>
                <div>
                  <dt className="text-[var(--text-muted)]">Pricing</dt>
                  <dd>{tool.pricing ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-[var(--text-muted)]">Upvotes</dt>
                  <dd>{tool.upvotes}</dd>
                </div>
                <div>
                  <dt className="text-[var(--text-muted)]">Description</dt>
                  <dd className="text-[var(--text-muted)]">{tool.description}</dd>
                </div>
              </dl>
              <a href={`/tool/${tool.slug}`} className="mt-4 inline-block text-sm text-sage-600 hover:underline">
                View tool →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
