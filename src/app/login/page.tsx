'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const { loginUser } = useApp();

  const roleParam = searchParams.get('role')?.toLowerCase();

  const initialRole: 'CITIZEN' | 'SUPERVISOR' | 'REVIEWER' =
    roleParam === 'supervisor'
      ? 'SUPERVISOR'
      : roleParam === 'reviewer'
      ? 'REVIEWER'
      : 'CITIZEN';

  const [selectedRole, setSelectedRole] = useState<'CITIZEN' | 'SUPERVISOR' | 'REVIEWER'>(initialRole);

  useEffect(() => {
    if (roleParam === 'supervisor') setSelectedRole('SUPERVISOR');
    else if (roleParam === 'reviewer') setSelectedRole('REVIEWER');
    else if (roleParam === 'citizen') setSelectedRole('CITIZEN');
  }, [roleParam]);

  // Citizen state — starts completely empty
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenPhoneError, setCitizenPhoneError] = useState('');
  const [citizenOtp, setCitizenOtp] = useState('');
  const [citizenOtpSent, setCitizenOtpSent] = useState(false);

  // Supervisor state
  const [supervisorId, setSupervisorId] = useState('');
  const [supervisorPass, setSupervisorPass] = useState('');

  // Reviewer state
  const [reviewerEmail, setReviewerEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCitizenPhoneError('');

    if (!citizenOtpSent) {
      // Validate 10-digit Indian mobile number
      const digitsOnly = citizenPhone.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        setCitizenPhoneError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)');
        return;
      }
      setCitizenOtpSent(true);
      return;
    }

    if (!citizenOtp.trim()) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      loginUser('CITIZEN', {
        name: 'Aarav Deshmukh',
        phone: citizenPhone.startsWith('+91') ? citizenPhone : `+91 ${citizenPhone}`,
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
              Access your role-specific evidence verification portal.
            </p>
          </div>

          {/* Role Portal Selection Tabs (Section 3 & 14) */}
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
              <span>Citizen Portal</span>
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
              <span>Supervisor Portal</span>
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
              <span>Reviewer Login</span>
            </button>
          </div>

          {/* ── 1. CITIZEN LOGIN TAB (Section 2 & 5) ────────────────────────── */}
          {selectedRole === 'CITIZEN' && (
            <form onSubmit={handleCitizenSubmit} className="space-y-4 text-xs animate-page-enter">
              <div className="space-y-1">
                <label className="font-bold text-ink-primary block">
                  Citizen Mobile Phone Number (10 Digits):
                </label>
                <input
                  type="tel"
                  value={citizenPhone}
                  onChange={(e) => {
                    setCitizenPhone(e.target.value);
                    if (citizenPhoneError) setCitizenPhoneError('');
                  }}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-sm focus:outline-none focus:border-saffron"
                  required
                  autoFocus
                />
                {citizenPhoneError && (
                  <p className="text-[11px] text-risk-critical font-medium mt-1">
                    {citizenPhoneError}
                  </p>
                )}
                {!citizenPhoneError && (
                  <p className="text-[11px] text-ink-muted mt-1">
                    Enter any 10-digit mobile number to receive demo OTP.
                  </p>
                )}
              </div>

              {citizenOtpSent && (
                <div className="space-y-1.5 p-3.5 bg-saffron/10 border border-saffron/30 rounded-xl animate-page-enter">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-ink-primary block">
                      Enter 6-Digit OTP:
                    </label>
                    <span className="text-[10px] font-mono text-india-green font-bold bg-surface px-2 py-0.5 rounded border">
                      Demo OTP: 123456
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={citizenOtp}
                    onChange={(e) => setCitizenOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface border border-border-hairline text-ink-primary font-mono text-lg tracking-widest text-center focus:outline-none focus:border-saffron"
                    required
                    autoFocus
                  />
                  <span className="text-[10px] text-ink-muted block text-center">
                    Demo verification code auto-generated for testing.
                  </span>
                </div>
              )}

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

          {/* ── 2. SUPERVISOR LOGIN TAB ──────────────────────────────────── */}
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
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-sm focus:outline-none focus:border-india-green"
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
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary text-sm focus:outline-none focus:border-india-green"
                  required
                />
              </div>

              <div className="p-3 rounded-lg bg-india-green/10 border border-india-green/30 text-[11px] text-ink-secondary">
                <div className="flex items-center gap-1.5 font-bold text-india-green">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Field Junior Engineer (JE) Profile Attached</span>
                </div>
                <p className="text-[10px] text-ink-muted mt-0.5">
                  District: Pune Rural • Assigned schemes: PMGSY &amp; Jal Jeevan Mission
                </p>
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

          {/* ── 3. REVIEWER LOGIN TAB ───────────────────────────────────── */}
          {selectedRole === 'REVIEWER' && (
            <form onSubmit={handleReviewerSubmit} className="space-y-4 text-xs animate-page-enter">
              <div className="space-y-1">
                <label className="font-bold text-ink-primary block">
                  Official Institutional Email (सरकारी ईमेल):
                </label>
                <input
                  type="email"
                  value={reviewerEmail}
                  onChange={(e) => setReviewerEmail(e.target.value)}
                  placeholder="name@gov.in"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-sm focus:outline-none focus:border-navy"
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
                className="w-full py-3 rounded-xl bg-navy text-white font-bold text-xs hover:bg-navy/90 dark:bg-[#7FA8D9] dark:text-[#0B2A52] transition-colors shadow-subtle flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Authenticating MeriPehchaan...' : 'Authenticate with Gov SSO'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ── 4. CONDITIONAL FOOTER (Section 5) ────────────────────────── */}
          <div className="pt-4 border-t border-border-hairline flex items-center justify-between text-xs text-ink-muted">
            <Link href="/" className="hover:text-ink-primary font-medium flex items-center gap-1">
              <span>← Return Home</span>
            </Link>

            {selectedRole === 'CITIZEN' ? (
              <Link href="/signup" className="hover:text-ink-primary font-bold text-saffron-deep dark:text-saffron">
                Create Citizen Account →
              </Link>
            ) : selectedRole === 'SUPERVISOR' ? (
              <span className="text-[11px] text-ink-muted font-medium">
                Field Helpdesk: 1800-11-7700
              </span>
            ) : (
              <span className="text-[11px] text-ink-muted font-medium">
                NIC Gov SSO Service Desk
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UnifiedLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-8rem)] flex items-center justify-center text-xs text-ink-muted">Loading portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
