import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { query, queryOne } from '@/lib/db';
import { sendMail } from '@/lib/mailer';

const secret = () => new TextEncoder().encode(process.env.SECRET_KEY);

// POST /api/auth/reset-password  { email }              -> sends reset link
// PUT  /api/auth/reset-password  { token, password }     -> sets new password

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

  const user = await queryOne<{ id: number }>('SELECT id FROM users WHERE email = ?', [email]);
  // Always return ok, even if the email doesn't exist — don't leak which emails are registered
  if (!user) return NextResponse.json({ ok: true });

  const token = await new SignJWT({ userId: user.id, purpose: 'reset-password' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret());

  const resetUrl = `${process.env.SITE_URL}/reset-password?token=${token}`;
  await sendMail(
    email,
    'Reset your password',
    `<p>Click below to set a new password. This link expires in 1 hour.</p>
     <p><a href="${resetUrl}">${resetUrl}</a></p>`
  );

  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password || password.length < 8) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.purpose !== 'reset-password') throw new Error('wrong purpose');

    const hash = await bcrypt.hash(password, 12);
    await query('UPDATE users SET password = ? WHERE id = ?', [hash, payload.userId]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid or expired link' }, { status: 400 });
  }
}
