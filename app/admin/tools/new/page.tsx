import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import AdminToolForm from '@/components/AdminToolForm';

export default async function NewToolPage() {
  const user = await getSession();
  if (!user) redirect('/admin/login');
  if (user.role !== 'admin') redirect('/');

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl font-bold">New tool</h1>
      <AdminToolForm />
    </div>
  );
}
