import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const items = await query(
    'SELECT * FROM roadmap_items WHERE user_id = ? ORDER BY position ASC',
    [user.id]
  );
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const { title } = await req.json();
  if (!title) return NextResponse.json({ error: 'Missing title' }, { status: 400 });

  await query(
    `INSERT INTO roadmap_items (user_id, title, done, position)
     VALUES (?, ?, 0, (SELECT COALESCE(MAX(position), 0) + 1 FROM (SELECT position FROM roadmap_items WHERE user_id = ?) AS x))`,
    [user.id, title, user.id]
  );
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const { id, done } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await query('UPDATE roadmap_items SET done = ? WHERE id = ? AND user_id = ?', [
    done ? 1 : 0,
    id,
    user.id
  ]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await query('DELETE FROM roadmap_items WHERE id = ? AND user_id = ?', [id, user.id]);
  return NextResponse.json({ ok: true });
}
