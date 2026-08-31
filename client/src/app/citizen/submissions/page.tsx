'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  FileText,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';

export default function CitizenSubmissionsPage() {
  const { t } = useI18n();
  const { complaints } = useApp();

  const mockSubmissions = [
    {
      id: 'SUB-2026-0891',
      projectName: 'PMGSY All-Weather Concrete Pavement (Haveli to Saswad)',
      projectId: 'PRJ-PMGSY-MH-401',
      submittedDate: '24 Aug 2026',
      status: 'Verified',
      statusType: 'success',
      plainNote: 'Your submitted site photo has been verified by the district inspection team.',
    },
    {
      id: 'SUB-2026-0844',
      projectName: 'Solar Powered Micro-Feeder (Phaltan North)',
      projectId: 'PRJ-KUSUM-MH-102',
      submittedDate: '21 Aug 2026',
      status: 'Additional Information Required',
      statusType: 'warning',
      plainNote: 'The submitted photo could not be clearly matched to the selected project location. Please upload a clearer photo taken at the project site.',
    },
    {
      id: 'SUB-2026-0792',
      projectName: 'Jal Jeevan Mission Elevated Storage Reservoir (Baramati)',
      projectId: 'PRJ-JJM-MH-208',
      submittedDate: '15 Aug 2026',
      status: 'Completed',
      statusType: 'success',
      plainNote: 'Pumping pipeline connection confirmed and public audit certificate issued.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-surface border-2 border-border-hairline rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary">
            My Submissions &amp; Reports (मेरी प्रस्तुतियां)
          </h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Track photographs, milestone feedbacks, and civic inquiries submitted for local public works.
          </p>
        </div>

        <Link
          href="/citizen"
          className="px-4 py-2.5 rounded-lg bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors shadow-subtle flex items-center gap-2 self-start sm:self-center shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Browse Projects to Submit</span>
        </Link>
      </div>

      <div className="space-y-4">
        {mockSubmissions.map((sub) => (
          <div
            key={sub.id}
            className="bg-surface border-2 border-border-hairline rounded-2xl p-5 sm:p-6 space-y-4 shadow-subtle hover:border-ink-muted transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-hairline pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary">
                  {sub.id}
                </span>
                <span className="text-xs text-ink-muted">Project: {sub.projectId}</span>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  sub.statusType === 'success'
                    ? 'bg-india-green/15 text-india-green'
                    : sub.statusType === 'warning'
                    ? 'bg-risk-medium/20 text-risk-medium border border-risk-medium/40'
                    : 'bg-navy/15 text-navy dark:text-[#7FA8D9]'
                }`}
              >
                {sub.status}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-ink-primary">
                {sub.projectName}
              </h3>
              <div className="p-3.5 bg-surface-sunken rounded-xl border border-border-hairline text-xs text-ink-secondary leading-relaxed">
                <span className="font-bold text-ink-primary block mb-1">Status Note:</span>
                {sub.plainNote}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-ink-muted">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Submitted on {sub.submittedDate}</span>
              </div>

              <Link
                href={`/citizen/status?id=${sub.id}`}
                className="font-bold text-saffron-deep dark:text-saffron hover:underline flex items-center gap-1 self-end sm:self-center"
              >
                <span>Track Full Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
