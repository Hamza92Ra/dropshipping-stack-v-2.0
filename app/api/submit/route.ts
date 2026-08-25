import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';

const schema = z.object({
  name: z.string().min(2).max(100),
  category: z.string().min(2).max(100),
  website_url: z.string().url(),
  description: z.string().min(10).max(1000)
});

export async function POST(req: NextRequest) {
  const user = await getSession();
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  const { name, category, website_url, description } = parsed.data;

  await query(
    `INSERT INTO submissions (user_id, name, category, website_url, description, status, created_at)
     VALUES (?, ?, ?, ?, ?, 'pending', NOW())`,
    [user?.id ?? null, name, category, website_url, description]
  );

  return NextResponse.json({ ok: true });
}
