// Middleware: protect /admin/* (except /admin/login) and redirect
// unauthenticated users to the login page.

import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'rithala_admin_session';

async function isAuthenticated(token: string | undefined) {
  if (!token) return false;
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // only guard /admin/*, but allow login, setup, and migrate through
  if (!pathname.startsWith('/admin')) return NextResponse.next();
  if (pathname.startsWith('/admin/login')) return NextResponse.next();
  if (pathname.startsWith('/admin/setup')) return NextResponse.next();
  if (pathname.startsWith('/admin/migrate')) return NextResponse.next();
  if (pathname.startsWith('/admin/_')) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const ok = await isAuthenticated(token);
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
