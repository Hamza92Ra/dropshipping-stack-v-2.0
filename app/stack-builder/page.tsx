'use client';

import { useEffect, useState } from 'react';
import type { Tool } from '@/lib/types';

type Stack = { id: number; name: string; tool_ids: string; created_at: string };

export default function StackBuilderPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const [selected, setSelected] = useState<Tool[]>([]);
  const [name, setName] = useState('');
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadStacks() {
    fetch('/api/stack-builder')
      .then((res) => (res.ok ? res.json() : { stacks: [] }))
      .then((data) => setStacks(data.stacks ?? []));
  }

  useEffect(loadStacks, []);

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
    if (selected.some((t) => t.id === tool.id)) return;
    setSelected((s) => [...s, tool]);
    setQuery('');
    setResults([]);
  }

  function removeTool(id: number) {
    setSelected((s) => s.filter((t) => t.id !== id));
  }

  async function saveStack(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || selected.length === 0) return;
    setSaving(true);
    setError(null);

    const res = await fetch('/api/stack-builder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, toolIds: selected.map((t) => t.id) })
    });

    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(res.status === 401 ? 'Log in to save a stack.' : data.error ?? 'Save failed');
      return;
    }
    setName('');
    setSelected([]);
    loadStacks();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 font-display text-3xl font-bold">Stack Builder</h1>
      <p className="mb-6 text-sm text-[var(--text-muted)]">
        Put together your dropshipping toolkit and save it for later.
      </p>

      <div className="relative mb-4">
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
                <button onClick={() => addTool(tool)} className="w-full px-3 py-2 text-left hover:bg-sage-50">
                  {tool.name} <span className="text-xs text-[var(--text-muted)]">{tool.category}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className="mb-6 flex flex-col gap-2">
        {selected.map((tool) => (
          <li
            key={tool.id}
            className="flex items-center justify-between rounded-lg border px-3 py-2"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
          >
            <span>{tool.name}</span>
            <button onClick={() => removeTool(tool.id)} className="text-xs text-red-600 hover:underline">
              Remove
            </button>
          </li>
        ))}
      </ul>

      {selected.length > 0 && (
        <form onSubmit={saveStack} className="mb-10 flex gap-2">
          <input
            required
            placeholder="Name this stack, e.g. My Print-on-Demand Setup"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-lg border px-3 py-2"
            style={{ borderColor: 'var(--border)' }}
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-sage-500 px-4 py-2 text-white hover:bg-sage-600 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save stack'}
          </button>
        </form>
      )}
      {error && <p className="mb-6 text-sm text-red-600">{error}</p>}

      {stacks.length > 0 && (
        <>
          <h2 className="mb-3 font-display text-xl font-semibold">Your saved stacks</h2>
          <ul className="flex flex-col gap-2">
            {stacks.map((s) => (
              <li
                key={s.id}
                className="rounded-lg border px-3 py-2"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
              >
                {s.name}{' '}
                <span className="text-xs text-[var(--text-muted)]">
                  ({JSON.parse(s.tool_ids).length} tools)
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
