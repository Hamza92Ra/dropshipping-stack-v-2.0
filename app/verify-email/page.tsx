'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState<'checking' | 'ok' | 'error'>('checking');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then((res) => setStatus(res.ok ? 'ok' : 'error'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      {status === 'checking' && <p>Verifying your email…</p>}
      {status === 'ok' && (
        <>
          <h1 className="mb-2 font-display text-2xl font-bold">Email verified</h1>
          <p className="text-[var(--text-muted)]">You're all set. Head back to your dashboard.</p>
        </>
      )}
      {status === 'error' && (
        <>
          <h1 className="mb-2 font-display text-2xl font-bold">Link expired or invalid</h1>
          <p className="text-[var(--text-muted)]">
            Request a new verification email from your profile page.
          </p>
        </>
      )}
    </div>
  );
}
