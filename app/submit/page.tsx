'use client';

import { useState } from 'react';

export default function SubmitPage() {
  const [form, setForm] = useState({ name: '', category: '', website_url: '', description: '' });
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setError(null);

    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Submission failed');
      setStatus('error');
      return;
    }
    setStatus('done');
    setForm({ name: '', category: '', website_url: '', description: '' });
  }

  if (status === 'done') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold">Thanks!</h1>
        <p className="text-[var(--text-muted)]">
          Your submission is in review. We'll add it to the directory once approved.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-2 font-display text-2xl font-bold">Submit a tool</h1>
      <p className="mb-6 text-sm text-[var(--text-muted)]">
        Know a great dropshipping tool that's missing? Suggest it below.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          required
          placeholder="Tool name"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          className="rounded-lg border px-3 py-2"
          style={{ borderColor: 'var(--border)' }}
        />
        <input
          required
          placeholder="Category (e.g. Store Builders)"
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          className="rounded-lg border px-3 py-2"
          style={{ borderColor: 'var(--border)' }}
        />
        <input
          required
          type="url"
          placeholder="Website URL"
          value={form.website_url}
          onChange={(e) => set('website_url', e.target.value)}
          className="rounded-lg border px-3 py-2"
          style={{ borderColor: 'var(--border)' }}
        />
        <textarea
          required
          rows={4}
          minLength={10}
          placeholder="What does it do, and why is it worth listing?"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          className="rounded-lg border px-3 py-2"
          style={{ borderColor: 'var(--border)' }}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={status === 'saving'}
          className="rounded-full bg-sage-500 py-2 font-medium text-white hover:bg-sage-600 disabled:opacity-60"
        >
          {status === 'saving' ? 'Submitting…' : 'Submit for review'}
        </button>
      </form>
    </div>
  );
}
