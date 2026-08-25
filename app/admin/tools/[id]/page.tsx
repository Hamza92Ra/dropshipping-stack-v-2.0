import { redirect, notFound } from 'next/navigation';
import { getSession } from '@/lib/session';
import { queryOne } from '@/lib/db';
import type { Tool } from '@/lib/types';
import AdminToolForm from '@/components/AdminToolForm';

export default async function EditToolPage({ params }: { params: { id: string } }) {
  const user = await getSession();
  if (!user) redirect('/admin/login');
  if (user.role !== 'admin') redirect('/');

  const tool = await queryOne<Tool>('SELECT * FROM tools WHERE id = ?', [params.id]);
  if (!tool) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-bold">Edit tool</h1>
      <AdminToolForm tool={tool} />
    </div>
  );
}
