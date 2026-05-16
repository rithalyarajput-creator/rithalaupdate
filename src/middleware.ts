import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const ADMIN_COOKIE = 'rithala_admin_session';
const SITE_ACCESS_COOKIE = 'rithala_site_access';

// Paths that are always accessible (no coming-soon block)
const ALWAYS_ALLOWED = [
  '/coming-soon',
  '/api/guest-submissions',
  '/api/guest-upload',
  '/api/site-access',
  '/admin',
  '/_next',
  '/favicon',
  '/logo',
  '/robots',
  '/sitemap',
];

const FALLBACK_SECRET = 'rithala-admin-jwt-secret-key-2025-secure-login-xk9';

async function isAdminAuthenticated(token: string | undefined) {
  if (!token) return false;
  const secret = process.env.JWT_SECRET || FALLBACK_SECRET;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- Admin protection ---
  if (pathname.startsWith('/admin')) {
    if (
      pathname.startsWith('/admin/login') ||
      pathname.startsWith('/admin/setup') ||
      pathname.startsWith('/admin/migrate') ||
      pathname.startsWith('/admin/_')
    ) {
      return NextResponse.next();
    }
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    const ok = await isAdminAuthenticated(token);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // --- Blog date-based URL redirect (e.g. /blog/2025/08/10/slug -> /blog/slug) ---
  const blogDateMatch = pathname.match(/^\/blog\/\d{4}\/\d{2}\/\d{2}\/(.+)/);
  if (blogDateMatch) {
    const url = req.nextUrl.clone();
    url.pathname = `/blog/${blogDateMatch[1]}`;
    return NextResponse.redirect(url, 301);
  }

  // --- Coming soon gate ---
  // Allow static assets, API routes, coming-soon itself
  const isAllowed = ALWAYS_ALLOWED.some((p) => pathname.startsWith(p));
  if (isAllowed) return NextResponse.next();

  // Check site access cookie
  const hasAccess = req.cookies.get(SITE_ACCESS_COOKIE)?.value === '1';
  if (!hasAccess) {
    const url = req.nextUrl.clone();
    url.pathname = '/coming-soon';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico|.*\\.webp).*)',
  ],
};
