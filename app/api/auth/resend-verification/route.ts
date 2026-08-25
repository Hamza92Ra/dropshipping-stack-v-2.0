import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { getSession } from '@/lib/session';
import { sendMail } from '@/lib/mailer';

const secret = () => new TextEncoder().encode(process.env.SECRET_KEY);

export async function POST() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const token = await new SignJWT({ userId: user.id, purpose: 'verify-email' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret());

  const verifyUrl = `${process.env.SITE_URL}/verify-email?token=${token}`;
  await sendMail(
    user.email,
    'Verify your email',
    `<p>Click below to verify your email:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`
  );

  return NextResponse.json({ ok: true });
}
