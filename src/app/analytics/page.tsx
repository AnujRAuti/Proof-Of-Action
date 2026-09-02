'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import { IntegrityArc } from '@/components/ui/integrity-arc';
import { AbstractMark } from '@/components/ui/abstract-mark';
import {
  BarChart3,
  Award,
  Download,
  Printer,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileCheck2,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function AnalyticsAndCertificatesPage() {
  const { t, formatDate, formatNumber } = useI18n();
  const { evidenceList, projects, addToast } = useApp();

  const approvedEvidence = evidenceList.filter((e) => e.auditStatus === 'APPROVED');
  const [selectedCertId, setSelectedCertId] = useState<string>(
    approvedEvidence[0]?.id || evidenceList[0]?.id
  );

  const certEvidence = evidenceList.find((e) => e.id === selectedCertId) || evidenceList[0];
  const certProject = projects.find((p) => p.id === certEvidence.projectId) || projects[0];

  const handlePrintCertificate = () => {
    window.print();
    addToast({
      title: 'Certificate Print Dialog Opened',
      description: 'Document ready for official archival printing or PDF export.',
      type: 'info',
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary tracking-tight">
              {t('nav_analytics', 'Program Analytics & Evidence Integrity Certificates')}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-india-green/15 text-india-green font-bold">
              Statutory Provenance (Section 86)
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-1">
            Institutional verification metrics and tamper-proof Evidence Integrity Certificates for disbursement clearance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintCertificate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-ink-primary text-surface text-xs font-semibold hover:opacity-90 transition-opacity shadow-subtle"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save Certificate PDF</span>
          </button>
        </div>
      </div>

      {/* Top Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-border-hairline rounded p-4 shadow-subtle space-y-1">
          <span className="text-[11px] font-medium text-ink-secondary">
            Cross-District Duplicate Prevention
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-ink-primary tabular-nums">99.2%</span>
            <span className="text-[11px] text-india-green font-semibold">Precision</span>
          </div>
          <span className="text-[10px] text-ink-muted block">pHash + Vector nearest-neighbor filter</span>
        </div>

        <div className="bg-surface border border-border-hairline rounded p-4 shadow-subtle space-y-1">
          <span className="text-[11px] font-medium text-ink-secondary">
            Average Reviewer Turnaround
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-ink-primary tabular-nums">4.2h</span>
            <span className="text-[11px] text-india-green font-semibold">-68% vs baseline</span>
          </div>
          <span className="text-[10px] text-ink-muted block">Triage queue prioritized by AI risk score</span>
        </div>

        <div className="bg-surface border border-border-hairline rounded p-4 shadow-subtle space-y-1">
          <span className="text-[11px] font-medium text-ink-secondary">
            Certificates Issued This Quarter
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-ink-primary tabular-nums">842</span>
            <span className="text-[11px] text-saffron-deep font-semibold">Cryptographically Signed</span>
          </div>
          <span className="text-[10px] text-ink-muted block">Disbursement audit certificates</span>
        </div>
      </div>

      {/* Main Certificate Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="font-serif font-bold text-lg text-ink-primary">
            Official Evidence Integrity Certificate (Sample Generator)
          </h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-ink-secondary">Select Evidence Item:</span>
            <select
              value={selectedCertId}
              onChange={(e) => setSelectedCertId(e.target.value)}
              className="px-2.5 py-1.5 rounded bg-surface border border-border-hairline font-semibold text-ink-primary"
            >
              {evidenceList.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.id} • Score: {e.integrityScore} ({e.auditStatus})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Printable Institutional Certificate Box */}
        <div className="bg-surface border-2 border-border-hairline rounded-lg p-6 sm:p-10 shadow-dropdown space-y-6 relative overflow-hidden print:border-none print:shadow-none">
          {/* Subtle Tricolour Header Band */}
          <div className="tricolour-hairline absolute top-0 inset-x-0" />

          {/* Certificate Header Lockup */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-hairline pb-5">
            <div className="flex items-center gap-3">
              <AbstractMark size={48} />
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-ink-muted block">
                  GOVERNMENT OF INDIA • DIGITAL PUBLIC INFRASTRUCTURE
                </span>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-ink-primary">
                  Official Certificate of Evidence Integrity (EIIL)
                </h3>
                <span className="text-xs text-ink-secondary">
                  Statutory Audit Record pursuant to Public Works Oversight Guidelines
                </span>
              </div>
            </div>

            <div className="text-right rtl:text-left font-mono text-xs">
              <span className="text-ink-muted block text-[10px]">CERTIFICATE SERIAL NO:</span>
              <span className="font-bold text-ink-primary">EIIL-CERT-2026-{certEvidence.id.replace('EVD-', '')}</span>
              <span className="text-ink-muted block text-[10px] mt-0.5">ISSUED: {formatDate(new Date())}</span>
            </div>
          </div>

          {/* Certificate Body Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Evidence & Project Details */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold uppercase text-[11px] text-ink-secondary border-b border-border-hairline pb-1">
                Asset &amp; Scheme Dossier
              </h4>
              <div className="space-y-1.5">
                <div>
                  <span className="text-ink-muted block text-[10px]">Scheme Track:</span>
                  <span className="font-semibold text-ink-primary">{certProject.scheme}</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px]">Project Name:</span>
                  <span className="font-semibold text-ink-primary">{certProject.name}</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px]">Location &amp; Block:</span>
                  <span className="text-ink-primary font-medium">{certProject.block}, {certProject.district}, {certProject.state}</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px]">Contractor Entity:</span>
                  <span className="text-ink-primary">{certProject.contractor}</span>
                </div>
              </div>
            </div>

            {/* Column 2: Cryptographic & Spatial Fingerprint */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold uppercase text-[11px] text-ink-secondary border-b border-border-hairline pb-1">
                Cryptographic Provenance
              </h4>
              <div className="space-y-1.5 font-mono">
                <div>
                  <span className="text-ink-muted block text-[10px]">SHA-256 Digest:</span>
                  <span className="text-ink-primary break-all text-[10px] font-bold">{certEvidence.sha256}</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px]">Captured Coordinates:</span>
                  <span className="text-ink-primary text-[11px] font-semibold">
                    {certEvidence.location.lat.toFixed(4)}° N, {certEvidence.location.lng.toFixed(4)}° E (±{certEvidence.location.accuracyMeters}m)
                  </span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px]">AI Model Hash &amp; Version:</span>
                  <span className="text-ink-primary text-[11px]">{certEvidence.modelVersion}</span>
                </div>
              </div>
            </div>

            {/* Column 3: Integrity Score & Official Stamp */}
            <div className="bg-surface-sunken p-4 rounded border border-border-hairline flex flex-col items-center justify-between text-center space-y-3">
              <span className="text-[10px] uppercase font-bold text-ink-muted">
                Audit Determination Index
              </span>
              <IntegrityArc score={certEvidence.integrityScore} size="md" showRiskBadge />
              <div className="text-[10px] text-ink-secondary font-medium">
                {certEvidence.auditStatus === 'APPROVED' ? (
                  <span className="text-india-green font-bold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved for Milestone Release
                  </span>
                ) : (
                  <span className="text-risk-high font-bold flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Under Audit Investigation
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Certificate Sign-Off Footer */}
          <div className="pt-6 border-t border-border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-surface-sunken border border-border-hairline rounded flex items-center justify-center p-1">
                <QrCode className="w-12 h-12 text-ink-primary" />
              </div>
              <div className="text-[10px] text-ink-muted">
                <span className="font-mono font-bold block text-ink-primary">VERIFIABLE DIGITAL SEAL</span>
                <span>Scan QR code to verify immutable cryptographic block on the National EIIL Node.</span>
              </div>
            </div>

            <div className="text-center sm:text-right rtl:sm:text-left space-y-1">
              <div className="w-44 border-b border-ink-primary pb-1">
                <span className="font-serif font-bold text-ink-primary text-xs">
                  {certEvidence.reviewer?.reviewedBy || 'Executive Engineer (Civil/Audit)'}
                </span>
              </div>
              <span className="text-[10px] text-ink-muted block uppercase">Authorized Reviewing Officer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

