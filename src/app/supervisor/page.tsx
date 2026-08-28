'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export default function SupervisorHomePage() {
  const { t, formatDate } = useI18n();
  const { supervisorTasks, currentUser } = useApp();

  return (
    <div className="space-y-6">
      {/* Top Banner & Giant "Upload Evidence" Primary Action */}
      <div className="bg-surface border-2 border-border-hairline rounded-xl p-5 sm:p-6 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary">
              Your Tasks Today (आज के कार्य)
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
              Assigned site verification duties for {currentUser?.district || 'Pune'} jurisdiction.
            </p>
          </div>

          <Link
            href="/onboarding/supervisor"
            className="text-xs text-saffron-deep dark:text-saffron hover:underline font-semibold flex items-center gap-1 self-start sm:self-center"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Field Photo Guidelines (गाइड देखें)</span>
          </Link>
        </div>

        {/* Giant Thumb-Friendly Primary Action Button */}
        <Link
          href="/supervisor/upload"
          className="w-full py-4 rounded-xl bg-india-green text-surface font-bold text-base sm:text-lg shadow-dropdown hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-3"
        >
          <Camera className="w-6 h-6" />
          <span>Upload Evidence from Site (फोटो अपलोड करें)</span>
        </Link>
      </div>

      {/* Prioritized Tasks Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-ink-primary">
            Pending Submissions Checklist ({supervisorTasks.length})
          </h2>
          <span className="text-xs text-ink-muted">Sorted by Due Date</span>
        </div>

        <div className="space-y-3">
          {supervisorTasks.map((task) => {
            const isRetake = task.status === 'NEEDS_RETAKE';
            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-xl border-2 transition-all flex flex-col sm:flex-row gap-4 items-start justify-between ${
                  isRetake
                    ? 'bg-risk-high/5 border-risk-high/40'
                    : 'bg-surface border-border-hairline hover:border-ink-muted'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary">
                      {task.projectId}
                    </span>
                    <span className="text-xs font-semibold text-saffron-deep dark:text-saffron">
                      {task.scheme}
                    </span>
                    {isRetake && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-risk-high text-surface animate-pulse">
                        Action Required: Retake Photo
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-sm sm:text-base text-ink-primary leading-snug">
                    {task.projectName}
                  </h3>

                  <div className="p-2.5 bg-surface-sunken rounded-lg border border-border-hairline text-xs space-y-1">
                    <div className="font-semibold text-ink-primary flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-india-green" />
                      <span>Required Evidence: {task.activityName}</span>
                    </div>
                    {task.reviewerNote && (
                      <p className="text-risk-high font-medium text-[11px] leading-snug">
                        💬 Reviewer Note: {task.reviewerNote}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-ink-secondary">
                    <span className="flex items-center gap-1 text-india-green font-bold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{task.distanceMeters < 100 ? `On Site (${task.distanceMeters}m away)` : `${task.distanceMeters}m away`}</span>
                    </span>
                    <span className="flex items-center gap-1 text-ink-muted">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Due by {task.dueDate}</span>
                    </span>
                  </div>
                </div>

                <Link
                  href={`/supervisor/upload?projectId=${task.projectId}`}
                  className="w-full sm:w-auto text-center px-5 py-2.5 rounded-lg bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors shadow-subtle shrink-0 flex items-center justify-center gap-1.5 self-end sm:self-center"
                >
                  <span>{isRetake ? 'Retake Photo Now' : 'Capture Photo'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

