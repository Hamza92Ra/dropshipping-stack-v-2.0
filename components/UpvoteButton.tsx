'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UpvoteButton({ toolId, initialCount }: { toolId: number; initialCount: number }) {
  const router = useRouter();
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(false);

  async function handleUpvote() {
    if (voted) return;
    setVoted(true);
    setCount((c) => c + 1);

    const res = await fetch('/api/upvote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolId })
    });

    if (!res.ok) {
      if (res.status === 401) router.push('/login');
      setVoted(false);
      setCount((c) => c - 1);
    }
  }

  return (
    <button
      onClick={handleUpvote}
      disabled={voted}
      className="flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium disabled:opacity-70"
      style={{ borderColor: 'var(--border)' }}
    >
      ▲ {count}
    </button>
  );
}
