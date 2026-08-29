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
  ScanLine,
  FolderGit2,
  FileCheck2,
  Clock,
} from 'lucide-react';

export default function SupervisorDashboardPage() {
  const { t, formatDate } = useI18n();
  const { supervisorTasks, currentUser, projects } = useApp();

  const correctionsNeeded = supervisorTasks.filter((t) => t.status === 'NEEDS_RETAKE');
  const pendingTasks = supervisorTasks.filter((t) => t.status === 'PENDING');

  const metrics = [
    { label: 'Projects Assigned', value: '4', sub: 'In Pune District', icon: FolderGit2, color: 'text-navy dark:text-[#7FA8D9]', bg: 'bg-navy/10 dark:bg-[#7FA8D9]/10' },
    { label: 'Evidence Uploaded', value: '142', sub: 'Total Records', icon: Camera, color: 'text-india-green', bg: 'bg-india-green/10' },
    { label: 'Scans Completed', value: '38', sub: 'This Month', icon: ScanLine, color: 'text-saffron-deep dark:text-saffron', bg: 'bg-saffron/15' },
    { label: 'Issues To Fix', value: `${correctionsNeeded.length}`, sub: 'Action Required', icon: AlertTriangle, color: 'text-risk-high', bg: 'bg-risk-high/10', isAlert: correctionsNeeded.length > 0 },
    { label: 'Verified Clean', value: '139', sub: '97.8% Acceptance', icon: CheckCircle2, color: 'text-india-green', bg: 'bg-india-green/10' },
  ];

  return (
    <div className="space-y-6">
      {/* ── 1. GREETING & PRIMARY ACTIONS ──────────────────────────────── */}
      <div className="bg-surface border-2 border-border-hairline rounded-2xl p-5 sm:p-7 shadow-subtle space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-india-green/10 text-india-green text-xs font-bold mb-1.5">
              <span className="w-2 h-2 rounded-full bg-india-green animate-pulse" />
              <span>Duty Roster Active • GPS Geofencing Enabled</span>
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-ink-primary">
              Welcome back, {currentUser?.name?.split(' ')[0] || 'Suresh'}
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
              Here are your assigned verification duties and urgent site tasks for today.
            </p>
          </div>

          <Link
            href="/onboarding/supervisor"
            className="text-xs text-saffron-deep dark:text-saffron hover:underline font-semibold flex items-center gap-1.5 self-start sm:self-center px-3 py-1.5 rounded-lg bg-surface-sunken border border-border-hairline"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Field Photo Guide (गाइड)</span>
          </Link>
        </div>

        {/* Action Buttons: Giant Upload + Quick Scan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Link
            href="/supervisor/upload"
            className="py-4 px-5 rounded-xl bg-india-green text-surface font-bold text-base sm:text-lg shadow-dropdown hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-3"
          >
            <Camera className="w-6 h-6 shrink-0" />
            <span>+ Upload Site Photo (नया फोटो)</span>
          </Link>

          <Link
            href="/supervisor/scan"
            className="py-4 px-5 rounded-xl bg-surface-sunken hover:bg-surface border-2 border-border-hairline text-ink-primary font-bold text-base sm:text-lg shadow-subtle active:scale-[0.99] transition-all flex items-center justify-center gap-3"
          >
            <ScanLine className="w-6 h-6 text-navy dark:text-[#7FA8D9] shrink-0" />
            <span>Quick Scan &amp; Verify (स्कैन करें)</span>
          </Link>
        </div>
      </div>

      {/* ── 2. METRICS AT A GLANCE (Section 4) ─────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className={`bg-surface border rounded-xl p-4 space-y-2 transition-all shadow-subtle ${
                m.isAlert ? 'border-risk-high/50 bg-risk-high/5' : 'border-border-hairline'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-ink-muted leading-tight">{m.label}</span>
                <div className={`w-7 h-7 rounded-lg ${m.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
              </div>
              <div>
                <div className="font-mono font-bold text-2xl text-ink-primary tabular-nums">
                  {m.value}
                </div>
                <div className="text-[10px] text-ink-muted truncate">{m.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 3. URGENT CORRECTIONS ALERT (If Any) ────────────────────────── */}
      {correctionsNeeded.length > 0 && (
        <div className="bg-risk-high/10 border-2 border-risk-high/40 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-risk-high font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>{correctionsNeeded.length} Submission(s) Need Your Immediate Correction</span>
            </div>
            <Link
              href="/supervisor/corrections"
              className="text-xs font-bold text-risk-high underline hover:opacity-80"
            >
              View All Corrections →
            </Link>
          </div>
          <p className="text-xs text-ink-secondary leading-relaxed">
            The reviewer requested new photos for the following items due to location match or image clarity.
          </p>
        </div>
      )}

      {/* ── 4. YOUR TASKS TODAY (Section 4) ─────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-lg text-ink-primary">
              Your Tasks Today (आज के कार्य सूची)
            </h2>
            <p className="text-xs text-ink-muted">
              {supervisorTasks.length} tasks scheduled • Prioritized by deadline and site distance
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-ink-secondary bg-surface-sunken px-2.5 py-1 rounded border border-border-hairline">
            {supervisorTasks.length} Active Tasks
          </span>
        </div>

        <div className="space-y-3">
          {supervisorTasks.map((task) => {
            const isRetake = task.status === 'NEEDS_RETAKE';
            return (
              <div
                key={task.id}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-subtle ${
                  isRetake
                    ? 'bg-risk-high/5 border-risk-high/40'
                    : 'bg-surface border-border-hairline hover:border-ink-muted'
                }`}
              >
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary">
                      {task.projectId}
                    </span>
                    <span className="text-xs font-semibold text-saffron-deep dark:text-saffron">
                      {task.scheme}
                    </span>
                    {isRetake ? (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-risk-high text-surface animate-pulse">
                        Action Required: Retake Photo
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-india-green/15 text-india-green">
                        Scheduled Inspection
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-base text-ink-primary leading-snug">
                    {task.projectName}
                  </h3>

                  <div className="p-3 bg-surface-sunken rounded-xl border border-border-hairline text-xs space-y-1.5">
                    <div className="font-semibold text-ink-primary flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-india-green shrink-0" />
                      <span>Target Milestone: {task.activityName}</span>
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
                      <span>Due: {task.dueDate}</span>
                    </span>
                  </div>
                </div>

                <Link
                  href={`/supervisor/upload?projectId=${task.projectId}`}
                  className={`w-full md:w-auto text-center px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-subtle shrink-0 flex items-center justify-center gap-2 transition-all ${
                    isRetake
                      ? 'bg-risk-high text-surface hover:opacity-90'
                      : 'bg-saffron text-ink-primary hover:bg-saffron-deep'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>{isRetake ? 'Retake Photo Now' : 'Capture Site Evidence'}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
