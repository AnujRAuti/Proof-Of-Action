'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import { AbstractMark } from '@/components/ui/abstract-mark';
import {
  Users,
  Smartphone,
  MapPin,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
  Check,
} from 'lucide-react';

export default function CitizenSignupPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { loginUser, addToast } = useApp();

  // Wizard Steps: 1 = Phone & OTP, 2 = Name & Location, 3 = Optional Aadhaar Badge
  const [step, setStep] = useState<number>(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('Ramesh Sharma');
  const [district, setDistrict] = useState('Pune');
  const [pincode, setPincode] = useState('412301');
  const [enableAadhaarBadge, setEnableAadhaarBadge] = useState(true);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleFinish = () => {
    loginUser('CITIZEN', {
      name,
      phone,
      district,
      pincode,
      isAadhaarVerified: enableAadhaarBadge,
    });
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border-hairline rounded-xl shadow-dropdown overflow-hidden">
        <div className="tricolour-hairline" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-1.5">
            <AbstractMark size={36} />
            <h1 className="font-serif font-bold text-xl text-ink-primary">
              Join as a Citizen Resident
            </h1>
            <p className="text-xs text-ink-secondary">
              Track local road, water, school, and solar projects in your area for free.
            </p>
          </div>

          {/* Step 1: Phone & OTP */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4 text-xs animate-page-enter">
              <div>
                <label className="font-semibold text-ink-primary block mb-1">
                  1. Your Mobile Phone Number:
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-ink-primary block mb-1">
                  One-Time Password (OTP):
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-center text-base"
                  required
                />
                <span className="text-[10px] text-india-green mt-1 block">
                  ✓ Demo verification code auto-filled
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors shadow-subtle flex items-center justify-center gap-2"
              >
                <span>Continue (आगे बढ़ें)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2: Name & Location */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4 text-xs animate-page-enter">
              <div>
                <label className="font-semibold text-ink-primary block mb-1">
                  2. Your Full Name:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-3 py-2.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-ink-primary block mb-1">District / City:</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-surface-sunken border border-border-hairline text-ink-primary text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink-primary block mb-1">Pincode:</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded bg-surface border border-border-hairline text-ink-secondary text-xs font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors shadow-subtle flex items-center justify-center gap-2"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Optional Aadhaar Resident Verification */}
          {step === 3 && (
            <div className="space-y-4 text-xs animate-page-enter">
              <div className="p-4 bg-surface-sunken rounded-lg border border-border-hairline space-y-2">
                <div className="flex items-center gap-2 text-saffron-deep dark:text-saffron font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Optional: Verified Resident Badge</span>
                </div>
                <p className="text-[11px] text-ink-secondary leading-relaxed">
                  Link Aadhaar e-verification so your reviews and concern reports carry verified priority with the district administration. (Completely optional, no documents needed).
                </p>

                <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={enableAadhaarBadge}
                    onChange={(e) => setEnableAadhaarBadge(e.target.checked)}
                    className="w-4 h-4 accent-saffron"
                  />
                  <span className="font-semibold text-ink-primary text-xs">
                    Enable &ldquo;Verified Resident&rdquo; status
                  </span>
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded bg-surface border border-border-hairline text-ink-secondary text-xs font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 py-3 rounded bg-india-green text-surface font-bold text-xs hover:opacity-90 transition-opacity shadow-subtle flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Setup &amp; Open Citizen App</span>
                </button>
              </div>
            </div>
          )}

          <div className="pt-2 text-center text-xs text-ink-muted">
            Already registered?{' '}
            <Link href="/login" className="text-saffron-deep dark:text-saffron font-semibold hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

