'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch('/api/auth/reset-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Reset failed');
      return;
    }
    setDone(true);
    setTimeout(() => router.push('/login'), 1500);
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center">
        <p className="text-[var(--text-muted)]">This link is missing its token. Request a new one.</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold">Password updated</h1>
        <p className="text-[var(--text-muted)]">Redirecting you to log in…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 font-display text-2xl font-bold">Set a new password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          required
          minLength={8}
          placeholder="New password (min. 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border px-3 py-2"
          style={{ borderColor: 'var(--border)' }}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="rounded-full bg-sage-500 py-2 font-medium text-white hover:bg-sage-600">
          Update password
        </button>
      </form>
    </div>
  );
}
