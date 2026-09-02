'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import { AbstractMark } from '@/components/ui/abstract-mark';
import {
  Camera,
  Lock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export default function SupervisorLoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { loginUser } = useApp();

  const [supervisorId, setSupervisorId] = useState('SP-MH-4019');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      loginUser('SUPERVISOR', {
        name: 'Suresh Patil (Junior Engineer)',
        district: 'Pune',
        state: 'Maharashtra',
      });
      router.push('/supervisor');
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border-hairline rounded-2xl shadow-dropdown overflow-hidden">
        {/* Tricolour Hairline */}
        <div className="tricolour-hairline" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-india-green/10 text-india-green flex items-center justify-center font-bold mb-1">
              <Camera className="w-6 h-6" />
            </div>
            <h1 className="font-serif font-bold text-xl text-ink-primary">
              Field Supervisor Login
            </h1>
            <p className="text-xs text-ink-secondary">
              फील्ड सुपरवाइजर पोर्टल • Private Officer Portal
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
                Password / Security Pin:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary text-sm focus:outline-none focus:border-india-green"
                required
              />
            </div>

            <div className="p-3 rounded-lg bg-india-green/10 border border-india-green/30 text-[11px] text-ink-secondary space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-india-green">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Assigned Jurisdiction: Pune Rural District</span>
              </div>
              <p className="text-[10px] text-ink-muted">
                Demo Credentials Loaded: Officer ID <code className="font-mono">SP-MH-4019</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-india-green text-surface font-bold text-xs hover:bg-india-green/90 transition-colors shadow-subtle flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In as Supervisor (लॉगिन करें)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer links */}
          <div className="pt-4 border-t border-border-hairline flex items-center justify-between text-xs text-ink-muted">
            <Link href="/login" className="hover:text-ink-primary">
              ← Other Roles
            </Link>
            <Link href="/citizen" className="hover:text-ink-primary font-semibold">
              Citizen Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
