// POST /api/leads — public endpoint for contact form submissions
// GET  /api/leads — admin only (used by Leads list)

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  // Public — no auth check
  const fd = await req.formData().catch(() => null);
  let name = '';
  let email = '';
  let phone = '';
  let subject = '';
  let message = '';
  let source = 'contact_form';

  const VALID_SOURCES = ['contact_form', 'blog_form', 'newsletter'];

  if (fd) {
    name = String(fd.get('name') || '').trim();
    email = String(fd.get('email') || '').trim();
    phone = String(fd.get('phone') || '').trim();
    subject = String(fd.get('subject') || '').trim();
    message = String(fd.get('message') || '').trim();
    const s = String(fd.get('source') || '').trim();
    if (VALID_SOURCES.includes(s)) source = s;
  } else {
    const j = await req.json().catch(() => ({}));
    name = String(j.name || '').trim();
    email = String(j.email || '').trim();
    phone = String(j.phone || '').trim();
    subject = String(j.subject || '').trim();
    message = String(j.message || '').trim();
    const s = String(j.source || '').trim();
    if (VALID_SOURCES.includes(s)) source = s;
  }

  if (!name || !message) {
    return NextResponse.json({ error: 'Name and message are required' }, { status: 400 });
  }

  // Basic spam/honeypot check
  if (message.length > 5000) {
    return NextResponse.json({ error: 'Message too long' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || null;
  const ua = req.headers.get('user-agent') || null;

  await sql`
    INSERT INTO leads (name, email, phone, subject, message, source, ip_address, user_agent)
    VALUES (${name}, ${email || null}, ${phone || null}, ${subject || null}, ${message}, ${source}, ${ip}, ${ua})
  `;

  return NextResponse.json({ ok: true, message: 'Thank you! We will get back to you soon.' });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const r = await sql`SELECT * FROM leads ORDER BY created_at DESC LIMIT 200`;
  return NextResponse.json({ leads: r.rows });
}
