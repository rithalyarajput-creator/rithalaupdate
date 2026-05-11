import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const all = url.searchParams.get('all') === '1';
  try {
    if (all) {
      const session = await getSession();
      if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const r = await sql`SELECT * FROM testimonials ORDER BY created_at DESC`;
      return NextResponse.json({ testimonials: r.rows });
    }
    const r = await sql`SELECT id, name, avatar_url, message, rating, location, created_at FROM testimonials WHERE status = 'approved' ORDER BY created_at DESC LIMIT 30`;
    return NextResponse.json({ testimonials: r.rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, avatar_url, message, rating, location, submitter_session } = body;
    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message required' }, { status: 400 });
    }
    const r = await sql`
      INSERT INTO testimonials (name, phone, email, avatar_url, message, rating, location, status, submitter_session)
      VALUES (${name}, ${phone || null}, ${email || null}, ${avatar_url || null}, ${message}, ${Math.min(5, Math.max(1, Number(rating) || 5))}, ${location || null}, 'pending', ${submitter_session || null})
      RETURNING id
    `;
    return NextResponse.json({ id: r.rows[0].id, message: 'Thank you! Your testimonial is pending approval.' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
