'use client';

import { useEffect, useState } from 'react';

type RoadmapItem = { id: number; title: string; done: number };

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [title, setTitle] = useState('');

  function load() {
    fetch('/api/roadmap')
      .then((res) => res.json())
      .then((data) => setItems(data.items ?? []));
  }

  useEffect(load, []);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch('/api/roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    setTitle('');
    load();
  }

  async function toggle(item: RoadmapItem) {
    await fetch('/api/roadmap', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, done: !item.done })
    });
    load();
  }

  async function remove(id: number) {
    await fetch(`/api/roadmap?id=${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 font-display text-3xl font-bold">Your roadmap</h1>

      <form onSubmit={addItem} className="mb-6 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a step, e.g. Pick a niche"
          className="flex-1 rounded-lg border px-3 py-2"
          style={{ borderColor: 'var(--border)' }}
        />
        <button type="submit" className="rounded-lg bg-sage-500 px-4 py-2 text-white hover:bg-sage-600">
          Add
        </button>
      </form>

      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-lg border px-4 py-3"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
          >
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={!!item.done} onChange={() => toggle(item)} />
              <span className={item.done ? 'line-through text-[var(--text-muted)]' : ''}>{item.title}</span>
            </label>
            <button onClick={() => remove(item.id)} className="text-sm text-red-600 hover:underline">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
