import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const { name, slug, category, description, logo_url, website_url, affiliate_url, pricing } = body;

  if (!name || !slug || !category || !website_url || !affiliate_url) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await query(
    `INSERT INTO tools (name, slug, category, description, logo_url, website_url, affiliate_url, pricing, upvotes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW())`,
    [name, slug, category, description ?? '', logo_url ?? null, website_url, affiliate_url, pricing ?? null]
  );

  return NextResponse.json({ ok: true });
}
