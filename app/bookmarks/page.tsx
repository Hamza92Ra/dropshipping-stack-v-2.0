'use client';

import { useEffect, useState } from 'react';
import ToolCard from '@/components/ToolCard';
import type { Tool } from '@/lib/types';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bookmarks')
      .then((res) => res.json())
      .then((data) => setBookmarks(data.bookmarks ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 font-display text-3xl font-bold">Your bookmarks</h1>
      {loading && <p className="text-[var(--text-muted)]">Loading…</p>}
      {!loading && bookmarks.length === 0 && (
        <p className="text-[var(--text-muted)]">No bookmarks yet — browse tools and save your favorites.</p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
