import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const bookmarks = await query(
    `SELECT t.* FROM bookmarks b
     JOIN tools t ON t.id = b.tool_id
     WHERE b.user_id = ?
     ORDER BY b.created_at DESC`,
    [user.id]
  );
  return NextResponse.json({ bookmarks });
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const { toolId } = await req.json();
  if (!toolId) return NextResponse.json({ error: 'Missing toolId' }, { status: 400 });

  await query(
    'INSERT IGNORE INTO bookmarks (user_id, tool_id, created_at) VALUES (?, ?, NOW())',
    [user.id, toolId]
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const toolId = req.nextUrl.searchParams.get('toolId');
  if (!toolId) return NextResponse.json({ error: 'Missing toolId' }, { status: 400 });

  await query('DELETE FROM bookmarks WHERE user_id = ? AND tool_id = ?', [user.id, toolId]);
  return NextResponse.json({ ok: true });
}
