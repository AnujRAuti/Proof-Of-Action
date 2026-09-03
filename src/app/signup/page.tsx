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
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
} from 'lucide-react';

export default function CitizenSignupPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { setAuthenticatedUser, addToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [district, setDistrict] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('412301');
  const [enableAadhaarBadge, setEnableAadhaarBadge] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (name.trim().length < 2) {
      setErrorMessage('Full name must be at least 2 characters.');
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setErrorMessage('Please provide either an email or a 10-digit mobile number.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create account via backend API
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() ? email.trim().toLowerCase() : undefined,
          phone: phone.trim() ? (phone.trim().startsWith('+91') ? phone.trim() : `+91${phone.trim().replace(/\D/g, '')}`) : undefined,
          password,
          role: 'CITIZEN',
          district: district.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
        }),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        setErrorMessage(signupData?.error || 'Registration failed. Please check your inputs.');
        setIsLoading(false);
        return;
      }

      // 2. Automatically authenticate the new user
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim() ? email.trim().toLowerCase() : undefined,
          phone: phone.trim() ? phone.trim() : undefined,
          password,
          requiredRole: 'CITIZEN',
        }),
      });

      const loginData = await loginRes.json();

      if (loginRes.ok && loginData.authenticated) {
        setAuthenticatedUser(loginData.user);
        addToast({
          title: `Account Created Successfully`,
          description: `Welcome, ${signupData.data.name}! Your citizen portal is ready.`,
          type: 'success',
        });
        router.push('/citizen');
      } else {
        // Account created, redirect to login
        addToast({
          title: 'Account Created',
          description: 'Please sign in with your new password.',
          type: 'info',
        });
        router.push('/login?role=citizen');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setErrorMessage('Unable to connect to authentication service. Please try again.');
      setIsLoading(false);
    }
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

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3 bg-risk-critical/10 border border-risk-critical/30 rounded-xl flex items-start gap-2.5 text-xs text-risk-critical animate-page-enter">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs animate-page-enter">
            {/* Full Name */}
            <div>
              <label className="font-semibold text-ink-primary block mb-1">
                Full Name (पूरा नाम):
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="e.g. Ramesh Sharma"
                className="w-full px-3 py-2.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary text-sm focus:outline-none focus:border-saffron"
                required
                disabled={isLoading}
                autoFocus
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="font-semibold text-ink-primary block mb-1">
                Email Address (ईमेल):
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="name@example.com"
                className="w-full px-3 py-2.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-sm focus:outline-none focus:border-saffron"
                disabled={isLoading}
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="font-semibold text-ink-primary block mb-1">
                Mobile Phone Number (10 Digits):
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="9876543210"
                className="w-full px-3 py-2.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-sm focus:outline-none focus:border-saffron"
                disabled={isLoading}
              />
            </div>

            {/* Password with min 8 chars */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-ink-primary block">
                  Password (न्यूनतम 8 अक्षर):
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-ink-muted hover:text-ink-primary flex items-center gap-1"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3 py-2.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary text-sm focus:outline-none focus:border-saffron pr-10"
                  required
                  minLength={8}
                  disabled={isLoading}
                />
                <Lock className="w-4 h-4 text-ink-muted absolute right-3 top-3 pointer-events-none" />
              </div>
              <span className="text-[10px] text-ink-muted mt-1 block">
                Must be at least 8 characters.
              </span>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-ink-primary block mb-1">District / City:</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-surface-sunken border border-border-hairline text-ink-primary text-xs"
                  required
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Optional Verified Resident Badge */}
            <div className="p-3 bg-surface-sunken rounded-lg border border-border-hairline space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={enableAadhaarBadge}
                  onChange={(e) => setEnableAadhaarBadge(e.target.checked)}
                  className="w-4 h-4 accent-saffron"
                />
                <span className="font-semibold text-ink-primary text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-india-green" />
                  <span>Verified Resident Badge (Aadhaar e-KYC Demo)</span>
                </span>
              </label>
              <p className="text-[10px] text-ink-muted leading-relaxed">
                Prioritizes your public concern reports with the district administration.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors shadow-subtle flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <span>{isLoading ? 'Creating Account in Database...' : 'Register & Enter Citizen Portal (खाता बनाएं)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

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
