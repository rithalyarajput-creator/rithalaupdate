import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (typeof body !== 'object' || !body) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  for (const [key, value] of Object.entries(body)) {
    if (typeof value !== 'string' || key.length > 100) continue;
    await sql`
      INSERT INTO settings (key, value)
      VALUES (${key}, ${value})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;
  }

  revalidatePath('/');
  revalidatePath('/contact/');
  revalidatePath('/reels/');
  return NextResponse.json({ ok: true });
}
