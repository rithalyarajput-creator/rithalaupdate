import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const displayName = body.display_name || null;

  if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: 'Password too short' }, { status: 400 });

  const bcrypt = await import('bcryptjs');
  const hash = await bcrypt.hash(password, 10);

  try {
    const r = await sql<{ id: number }>`
      INSERT INTO users (email, password_hash, display_name, role)
      VALUES (${email}, ${hash}, ${displayName}, 'admin')
      RETURNING id
    `;
    return NextResponse.json({ id: r.rows[0].id });
  } catch (e: any) {
    if (e.message?.includes('duplicate')) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 });
  }
}
