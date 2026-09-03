import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { encode } from 'next-auth/jwt';
import { prisma } from '@/lib/db';

const loginSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(1, 'Password is required'),
  requiredRole: z.enum(['CITIZEN', 'SUPERVISOR', 'REVIEWER', 'PROGRAM_ADMIN', 'AUDITOR']).optional(),
}).refine((data) => Boolean(data.email?.trim() || data.phone?.trim()), {
  message: 'Email or phone number is required',
  path: ['email'],
});

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: { code: 'INVALID_JSON', message: 'Malformed JSON payload.' } },
        { status: 400 }
      );
    }

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Email and password are required.';
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: firstError, details: parsed.error.flatten().fieldErrors } },
        { status: 422 }
      );
    }

    const { email, phone, password, requiredRole } = parsed.data;

    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPhone = phone?.trim();

    // 1. Query database for user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
          ...(normalizedPhone ? [{ phone: normalizedPhone }, { phone: `+91${normalizedPhone.replace(/\D/g, '')}` }] : []),
        ],
      },
    });

    if (!user) {
      // Audit failed login attempt
      try {
        await prisma.auditEvent.create({
          data: {
            actorId: 'anonymous',
            action: 'LOGIN_FAILED',
            reason: `Attempted login for nonexistent user: ${normalizedEmail || normalizedPhone}`,
          },
        });
      } catch {}

      return NextResponse.json(
        { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } },
        { status: 401 }
      );
    }

    // 2. Verify password hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      try {
        await prisma.auditEvent.create({
          data: {
            actorId: user.id,
            action: 'LOGIN_FAILED',
            reason: `Invalid password attempt for account: ${user.email || user.phone}`,
          },
        });
      } catch {}

      return NextResponse.json(
        { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } },
        { status: 401 }
      );
    }

    // 3. Verify account active status
    if (!user.isActive) {
      return NextResponse.json(
        { error: { code: 'ACCOUNT_DISABLED', message: 'This account is disabled. Please contact an administrator.' } },
        { status: 403 }
      );
    }

    // 4. Verify role permissions if a specific portal was requested
    if (requiredRole) {
      const rolePermissions: Record<string, string[]> = {
        REVIEWER: ['REVIEWER', 'PROGRAM_ADMIN', 'AUDITOR'],
        SUPERVISOR: ['SUPERVISOR', 'PROGRAM_ADMIN'],
        CITIZEN: ['CITIZEN', 'PROGRAM_ADMIN'],
      };

      const allowed = rolePermissions[requiredRole] || [requiredRole];
      if (!allowed.includes(user.role)) {
        const portalNames: Record<string, string> = {
          REVIEWER: 'Reviewer Portal',
          SUPERVISOR: 'Supervisor Portal',
          CITIZEN: 'Citizen Portal',
        };
        return NextResponse.json(
          {
            error: {
              code: 'UNAUTHORIZED_ROLE',
              message: `This account does not have ${portalNames[requiredRole] || requiredRole} access.`,
            },
          },
          { status: 403 }
        );
      }
    }

    // 5. Generate secure JWT session token compatible with NextAuth
    const secret = process.env.NEXTAUTH_SECRET || 'poa-super-secret-session-key-for-jwt-2026';
    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email || undefined,
      role: user.role,
      district: user.district || undefined,
      state: user.state || undefined,
      department: user.department || undefined,
      sub: user.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    };

    const sessionToken = await encode({
      token: tokenPayload,
      secret,
      maxAge: 24 * 60 * 60,
    });

    // 6. Record successful login audit event
    try {
      await prisma.auditEvent.create({
        data: {
          actorId: user.id,
          action: 'LOGIN_SUCCESS',
          reason: `Authenticated as ${user.role}`,
          metadata: JSON.stringify({ ip: request.headers.get('x-forwarded-for') || 'local' }),
        },
      });
    } catch {}

    // Determine redirect destination
    const redirectMap: Record<string, string> = {
      CITIZEN: '/citizen',
      SUPERVISOR: '/supervisor',
      REVIEWER: '/reviewer',
      PROGRAM_ADMIN: '/reviewer',
      AUDITOR: '/reviewer',
    };

    const response = NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        district: user.district,
        state: user.state,
        department: user.department,
      },
      redirectUrl: redirectMap[user.role] || '/citizen',
    });

    // Set secure HTTP-only NextAuth session cookies
    const cookieName =
      process.env.NODE_ENV === 'production' && request.url.startsWith('https://')
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token';

    response.cookies.set({
      name: cookieName,
      value: sessionToken,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production' && request.url.startsWith('https://'),
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('[POST /api/auth/login] Error:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Unable to connect to the authentication service. Please try again.' } },
      { status: 500 }
    );
  }
}

