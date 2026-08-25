import Link from 'next/link';
import Image from 'next/image';
import type { Tool } from '@/lib/types';

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tool/${tool.slug}`}
      className="flex flex-col gap-3 rounded-2xl border p-4 transition hover:shadow-md"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
    >
      <div className="flex items-center gap-3">
        {tool.logo_url ? (
          <Image src={tool.logo_url} alt={tool.name} width={40} height={40} className="rounded-lg" />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-sage-100" />
        )}
        <div>
          <h3 className="font-display text-lg font-semibold">{tool.name}</h3>
          <span className="text-xs text-[var(--text-muted)]">{tool.category}</span>
        </div>
      </div>
      <p className="line-clamp-2 text-sm text-[var(--text-muted)]">{tool.description}</p>
      <div className="mt-auto flex items-center justify-between text-sm">
        <span className="font-medium text-amber-600">{tool.pricing ?? 'See pricing'}</span>
        <span>▲ {tool.upvotes}</span>
      </div>
    </Link>
  );
}
