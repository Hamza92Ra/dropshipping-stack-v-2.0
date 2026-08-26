import { query } from '@/lib/db';
import type { Tool } from '@/lib/types';
import ToolCard from '@/components/ToolCard';

export const revalidate = 300;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = slug.replace(/-/g, ' ');
  const tools = await query<Tool>(
    'SELECT * FROM tools WHERE category = ? ORDER BY upvotes DESC',
    [category]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 font-display text-3xl font-bold capitalize">{category}</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
      {tools.length === 0 && (
        <p className="text-[var(--text-muted)]">No tools found in this category yet.</p>
      )}
    </div>
  );
}