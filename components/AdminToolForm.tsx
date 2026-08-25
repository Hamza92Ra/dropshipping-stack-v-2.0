'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Tool } from '@/lib/types';

export default function AdminToolForm({ tool }: { tool?: Tool }) {
  const router = useRouter();
  const isEdit = !!tool;
  const [form, setForm] = useState({
    name: tool?.name ?? '',
    slug: tool?.slug ?? '',
    category: tool?.category ?? '',
    description: tool?.description ?? '',
    logo_url: tool?.logo_url ?? '',
    website_url: tool?.website_url ?? '',
    affiliate_url: tool?.affiliate_url ?? '',
    pricing: tool?.pricing ?? ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = isEdit ? `/api/admin/tools/${tool!.id}` : '/api/admin/tools';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Save failed');
      return;
    }
    router.push('/admin/tools');
    router.refresh();
  }

  async function handleDelete() {
    if (!tool || !confirm(`Delete ${tool.name}?`)) return;
    await fetch(`/api/admin/tools/${tool.id}`, { method: 'DELETE' });
    router.push('/admin/tools');
    router.refresh();
  }

  const fields: { key: keyof typeof form; label: string; required?: boolean }[] = [
    { key: 'name', label: 'Name', required: true },
    { key: 'slug', label: 'Slug (URL, e.g. shopify)', required: !isEdit },
    { key: 'category', label: 'Category', required: true },
    { key: 'description', label: 'Description' },
    { key: 'logo_url', label: 'Logo URL' },
    { key: 'website_url', label: 'Website URL', required: true },
    { key: 'affiliate_url', label: 'Affiliate URL', required: true },
    { key: 'pricing', label: 'Pricing label (e.g. "From $29/mo")' }
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fields.map((f) => {
  const isSlug = f.key === 'slug';

  return (
    <label key={f.key} className="flex flex-col gap-1 text-sm">
      <span>{f.label}</span>

      {f.key === 'description' ? (
        <textarea
          value={form[f.key]}
          onChange={(e) => set(f.key, e.target.value)}
          required={f.required}
          disabled={isEdit && isSlug}
          rows={4}
          className="rounded-lg border px-3 py-2"
          style={{ borderColor: 'var(--border)' }}
        />
      ) : (
        <input
          value={form[f.key]}
          onChange={(e) => set(f.key, e.target.value)}
          required={f.required}
          disabled={isEdit && isSlug}
          className="rounded-lg border px-3 py-2"
          style={{ borderColor: 'var(--border)' }}
        />
      )}
    </label>
  );
})}


      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-sage-500 px-4 py-2 text-white hover:bg-sage-600 disabled:opacity-60"
        >
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create tool'}
        </button>
        {isEdit && (
          <button type="button" onClick={handleDelete} className="text-sm text-red-600 hover:underline">
            Delete tool
          </button>
        )}
      </div>
    </form>
  );
}
