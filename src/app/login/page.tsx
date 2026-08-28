'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp, UserRole } from '@/lib/store/app-context';
import { AbstractMark } from '@/components/ui/abstract-mark';
import {
  ShieldCheck,
  UserCheck,
  KeyRound,
  ArrowRight,
  Lock,
  Building,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { setRole, addToast } = useApp();

  const [selectedPersona, setSelectedPersona] = useState<UserRole>('REVIEWER');
  const [govEmail, setGovEmail] = useState('r.kulkarni@pwd.maharashtra.gov.in');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedPersona);
    addToast({
      title: 'Authenticated via MeriPehchaan SSO',
      description: `Logged in as ${selectedPersona.replace('_', ' ')}.`,
      type: 'success',
    });
    router.push('/');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border-hairline rounded-lg shadow-dropdown overflow-hidden">
        {/* Top Tricolour Stripe */}
        <div className="tricolour-hairline" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Lockup */}
          <div className="flex flex-col items-center text-center space-y-2">
            <AbstractMark size={44} />
            <h1 className="font-serif font-bold text-xl text-ink-primary">
              Proof-of-Action (EIIL)
            </h1>
            <span className="text-xs text-ink-secondary">
              National Digital Public Infrastructure Evidence Audit Layer
            </span>
          </div>

          {/* Institutional SSO Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-ink-primary block mb-1">
                Select Audit Role / Persona:
              </label>
              <select
                value={selectedPersona}
                onChange={(e) => setSelectedPersona(e.target.value as any)}
                className="w-full px-3 py-2 rounded bg-surface-sunken border border-border-hairline text-ink-primary font-medium focus:outline-none focus:border-saffron"
              >
                <option value="REVIEWER">Evidence Reviewer (State PWD / Water / Education)</option>
                <option value="PROGRAM_ADMIN">Program Administrator (Ministry / Scheme Level)</option>
                <option value="FIELD_OFFICER">Field Verification Officer (Mobile Node)</option>
                <option value="AUDITOR">Senior Audit Officer (CAG / State Accountant General)</option>
                <option value="API_CLIENT">API Client / Automated System</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-ink-primary block mb-1">
                Government e-Mail / MeriPehchaan ID:
              </label>
              <input
                type="email"
                value={govEmail}
                onChange={(e) => setGovEmail(e.target.value)}
                className="w-full px-3 py-2 rounded bg-surface-sunken border border-border-hairline text-ink-primary font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors shadow-subtle flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate with MeriPehchaan / Parichay SSO</span>
            </button>
          </form>

          {/* Institutional Advisory Note */}
          <div className="pt-4 border-t border-border-hairline text-[10px] text-ink-muted text-center space-y-1">
            <p>
              Access restricted to authorized personnel under IT Act 2000 and GIGW 3.0 standards.
            </p>
            <p>All authentication events and session interactions are cryptographically logged.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

