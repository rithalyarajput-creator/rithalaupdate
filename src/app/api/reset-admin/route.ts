import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';

// TEMPORARY: Remove this file after login works
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const key = searchParams.get('key');

  if (key !== 'rithala-reset-2025') {
    return NextResponse.json({ error: 'Invalid key' }, { status: 403 });
  }

  const bcrypt = await import('bcryptjs');
  const hash = await bcrypt.hash('rithala@2025', 10);

  // Create table if not exists
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      email         VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      display_name  VARCHAR(100),
      role          VARCHAR(20) NOT NULL DEFAULT 'admin',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Upsert admin user
  await sql`
    INSERT INTO users (email, password_hash, display_name, role)
    VALUES ('rithalyarajput@gmail.com', ${hash}, 'Rithalya Rajput', 'admin')
    ON CONFLICT (email) DO UPDATE SET
      password_hash = ${hash},
      updated_at = NOW()
  `;

  // Return all users to confirm
  const { rows } = await sql`SELECT id, email, role, created_at FROM users`;

  return NextResponse.json({ ok: true, message: 'Password reset to rithala@2025', users: rows });
}
