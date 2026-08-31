'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  User,
  ShieldCheck,
  MapPin,
  Phone,
  LogOut,
  FileText,
  Lock,
} from 'lucide-react';

export default function CitizenProfilePage() {
  const { t } = useI18n();
  const { currentUser, logoutUser, complaints } = useApp();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-surface border-2 border-border-hairline rounded-2xl p-6 sm:p-7 shadow-subtle space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-border-hairline pb-5">
          <div className="w-14 h-14 rounded-2xl bg-saffron/20 text-saffron-deep dark:text-saffron flex items-center justify-center font-bold text-2xl shrink-0">
            {(currentUser?.name || 'A').charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-xl text-ink-primary">
                {currentUser?.name || 'Aarav Deshmukh'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-india-green/10 text-india-green">
                Verified Resident
              </span>
            </div>
            <p className="text-xs text-ink-muted mt-0.5">
              Citizen Account • {currentUser?.district || 'Pune'} Constituency
            </p>
          </div>
        </div>

        {/* Masked Aadhaar & Details (Section 2 Specification) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-surface-sunken rounded-xl border border-border-hairline space-y-1">
            <span className="text-ink-muted block text-[10px] uppercase font-bold">
              Aadhaar (आधार संख्या)
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-ink-primary">
                XXXX XXXX 4821
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-india-green/15 text-india-green font-semibold">
                Mock Demo Verified
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-surface-sunken rounded-xl border border-border-hairline space-y-1">
            <span className="text-ink-muted block text-[10px] uppercase font-bold">
              Mobile Number
            </span>
            <span className="font-mono font-bold text-sm text-ink-primary">
              +91 98230 11223
            </span>
          </div>

          <div className="p-3.5 bg-surface-sunken rounded-xl border border-border-hairline space-y-1">
            <span className="text-ink-muted block text-[10px] uppercase font-bold">
              District / State
            </span>
            <span className="font-bold text-sm text-ink-primary">
              {currentUser?.district || 'Pune'}, {currentUser?.state || 'Maharashtra'}
            </span>
          </div>

          <div className="p-3.5 bg-surface-sunken rounded-xl border border-border-hairline space-y-1">
            <span className="text-ink-muted block text-[10px] uppercase font-bold">
              My Active Submissions
            </span>
            <span className="font-bold text-sm text-ink-primary">
              3 public inquiries recorded
            </span>
          </div>
        </div>

        {/* Demo Compliance Notice */}
        <div className="p-3.5 rounded-xl bg-surface-sunken border border-border-hairline text-[11px] text-ink-muted space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-ink-primary">
            <Lock className="w-3.5 h-3.5 text-india-green" />
            <span>Privacy &amp; Data Protection (GIGW 3.0 Standard)</span>
          </div>
          <p>
            No full Aadhaar number is ever stored or exposed in compliance with Aadhaar Act privacy mandates. 
            All civic inquiries are cryptographically hashed.
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={logoutUser}
          className="w-full py-3 rounded-xl border-2 border-border-hairline bg-surface hover:bg-surface-sunken text-ink-secondary hover:text-risk-high font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-subtle"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out from Citizen Portal (लॉगआउट)</span>
        </button>
      </div>
    </div>
  );
}
