import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.NEXTAUTH_SECRET || 'poa-super-secret-session-key-for-jwt-2026';
    const token = await getToken({
      req: request,
      secret,
    });

    if (token?.id) {
      try {
        await prisma.auditEvent.create({
          data: {
            actorId: token.id as string,
            action: 'LOGOUT',
            reason: 'User initiated logout',
          },
        });
      } catch {}
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully.',
    });

    // Invalidate cookies
    response.cookies.set({
      name: 'next-auth.session-token',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });

    response.cookies.set({
      name: '__Secure-next-auth.session-token',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('[POST /api/auth/logout] Error:', error);
    return NextResponse.json({ success: true }, { status: 200 });
  }
}

