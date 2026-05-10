// One-time admin user creation endpoint.
// Protected by ADMIN_SETUP_TOKEN env var.

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const expectedToken = process.env.ADMIN_SETUP_TOKEN;
  if (!expectedToken) {
    return NextResponse.json(
      { error: 'Setup disabled — ADMIN_SETUP_TOKEN not set' },
      { status: 403 }
    );
  }

  const fd = await req.formData();
  const token = String(fd.get('token') || '');
  const email = String(fd.get('email') || '').trim().toLowerCase();
  const password = String(fd.get('password') || '');
  const displayName = String(fd.get('display_name') || '').trim() || null;

  if (token !== expectedToken) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }
  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password required' },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: 'Password must be at least 6 characters' },
      { status: 400 }
    );
  }

  const bcrypt = await import('bcryptjs');
  const passwordHash = await bcrypt.hash(password, 10);

  // Ensure users table exists (in case schema not run yet)
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      email         VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      display_name  VARCHAR(100),
      role          VARCHAR(20)  NOT NULL DEFAULT 'admin',
      created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    INSERT INTO users (email, password_hash, display_name, role)
    VALUES (${email}, ${passwordHash}, ${displayName}, 'admin')
    ON CONFLICT (email) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      display_name  = COALESCE(EXCLUDED.display_name, users.display_name),
      updated_at    = NOW()
  `;

  return NextResponse.json({ ok: true, email });
}
