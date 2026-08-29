'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import { IntegrityArc } from '@/components/ui/integrity-arc';
import {
  FolderGit2,
  MapPin,
  Calendar,
  IndianRupee,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ArrowRight,
  ExternalLink,
  Layers,
  Clock,
} from 'lucide-react';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { t, formatNumber, formatDate } = useI18n();
  const { projects, evidenceList } = useApp();

  const project = projects.find((p) => p.id === resolvedParams.id) || projects[0];
  if (!project) return notFound();

  const projectEvidence = evidenceList.filter((e) => e.projectId === project.id);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6">
      {/* Project Master Dossier Header */}
      <div className="bg-surface border border-border-hairline rounded p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-ink-primary px-2 py-0.5 rounded bg-surface-sunken border border-border-hairline">
              {project.id}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-navy/10 text-navy dark:text-[#7FA8D9]">
              {project.scheme}
            </span>
            <span className="text-xs text-ink-muted">{project.ministry}</span>
          </div>

          <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary leading-tight">
            {project.name}
          </h1>

          <div className="flex flex-wrap gap-4 text-xs text-ink-secondary pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-ink-muted" /> {project.block}, {project.district}, {project.state}
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-ink-muted" /> Contractor: {project.contractor}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-ink-muted" /> {project.startDate} to {project.endDate}
            </span>
          </div>
        </div>

        {/* Aggregate Evidence Health Arc Score */}
        <div className="flex flex-col items-center text-center p-3 bg-surface-sunken rounded border border-border-hairline shrink-0">
          <span className="text-[10px] uppercase font-bold text-ink-muted mb-1">
            Evidence Health Index
          </span>
          <IntegrityArc score={project.evidenceHealthScore} size="md" showRiskBadge />
        </div>
      </div>

      {/* 2-Column Section: Evidence Requirements Engine + Project Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Domain Evidence Requirements Engine */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface border border-border-hairline rounded p-5 shadow-subtle space-y-4">
            <div className="border-b border-border-hairline pb-2">
              <h2 className="font-serif font-bold text-base text-ink-primary">
                Evidence Requirements Engine
              </h2>
              <p className="text-[11px] text-ink-secondary mt-0.5">
                Statutory evidence schema required by {project.scheme} operational guidelines.
              </p>
            </div>

            <div className="space-y-2.5">
              {project.requiredEvidenceList.map((req, idx) => (
                <div
                  key={req.key}
                  className="p-3 bg-surface-sunken rounded border border-border-hairline flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-surface border border-border-hairline flex items-center justify-center font-mono text-[10px] text-ink-muted font-bold">
                      {idx + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-ink-primary">{req.label}</span>
                      <span className="text-[10px] text-ink-muted">
                        {req.isMandatory ? 'Mandatory Milestone' : 'Optional Supporting'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      req.status === 'FULFILLED'
                        ? 'bg-india-green/15 text-india-green'
                        : req.status === 'PARTIAL'
                        ? 'bg-risk-medium/15 text-risk-medium'
                        : 'bg-risk-critical/15 text-risk-critical'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Scheme Sanction Specifications */}
            <div className="p-3.5 bg-surface-sunken/60 rounded border border-border-hairline space-y-1.5 text-xs">
              <span className="font-bold text-[11px] uppercase text-ink-secondary block">
                Geofence &amp; Financial Sanction
              </span>
              <div className="flex justify-between text-ink-primary">
                <span className="text-ink-muted">Sanctioned Value:</span>
                <span className="font-mono font-bold tabular-nums">₹{(project.budgetInr / 10000000).toFixed(2)} Cr</span>
              </div>
              <div className="flex justify-between text-ink-primary">
                <span className="text-ink-muted">Site Centroid:</span>
                <span className="font-mono font-bold">{project.centroid.lat}° N, {project.centroid.lng}° E</span>
              </div>
              <div className="flex justify-between text-ink-primary">
                <span className="text-ink-muted">Permitted Radius:</span>
                <span className="font-mono font-bold">{project.geofenceRadiusMeters} metres</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Project Evidence Timeline & Submissions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-surface border border-border-hairline rounded p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-border-hairline pb-2">
              <h2 className="font-serif font-bold text-base text-ink-primary">
                Ingested Submissions &amp; Activity Stages
              </h2>
              <span className="text-xs text-ink-muted font-mono">{projectEvidence.length} items logged</span>
            </div>

            {projectEvidence.length === 0 ? (
              <div className="p-8 text-center bg-surface-sunken rounded border border-border-hairline text-xs text-ink-muted">
                No evidence items currently uploaded for this project.
              </div>
            ) : (
              <div className="space-y-3">
                {projectEvidence.map((e) => (
                  <div
                    key={e.id}
                    className="p-3.5 rounded bg-surface-sunken border border-border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <IntegrityArc score={e.integrityScore} size="sm" showLabel />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-ink-primary">{e.id}</span>
                          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-surface border border-border-hairline text-ink-secondary">
                            {e.stage}
                          </span>
                        </div>
                        <h4 className="font-semibold text-ink-primary">{e.title}</h4>
                        <span className="text-[10px] text-ink-muted block">
                          Captured: {formatDate(e.capturedAt)} • {e.location.district}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/evidence/${e.id}`}
                      className="px-3 py-1.5 rounded bg-surface hover:bg-surface/80 border border-border-hairline text-ink-primary font-semibold shrink-0 flex items-center gap-1 self-end sm:self-center"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

