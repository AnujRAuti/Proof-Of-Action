'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  FileCheck2,
} from 'lucide-react';

export default function ReviewerLoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { setAuthenticatedUser, addToast } = useApp();

  const [email, setEmail] = useState('reviewer.demo@example.com');
  const [password, setPassword] = useState('Reviewer@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Official email is required.');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          requiredRole: 'REVIEWER',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.authenticated) {
        setErrorMessage(data?.error?.message || 'Invalid email or password.');
        setIsLoading(false);
        return;
      }

      setAuthenticatedUser(data.user);

      addToast({
        title: `Welcome, ${data.user.name}`,
        description: 'Authenticated as REVIEWER. Loading dashboard...',
        type: 'success',
      });

      router.push('/reviewer');
    } catch (err) {
      console.error('Reviewer login error:', err);
      setErrorMessage('Unable to connect to authentication service.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border-hairline rounded-2xl shadow-dropdown overflow-hidden">
        {/* Tricolour Hairline */}
        <div className="tricolour-hairline" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-navy/15 dark:bg-[#7FA8D9]/20 text-navy dark:text-[#7FA8D9] flex items-center justify-center font-bold mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-serif font-bold text-xl text-ink-primary">
              Government Reviewer Login
            </h1>
            <p className="text-xs text-ink-secondary">
              Parichay / MeriPehchaan Institutional Authentication
            </p>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3 bg-risk-critical/10 border border-risk-critical/30 rounded-xl flex items-start gap-2.5 text-xs text-risk-critical animate-page-enter">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-ink-primary block">
                Official Government Email ID:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="officer.name@nic.in / @gov.in"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-sm focus:outline-none focus:border-navy"
                required
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-ink-primary block">
                  Password:
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
                  placeholder="Enter secure password"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary text-sm focus:outline-none focus:border-navy pr-10"
                  required
                  disabled={isLoading}
                />
                <Lock className="w-4 h-4 text-ink-muted absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-navy/5 dark:bg-[#7FA8D9]/10 border border-navy/20 dark:border-[#7FA8D9]/30 text-[11px] text-ink-secondary space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-navy dark:text-[#7FA8D9]">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Institutional Reviewer Clearance Level 3</span>
              </div>
              <p className="text-[10px] text-ink-muted">
                Authorized for 7-signal evidence fusion analysis, anomaly investigation, and milestone audit certification.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl bg-navy text-white font-bold text-xs hover:bg-navy/90 dark:bg-[#7FA8D9] dark:text-[#0B2A52] transition-colors shadow-subtle flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <span>{isLoading ? 'Verifying Credentials with DB...' : 'Authenticate as Reviewer'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer */}
          <div className="pt-4 border-t border-border-hairline flex items-center justify-between text-xs text-ink-muted">
            <Link href="/login" className="hover:text-ink-primary">
              ← Other Roles
            </Link>
            <Link href="/citizen" className="hover:text-ink-primary font-semibold">
              Public Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
