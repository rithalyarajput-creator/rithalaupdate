import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const SITE_PASSWORD = 'rithala244';
const COOKIE_NAME = 'rithala_site_access';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password !== SITE_PASSWORD) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, '1', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
  return res;
}
