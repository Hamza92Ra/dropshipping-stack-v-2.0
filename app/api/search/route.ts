import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { Tool } from '@/lib/types';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (q.length < 2) return NextResponse.json({ results: [] });

  const results = await query<Tool>(
    `SELECT id, name, slug, category, logo_url
     FROM tools
     WHERE name LIKE ? OR category LIKE ? OR description LIKE ?
     ORDER BY upvotes DESC
     LIMIT 10`,
    [`%${q}%`, `%${q}%`, `%${q}%`]
  );

  return NextResponse.json({ results });
}
