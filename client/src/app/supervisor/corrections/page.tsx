'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  AlertTriangle,
  Camera,
  MapPin,
  Calendar,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export default function SupervisorCorrectionsPage() {
  const { t } = useI18n();
  const { supervisorTasks } = useApp();

  const corrections = supervisorTasks.filter((t) => t.status === 'NEEDS_RETAKE');

  return (
    <div className="space-y-6">
      <div className="bg-surface border-2 border-risk-high/40 rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-risk-high font-bold text-xs uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Action Required / सुधार कार्य</span>
          </div>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary">
            Reviewer Retake Requests ({corrections.length})
          </h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            The evidence items below require a retake or clearer photograph before funding certification.
          </p>
        </div>

        <Link
          href="/onboarding/supervisor"
          className="text-xs font-semibold text-saffron-deep dark:text-saffron flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-sunken border border-border-hairline self-start sm:self-center shrink-0"
        >
          <HelpCircle className="w-4 h-4" />
          <span>How to Take Accepted Photos</span>
        </Link>
      </div>

      {corrections.length === 0 ? (
        <div className="bg-surface border border-border-hairline rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-india-green/10 text-india-green flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-ink-primary">
            No Corrections Required! (कोई सुधार लंबित नहीं)
          </h3>
          <p className="text-xs text-ink-secondary max-w-sm mx-auto">
            All your submitted evidence items are verified and in good standing.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {corrections.map((task) => (
            <div
              key={task.id}
              className="bg-surface border-2 border-risk-high/40 rounded-2xl p-5 sm:p-6 space-y-4 shadow-subtle"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-hairline pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary">
                    {task.projectId}
                  </span>
                  <span className="text-xs font-semibold text-saffron-deep dark:text-saffron">
                    {task.scheme}
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-risk-high text-surface uppercase tracking-wider">
                  Needs Retake
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif font-bold text-base text-ink-primary">
                  {task.projectName}
                </h3>
                <div className="p-3 bg-risk-high/5 rounded-xl border border-risk-high/20 space-y-1 text-xs">
                  <div className="font-bold text-ink-primary">
                    Requested Activity: {task.activityName}
                  </div>
                  <div className="text-risk-high font-medium leading-relaxed">
                    💬 Reviewer Instruction: {task.reviewerNote || 'Image was blurry or too similar to existing baseline. Please capture a clear, well-lit photo showing current construction stage.'}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-4 text-xs text-ink-secondary">
                  <span className="flex items-center gap-1 font-bold text-india-green">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{task.distanceMeters}m from site</span>
                  </span>
                  <span className="flex items-center gap-1 text-ink-muted">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Due: {task.dueDate}</span>
                  </span>
                </div>

                <Link
                  href={`/supervisor/upload?projectId=${task.projectId}`}
                  className="px-6 py-2.5 rounded-xl bg-risk-high text-surface font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-subtle"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Upload Retake Photo Now</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
