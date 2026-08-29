'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  Users,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function CitizenLoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { loginUser } = useApp();

  const [phone, setPhone] = useState('+91 98230 11223');
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'AADHAAR'>('PHONE');
  const [otp, setOtp] = useState('');
  const [aadhaarLast4, setAadhaarLast4] = useState('4821');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('OTP');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('AADHAAR');
  };

  const handleCompleteAadhaar = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser('CITIZEN', {
      name: 'Aarav Deshmukh',
      phone,
      isAadhaarVerified: true,
      district: 'Pune',
      state: 'Maharashtra',
    });
    router.push('/citizen');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border-hairline rounded-2xl shadow-dropdown overflow-hidden">
        {/* Tricolour Hairline */}
        <div className="tricolour-hairline" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-saffron/15 text-saffron-deep dark:text-saffron flex items-center justify-center font-bold mb-1">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="font-serif font-bold text-xl text-ink-primary">
              Citizen Portal Sign In
            </h1>
            <p className="text-xs text-ink-secondary">
              नागरिक पोर्टल • OTP &amp; Mock Aadhaar Verification
            </p>
          </div>

          {/* Progress Step Indicator */}
          <div className="flex items-center justify-between text-[11px] px-2 text-ink-muted border-b border-border-hairline pb-3">
            <span className={step === 'PHONE' ? 'font-bold text-saffron-deep' : 'text-india-green'}>
              1. Mobile
            </span>
            <span>→</span>
            <span className={step === 'OTP' ? 'font-bold text-saffron-deep' : step === 'AADHAAR' ? 'text-india-green' : ''}>
              2. OTP
            </span>
            <span>→</span>
            <span className={step === 'AADHAAR' ? 'font-bold text-saffron-deep' : ''}>
              3. Aadhaar (Demo)
            </span>
          </div>

          {/* Step 1: Phone */}
          {step === 'PHONE' && (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-ink-primary block">
                  Mobile Phone Number (मोबाइल नंबर):
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-sm focus:outline-none"
                  required
                />
              </div>

              <p className="text-[11px] text-ink-muted">
                A 6-digit verification code will be sent to your mobile phone number.
              </p>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors shadow-subtle flex items-center justify-center gap-2"
              >
                <span>Send One-Time Password (OTP)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-ink-primary block">
                  Enter 6-Digit OTP received on {phone}:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-lg tracking-widest text-center focus:outline-none"
                  required
                  autoFocus
                />
                <span className="text-[10px] text-india-green block text-center font-semibold">
                  ✓ Demo verification code: 123456
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors shadow-subtle flex items-center justify-center gap-2"
              >
                <span>Verify OTP &amp; Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 3: Aadhaar Verification (Demo Flow - Section 2) */}
          {step === 'AADHAAR' && (
            <form onSubmit={handleCompleteAadhaar} className="space-y-4 text-xs">
              <div className="p-3.5 bg-india-green/10 border border-india-green/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-india-green text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Mock Aadhaar Resident Verification (Demo)</span>
                </div>
                <p className="text-[11px] text-ink-secondary leading-relaxed">
                  For prototype evaluation, an instant demo UIDAI verification token is simulated. Full Aadhaar numbers are never stored or exposed.
                </p>
                <div className="font-mono text-xs font-bold text-ink-primary bg-surface p-2 rounded border border-border-hairline text-center">
                  Aadhaar: XXXX XXXX {aadhaarLast4}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-india-green text-surface font-bold text-xs hover:bg-india-green/90 transition-colors shadow-subtle flex items-center justify-center gap-2"
              >
                <span>Complete Verification &amp; Enter Citizen Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-border-hairline flex items-center justify-between text-xs text-ink-muted">
            <Link href="/login" className="hover:text-ink-primary">
              ← Other Roles
            </Link>
            <Link href="/signup" className="hover:text-ink-primary font-semibold text-saffron-deep dark:text-saffron">
              Create New Account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
