import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const secret = process.env.NEXTAUTH_SECRET || 'poa-super-secret-session-key-for-jwt-2026';
    const token = await getToken({
      req: request,
      secret,
    });

    if (!token?.id && !token?.sub) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const userId = (token.id as string) || (token.sub as string);

    // Verify current status against database (source of truth)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        district: true,
        state: true,
        pincode: true,
        isAadhaarVerified: true,
        department: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        district: user.district,
        state: user.state,
        pincode: user.pincode,
        isAadhaarVerified: user.isAadhaarVerified,
        department: user.department,
      },
    });
  } catch (error) {
    console.error('[GET /api/auth/me] Error:', error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}

