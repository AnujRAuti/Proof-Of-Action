'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  User,
  ShieldCheck,
  MapPin,
  Building2,
  Phone,
  LogOut,
  Smartphone,
  Wifi,
  HardDrive,
  CheckCircle2,
} from 'lucide-react';

export default function SupervisorProfilePage() {
  const { t } = useI18n();
  const { currentUser, logoutUser, supervisorTasks } = useApp();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-surface border-2 border-border-hairline rounded-2xl p-6 sm:p-7 shadow-subtle space-y-6">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 border-b border-border-hairline pb-5">
          <div className="w-14 h-14 rounded-2xl bg-india-green/20 text-india-green flex items-center justify-center font-bold text-2xl shrink-0">
            {(currentUser?.name || 'S').charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-xl text-ink-primary">
                {currentUser?.name || 'Suresh Patil (Junior Engineer)'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-india-green/10 text-india-green">
                Active Field Officer
              </span>
            </div>
            <p className="text-xs text-ink-muted mt-0.5">
              Designation: Field Junior Engineer (JE) • Public Works Dept
            </p>
          </div>
        </div>

        {/* Credentials & Jurisdiction Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-surface-sunken rounded-xl border border-border-hairline space-y-1">
            <span className="text-ink-muted block text-[10px] uppercase font-bold">Officer ID</span>
            <span className="font-mono font-bold text-sm text-ink-primary">SP-MH-4019</span>
          </div>

          <div className="p-3.5 bg-surface-sunken rounded-xl border border-border-hairline space-y-1">
            <span className="text-ink-muted block text-[10px] uppercase font-bold">Assigned District</span>
            <span className="font-bold text-sm text-ink-primary">{currentUser?.district || 'Pune'}, {currentUser?.state || 'Maharashtra'}</span>
          </div>

          <div className="p-3.5 bg-surface-sunken rounded-xl border border-border-hairline space-y-1">
            <span className="text-ink-muted block text-[10px] uppercase font-bold">Mobile Number</span>
            <span className="font-mono font-bold text-sm text-ink-primary">+91 98230 44921</span>
          </div>

          <div className="p-3.5 bg-surface-sunken rounded-xl border border-border-hairline space-y-1">
            <span className="text-ink-muted block text-[10px] uppercase font-bold">Department Division</span>
            <span className="font-bold text-sm text-ink-primary">Rural Infrastructure Division IV</span>
          </div>
        </div>

        {/* Device & Field Sync Status */}
        <div className="p-4 rounded-xl border border-border-hairline bg-surface space-y-3">
          <h3 className="font-bold text-xs text-ink-primary uppercase tracking-wider">
            Device &amp; Offline Sync Status
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-ink-secondary">
                <Smartphone className="w-4 h-4 text-ink-muted" />
                <span>Registered Device: Samsung Galaxy M32</span>
              </div>
              <span className="text-india-green font-bold text-[11px]">✓ Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-ink-secondary">
                <Wifi className="w-4 h-4 text-ink-muted" />
                <span>Offline Storage Queue</span>
              </div>
              <span className="text-ink-muted font-mono text-[11px]">0 records pending sync</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-ink-secondary">
                <HardDrive className="w-4 h-4 text-ink-muted" />
                <span>Local Cache Integrity</span>
              </div>
              <span className="text-india-green font-bold text-[11px]">✓ Synchronized</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logoutUser}
          className="w-full py-3 rounded-xl border-2 border-border-hairline bg-surface hover:bg-surface-sunken text-risk-high font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-subtle"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out from Field Portal (लॉगआउट)</span>
        </button>
      </div>
    </div>
  );
}
