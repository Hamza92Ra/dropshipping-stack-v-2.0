import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { query } from '@/lib/db';
import type { Tool } from '@/lib/types';

export default async function AdminToolsPage() {
  const user = await getSession();
  if (!user) redirect('/admin/login');
  if (user.role !== 'admin') redirect('/');

  const tools = await query<Tool>('SELECT * FROM tools ORDER BY created_at DESC');

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Manage tools</h1>
        <Link href="/admin/tools/new" className="rounded-lg bg-sage-500 px-4 py-2 text-white hover:bg-sage-600">
          + New tool
        </Link>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
            <th className="py-2">Name</th>
            <th className="py-2">Category</th>
            <th className="py-2">Upvotes</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {tools.map((tool) => (
            <tr key={tool.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
              <td className="py-2">{tool.name}</td>
              <td className="py-2">{tool.category}</td>
              <td className="py-2">{tool.upvotes}</td>
              <td className="py-2 text-right">
                <Link href={`/admin/tools/${tool.id}`} className="text-sage-600 hover:underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
