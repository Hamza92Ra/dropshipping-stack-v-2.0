import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { name, category, description, logo_url, website_url, affiliate_url, pricing } = body;

  await query(
    `UPDATE tools SET name = ?, category = ?, description = ?, logo_url = ?, website_url = ?, affiliate_url = ?, pricing = ?
     WHERE id = ?`,
    [name, category, description, logo_url, website_url, affiliate_url, pricing, params.id]
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await query('DELETE FROM tools WHERE id = ?', [params.id]);
  return NextResponse.json({ ok: true });
}
