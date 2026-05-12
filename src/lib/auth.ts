// Authentication helpers  JWT in an HTTP-only cookie.
// Uses `jose` because it works in both Node.js and Edge runtimes.

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { sql } from './db';

const COOKIE_NAME = 'rithala_admin_session';
const ALG = 'HS256';

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'JWT_SECRET environment variable must be set to a string of at least 32 characters'
    );
  }
  return new TextEncoder().encode(secret);
}

export type Session = {
  userId: number;
  email: string;
  role: string;
};

export async function createSession(session: Session) {
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function destroySession() {
  cookies().delete(COOKIE_NAME);
}

export async function getSession(): Promise<Session | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as Session;
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function authenticate(email: string, password: string) {
  const bcrypt = await import('bcryptjs');
  const { rows } = await sql<{
    id: number;
    email: string;
    password_hash: string;
    role: string;
  }>`
    SELECT id, email, password_hash, role FROM users WHERE email = ${email} LIMIT 1
  `;
  const user = rows[0];
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return null;
  return { userId: user.id, email: user.email, role: user.role };
}
