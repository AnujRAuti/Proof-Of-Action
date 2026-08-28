'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp, UserRole } from '@/lib/store/app-context';
import { AbstractMark } from '@/components/ui/abstract-mark';
import {
  ShieldCheck,
  Smartphone,
  Mail,
  ArrowRight,
  UserCheck,
  Lock,
  Building2,
  Users,
  Camera,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { loginUser } = useApp();

  const [authMethod, setAuthMethod] = useState<'OTP' | 'GOV_SSO'>('OTP');
  const [identifier, setIdentifier] = useState('+91 98230 11223');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Default citizen if logging in via phone
    loginUser('CITIZEN', { phone: identifier });
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border-hairline rounded-xl shadow-dropdown overflow-hidden space-y-0">
        {/* Structural Tricolour Hairline */}
        <div className="tricolour-hairline" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Lockup */}
          <div className="flex flex-col items-center text-center space-y-2">
            <AbstractMark size={42} />
            <h1 className="font-serif font-bold text-xl text-ink-primary">
              Sign in to Proof-of-Action
            </h1>
            <p className="text-xs text-ink-secondary">
              Your account automatically opens your dedicated dashboard.
            </p>
          </div>

          {/* Quick Persona Demo Switcher for SIH Jury / Evaluation */}
          <div className="p-3 bg-surface-sunken rounded-lg border border-border-hairline space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block text-center">
              1-Click Demo Logins (Select Role to Experience)
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => loginUser('CITIZEN')}
                className="p-2 rounded bg-surface hover:bg-surface/80 border border-border-hairline text-center text-xs transition-all flex flex-col items-center gap-1 group"
              >
                <Users className="w-4 h-4 text-saffron-deep group-hover:scale-110" />
                <span className="font-bold text-[11px] text-ink-primary">Citizen</span>
                <span className="text-[9px] text-ink-muted">Public App</span>
              </button>

              <button
                type="button"
                onClick={() => loginUser('SUPERVISOR')}
                className="p-2 rounded bg-surface hover:bg-surface/80 border border-border-hairline text-center text-xs transition-all flex flex-col items-center gap-1 group"
              >
                <Camera className="w-4 h-4 text-india-green group-hover:scale-110" />
                <span className="font-bold text-[11px] text-ink-primary">Supervisor</span>
                <span className="text-[9px] text-ink-muted">Field Upload</span>
              </button>

              <button
                type="button"
                onClick={() => loginUser('REVIEWER')}
                className="p-2 rounded bg-surface hover:bg-surface/80 border border-border-hairline text-center text-xs transition-all flex flex-col items-center gap-1 group"
              >
                <ShieldCheck className="w-4 h-4 text-navy dark:text-[#7FA8D9] group-hover:scale-110" />
                <span className="font-bold text-[11px] text-ink-primary">Reviewer</span>
                <span className="text-[9px] text-ink-muted">Govt Ops</span>
              </button>
            </div>
          </div>

          {/* Regular Login Form */}
          <div className="space-y-4">
            <div className="flex border-b border-border-hairline text-xs">
              <button
                onClick={() => {
                  setAuthMethod('OTP');
                  setOtpSent(false);
                }}
                className={`flex-1 py-2 font-semibold text-center border-b-2 transition-colors ${
                  authMethod === 'OTP'
                    ? 'border-saffron text-ink-primary font-bold'
                    : 'border-transparent text-ink-muted hover:text-ink-primary'
                }`}
              >
                Mobile Number (OTP)
              </button>
              <button
                onClick={() => setAuthMethod('GOV_SSO')}
                className={`flex-1 py-2 font-semibold text-center border-b-2 transition-colors ${
                  authMethod === 'GOV_SSO'
                    ? 'border-saffron text-ink-primary font-bold'
                    : 'border-transparent text-ink-muted hover:text-ink-primary'
                }`}
              >
                Government SSO (MeriPehchaan)
              </button>
            </div>

            {authMethod === 'OTP' ? (
              <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-ink-primary block mb-1">
                    Mobile Phone Number:
                  </label>
                  <input
                    type="tel"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-sm"
                    required
                  />
                </div>

                {otpSent && (
                  <div>
                    <label className="font-semibold text-ink-primary block mb-1">
                      Enter 6-Digit OTP:
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full px-3 py-2 rounded bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-base tracking-widest text-center"
                      required
                      autoFocus
                    />
                    <span className="text-[10px] text-india-green mt-1 block">
                      ✓ Demo code 123456 sent to your phone
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors shadow-subtle flex items-center justify-center gap-2"
                >
                  <span>{otpSent ? 'Verify OTP & Continue' : 'Send One-Time Password (OTP)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-xs text-center">
                <p className="text-ink-secondary leading-relaxed">
                  Sign in with verified institutional credentials on Parichay / MeriPehchaan for state department officers.
                </p>
                <button
                  onClick={() => loginUser('REVIEWER')}
                  className="w-full py-2.5 rounded bg-navy text-surface font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate with MeriPehchaan Gov ID</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-border-hairline flex items-center justify-between text-xs text-ink-secondary">
            <span>New resident?</span>
            <Link href="/signup" className="font-bold text-saffron-deep dark:text-saffron hover:underline">
              Create Citizen Account (Free) →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
