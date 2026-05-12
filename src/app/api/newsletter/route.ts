// POST /api/newsletter — public newsletter signup (saves as a lead)

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  let email = '';
  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const j = await req.json().catch(() => ({}));
    email = String(j.email || '').trim();
  } else {
    const fd = await req.formData().catch(() => null);
    email = fd ? String(fd.get('email') || '').trim() : '';
  }

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || null;
  const ua = req.headers.get('user-agent') || null;

  await sql`
    INSERT INTO leads (name, email, message, source, ip_address, user_agent)
    VALUES ('Newsletter Subscriber', ${email}, 'Newsletter signup from footer', 'newsletter', ${ip}, ${ua})
  `;

  return NextResponse.json({ ok: true, message: 'Subscribed! आपको updates मिलते रहेंगे।' });
}
