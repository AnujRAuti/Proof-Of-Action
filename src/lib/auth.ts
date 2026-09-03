import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import type { UserRole } from '@prisma/client';

/**
 * NextAuth.js configuration for Proof-of-Action.
 *
 * Supports two authentication modes:
 * 1. Real credentials — email/phone + password (production flow)
 * 2. Demo login — role-based quick login for SIH presentation
 *
 * JWT strategy (stateless) — role is embedded in the token.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const identifier = credentials.email.trim();
        const normalizedEmail = identifier.toLowerCase();
        const normalizedPhone = identifier.startsWith('+91') ? identifier : `+91${identifier.replace(/\D/g, '')}`;

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: normalizedEmail },
              { phone: identifier },
              { phone: normalizedPhone },
            ],
          },
        });

        if (!user || !user.isActive) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email || '',
          role: user.role,
          district: user.district || '',
          state: user.state || '',
          department: user.department || '',
        };
      },
    }),

    // Demo login provider — pick a role, get an instant session
    CredentialsProvider({
      id: 'demo',
      name: 'Demo Login',
      credentials: {
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        const role = credentials?.role as UserRole | undefined;
        if (!role) return null;

        // Find or create a demo user for this role
        const demoEmail = `demo-${role.toLowerCase()}@poa.gov.in`;
        let user = await prisma.user.findUnique({ where: { email: demoEmail } });

        if (!user) {
          const demoProfiles: Record<string, { name: string; department?: string }> = {
            CITIZEN: { name: 'Ramesh Sharma (Demo Citizen)' },
            SUPERVISOR: { name: 'Suresh Patil (Demo Supervisor)', department: 'PMGSY Rural Roads Division' },
            REVIEWER: { name: 'Rajesh Kulkarni (Demo Reviewer)', department: 'State Quality Audit Division' },
            PROGRAM_ADMIN: { name: 'Admin (Demo)', department: 'Central Programme Office' },
            AUDITOR: { name: 'Auditor (Demo)', department: 'CAG Field Office' },
          };

          const profile = demoProfiles[role] || { name: `Demo ${role}` };
          const hash = await bcrypt.hash('demo-password', 10);

          user = await prisma.user.create({
            data: {
              name: profile.name,
              email: demoEmail,
              passwordHash: hash,
              role: role,
              department: profile.department,
              district: 'Pune',
              state: 'Maharashtra',
              isAadhaarVerified: true,
            },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          district: user.district,
          state: user.state,
          department: user.department,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, embed role + profile info in JWT
      if (user) {
        const u = user as unknown as Record<string, unknown>;
        token.id = user.id;
        token.role = u.role as string;
        token.district = u.district as string;
        token.state = u.state as string;
        token.department = u.department as string;
      }
      return token;
    },

    async session({ session, token }) {
      // Expose role + profile info to client via useSession()
      if (session.user) {
        const su = session.user as unknown as Record<string, unknown>;
        su.id = token.id;
        su.role = token.role;
        su.district = token.district;
        su.state = token.state;
        su.department = token.department;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// ─── Type augmentation for NextAuth ──────────────────────────────────────────

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      district?: string;
      state?: string;
      department?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    district?: string;
    state?: string;
    department?: string;
  }
}
