'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Search,
  FileText,
  UserCheck,
} from 'lucide-react';

export default function CitizenTrackStatusPage() {
  const { t } = useI18n();
  const [trackingId, setTrackingId] = useState('SUB-2026-0844');

  const timelineStages = [
    {
      step: '1',
      title: 'Submitted by Resident (जमा किया गया)',
      date: '21 Aug 2026, 11:24 AM',
      desc: 'Mobile upload and site photo received with GPS tag.',
      status: 'completed',
    },
    {
      step: '2',
      title: 'Evidence Received (प्रमाण प्राप्त)',
      date: '21 Aug 2026, 11:25 AM',
      desc: 'Digital public receipt generated and recorded in system ledger.',
      status: 'completed',
    },
    {
      step: '3',
      title: 'Automated Site Verification (स्वचालित मिलान)',
      date: '21 Aug 2026, 11:26 AM',
      desc: 'Location coordinates and timestamp verified against sanctioned project area.',
      status: 'completed',
    },
    {
      step: '4',
      title: 'Human Review by Officer (अधिकारी द्वारा समीक्षा)',
      date: '22 Aug 2026, 04:15 PM',
      desc: 'District Junior Engineer reviewed site photo and requested clarification.',
      status: 'action_required',
    },
    {
      step: '5',
      title: 'Final Determination (अंतिम निर्णय)',
      date: 'Pending Resubmission',
      desc: 'Final verification certificate will be issued after updated photo is received.',
      status: 'upcoming',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header & Tracking Search */}
      <div className="bg-surface border-2 border-border-hairline rounded-2xl p-6 sm:p-7 shadow-subtle space-y-4">
        <div>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary">
            Track Verification Status (स्थिति जांचें)
          </h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Follow the progress of your submitted public works evidence step by step.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter Tracking ID (e.g. SUB-2026-0844)..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface-sunken border border-border-hairline text-xs font-mono font-bold text-ink-primary focus:outline-none"
          />
          <button
            onClick={() => {}}
            className="px-5 py-2.5 rounded-xl bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors shadow-subtle flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track</span>
          </button>
        </div>
      </div>

      {/* Current Status Box (Plain Language - No Technical Jargon) */}
      <div className="bg-risk-medium/10 border-2 border-risk-medium/40 rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2 text-risk-medium font-bold text-sm">
          <AlertCircle className="w-5 h-5" />
          <span>Current Status: Additional Information Required (अतिरिक्त जानकारी अपेक्षित)</span>
        </div>

        <div className="space-y-2 text-xs text-ink-primary leading-relaxed">
          <p className="font-medium">
            The submitted photo could not be clearly matched to the selected project location.
          </p>
          <p className="text-ink-secondary">
            Please upload a clearer photo taken directly at the project site from a well-lit angle.
          </p>
        </div>

        <div className="pt-2 flex gap-3">
          <Link
            href="/citizen/complaints"
            className="px-4 py-2 rounded-lg bg-risk-medium text-ink-primary font-bold text-xs hover:opacity-90 shadow-subtle"
          >
            Upload Updated Photo →
          </Link>
        </div>
      </div>

      {/* Simple Timeline Component */}
      <div className="bg-surface border border-border-hairline rounded-2xl p-6 sm:p-7 shadow-subtle space-y-6">
        <h2 className="font-serif font-bold text-base text-ink-primary">
          Verification Lifecycle Timeline
        </h2>

        <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border-hairline">
          {timelineStages.map((stage) => {
            const isDone = stage.status === 'completed';
            const isAction = stage.status === 'action_required';

            return (
              <div key={stage.step} className="relative space-y-1">
                {/* Node icon on line */}
                <div
                  className={`absolute -left-[30px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isDone
                      ? 'bg-india-green text-surface'
                      : isAction
                      ? 'bg-risk-medium text-ink-primary animate-pulse'
                      : 'bg-surface-sunken border border-border-hairline text-ink-muted'
                  }`}
                >
                  {isDone ? '✓' : stage.step}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-ink-primary">{stage.title}</h3>
                  <span className="text-[11px] font-mono text-ink-muted">{stage.date}</span>
                </div>

                <p className="text-xs text-ink-secondary leading-relaxed">{stage.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
