import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const alerts = await query(
    `SELECT pa.*, t.name, t.slug FROM price_alerts pa
     JOIN tools t ON t.id = pa.tool_id
     WHERE pa.user_id = ?
     ORDER BY pa.id DESC`,
    [user.id]
  );
  return NextResponse.json({ alerts });
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const { toolId, targetPrice } = await req.json();
  if (!toolId || !targetPrice) {
    return NextResponse.json({ error: 'Missing toolId or targetPrice' }, { status: 400 });
  }

  await query(
    'INSERT INTO price_alerts (user_id, tool_id, target_price, active) VALUES (?, ?, ?, 1)',
    [user.id, toolId, targetPrice]
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await query('DELETE FROM price_alerts WHERE id = ? AND user_id = ?', [id, user.id]);
  return NextResponse.json({ ok: true });
}
