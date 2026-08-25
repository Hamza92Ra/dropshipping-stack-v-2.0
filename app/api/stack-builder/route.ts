import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const stacks = await query(
    'SELECT * FROM stacks WHERE user_id = ? ORDER BY created_at DESC',
    [user.id]
  );
  return NextResponse.json({ stacks });
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const { name, toolIds } = await req.json();
  if (!name || !Array.isArray(toolIds) || toolIds.length === 0) {
    return NextResponse.json({ error: 'Missing name or toolIds' }, { status: 400 });
  }

  await query(
    'INSERT INTO stacks (user_id, name, tool_ids, created_at) VALUES (?, ?, ?, NOW())',
    [user.id, name, JSON.stringify(toolIds)]
  );

  return NextResponse.json({ ok: true });
}
