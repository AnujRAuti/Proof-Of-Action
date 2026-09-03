import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';

/**
 * POST /api/auth/signup
 *
 * Registers a new user with bcrypt-hashed password.
 * Role is assigned at registration time (not changeable by user).
 */

const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address').optional(),
  phone: z.string().trim().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number (minimum 10 digits)').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['CITIZEN', 'SUPERVISOR', 'REVIEWER', 'PROGRAM_ADMIN', 'AUDITOR']),
  district: z.string().trim().optional(),
  state: z.string().trim().optional(),
  pincode: z.string().trim().optional(),
  department: z.string().trim().optional(),
}).refine(
  (data) => Boolean(data.email || data.phone),
  { message: 'Either email or phone is required', path: ['email'] }
);

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Malformed JSON in request body.' },
        { status: 400 }
      );
    }

    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { name, email, phone, password, role, district, state, pincode, department } = parsed.data;

    const normalizedEmail = email?.toLowerCase();
    const normalizedPhone = phone ? (phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '')}`) : undefined;

    // Check for existing user
    if (normalizedEmail) {
      const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existing) {
        return NextResponse.json({ error: 'Email already registered. Please sign in instead.' }, { status: 409 });
      }
    }
    if (normalizedPhone) {
      const existing = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
      if (existing) {
        return NextResponse.json({ error: 'Phone number already registered. Please sign in instead.' }, { status: 409 });
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone: normalizedPhone,
        passwordHash,
        role,
        district: district || 'Pune',
        state: state || 'Maharashtra',
        pincode,
        department,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        district: true,
        state: true,
        createdAt: true,
      },
    });

    // Record account creation audit event
    try {
      await prisma.auditEvent.create({
        data: {
          actorId: user.id,
          action: 'ACCOUNT_CREATED',
          reason: `New ${user.role} account created for ${user.name}`,
        },
      });
    } catch {}

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/auth/signup] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
