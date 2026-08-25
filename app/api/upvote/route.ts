import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const { toolId } = await req.json();
  if (!toolId) return NextResponse.json({ error: 'Missing toolId' }, { status: 400 });

  const existing = await queryOne(
    'SELECT id FROM upvotes WHERE user_id = ? AND tool_id = ?',
    [user.id, toolId]
  );
  if (existing) {
    return NextResponse.json({ error: 'Already upvoted' }, { status: 409 });
  }

  await query('INSERT INTO upvotes (user_id, tool_id, created_at) VALUES (?, ?, NOW())', [
    user.id,
    toolId
  ]);
  await query('UPDATE tools SET upvotes = upvotes + 1 WHERE id = ?', [toolId]);

  return NextResponse.json({ ok: true });
}
