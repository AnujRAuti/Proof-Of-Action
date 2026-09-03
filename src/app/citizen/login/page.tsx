'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  Users,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export default function CitizenLoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { setAuthenticatedUser, addToast } = useApp();

  const [identifier, setIdentifier] = useState('citizen.demo@example.com');
  const [password, setPassword] = useState('Citizen@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Citizen email or phone number is required.');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }

    setIsLoading(true);

    try {
      const isEmail = identifier.includes('@');
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: isEmail ? identifier.trim() : undefined,
          phone: !isEmail ? identifier.trim() : undefined,
          password,
          requiredRole: 'CITIZEN',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.authenticated) {
        setErrorMessage(data?.error?.message || 'Invalid citizen credentials or password.');
        setIsLoading(false);
        return;
      }

      setAuthenticatedUser(data.user);

      addToast({
        title: `Welcome, ${data.user.name}`,
        description: 'Authenticated as CITIZEN. Loading citizen dashboard...',
        type: 'success',
      });

      router.push('/citizen');
    } catch (err) {
      console.error('Citizen login error:', err);
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
            <div className="w-12 h-12 rounded-xl bg-saffron/15 text-saffron-deep dark:text-saffron flex items-center justify-center font-bold mb-1">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="font-serif font-bold text-xl text-ink-primary">
              Citizen Portal Sign In
            </h1>
            <p className="text-xs text-ink-secondary">
              नागरिक पोर्टल • Public Project &amp; Grievance Tracking
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
                Citizen Email or Mobile Number (10 Digits):
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="citizen.demo@example.com or 9823011223"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-sm focus:outline-none focus:border-saffron"
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
                  placeholder="Enter citizen password"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary text-sm focus:outline-none focus:border-saffron pr-10"
                  required
                  disabled={isLoading}
                />
                <Lock className="w-4 h-4 text-ink-muted absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="p-3 bg-surface-sunken border border-border-hairline rounded-xl text-[11px] text-ink-secondary space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-ink-primary">
                <KeyRound className="w-3.5 h-3.5 text-saffron-deep dark:text-saffron" />
                <span>Demo Citizen Account:</span>
              </div>
              <p className="text-[10px] text-ink-muted">
                Email: <code className="font-mono font-bold">citizen.demo@example.com</code> • Password: <code className="font-mono font-bold">Citizen@2026!</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors shadow-subtle flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <span>{isLoading ? 'Verifying with DB...' : 'Sign In to Citizen Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer */}
          <div className="pt-4 border-t border-border-hairline flex items-center justify-between text-xs text-ink-muted">
            <Link href="/login" className="hover:text-ink-primary">
              ← Other Roles
            </Link>
            <Link href="/signup" className="hover:text-ink-primary font-semibold text-saffron-deep dark:text-saffron">
              Create Account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
