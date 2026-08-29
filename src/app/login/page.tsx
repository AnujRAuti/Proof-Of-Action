'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import { AbstractMark } from '@/components/ui/abstract-mark';
import {
  ShieldCheck,
  Users,
  Camera,
  ArrowRight,
  CheckCircle2,
  Lock,
  Smartphone,
  KeyRound,
  Building2,
} from 'lucide-react';

export default function UnifiedLoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { loginUser } = useApp();

  const [selectedRole, setSelectedRole] = useState<'CITIZEN' | 'SUPERVISOR' | 'REVIEWER'>('CITIZEN');

  // Citizen state
  const [citizenPhone, setCitizenPhone] = useState('+91 98230 11223');
  const [citizenOtp, setCitizenOtp] = useState('');
  const [citizenOtpSent, setCitizenOtpSent] = useState(false);

  // Supervisor state
  const [supervisorId, setSupervisorId] = useState('SP-MH-4019');
  const [supervisorPass, setSupervisorPass] = useState('••••••••');

  // Reviewer state
  const [reviewerEmail, setReviewerEmail] = useState('rajesh.sharma@gov.in');

  const [isLoading, setIsLoading] = useState(false);

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenOtpSent) {
      setCitizenOtpSent(true);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      loginUser('CITIZEN', {
        name: 'Aarav Deshmukh',
        phone: citizenPhone,
        isAadhaarVerified: true,
        district: 'Pune',
        state: 'Maharashtra',
      });
      router.push('/citizen');
    }, 300);
  };

  const handleSupervisorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      loginUser('SUPERVISOR', {
        name: 'Suresh Patil (Junior Engineer)',
        district: 'Pune',
        state: 'Maharashtra',
      });
      router.push('/supervisor');
    }, 300);
  };

  const handleReviewerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      loginUser('REVIEWER', {
        name: 'Rajesh Sharma (Quality Reviewer)',
        district: 'Pune',
        state: 'Maharashtra',
      });
      router.push('/reviewer');
    }, 300);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-surface border border-border-hairline rounded-2xl shadow-dropdown overflow-hidden">
        {/* Tricolour Hairline */}
        <div className="tricolour-hairline" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-2">
            <AbstractMark size={44} />
            <h1 className="font-serif font-bold text-2xl text-ink-primary">
              Proof-of-Action Sign In
            </h1>
            <p className="text-xs text-ink-secondary max-w-xs">
              Select your role portal to access your purpose-built evidence interface.
            </p>
          </div>

          {/* Role Portal Selection Tabs (Section 1 & 9) */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-surface-sunken rounded-xl border border-border-hairline">
            <button
              type="button"
              onClick={() => setSelectedRole('CITIZEN')}
              className={`py-2.5 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                selectedRole === 'CITIZEN'
                  ? 'bg-surface text-saffron-deep dark:text-saffron shadow-subtle'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Citizen</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('SUPERVISOR')}
              className={`py-2.5 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                selectedRole === 'SUPERVISOR'
                  ? 'bg-surface text-india-green shadow-subtle'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Supervisor</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('REVIEWER')}
              className={`py-2.5 px-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                selectedRole === 'REVIEWER'
                  ? 'bg-surface text-navy dark:text-[#7FA8D9] shadow-subtle'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Reviewer</span>
            </button>
          </div>

          {/* ── CITIZEN LOGIN TAB ────────────────────────────────────────── */}
          {selectedRole === 'CITIZEN' && (
            <form onSubmit={handleCitizenSubmit} className="space-y-4 text-xs animate-page-enter">
              <div className="space-y-1">
                <label className="font-bold text-ink-primary block">
                  Citizen Mobile Phone Number:
                </label>
                <input
                  type="tel"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-sm focus:outline-none"
                  required
                />
              </div>

              {citizenOtpSent && (
                <div className="space-y-1 animate-page-enter">
                  <label className="font-bold text-ink-primary block">
                    Enter 6-Digit OTP:
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={citizenOtp}
                    onChange={(e) => setCitizenOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-lg tracking-widest text-center focus:outline-none"
                    required
                    autoFocus
                  />
                  <span className="text-[10px] text-india-green block text-center font-semibold">
                    ✓ Demo code 123456 sent to your phone
                  </span>
                </div>
              )}

              <div className="p-3 rounded-lg bg-saffron/10 border border-saffron/30 text-[11px] text-ink-secondary">
                <div className="flex items-center gap-1.5 font-bold text-saffron-deep dark:text-saffron">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aadhaar resident verification is simulated automatically (Demo)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors shadow-subtle flex items-center justify-center gap-2"
              >
                <span>
                  {citizenOtpSent ? 'Verify OTP & Open Citizen Portal' : 'Send OTP via SMS'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ── SUPERVISOR LOGIN TAB ─────────────────────────────────────── */}
          {selectedRole === 'SUPERVISOR' && (
            <form onSubmit={handleSupervisorSubmit} className="space-y-4 text-xs animate-page-enter">
              <div className="space-y-1">
                <label className="font-bold text-ink-primary block">
                  Supervisor Officer ID (अधिकारी आईडी):
                </label>
                <input
                  type="text"
                  value={supervisorId}
                  onChange={(e) => setSupervisorId(e.target.value)}
                  placeholder="e.g. SP-MH-4019"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink-primary block">
                  Password:
                </label>
                <input
                  type="password"
                  value={supervisorPass}
                  onChange={(e) => setSupervisorPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="p-3 rounded-lg bg-india-green/10 border border-india-green/30 text-[11px] text-ink-secondary">
                <div className="flex items-center gap-1.5 font-bold text-india-green">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Field Junior Engineer Credentials Loaded</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-india-green text-surface font-bold text-xs hover:bg-india-green/90 transition-colors shadow-subtle flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Field Portal (लॉगिन करें)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ── REVIEWER LOGIN TAB ──────────────────────────────────────── */}
          {selectedRole === 'REVIEWER' && (
            <form onSubmit={handleReviewerSubmit} className="space-y-4 text-xs animate-page-enter">
              <div className="space-y-1">
                <label className="font-bold text-ink-primary block">
                  Official Institutional Email:
                </label>
                <input
                  type="email"
                  value={reviewerEmail}
                  onChange={(e) => setReviewerEmail(e.target.value)}
                  placeholder="name@gov.in"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="p-3.5 rounded-xl bg-navy/10 dark:bg-[#7FA8D9]/15 border border-navy/20 dark:border-[#7FA8D9]/30 text-[11px] text-ink-secondary space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-navy dark:text-[#7FA8D9]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>MeriPehchaan (National SSO) Institutional Gateway</span>
                </div>
                <p className="text-[10px] text-ink-muted leading-relaxed">
                  Grants full 7-signal fusion analytics, review queue, before/after comparison, and audit certification.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-navy text-surface font-bold text-xs hover:bg-navy/90 dark:bg-[#7FA8D9] dark:text-navy transition-colors shadow-subtle flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Authenticating MeriPehchaan...' : 'Authenticate with Gov SSO'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-border-hairline flex items-center justify-between text-xs text-ink-muted">
            <Link href="/" className="hover:text-ink-primary">
              ← Return Home
            </Link>
            <Link href="/signup" className="hover:text-ink-primary font-semibold text-saffron-deep dark:text-saffron">
              Create Citizen Account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
