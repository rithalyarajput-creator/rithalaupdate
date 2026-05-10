import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const name = String(body.name || '').trim();
  const slug = String(body.slug || '').trim();
  if (!name || !slug) return NextResponse.json({ error: 'Name and slug required' }, { status: 400 });

  try {
    const r = await sql<{ id: number }>`
      INSERT INTO categories (slug, name, description)
      VALUES (${slug}, ${name}, ${body.description || null})
      RETURNING id
    `;
    revalidatePath('/');
    return NextResponse.json({ id: r.rows[0].id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 });
  }
}

export async function GET() {
  const r = await sql`SELECT * FROM categories ORDER BY name`;
  return NextResponse.json({ categories: r.rows });
}
