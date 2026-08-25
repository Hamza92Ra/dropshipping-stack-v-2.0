'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-2xl font-bold">Check your email</h1>
        <p className="text-[var(--text-muted)]">
          If an account exists for {email}, a reset link is on its way.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 font-display text-2xl font-bold">Reset your password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border px-3 py-2"
          style={{ borderColor: 'var(--border)' }}
        />
        <button type="submit" className="rounded-full bg-sage-500 py-2 font-medium text-white hover:bg-sage-600">
          Send reset link
        </button>
      </form>
    </div>
  );
}
