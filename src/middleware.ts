import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware for Proof-of-Action (PoA)
 *
 * Responsibilities:
 * 1. Legacy route redirects (bare /queue → /reviewer/queue)
 * 2. Authentication enforcement (redirect to /login if no session)
 * 3. Role-based access control (CITIZEN can't access /reviewer/*, etc.)
 */

// Routes that don't require authentication
const PUBLIC_PATHS = new Set([
  '/',
  '/login',
  '/signup',
  '/about',
  '/api/health',
  '/citizen/login',
  '/supervisor/login',
  '/reviewer/login',
]);

const PUBLIC_PREFIXES = [
  '/api/auth/',
  '/_next/',
  '/images/',
  '/favicon',
];

// Role-to-route mapping for RBAC
const ROLE_ROUTES: Record<string, string[]> = {
  CITIZEN: ['/citizen'],
  SUPERVISOR: ['/supervisor', '/onboarding/supervisor'],
  REVIEWER: ['/reviewer'],
  PROGRAM_ADMIN: ['/reviewer', '/supervisor', '/citizen'],
  AUDITOR: ['/reviewer'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public paths and prefixes
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next();

  // 2. Legacy reviewer route redirects
  const reviewerRedirects: Record<string, string> = {
    '/queue': '/reviewer/queue',
    '/compare': '/reviewer/compare',
    '/map': '/reviewer/map',
    '/audit': '/reviewer/audit',
    '/analytics': '/reviewer/analytics',
    '/field': '/reviewer/field',
    '/ingest': '/reviewer/ingest',
    '/settings': '/reviewer/settings',
  };

  if (reviewerRedirects[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = reviewerRedirects[pathname];
    return NextResponse.redirect(url);
  }

  // 3. Check authentication via JWT
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If no token and accessing a protected route, redirect to login
  if (!token) {
    // For API routes, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For page routes, redirect to login
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Role-based access control for role-specific routes
  const userRole = token.role as string;
  const allowedPrefixes = ROLE_ROUTES[userRole] || [];

  // Check if the current path is a role-specific route
  const isRoleRoute =
    pathname.startsWith('/citizen') ||
    pathname.startsWith('/supervisor') ||
    pathname.startsWith('/reviewer');

  if (isRoleRoute) {
    const isAllowed = allowedPrefixes.some((prefix) => pathname.startsWith(prefix));
    if (!isAllowed) {
      // Redirect to appropriate dashboard
      const dashboardMap: Record<string, string> = {
        CITIZEN: '/citizen',
        SUPERVISOR: '/supervisor',
        REVIEWER: '/reviewer',
        PROGRAM_ADMIN: '/reviewer',
        AUDITOR: '/reviewer',
      };
      const url = request.nextUrl.clone();
      url.pathname = dashboardMap[userRole] || '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
