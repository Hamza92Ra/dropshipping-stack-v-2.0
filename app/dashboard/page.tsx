import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { query } from '@/lib/db';

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect('/login');

  const [bookmarkCount] = await query<{ count: number }>(
    'SELECT COUNT(*) as count FROM bookmarks WHERE user_id = ?',
    [user.id]
  );
  const [alertCount] = await query<{ count: number }>(
    'SELECT COUNT(*) as count FROM price_alerts WHERE user_id = ? AND active = 1',
    [user.id]
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 font-display text-3xl font-bold">Welcome back, {user.name}</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <a
          href="/bookmarks"
          className="rounded-2xl border p-6"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
        >
          <p className="text-3xl font-bold">{bookmarkCount?.count ?? 0}</p>
          <p className="text-[var(--text-muted)]">Bookmarked tools</p>
        </a>
        <a
          href="/price-alerts"
          className="rounded-2xl border p-6"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
        >
          <p className="text-3xl font-bold">{alertCount?.count ?? 0}</p>
          <p className="text-[var(--text-muted)]">Active price alerts</p>
        </a>
        <a
          href="/roadmap"
          className="rounded-2xl border p-6"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
        >
          <p className="text-3xl font-bold">→</p>
          <p className="text-[var(--text-muted)]">Your roadmap</p>
        </a>
      </div>
    </div>
  );
}
