import { NextRequest, NextResponse } from 'next/server';
import { authenticate, createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const fd = await req.formData();
  const email = String(fd.get('email') || '').trim();
  const password = String(fd.get('password') || '');

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const session = await authenticate(email, password);
  if (!session) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }
  await createSession(session);
  return NextResponse.json({ ok: true });
}
