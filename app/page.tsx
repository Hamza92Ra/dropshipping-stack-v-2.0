import { query } from '@/lib/db';
import type { Tool } from '@/lib/types';
import ToolCard from '@/components/ToolCard';

export const revalidate = 300; // ISR: refresh every 5 minutes instead of hitting shared MySQL on every request

export default async function HomePage() {
  const tools = await query<Tool>(
    'SELECT * FROM tools ORDER BY upvotes DESC, created_at DESC LIMIT 24'
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold">Find the right dropshipping tools</h1>
        <p className="mt-2 text-[var(--text-muted)]">
          Hand-picked platforms, suppliers, and apps to launch and grow your store.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {tools.length === 0 && (
        <p className="text-center text-[var(--text-muted)]">
          No tools yet — add some from the admin panel.
        </p>
      )}
    </div>
  );
}
