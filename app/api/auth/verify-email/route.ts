import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { query } from '@/lib/db';

const secret = () => new TextEncoder().encode(process.env.SECRET_KEY);

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.purpose !== 'verify-email') throw new Error('wrong purpose');

    await query('UPDATE users SET email_verified = 1 WHERE id = ?', [payload.userId]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid or expired link' }, { status: 400 });
  }
}
