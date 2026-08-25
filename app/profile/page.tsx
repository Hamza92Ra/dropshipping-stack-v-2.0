'use client';

import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setDark(saved === 'dark');
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  // Reset to light globally when leaving the profile page, keeping dark mode
  // scoped to this page only (matches the rest of the site staying light).
  useEffect(() => {
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, []);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-bold">Profile</h1>

      <div
        className="flex items-center justify-between rounded-xl border p-4"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
      >
        <span>Dark mode (this page only)</span>
        <button
          onClick={toggle}
          className="rounded-full px-4 py-1.5 text-sm text-white"
          style={{ backgroundColor: dark ? 'var(--accent-2)' : 'var(--accent)' }}
        >
          {dark ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  );
}
