import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export type SessionUser = {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
};

const COOKIE_NAME = 'ds_session';
const secret = () => new TextEncoder().encode(process.env.SECRET_KEY);

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export function destroySession() {
  cookies().delete(COOKIE_NAME);
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) throw new Error('UNAUTHENTICATED');
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== 'admin') throw new Error('FORBIDDEN');
  return user;
}
