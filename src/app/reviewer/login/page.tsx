'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  FileCheck2,
} from 'lucide-react';

export default function ReviewerLoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { loginUser } = useApp();

  const [email, setEmail] = useState('rajesh.sharma@gov.in');
  const [department, setDepartment] = useState('Ministry of Rural Development');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      loginUser('REVIEWER', {
        name: 'Rajesh Sharma (State Quality Coordinator)',
        district: 'Pune',
        state: 'Maharashtra',
      });
      router.push('/reviewer');
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
            <div className="w-12 h-12 rounded-xl bg-navy/15 dark:bg-[#7FA8D9]/20 text-navy dark:text-[#7FA8D9] flex items-center justify-center font-bold mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-serif font-bold text-xl text-ink-primary">
              Government Reviewer SSO
            </h1>
            <p className="text-xs text-ink-secondary">
              Parichay / MeriPehchaan Institutional Single Sign-On
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-ink-primary block">
                Official Government Email ID:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer.name@nic.in / @gov.in"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-sm focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ink-primary block">
                Department / Authority:
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-ink-primary text-sm focus:outline-none"
                required
              />
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
              className="w-full py-3 rounded-xl bg-navy text-surface font-bold text-xs hover:bg-navy/90 dark:bg-[#7FA8D9] dark:text-navy transition-colors shadow-subtle flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Verifying MeriPehchaan Token...' : 'Authenticate with Gov SSO (मेरी पहचान)'}</span>
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
