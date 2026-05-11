import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const r = await sql`SELECT * FROM faqs ORDER BY display_order ASC, created_at DESC`;
    return NextResponse.json({ faqs: r.rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { question, answer, category, display_order, show_on_home, status } = body;
    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer required' }, { status: 400 });
    }
    const r = await sql`
      INSERT INTO faqs (question, answer, category, display_order, show_on_home, status)
      VALUES (${question}, ${answer}, ${category || null}, ${display_order || 0}, ${!!show_on_home}, ${status || 'published'})
      RETURNING id
    `;
    revalidatePath('/');
    revalidatePath('/faqs');
    return NextResponse.json({ id: r.rows[0].id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
