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
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Lock,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const { setAuthenticatedUser, addToast } = useApp();

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

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clear fields and errors when switching tabs
  const handleTabSwitch = (role: 'CITIZEN' | 'SUPERVISOR' | 'REVIEWER') => {
    setSelectedRole(role);
    setErrorMessage('');
    setIdentifier('');
    setPassword('');
  };

  const handleFillDemo = (demoId: string, demoPass: string) => {
    setIdentifier(demoId);
    setPassword(demoPass);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      setErrorMessage(
        selectedRole === 'CITIZEN'
          ? 'Please enter your email or mobile phone number.'
          : selectedRole === 'SUPERVISOR'
          ? 'Please enter your Supervisor ID, email or phone.'
          : 'Please enter your official institutional email.'
      );
      return;
    }

    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }

    setIsLoading(true);

    try {
      const isEmail = cleanIdentifier.includes('@');
      const payload = {
        email: isEmail ? cleanIdentifier : undefined,
        phone: !isEmail ? cleanIdentifier : undefined,
        password,
        requiredRole: selectedRole,
      };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.authenticated) {
        setErrorMessage(data?.error?.message || 'Invalid email or password.');
        setIsLoading(false);
        return;
      }

      // Successful authentic login
      setAuthenticatedUser(data.user);

      addToast({
        title: `Welcome, ${data.user.name}`,
        description: `Authenticated as ${data.user.role}. Opening ${data.user.role.toLowerCase()} portal...`,
        type: 'success',
      });

      router.push(data.redirectUrl || (selectedRole === 'CITIZEN' ? '/citizen' : selectedRole === 'SUPERVISOR' ? '/supervisor' : '/reviewer'));
    } catch (err) {
      console.error('Login request error:', err);
      setErrorMessage('Unable to connect to the authentication service. Please try again.');
      setIsLoading(false);
    }
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

          {/* Role Portal Selection Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-surface-sunken rounded-xl border border-border-hairline">
            <button
              type="button"
              onClick={() => handleTabSwitch('CITIZEN')}
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
              onClick={() => handleTabSwitch('SUPERVISOR')}
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
              onClick={() => handleTabSwitch('REVIEWER')}
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

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3 bg-risk-critical/10 border border-risk-critical/30 rounded-xl flex items-start gap-2.5 text-xs text-risk-critical animate-page-enter">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs animate-page-enter">
            {/* Identifier Input */}
            <div className="space-y-1">
              <label className="font-bold text-ink-primary block">
                {selectedRole === 'CITIZEN'
                  ? 'Citizen Email or Mobile Number:'
                  : selectedRole === 'SUPERVISOR'
                  ? 'Supervisor Email, Phone or Officer ID:'
                  : 'Official Government Email ID:'}
              </label>
              <input
                type={selectedRole === 'REVIEWER' ? 'email' : 'text'}
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder={
                  selectedRole === 'CITIZEN'
                    ? 'citizen.demo@example.com or 9823011223'
                    : selectedRole === 'SUPERVISOR'
                    ? 'supervisor.demo@example.com or 9845033441'
                    : 'reviewer.demo@example.com'
                }
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-sm focus:outline-none focus:border-saffron"
                required
                disabled={isLoading}
                autoFocus
              />
            </div>

            {/* Password Input with Show/Hide Toggle */}
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
                  placeholder="Enter account password"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary text-sm focus:outline-none focus:border-saffron pr-10"
                  required
                  disabled={isLoading}
                />
                <Lock className="w-4 h-4 text-ink-muted absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Demo Quick Fill Helper */}
            <div className="p-3 bg-surface-sunken border border-border-hairline rounded-xl text-[11px] text-ink-secondary flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-ink-muted" />
                <span>
                  Demo Credentials: <code className="font-mono font-bold text-ink-primary">
                    {selectedRole === 'CITIZEN'
                      ? 'citizen.demo@example.com'
                      : selectedRole === 'SUPERVISOR'
                      ? 'supervisor.demo@example.com'
                      : 'reviewer.demo@example.com'}
                  </code>
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleFillDemo(
                    selectedRole === 'CITIZEN'
                      ? 'citizen.demo@example.com'
                      : selectedRole === 'SUPERVISOR'
                      ? 'supervisor.demo@example.com'
                      : 'reviewer.demo@example.com',
                    selectedRole === 'CITIZEN'
                      ? 'Citizen@2026!'
                      : selectedRole === 'SUPERVISOR'
                      ? 'Supervisor@2026!'
                      : 'Reviewer@2026!'
                  )
                }
                className="text-[10px] font-bold text-saffron-deep dark:text-saffron bg-surface px-2 py-1 rounded border border-border-hairline hover:bg-surface-sunken transition-colors shrink-0"
              >
                Fill Demo
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-bold text-xs transition-colors shadow-subtle flex items-center justify-center gap-2 ${
                selectedRole === 'CITIZEN'
                  ? 'bg-saffron text-ink-primary hover:bg-saffron-deep'
                  : selectedRole === 'SUPERVISOR'
                  ? 'bg-india-green text-surface hover:bg-india-green/90'
                  : 'bg-navy text-white hover:bg-navy/90 dark:bg-[#7FA8D9] dark:text-[#0B2A52]'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <span>
                {isLoading
                  ? 'Verifying Credentials...'
                  : selectedRole === 'CITIZEN'
                  ? 'Sign In to Citizen Portal'
                  : selectedRole === 'SUPERVISOR'
                  ? 'Sign In to Supervisor Portal'
                  : 'Sign In to Reviewer Portal'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Conditional Footer */}
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
