'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import { resolveFindingText } from '@/lib/i18n/plain-language-layer';
import { IntegrityArc } from '@/components/ui/integrity-arc';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Camera,
  Layers,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  SplitSquareVertical,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Languages,
  UserCheck,
  Send,
  MessageSquare,
} from 'lucide-react';

export default function ReviewerEvidenceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { t, formatDate, language } = useI18n();
  const {
    evidenceList,
    approveEvidence,
    rejectEvidence,
    flagEvidence,
    overrideEvidence,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'METADATA' | 'SIMILAR' | 'MAP' | 'TIMELINE' | 'ACTIONS'>('METADATA');
  const [showBoxes, setShowBoxes] = useState(true);
  const [isCopiedSha, setIsCopiedSha] = useState(false);
  const [showSupervisorComposer, setShowSupervisorComposer] = useState(false);
  const [supervisorInstruction, setSupervisorInstruction] = useState('');

  // Override Form States
  const [overrideScore, setOverrideScore] = useState<number>(85);
  const [overrideRisk, setOverrideRisk] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('LOW');
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const evidence = evidenceList.find((e) => e.id === resolvedParams.id);
  if (!evidence) return notFound();

  // Auto-generate plain-language supervisor instruction from canonical finding
  const handleOpenSupervisorComposer = (canonicalKey: string) => {
    const plainText = resolveFindingText(canonicalKey, 'SUPERVISOR', language);
    setSupervisorInstruction(plainText);
    setShowSupervisorComposer(true);
  };

  const handleSendSupervisorInstruction = (e: React.FormEvent) => {
    e.preventDefault();
    flagEvidence(evidence.id, supervisorInstruction);
    setShowSupervisorComposer(false);
    addToast({
      title: 'Action Task Dispatched to Supervisor',
      description: 'Instruction formatted in plain field language and assigned to the supervisor’s task queue.',
      type: 'warning',
    });
  };

  const handleCopySha = () => {
    navigator.clipboard.writeText(evidence.sha256);
    setIsCopiedSha(true);
    setTimeout(() => setIsCopiedSha(false), 2000);
  };

  const submitOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim()) return;
    overrideEvidence(evidence.id, overrideScore, overrideRisk, overrideReason);
    setShowOverrideModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
        <div className="flex items-center gap-3">
          <Link
            href="/queue"
            className="p-1.5 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-muted hover:text-ink-primary"
            title="Back to Review Queue"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-ink-primary">{evidence.id}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                  evidence.auditStatus === 'APPROVED'
                    ? 'bg-india-green/15 text-india-green border border-india-green/30'
                    : evidence.auditStatus === 'REJECTED'
                    ? 'bg-risk-critical/15 text-risk-critical border border-risk-critical/30'
                    : evidence.auditStatus === 'FLAGGED'
                    ? 'bg-risk-high/15 text-risk-high border border-risk-high/30'
                    : 'bg-surface-sunken text-ink-secondary border border-border-hairline'
                }`}
              >
                {evidence.auditStatus}
              </span>
            </div>
            <h1 className="font-serif font-bold text-lg sm:text-xl text-ink-primary mt-0.5">
              {evidence.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {evidence.beforeImageUrl && (
            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary text-xs font-semibold"
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Compare Before/After</span>
            </Link>
          )}
          <Link
            href={`/projects/${evidence.projectId}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary text-xs font-medium"
          >
            <span>Project Dossier</span>
            <ExternalLink className="w-3 h-3 text-ink-muted" />
          </Link>
        </div>
      </div>

      {/* Main 2-Col Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: High-Res Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-surface border border-border-hairline rounded shadow-subtle overflow-hidden relative">
            <div className="relative w-full aspect-[4/3] bg-ink-primary flex items-center justify-center overflow-hidden">
              <img src={evidence.imageUrl} alt={evidence.title} className="w-full h-full object-cover" />

              {showBoxes &&
                evidence.detectedObjects.map((obj, i) => {
                  const [ymin, xmin, ymax, xmax] = obj.box;
                  return (
                    <div
                      key={i}
                      className="absolute border-2 border-saffron bg-saffron/10 rounded-sm pointer-events-none"
                      style={{
                        top: `${ymin * 100}%`,
                        left: `${xmin * 100}%`,
                        width: `${(xmax - xmin) * 100}%`,
                        height: `${(ymax - ymin) * 100}%`,
                      }}
                    >
                      <span className="absolute -top-5 left-0 bg-saffron text-ink-primary text-[9px] font-bold px-1 py-0.2 rounded font-mono">
                        {obj.label} ({Math.round(obj.confidence * 100)}%)
                      </span>
                    </div>
                  );
                })}

              <div className="absolute bottom-0 inset-x-0 bg-ink-primary/80 backdrop-blur-sm p-2 text-surface flex items-center justify-between text-[11px] font-mono">
                <span>LAT: {evidence.location.lat.toFixed(4)}° N | LNG: {evidence.location.lng.toFixed(4)}° E</span>
                <button
                  onClick={() => setShowBoxes(!showBoxes)}
                  className="px-2 py-0.5 rounded bg-surface/20 hover:bg-surface/30 text-surface text-[10px] font-sans font-semibold"
                >
                  {showBoxes ? 'Hide Bounding Boxes' : 'Show Boxes'}
                </button>
              </div>
            </div>

            <div className="p-3 bg-surface-sunken border-t border-border-hairline flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-ink-secondary">
                <Camera className="w-3.5 h-3.5" /> {evidence.camera.make} {evidence.camera.model}
              </span>
              <button onClick={handleCopySha} className="font-mono text-[11px] text-ink-muted hover:text-ink-primary flex items-center gap-1">
                <span>SHA: {evidence.sha256.slice(0, 12)}...</span>
                {isCopiedSha ? <Check className="w-3 h-3 text-india-green" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="bg-surface border border-border-hairline rounded p-4 shadow-subtle space-y-2 text-xs">
            <span className="font-bold uppercase text-[10px] text-ink-secondary block">Sanctioned Claim:</span>
            <p className="bg-surface-sunken p-3 rounded border border-border-hairline italic text-ink-primary">
              &ldquo;{evidence.claimText}&rdquo;
            </p>
          </div>
        </div>

        {/* Right 5 Cols: Score & Fusion */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface border border-border-hairline rounded p-5 shadow-subtle flex flex-col items-center text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
              Evidence Integrity Score
            </span>
            <IntegrityArc score={evidence.integrityScore} size="lg" showRiskBadge />
          </div>

          {/* Fusion Breakdown */}
          <div className="bg-surface border border-border-hairline rounded p-4 shadow-subtle space-y-2.5 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-ink-primary border-b border-border-hairline pb-1.5">
              Multi-Signal Fusion Sub-Scores
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Geospatial Geofence</span>
                <span className="font-mono font-bold">{evidence.fusionScores.gps}%</span>
              </div>
              <div className="flex justify-between">
                <span>Temporal Chronology</span>
                <span className="font-mono font-bold">{evidence.fusionScores.temporal}%</span>
              </div>
              <div className="flex justify-between text-risk-high font-bold">
                <span>Duplicate Risk</span>
                <span className="font-mono">{evidence.fusionScores.duplicateRisk}%</span>
              </div>
              <div className="flex justify-between">
                <span>Claim-to-Evidence Match</span>
                <span className="font-mono font-bold">{evidence.fusionScores.claimMatch}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detected Anomalies Alert & Plain-Language Supervisor Instruction Composer */}
      {evidence.detectedAnomalies.length > 0 && (
        <div className="bg-surface border-l-4 border-risk-critical border-t border-r border-b border-border-hairline rounded p-4 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-risk-critical font-bold text-xs uppercase">
              <ShieldAlert className="w-4 h-4" />
              <span>AI Anomaly Explanation ({evidence.detectedAnomalies.length} Flagged)</span>
            </div>
            <button
              onClick={() => handleOpenSupervisorComposer('duplicate_evidence_found')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-saffron text-ink-primary font-bold text-xs shadow-subtle hover:bg-saffron-deep transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Compose Plain Field Instruction for Supervisor</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {evidence.detectedAnomalies.map((anom) => (
              <div key={anom.id} className="p-3 bg-surface-sunken rounded border border-border-hairline space-y-1">
                <span className="font-bold text-risk-critical block">{anom.title}</span>
                <p className="text-ink-primary">{anom.description}</p>
                {anom.supportingData && (
                  <div className="mt-1 pt-1 border-t border-border-hairline font-mono text-[10px] text-ink-muted">
                    {anom.supportingData}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plain Language Supervisor Instruction Modal (Section 6 & 7) */}
      {showSupervisorComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/50 backdrop-blur-sm animate-page-enter">
          <div className="w-full max-w-lg bg-surface border border-border-hairline rounded-xl shadow-dropdown overflow-hidden">
            <form onSubmit={handleSendSupervisorInstruction}>
              <div className="px-5 py-4 border-b border-border-hairline bg-surface-sunken">
                <div className="flex items-center gap-2 text-saffron-deep dark:text-saffron font-bold text-xs">
                  <MessageSquare className="w-4 h-4" />
                  <span>Plain-Language Supervisor Instruction (सुपरवाइजर निर्देश)</span>
                </div>
                <p className="text-[11px] text-ink-secondary mt-0.5">
                  Translates technical findings into direct, actionable field language.
                </p>
              </div>

              <div className="p-5 space-y-3 text-xs">
                <div>
                  <label className="font-bold text-ink-primary block mb-1">
                    Instruction text dispatched to field officer task list:
                  </label>
                  <textarea
                    rows={3}
                    value={supervisorInstruction}
                    onChange={(e) => setSupervisorInstruction(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-sunken border border-border-hairline text-xs text-ink-primary focus:outline-none focus:border-saffron"
                    required
                  />
                </div>

                <div className="p-3 bg-india-green/10 border border-india-green/20 rounded-lg text-[11px] text-ink-primary leading-relaxed">
                  ✓ <strong>Automated Plain Translation:</strong> Technical codes like <code>cosine_similarity: 0.947</code> are converted into plain instruction: <em>&ldquo;यह फोटो पुरानी फोटो जैसी दिख रही है — कृपया आज की ताज़ा लाइव फोटो दोबारा खींचें।&rdquo;</em>
                </div>
              </div>

              <div className="px-5 py-3 bg-surface-sunken border-t border-border-hairline flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowSupervisorComposer(false)}
                  className="px-4 py-2 rounded bg-surface border border-border-hairline text-ink-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-india-green text-surface font-bold hover:opacity-90 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Task to Field Supervisor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

