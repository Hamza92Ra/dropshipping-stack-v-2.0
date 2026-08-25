import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { SignJWT } from 'jose';
import { query, queryOne } from '@/lib/db';
import { createSession } from '@/lib/session';
import { sendMail } from '@/lib/mailer';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8)
});

const secret = () => new TextEncoder().encode(process.env.SECRET_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  const { name, email, password } = parsed.data;

  const existing = await queryOne('SELECT id FROM users WHERE email = ?', [email]);
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 12);
  const result: any = await query(
    'INSERT INTO users (name, email, password, role, email_verified, created_at) VALUES (?, ?, ?, "user", 0, NOW())',
    [name, email, hash]
  );
  const userId = result.insertId;

  const verifyToken = await new SignJWT({ userId, purpose: 'verify-email' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret());

  const verifyUrl = `${process.env.SITE_URL}/verify-email?token=${verifyToken}`;
  await sendMail(
    email,
    'Verify your email',
    `<p>Welcome to DropshippingStack! Click below to verify your email:</p>
     <p><a href="${verifyUrl}">${verifyUrl}</a></p>`
  ).catch(() => {}); // don't block signup on email delivery issues

  await createSession({ id: userId, email, name, role: 'user' });

  return NextResponse.json({ ok: true });
}
