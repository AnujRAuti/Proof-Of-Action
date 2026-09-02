'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { IntegrityArc } from '@/components/ui/integrity-arc';
import { AbstractMark } from '@/components/ui/abstract-mark';
import {
  ShieldCheck,
  ShieldAlert,
  Layers,
  MapPin,
  Clock,
  Camera,
  FileCheck2,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function AboutPublicHubPage() {
  const { t } = useI18n();
  const [demoScore, setDemoScore] = useState<number>(88);

  return (
    <div className="p-4 sm:p-6 lg:p-12 max-w-[1280px] mx-auto space-y-12">
      {/* Editorial DPI Hero Section */}
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-2">
          <AbstractMark size={32} />
          <span className="text-xs uppercase tracking-widest font-bold text-ink-muted">
            DIGITAL PUBLIC INFRASTRUCTURE (DPI)
          </span>
        </div>

        <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-ink-primary tracking-tight leading-[1.15]">
          We don&rsquo;t collect more evidence; we make existing evidence trustworthy.
        </h1>

        <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
          The <strong>Evidence Integrity &amp; Intelligence Layer (EIIL)</strong> is an Indian government-grade evidence-auditing platform that audits evidence already submitted for public-works projects (roads, piped water, school repairs, solar installations) to detect whether it is spatially, temporally, visually, and cross-project consistent.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 rounded bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors shadow-subtle flex items-center gap-2"
          >
            <span>Open Reviewer Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/ingest"
            className="px-5 py-2.5 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary font-semibold text-xs transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-navy dark:text-[#7FA8D9]" />
            <span>Try Interactive Pipeline Sandbox</span>
          </Link>
        </div>
      </div>

      {/* Honest "What This Product Is Not" Callouts (Section 3 of Specification) */}
      <div className="bg-surface border-2 border-border-hairline rounded-lg p-6 sm:p-8 shadow-dropdown space-y-6">
        <div className="border-b border-border-hairline pb-4">
          <h2 className="font-serif font-bold text-xl text-ink-primary">
            What This Platform Is — And What It Is Not
          </h2>
          <p className="text-xs text-ink-secondary mt-1">
            Institutional integrity requires technical honesty. The EIIL is an evidence-auditing and investigation-prioritization layer, not an automated judge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* What it is NOT */}
          <div className="space-y-3 bg-risk-critical/5 p-4 rounded border border-risk-critical/20">
            <h3 className="font-bold text-xs uppercase text-risk-critical flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              <span>What We Do NOT Claim</span>
            </h3>
            <ul className="space-y-2 text-ink-primary leading-relaxed list-disc list-inside">
              <li>It is <strong>NOT</strong> an automated fraud judge that makes irreversible legal decisions.</li>
              <li>It does <strong>NOT</strong> claim a single photograph proves physical road compaction or civil durability.</li>
              <li>It is <strong>NOT</strong> a replacement for authorized Executive Engineers and field officers.</li>
              <li>It does <strong>NOT</strong> claim 100% infallible AI image detection; it quantifies anomaly probabilities and explicitly acknowledges uncertainty.</li>
            </ul>
          </div>

          {/* What it IS */}
          <div className="space-y-3 bg-india-green/5 p-4 rounded border border-india-green/20">
            <h3 className="font-bold text-xs uppercase text-india-green flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>What The Platform Actually Does</span>
            </h3>
            <ul className="space-y-2 text-ink-primary leading-relaxed list-disc list-inside">
              <li>Correlates 7 distinct multi-signals (GPS Haversine, EXIF chronology, pHash duplicates, visual diffs).</li>
              <li>Searches across projects nationwide to stop <strong>recycled photos</strong> across districts.</li>
              <li>Detects <strong>impossible travel</strong> (e.g. 48 km teleportation in 3 minutes).</li>
              <li>Produces an explainable <strong>Evidence Integrity Score</strong> and prioritizes human review queues.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Signature Element Showcase: Tricolour Integrity Arc */}
      <div className="bg-surface border border-border-hairline rounded-lg p-6 sm:p-8 shadow-subtle grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-bold text-ink-muted block">
            Signature Design Element (Section 2.5)
          </span>
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary">
            The Tricolour Integrity Arc
          </h2>
          <p className="text-xs text-ink-secondary leading-relaxed">
            A three-segment arc (saffron → neutral → green) used as the structural progress ring around every Evidence Integrity Score. Sweeps 0–100 and is color-coded strictly by audit risk level rather than decorative flags.
          </p>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-ink-primary block">
              Adjust Interactive Score Slider: <span className="font-mono text-saffron-deep font-bold">{demoScore}/100</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={demoScore}
              onChange={(e) => setDemoScore(Number(e.target.value))}
              className="w-full accent-saffron cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-surface-sunken rounded border border-border-hairline space-y-3">
          <IntegrityArc score={demoScore} size="xl" showRiskBadge animate={false} />
          <span className="text-[11px] text-ink-muted text-center max-w-xs">
            Dynamic SVG substrate with initial 400ms ease-out animation and WCAG AA contrast compliance.
          </span>
        </div>
      </div>

      {/* Legal & Standards Compliance Declarations */}
      <div className="p-6 bg-surface-sunken border border-border-hairline rounded-lg space-y-3 text-xs text-ink-secondary">
        <h3 className="font-bold text-xs uppercase text-ink-primary">
          Design System &amp; Statutory Compliance Notes
        </h3>
        <p className="leading-relaxed">
          • <strong>State Emblem Compliance:</strong> In accordance with the <em>State Emblem of India (Prohibition of Improper Use) Act, 2005</em>, this prototype does not reproduce the official Ashoka Lion Capital emblem or national flag in a manner implying unauthorized official endorsement. It uses an original abstract digital public infrastructure mark.
        </p>
        <p className="leading-relaxed">
          • <strong>GIGW 3.0 Alignment:</strong> Adheres to Guidelines for Indian Government Websites 3.0 (NIC / MeitY), supporting 12 official Indic scripts, Urdu RTL mirroring, high contrast ratios, and complete keyboard accessibility.
        </p>
      </div>
    </div>
  );
}

