import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route protection & role organization for Proof-of-Action (PoA)
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Legacy reviewer route redirects to /reviewer/*
  const reviewerRedirects: Record<string, string> = {
    '/queue': '/reviewer/queue',
    '/compare': '/reviewer/compare',
    '/map': '/reviewer/map',
    '/audit': '/reviewer/audit',
    '/analytics': '/reviewer/analytics',
    '/field': '/reviewer/field',
    '/ingest': '/reviewer/ingest',
    '/settings': '/reviewer/settings',
    '/about': '/reviewer/about',
  };

  if (reviewerRedirects[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = reviewerRedirects[pathname];
    return NextResponse.redirect(url);
  }

  // Allow next for role-specific routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/queue',
    '/compare',
    '/map',
    '/audit',
    '/analytics',
    '/field',
    '/ingest',
    '/settings',
    '/about',
    '/supervisor/:path*',
    '/reviewer/:path*',
    '/citizen/:path*',
  ],
};
