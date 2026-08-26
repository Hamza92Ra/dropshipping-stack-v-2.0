import { notFound } from 'next/navigation';
import { queryOne } from '@/lib/db';
import type { Tool } from '@/lib/types';
import Image from 'next/image';
import UpvoteButton from '@/components/UpvoteButton';

export const revalidate = 300;

export default async function ToolPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const tool = await queryOne<Tool>('SELECT * FROM tools WHERE slug = ?', [slug]);
    if (!tool) notFound();

    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <div className="flex items-center gap-4">
                {tool.logo_url ? (
                    <Image src={tool.logo_url} alt={tool.name} width={56} height={56} className="rounded-xl" />
                ) : (
                    <div className="h-14 w-14 rounded-xl bg-sage-100" />
                )}
                <div>
                    <h1 className="font-display text-3xl font-bold">{tool.name}</h1>
                    <span className="text-sm text-[var(--text-muted)]">{tool.category}</span>
                </div>
            </div>

            <p className="mt-6 leading-relaxed">{tool.description}</p>

            <div className="mt-8 flex items-center gap-4">
                <a>
                    href={`/api/go?tool=${tool.slug}`}
                    className="rounded-full bg-sage-500 px-6 py-2 font-medium text-white hover:bg-sage-600"
                    Visit {tool.name} →
                </a>
                <span className="text-amber-600">{tool.pricing ?? 'See pricing'}</span>
                <UpvoteButton toolId={tool.id} initialCount={tool.upvotes} />
            </div>
        </div>
    );
}