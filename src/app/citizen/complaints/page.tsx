'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export default function CitizenComplaintsPage() {
  const { t, formatDate } = useI18n();
  const { complaints } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-border-hairline rounded-xl p-5 sm:p-6 shadow-subtle space-y-1">
        <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary">
          Your Reported Concerns &amp; Grievances (आपकी शिकायतें)
        </h1>
        <p className="text-xs text-ink-secondary">
          Track official department responses and site inspection outcomes.
        </p>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="p-8 bg-surface border border-border-hairline rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-india-green mx-auto" />
            <h3 className="font-serif font-bold text-base text-ink-primary">
              No Pending Concerns Filed
            </h3>
            <p className="text-xs text-ink-secondary max-w-sm mx-auto">
              You haven&rsquo;t reported any issues with ongoing projects in your area yet.
            </p>
            <Link
              href="/citizen"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep"
            >
              <span>Explore Projects in Your Ward</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          complaints.map((cmp) => {
            const isResolved = cmp.status === 'RESOLVED';
            const isInReview = cmp.status === 'IN_REVIEW';

            return (
              <div
                key={cmp.id}
                className="bg-surface border border-border-hairline rounded-xl p-5 shadow-subtle space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-hairline pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-ink-primary px-2 py-0.5 rounded bg-surface-sunken border border-border-hairline">
                      Tracking #{cmp.trackingId}
                    </span>
                    <span className="text-xs font-semibold text-ink-secondary">
                      {cmp.category}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isResolved
                        ? 'bg-india-green/15 text-india-green'
                        : isInReview
                        ? 'bg-saffron/15 text-saffron-deep'
                        : 'bg-navy/15 text-navy dark:text-[#7FA8D9]'
                    }`}
                  >
                    {cmp.statusLabel}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-ink-primary leading-snug">
                    {cmp.projectName}
                  </h3>
                  <p className="text-xs text-ink-secondary leading-relaxed bg-surface-sunken p-3 rounded-lg border border-border-hairline">
                    &ldquo;{cmp.description}&rdquo;
                  </p>
                </div>

                {/* Department Response Box */}
                {cmp.departmentResponse && (
                  <div className="p-3 bg-india-green/10 border border-india-green/20 rounded-lg space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-india-green">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Official Department Action Response:</span>
                    </div>
                    <p className="text-ink-primary text-[11px] leading-relaxed">
                      {cmp.departmentResponse}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-ink-muted pt-1">
                  <span>Filed on {formatDate(cmp.filedAt)}</span>
                  <span>Filed by {cmp.filedBy}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

