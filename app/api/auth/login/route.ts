import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { queryOne } from '@/lib/db';
import { createSession } from '@/lib/session';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

type UserRow = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  email_verified: number;
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await queryOne<UserRow>('SELECT * FROM users WHERE email = ?', [email]);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  await createSession({ id: user.id, email: user.email, name: user.name, role: user.role });

  return NextResponse.json({ ok: true, role: user.role });
}
