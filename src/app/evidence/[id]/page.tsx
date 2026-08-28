'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
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
  Maximize2,
  Languages,
  UserCheck,
  Undo2,
} from 'lucide-react';

export default function EvidenceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { t, formatDate, formatNumber } = useI18n();
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
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);

  // Override Form States
  const [overrideScore, setOverrideScore] = useState<number>(85);
  const [overrideRisk, setOverrideRisk] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('LOW');
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const evidence = evidenceList.find((e) => e.id === resolvedParams.id);
  if (!evidence) {
    return notFound();
  }

  const handleCopySha = () => {
    navigator.clipboard.writeText(evidence.sha256);
    setIsCopiedSha(true);
    setTimeout(() => setIsCopiedSha(false), 2000);
    addToast({
      title: 'SHA-256 Hash Copied',
      description: 'Cryptographic fingerprint copied to clipboard.',
      type: 'info',
    });
  };

  const handleTranslateFinding = () => {
    if (translatedText) {
      setTranslatedText(null);
      setIsTranslating(false);
      return;
    }
    setIsTranslating(true);
    setTimeout(() => {
      setTranslatedText(
        'मशीनी अनुवाद: यह फोटोग्राफ जोधपुर जिले में 318.4 किमी दूर स्थित एक अन्य परियोजना के पिछले साक्ष्य EVD-2025-1832 के साथ 94.7% दृश्य समानता प्रदर्शित करता है।'
      );
      setIsTranslating(false);
    }, 400);
  };

  const submitOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim()) {
      addToast({
        title: 'Mandatory Reason Required',
        description: 'Reviewer override requires a recorded justification for the audit log.',
        type: 'error',
      });
      return;
    }
    overrideEvidence(evidence.id, overrideScore, overrideRisk, overrideReason);
    setShowOverrideModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6">
      {/* Top Navigation & Dossier Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
        <div className="flex items-center gap-3">
          <Link
            href="/queue"
            className="p-1.5 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-muted hover:text-ink-primary transition-colors"
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
                    : evidence.auditStatus === 'OVERRIDDEN'
                    ? 'bg-navy/15 text-navy dark:text-[#7FA8D9] border border-navy/30'
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

        {/* Header Action Shortcuts */}
        <div className="flex items-center gap-2">
          {evidence.beforeImageUrl && (
            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary text-xs font-semibold transition-colors"
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Compare Before / After</span>
            </Link>
          )}
          <Link
            href={`/projects/${evidence.projectId}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary text-xs font-medium transition-colors"
          >
            <span>Project Dossier</span>
            <ExternalLink className="w-3 h-3 text-ink-muted" />
          </Link>
        </div>
      </div>

      {/* Main 2-Column Split Layout: Evidence Preview + Integrity & Fusion Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: High-Res Visual Preview with Bounding Box Overlay */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-surface border border-border-hairline rounded shadow-subtle overflow-hidden relative group">
            {/* Image Container with aspect ratio */}
            <div className="relative w-full aspect-[4/3] bg-ink-primary flex items-center justify-center overflow-hidden">
              <img
                src={evidence.imageUrl}
                alt={evidence.title}
                className="w-full h-full object-cover"
              />

              {/* Computer Vision Object Bounding Boxes */}
              {showBoxes &&
                evidence.detectedObjects.map((obj, i) => {
                  const [ymin, xmin, ymax, xmax] = obj.box;
                  return (
                    <div
                      key={i}
                      className="absolute border-2 border-saffron bg-saffron/10 rounded-sm pointer-events-none transition-all"
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

              {/* Bottom Visual Overlay Bar with HUD Coordinates */}
              <div className="absolute bottom-0 inset-x-0 bg-ink-primary/80 backdrop-blur-sm p-2 text-surface flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-3 truncate">
                  <span>LAT: {evidence.location.lat.toFixed(4)}° N</span>
                  <span>LNG: {evidence.location.lng.toFixed(4)}° E</span>
                  <span>ACC: ±{evidence.location.accuracyMeters}m</span>
                </div>
                <button
                  onClick={() => setShowBoxes(!showBoxes)}
                  className="px-2 py-0.5 rounded bg-surface/20 hover:bg-surface/30 text-surface text-[10px] font-sans font-semibold shrink-0"
                >
                  {showBoxes ? 'Hide Bounding Boxes' : 'Show Bounding Boxes'}
                </button>
              </div>
            </div>

            {/* Quick Metadata Bar Under Image */}
            <div className="p-3 bg-surface-sunken border-t border-border-hairline flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-ink-secondary">
                  <Camera className="w-3.5 h-3.5 text-ink-muted" /> {evidence.camera.make} {evidence.camera.model}
                </span>
                <span className="flex items-center gap-1 text-ink-secondary">
                  <Clock className="w-3.5 h-3.5 text-ink-muted" /> {formatDate(evidence.capturedAt, { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <button
                onClick={handleCopySha}
                className="font-mono text-[11px] text-ink-muted hover:text-ink-primary flex items-center gap-1"
                title="Click to copy full SHA-256 fingerprint"
              >
                <span>SHA: {evidence.sha256.slice(0, 12)}...</span>
                {isCopiedSha ? <Check className="w-3 h-3 text-india-green" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Claim Context Card */}
          <div className="bg-surface border border-border-hairline rounded p-4 shadow-subtle space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
              Sanctioned Activity &amp; Contractor Claim
            </h3>
            <p className="text-xs text-ink-primary bg-surface-sunken p-3 rounded border border-border-hairline italic leading-relaxed">
              &ldquo;{evidence.claimText}&rdquo;
            </p>
            <div className="flex items-center justify-between text-[11px] text-ink-muted pt-1">
              <span>Scheme: {evidence.scheme}</span>
              <span>Model: {evidence.modelVersion}</span>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Signature Integrity Arc & Evidence Fusion Engine Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          {/* Top Score Box */}
          <div className="bg-surface border border-border-hairline rounded p-5 shadow-subtle flex flex-col items-center text-center space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
              {t('score_integrity', 'Evidence Integrity Score')}
            </h3>

            <IntegrityArc score={evidence.integrityScore} size="lg" showRiskBadge />

            <div className="space-y-1">
              <span
                className={`text-xs font-bold uppercase tracking-wide block ${
                  evidence.riskLevel === 'CRITICAL'
                    ? 'text-risk-critical'
                    : evidence.riskLevel === 'HIGH'
                    ? 'text-risk-high'
                    : evidence.riskLevel === 'MEDIUM'
                    ? 'text-risk-medium'
                    : 'text-india-green'
                }`}
              >
                {evidence.riskLevel === 'LOW' && 'Verified Spatially & Visually Consistent'}
                {evidence.riskLevel === 'MEDIUM' && 'Minor Discrepancy / Boundary Deviation'}
                {evidence.riskLevel === 'HIGH' && 'High Inconsistency / Travel Teleportation'}
                {evidence.riskLevel === 'CRITICAL' && 'Critical Fraud / Recycled Evidence Alert'}
              </span>
              <p className="text-[11px] text-ink-muted leading-tight max-w-xs">
                Derived from deterministic rules, vector embeddings, and computer vision change detection.
              </p>
            </div>
          </div>

          {/* Multi-Signal Evidence Fusion Breakdown Bars */}
          <div className="bg-surface border border-border-hairline rounded p-4 shadow-subtle space-y-3">
            <div className="flex items-center justify-between border-b border-border-hairline pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                Multi-Signal Fusion Sub-Scores
              </h3>
              <span className="text-[10px] text-ink-muted">Weight Calibrated</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* GPS Geofence */}
              <div>
                <div className="flex justify-between text-ink-primary mb-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-navy dark:text-[#7FA8D9]" />
                    <span>Geospatial Geofence</span>
                  </span>
                  <span className="font-mono tabular-nums font-bold">{evidence.fusionScores.gps}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                  <div
                    className="h-full bg-navy dark:bg-[#7FA8D9]"
                    style={{ width: `${evidence.fusionScores.gps}%` }}
                  />
                </div>
              </div>

              {/* Temporal Chronology */}
              <div>
                <div className="flex justify-between text-ink-primary mb-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-navy dark:text-[#7FA8D9]" />
                    <span>Temporal Chronology</span>
                  </span>
                  <span className="font-mono tabular-nums font-bold">{evidence.fusionScores.temporal}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                  <div
                    className="h-full bg-navy dark:bg-[#7FA8D9]"
                    style={{ width: `${evidence.fusionScores.temporal}%` }}
                  />
                </div>
              </div>

              {/* Perceptual Duplicate Risk (Lower is better) */}
              <div>
                <div className="flex justify-between text-ink-primary mb-1">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-risk-high" />
                    <span>Perceptual Duplicate Risk</span>
                  </span>
                  <span className="font-mono tabular-nums font-bold text-risk-high">
                    {evidence.fusionScores.duplicateRisk}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                  <div
                    className="h-full bg-risk-high"
                    style={{ width: `${evidence.fusionScores.duplicateRisk}%` }}
                  />
                </div>
              </div>

              {/* Claim Match */}
              <div>
                <div className="flex justify-between text-ink-primary mb-1">
                  <span className="flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-saffron-deep dark:text-saffron" />
                    <span>Claim-to-Evidence Match</span>
                  </span>
                  <span className="font-mono tabular-nums font-bold">{evidence.fusionScores.claimMatch}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                  <div
                    className="h-full bg-saffron-deep dark:bg-saffron"
                    style={{ width: `${evidence.fusionScores.claimMatch}%` }}
                  />
                </div>
              </div>

              {/* Metadata Integrity */}
              <div>
                <div className="flex justify-between text-ink-primary mb-1">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-india-green" />
                    <span>Metadata &amp; EXIF Authenticity</span>
                  </span>
                  <span className="font-mono tabular-nums font-bold">{evidence.fusionScores.metadataIntegrity}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                  <div
                    className="h-full bg-india-green"
                    style={{ width: `${evidence.fusionScores.metadataIntegrity}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detected Anomalies Alert Box with Opt-In Translation (Section 4.4) */}
      {evidence.detectedAnomalies.length > 0 && (
        <div className="bg-surface border-l-4 border-risk-critical border-t border-r border-b border-border-hairline rounded p-4 shadow-subtle space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-risk-critical font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>AI Anomaly Explanation ({evidence.detectedAnomalies.length} Flagged)</span>
            </div>

            {/* Translation affordance with machine-translated tag */}
            <button
              onClick={handleTranslateFinding}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-sunken border border-border-hairline text-xs text-ink-primary hover:bg-surface-sunken/80 transition-colors"
            >
              <Languages className="w-3 h-3 text-navy dark:text-[#7FA8D9]" />
              <span>{translatedText ? 'Show English' : 'Translate Finding'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {evidence.detectedAnomalies.map((anom) => (
              <div key={anom.id} className="p-3 bg-surface-sunken rounded border border-border-hairline space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-risk-critical">{anom.title}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-risk-critical/15 text-risk-critical font-bold">
                    Confidence: {anom.confidence}%
                  </span>
                </div>

                <p className="text-xs text-ink-primary leading-relaxed">
                  {translatedText || anom.description}
                </p>

                {translatedText && (
                  <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-navy/10 text-navy dark:text-[#7FA8D9] font-medium">
                    Machine Translated
                  </span>
                )}

                {anom.supportingData && (
                  <div className="mt-1.5 pt-1.5 border-t border-border-hairline text-[11px] font-mono text-ink-secondary">
                    {anom.supportingData}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5 Bottom Deep Inspection Tabs */}
      <div className="bg-surface border border-border-hairline rounded shadow-subtle overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-border-hairline overflow-x-auto bg-surface-sunken/50 text-xs">
          {[
            { key: 'METADATA', label: '1. Metadata & Cryptographic Hash' },
            { key: 'SIMILAR', label: `2. Cross-Project Search (${evidence.similarEvidenceMatches.length})` },
            { key: 'MAP', label: '3. Geofence & Satellite Path' },
            { key: 'TIMELINE', label: '4. Evidence Lifecycle Timeline' },
            { key: 'ACTIONS', label: '5. Review Decisions & Override' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.key
                  ? 'border-saffron bg-surface text-ink-primary font-bold'
                  : 'border-transparent text-ink-secondary hover:text-ink-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Metadata */}
        {activeTab === 'METADATA' && (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3 bg-surface-sunken p-4 rounded border border-border-hairline">
              <h4 className="font-bold text-xs uppercase text-ink-primary border-b border-border-hairline pb-1.5">
                Cryptographic Fingerprint &amp; File
              </h4>
              <div className="space-y-2 font-mono">
                <div>
                  <span className="text-ink-muted block text-[10px]">SHA-256 Digest:</span>
                  <span className="text-ink-primary break-all text-[11px] font-bold">{evidence.sha256}</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px]">MIME Type &amp; Size:</span>
                  <span className="text-ink-primary">{evidence.mimeType} • {(evidence.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px]">Model Analyzer Version:</span>
                  <span className="text-ink-primary">{evidence.modelVersion}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-surface-sunken p-4 rounded border border-border-hairline">
              <h4 className="font-bold text-xs uppercase text-ink-primary border-b border-border-hairline pb-1.5">
                EXIF &amp; Hardware Sensor Payload
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Device Manufacturer:</span>
                  <span className="font-medium text-ink-primary">{evidence.camera.make} {evidence.camera.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Client Software Tag:</span>
                  <span className="font-medium text-ink-primary">{evidence.camera.software}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Optical Settings:</span>
                  <span className="font-medium text-ink-primary">{evidence.camera.focalLength} • ISO {evidence.camera.iso} • {evidence.camera.exposure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Reported Capture Time:</span>
                  <span className="font-medium text-ink-primary">{formatDate(evidence.capturedAt, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Similar Evidence (Cross-Project Search) */}
        {activeTab === 'SIMILAR' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <p className="text-ink-secondary">
                Nearest-neighbor visual embeddings &amp; perceptual hashes matched against the nationwide evidence repository.
              </p>
              <span className="text-ink-muted font-mono">k-NN pgvector cosine query</span>
            </div>

            {evidence.similarEvidenceMatches.length === 0 ? (
              <div className="p-8 text-center bg-surface-sunken rounded border border-border-hairline text-xs text-ink-muted">
                No matching duplicate or recycled visual evidence detected across any public works scheme.
              </div>
            ) : (
              <div className="space-y-3">
                {evidence.similarEvidenceMatches.map((match) => (
                  <div
                    key={match.evidenceId}
                    className="p-4 rounded bg-surface-sunken border border-border-hairline flex flex-col md:flex-row gap-4 items-start justify-between"
                  >
                    <div className="flex gap-3">
                      <img
                        src={match.thumbnailUri}
                        alt="Matched Evidence"
                        className="w-20 h-20 object-cover rounded border border-border-hairline shrink-0"
                      />
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-ink-primary">{match.evidenceId}</span>
                          <span className="px-1.5 py-0.2 rounded bg-risk-critical/15 text-risk-critical font-bold text-[10px]">
                            {match.similarityPercentage}% Similarity Match
                          </span>
                        </div>
                        <h5 className="font-semibold text-ink-primary">{match.projectName}</h5>
                        <p className="text-ink-secondary text-[11px]">
                          {match.scheme} • {match.district} ({match.distanceKm} km away)
                        </p>
                        <span className="text-[10px] text-ink-muted font-mono block">
                          Matched Algorithm: {match.matchedFeature}
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/compare"
                      className="px-3 py-1.5 rounded bg-surface hover:bg-surface/80 border border-border-hairline text-ink-primary text-xs font-semibold shrink-0"
                    >
                      Compare Side-by-Side
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Geofence & Satellite Path */}
        {activeTab === 'MAP' && (
          <div className="p-5 space-y-4 text-xs">
            <div className="bg-surface-sunken p-4 rounded border border-border-hairline flex flex-col md:flex-row justify-between gap-4">
              <div>
                <span className="text-ink-muted block text-[10px]">Project Centroid:</span>
                <span className="font-mono font-bold text-ink-primary">
                  {evidence.location.siteCentroid.lat.toFixed(4)}° N, {evidence.location.siteCentroid.lng.toFixed(4)}° E
                </span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px]">Evidence Coordinate:</span>
                <span className="font-mono font-bold text-ink-primary">
                  {evidence.location.lat.toFixed(4)}° N, {evidence.location.lng.toFixed(4)}° E
                </span>
              </div>
              <div>
                <span className="text-ink-muted block text-[10px]">Haversine Distance Deviation:</span>
                <span
                  className={`font-mono font-bold ${
                    evidence.location.geofenceDistanceMeters > 500
                      ? 'text-risk-critical'
                      : evidence.location.geofenceDistanceMeters > 100
                      ? 'text-risk-medium'
                      : 'text-india-green'
                  }`}
                >
                  {evidence.location.geofenceDistanceMeters} metres
                </span>
              </div>
            </div>

            {/* Visual Geofence Radar Box */}
            <div className="w-full h-64 bg-surface-sunken border border-border-hairline rounded relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--border-hairline)_1px,transparent_1px)] bg-[size:16px_16px] opacity-40" />

              {/* Target Project Geofence Perimeter */}
              <div className="w-40 h-40 rounded-full border-2 border-dashed border-india-green/60 bg-india-green/5 flex items-center justify-center relative">
                <span className="text-[10px] font-mono text-india-green font-bold bg-surface px-1.5 py-0.5 rounded border border-border-hairline">
                  Centroid (Sanctioned)
                </span>
                <div className="w-3 h-3 rounded-full bg-india-green absolute" />
              </div>

              {/* Actual Capture Point Offset */}
              <div
                className="absolute flex items-center gap-1.5"
                style={{
                  transform: `translate(${Math.min(evidence.location.geofenceDistanceMeters / 10, 110)}px, -${Math.min(
                    evidence.location.geofenceDistanceMeters / 15,
                    70
                  )}px)`,
                }}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-risk-critical animate-ping" />
                <span className="text-[10px] font-mono font-bold bg-risk-critical text-surface px-1.5 py-0.5 rounded shadow">
                  Upload Point (+{evidence.location.geofenceDistanceMeters}m)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Timeline */}
        {activeTab === 'TIMELINE' && (
          <div className="p-5 space-y-4 text-xs">
            <div className="relative border-l-2 border-border-hairline ml-4 space-y-6">
              <div className="relative pl-6">
                <span className="w-3 h-3 rounded-full bg-india-green absolute -left-1.5 top-1" />
                <span className="text-[10px] text-ink-muted font-mono">1. Project Sanctioned</span>
                <h5 className="font-bold text-ink-primary">Administrative Approval &amp; Geofence Registered</h5>
              </div>
              <div className="relative pl-6">
                <span className="w-3 h-3 rounded-full bg-india-green absolute -left-1.5 top-1" />
                <span className="text-[10px] text-ink-muted font-mono">2. Stage 1: Before Condition</span>
                <h5 className="font-bold text-ink-primary">Initial Site Survey Evidence Ingested</h5>
              </div>
              <div className="relative pl-6">
                <span className="w-3 h-3 rounded-full bg-saffron-deep absolute -left-1.5 top-1" />
                <span className="text-[10px] text-ink-muted font-mono">3. Stage 2: During Execution</span>
                <h5 className="font-bold text-ink-primary">WBM Foundation Subgrade Verification</h5>
              </div>
              <div className="relative pl-6">
                <span className="w-3 h-3 rounded-full bg-navy dark:bg-[#7FA8D9] absolute -left-1.5 top-1" />
                <span className="text-[10px] text-ink-muted font-mono">4. Current Submission (Stage 3)</span>
                <h5 className="font-bold text-ink-primary">{evidence.title}</h5>
                <span className="text-[10px] text-ink-muted">{formatDate(evidence.uploadedAt)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Review Decisions & AI Override */}
        {activeTab === 'ACTIONS' && (
          <div className="p-5 space-y-5 text-xs">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => approveEvidence(evidence.id, 'Approved via Evidence Inspector')}
                className="px-4 py-2 rounded bg-india-green text-surface font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Evidence</span>
              </button>

              <button
                onClick={() => rejectEvidence(evidence.id, 'Evidence rejected due to multi-signal inconsistency')}
                className="px-4 py-2 rounded bg-risk-critical text-surface font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Reject Evidence</span>
              </button>

              <button
                onClick={() => flagEvidence(evidence.id, 'Dispatched to Field Officer for physical site inspection')}
                className="px-4 py-2 rounded bg-risk-high text-surface font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Request Field Inspection</span>
              </button>

              <button
                onClick={() => setShowOverrideModal(true)}
                className="px-4 py-2 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary font-semibold transition-colors flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4 text-saffron-deep" />
                <span>Reviewer Override AI Finding</span>
              </button>
            </div>

            {/* Review History Notes */}
            {evidence.reviewer?.note && (
              <div className="p-3 bg-surface-sunken rounded border border-border-hairline space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink-muted">Recorded Reviewer Note:</span>
                <p className="text-ink-primary">{evidence.reviewer.note}</p>
                {evidence.reviewer.overrideReason && (
                  <p className="text-saffron-deep font-semibold text-[11px] mt-1">
                    Override Justification: {evidence.reviewer.overrideReason}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reviewer Override Modal with Mandatory Reason Requirement */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/50 backdrop-blur-sm animate-page-enter">
          <div className="w-full max-w-md bg-surface border border-border-hairline rounded-lg shadow-dropdown overflow-hidden">
            <form onSubmit={submitOverride}>
              <div className="px-4 py-3 border-b border-border-hairline bg-surface-sunken/50">
                <h3 className="font-serif font-bold text-sm text-ink-primary">
                  Reviewer Override of AI Determination
                </h3>
                <p className="text-[11px] text-ink-secondary mt-0.5">
                  AI findings provide probabilistic guidance. Reviewers possess legal authority to override with recorded justification.
                </p>
              </div>

              <div className="p-4 space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-ink-primary block mb-1">
                    New Evidence Integrity Score (0-100):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={overrideScore}
                    onChange={(e) => setOverrideScore(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary font-mono text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-ink-primary block mb-1">
                    New Risk Level Classification:
                  </label>
                  <select
                    value={overrideRisk}
                    onChange={(e) => setOverrideRisk(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary text-xs"
                  >
                    <option value="LOW">LOW - Consistent</option>
                    <option value="MEDIUM">MEDIUM - Minor Deviation</option>
                    <option value="HIGH">HIGH - Suspicious</option>
                    <option value="CRITICAL">CRITICAL - Severe Anomaly</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-ink-primary block mb-1">
                    Mandatory Override Justification (Audited):
                  </label>
                  <textarea
                    rows={3}
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="e.g. Known project boundary realignment sanctioned on 14 Aug; GPS discrepancy verified with Executive Engineer..."
                    className="w-full px-3 py-2 rounded bg-surface-sunken border border-border-hairline text-xs text-ink-primary placeholder-ink-muted focus:outline-none focus:border-saffron"
                    required
                  />
                </div>
              </div>

              <div className="px-4 py-3 bg-surface-sunken/60 border-t border-border-hairline flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="px-3 py-1.5 rounded bg-surface border border-border-hairline text-ink-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-saffron text-ink-primary font-bold hover:bg-saffron-deep"
                >
                  Record Override in Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

