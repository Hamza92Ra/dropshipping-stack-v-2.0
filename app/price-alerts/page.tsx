'use client';

import { useEffect, useState } from 'react';

type Alert = {
  id: number;
  tool_id: number;
  name: string;
  slug: string;
  target_price: number;
  active: number;
};

export default function PriceAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    fetch('/api/price-alerts')
      .then((res) => res.json())
      .then((data) => setAlerts(data.alerts ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function removeAlert(id: number) {
    await fetch(`/api/price-alerts?id=${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 font-display text-3xl font-bold">Price alerts</h1>
      {loading && <p className="text-[var(--text-muted)]">Loading…</p>}
      {!loading && alerts.length === 0 && (
        <p className="text-[var(--text-muted)]">No active alerts. Set one from a tool's page.</p>
      )}
      <ul className="flex flex-col gap-3">
        {alerts.map((a) => (
          <li
            key={a.id}
            className="flex items-center justify-between rounded-xl border p-4"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
          >
            <div>
              <p className="font-medium">{a.name}</p>
              <p className="text-sm text-[var(--text-muted)]">Alert below ${a.target_price}</p>
            </div>
            <button onClick={() => removeAlert(a.id)} className="text-sm text-red-600 hover:underline">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
