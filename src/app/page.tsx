'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import { IntegrityArc } from '@/components/ui/integrity-arc';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  FileText,
  ExternalLink,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function ReviewerDashboard() {
  const { t, formatNumber, formatDate } = useI18n();
  const { evidenceList, projects, approveEvidence, flagEvidence } = useApp();

  const totalAudited = 1428;
  const flaggedItems = evidenceList.filter((e) => e.riskLevel === 'CRITICAL' || e.riskLevel === 'HIGH');
  const pendingItems = evidenceList.filter((e) => e.auditStatus === 'PENDING' || e.auditStatus === 'FLAGGED');
  const criticalCount = evidenceList.filter((e) => e.riskLevel === 'CRITICAL').length;
  const highCount = evidenceList.filter((e) => e.riskLevel === 'HIGH').length;
  const mediumCount = evidenceList.filter((e) => e.riskLevel === 'MEDIUM').length;
  const lowCount = evidenceList.filter((e) => e.riskLevel === 'LOW').length;

  const avgIntegrity = Math.round(
    evidenceList.reduce((acc, curr) => acc + curr.integrityScore, 0) / evidenceList.length
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6">
      {/* Top Welcome & Institutional Status Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary tracking-tight">
              {t('nav_dashboard', 'Reviewer Operations Hub')}
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-india-green/10 text-india-green text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-india-green animate-pulse" />
              Live Audit Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1 max-w-2xl leading-relaxed">
            Multi-signal consistency audit for public-works evidence across geospatial, temporal, visual, and cross-project vector corpora.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/queue"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-saffron text-ink-primary hover:bg-saffron-deep font-semibold text-xs transition-colors shadow-subtle"
          >
            <span>{t('nav_queue', 'Open Review Queue')}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-ink-primary text-surface text-[10px] tabular-nums">
              {pendingItems.length}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/ingest"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-navy dark:text-[#7FA8D9]" />
            <span>Live Pipeline Sandbox</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Metric Tiles in Fraunces Serif + Tabular Digits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Tile 1: Total Audited */}
        <div className="bg-surface border border-border-hairline rounded p-4 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink-secondary text-xs">
            <span className="font-medium">{t('stat_total_audited', 'Total Audited Submissions')}</span>
            <FileText className="w-4 h-4 text-ink-muted" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tabular-nums">
              {formatNumber(totalAudited)}
            </span>
            <span className="text-[11px] text-india-green font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +184 today
            </span>
          </div>
          <span className="text-[10px] text-ink-muted mt-2">Across 6 Ministries &amp; 14 States</span>
        </div>

        {/* Tile 2: Anomaly Flag Rate */}
        <div className="bg-surface border border-border-hairline rounded p-4 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink-secondary text-xs">
            <span className="font-medium">{t('stat_flagged_rate', 'Anomaly Detection Rate')}</span>
            <ShieldAlert className="w-4 h-4 text-risk-high" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-risk-high tabular-nums">
              4.8%
            </span>
            <span className="text-[11px] text-ink-muted font-medium">68 flagged cases</span>
          </div>
          <span className="text-[10px] text-ink-muted mt-2">Cross-project duplicates &amp; geofence</span>
        </div>

        {/* Tile 3: Mean Integrity Index */}
        <div className="bg-surface border border-border-hairline rounded p-4 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink-secondary text-xs">
            <span className="font-medium">{t('stat_avg_integrity', 'Mean Integrity Score')}</span>
            <CheckCircle2 className="w-4 h-4 text-india-green" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary tabular-nums">
                {avgIntegrity}
              </span>
              <span className="text-xs text-ink-muted">/100</span>
            </div>
            <IntegrityArc score={avgIntegrity} size="sm" showLabel={false} />
          </div>
          <span className="text-[10px] text-ink-muted mt-2">Weighted multi-signal fusion average</span>
        </div>

        {/* Tile 4: Review Backlog */}
        <div className="bg-surface border border-border-hairline rounded p-4 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink-secondary text-xs">
            <span className="font-medium">{t('stat_pending_review', 'Cases Awaiting Review')}</span>
            <Clock className="w-4 h-4 text-saffron-deep dark:text-saffron" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-saffron-deep dark:text-saffron tabular-nums">
              {pendingItems.length}
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-risk-critical/15 text-risk-critical font-semibold">
              {criticalCount} Critical
            </span>
          </div>
          <span className="text-[10px] text-ink-muted mt-2">Target SLA: &lt; 24h per case</span>
        </div>
      </div>

      {/* Risk Distribution Breakdown Bar */}
      <div className="bg-surface border border-border-hairline rounded p-4 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-ink-secondary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
              Multi-Signal Risk Spectrum Distribution
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-risk-low font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-risk-low" /> {lowCount} Low Risk
            </span>
            <span className="flex items-center gap-1.5 text-risk-medium font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-risk-medium" /> {mediumCount} Medium
            </span>
            <span className="flex items-center gap-1.5 text-risk-high font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-risk-high" /> {highCount} High
            </span>
            <span className="flex items-center gap-1.5 text-risk-critical font-bold">
              <span className="w-2.5 h-2.5 rounded-sm bg-risk-critical" /> {criticalCount} Critical Flag
            </span>
          </div>
        </div>

        {/* Segmented Risk Visualizer Bar */}
        <div className="w-full h-3 bg-surface-sunken rounded-sm overflow-hidden flex gap-0.5">
          <div style={{ width: `${(lowCount / evidenceList.length) * 100}%` }} className="bg-risk-low" title="Low Risk" />
          <div style={{ width: `${(mediumCount / evidenceList.length) * 100}%` }} className="bg-risk-medium" title="Medium Risk" />
          <div style={{ width: `${(highCount / evidenceList.length) * 100}%` }} className="bg-risk-high" title="High Risk" />
          <div style={{ width: `${(criticalCount / evidenceList.length) * 100}%` }} className="bg-risk-critical" title="Critical Flags" />
        </div>
      </div>

      {/* Main Grid: Urgent Attention Cases + Recent Ingestion Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent Attention Flagged Evidence */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-risk-critical" />
              <h2 className="font-serif font-bold text-base text-ink-primary">
                Urgent Attention Flags Requiring Audit Action
              </h2>
            </div>
            <Link
              href="/queue"
              className="text-xs text-saffron-deep dark:text-saffron hover:underline font-semibold flex items-center gap-1"
            >
              View Full Queue ({pendingItems.length}) <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {flaggedItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-surface border border-border-hairline rounded p-4 shadow-subtle hover:border-ink-muted transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start"
              >
                <div className="flex gap-3.5 items-start">
                  <div className="shrink-0 mt-0.5">
                    <IntegrityArc score={item.integrityScore} size="md" showRiskBadge />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-ink-primary">{item.id}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-sunken border border-border-hairline text-ink-secondary">
                        {item.scheme}
                      </span>
                      <span className="text-[10px] text-ink-muted flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {item.location.district}, {item.location.state}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-ink-primary leading-tight">{item.title}</h4>

                    {/* Detected Anomaly Warning Pill */}
                    {item.detectedAnomalies.length > 0 && (
                      <div className="mt-1.5 p-2 rounded bg-surface-sunken border-l-2 border-risk-critical text-[11px] text-ink-primary leading-snug">
                        <span className="font-bold text-risk-critical block">
                          {item.detectedAnomalies[0].title}
                        </span>
                        <span className="text-ink-secondary text-[10px] line-clamp-2">
                          {item.detectedAnomalies[0].description}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline Action Toolbar */}
                <div className="flex sm:flex-col items-center sm:items-end gap-1.5 shrink-0 self-end sm:self-center w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border-hairline">
                  <Link
                    href={`/evidence/${item.id}`}
                    className="w-full sm:w-auto text-center px-3 py-1.5 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary text-xs font-semibold transition-colors"
                  >
                    Inspect Dossier
                  </Link>
                  <div className="flex gap-1 w-full sm:w-auto">
                    <button
                      onClick={() => flagEvidence(item.id, 'Dispatched to Field Officer for physical site audit')}
                      className="flex-1 sm:flex-initial px-2 py-1 rounded bg-risk-high/10 text-risk-high hover:bg-risk-high/20 text-[11px] font-semibold transition-colors"
                      title="Request Physical Field Inspection"
                    >
                      Flag Field
                    </button>
                    <button
                      onClick={() => approveEvidence(item.id, 'Verified upon manual reviewer corroboration')}
                      className="flex-1 sm:flex-initial px-2 py-1 rounded bg-india-green/10 text-india-green hover:bg-india-green/20 text-[11px] font-semibold transition-colors"
                      title="Approve Evidence"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recent Multi-Signal Ingestion Stream & Scheme Health */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-ink-primary">
              Active Public Works Schemes
            </h3>
            <Link href="/map" className="text-xs text-saffron-deep dark:text-saffron hover:underline">
              Map View
            </Link>
          </div>

          <div className="bg-surface border border-border-hairline rounded p-3.5 shadow-subtle space-y-3">
            {projects.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="block p-2 rounded hover:bg-surface-sunken transition-colors group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold text-ink-primary group-hover:text-saffron-deep">
                    {p.id}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      p.evidenceHealthScore > 80
                        ? 'bg-india-green/10 text-india-green'
                        : p.evidenceHealthScore > 50
                        ? 'bg-risk-medium/10 text-risk-medium'
                        : 'bg-risk-critical/10 text-risk-critical'
                    }`}
                  >
                    Health {p.evidenceHealthScore}/100
                  </span>
                </div>
                <p className="text-xs text-ink-secondary truncate mt-0.5">{p.name}</p>
                <div className="flex items-center justify-between text-[10px] text-ink-muted mt-1">
                  <span>{p.scheme}</span>
                  <span>{p.district}, {p.state}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Technical Differentiator Note */}
          <div className="p-3.5 rounded bg-surface-sunken border border-border-hairline space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-navy dark:text-[#7FA8D9]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Evidence Graph &amp; Fusion Core</span>
            </div>
            <p className="text-[11px] text-ink-secondary leading-relaxed">
              Every submission is cross-correlated across 7 distinct signals. AI provides explainable anomaly probabilities; human reviewers make the final authoritative determination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

