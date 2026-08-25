import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import type { Tool } from '@/lib/types';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('tool');
  if (!slug) return NextResponse.json({ error: 'Missing tool' }, { status: 400 });

  const tool = await queryOne<Tool>('SELECT * FROM tools WHERE slug = ?', [slug]);
  if (!tool) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await query('INSERT INTO clicks (tool_id, clicked_at, ip) VALUES (?, NOW(), ?)', [
    tool.id,
    req.headers.get('x-forwarded-for') ?? 'unknown'
  ]);

  return NextResponse.redirect(tool.affiliate_url, { status: 302 });
}
