'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import { AbstractMark } from '@/components/ui/abstract-mark';
import {
  Camera,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  ArrowRight,
  FileText,
  Fingerprint,
  Layers,
  BarChart3,
  Search,
  ChevronRight,
  Building2,
  Sparkles,
  AlertTriangle,
  FileCheck2,
  Check,
} from 'lucide-react';

// ─── SVG Proof-of-Action Evidence Graph Animation ─────────────────────────────
function ProofFlowAnimation() {
  const edges = [
    { x1: 15, y1: 30, x2: 50, y2: 30 },
    { x1: 30, y1: 12, x2: 50, y2: 30 },
    { x1: 30, y1: 48, x2: 50, y2: 30 },
    { x1: 50, y1: 30, x2: 85, y2: 30 },
  ];

  const nodes = [
    { id: 'photo', label: 'Photo Hash', x: 15, y: 30, char: 'P', color: 'var(--saffron-deep)' },
    { id: 'gps',   label: 'GPS Geofence', x: 30, y: 12, char: 'G', color: 'var(--india-green)' },
    { id: 'time',  label: 'Timestamp', x: 30, y: 48, char: 'T', color: 'var(--navy)' },
    { id: 'fusion', label: '7-Signal Fusion', x: 50, y: 30, char: '⚙', color: '#7c3aed', isEngine: true },
  ];

  return (
    <div className="w-full relative select-none" style={{ aspectRatio: '16/8' }} aria-hidden="true">
      <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <style>{`
          @keyframes dashDraw {
            from { stroke-dashoffset: 16; opacity: 0.3; }
            to { stroke-dashoffset: 0; opacity: 0.9; }
          }
          @keyframes pulseEngine {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 transparent); }
            50% { transform: scale(1.08); filter: drop-shadow(0 0 4px rgba(124, 58, 237, 0.4)); }
          }
          .edge-stream {
            stroke-dasharray: 2 1.5;
            animation: dashDraw 2.4s linear infinite;
          }
          .engine-node {
            transform-origin: 50px 30px;
            animation: pulseEngine 3s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .edge-stream, .engine-node {
              animation: none !important;
            }
          }
        `}</style>

        {/* Connecting Edges */}
        {edges.map((e, idx) => (
          <line
            key={idx}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke="var(--border-hairline)"
            strokeWidth="0.9"
            className="edge-stream"
            style={{ animationDelay: `${idx * 0.4}s` }}
          />
        ))}

        {/* Input Nodes & Fusion Core */}
        {nodes.map((node) => (
          <g key={node.id} className={node.isEngine ? 'engine-node' : ''}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.isEngine ? 7.8 : 5.5}
              fill="var(--bg-surface)"
              stroke={node.color}
              strokeWidth={node.isEngine ? 1.6 : 1.1}
            />
            <text
              x={node.x}
              y={node.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={node.isEngine ? 4.5 : 3.5}
              fill={node.color}
              fontWeight="bold"
              fontFamily="monospace"
            >
              {node.char}
            </text>
            <text
              x={node.x}
              y={node.y + (node.isEngine ? 11.5 : 9)}
              textAnchor="middle"
              fontSize="2.7"
              fill="var(--ink-secondary)"
              fontFamily="var(--font-sans, sans-serif)"
              fontWeight="600"
            >
              {node.label}
            </text>
          </g>
        ))}

        {/* Final Output: Verified Public Record */}
        <g>
          <circle
            cx="85"
            cy="30"
            r="8"
            fill="var(--bg-surface)"
            stroke="var(--india-green)"
            strokeWidth="1.8"
          />
          <text
            x="85"
            y="31.2"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="4.8"
            fill="var(--india-green)"
            fontWeight="bold"
            fontFamily="monospace"
          >
            ✓
          </text>
          <text
            x="85"
            y="42"
            textAnchor="middle"
            fontSize="2.9"
            fill="var(--ink-primary)"
            fontFamily="var(--font-sans, sans-serif)"
            fontWeight="bold"
          >
            Verified Record
          </text>
        </g>
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const { t } = useI18n();
  const { projects } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const whatWeCheck = [
    {
      icon: MapPin,
      title: 'Geofence Boundary Match',
      desc: 'GPS coordinates verified against the approved project boundary. Out-of-zone photos detected instantly.',
      color: 'text-india-green',
      bg: 'bg-india-green/10',
    },
    {
      icon: Clock,
      title: 'Timestamp & Daylight Consistency',
      desc: 'Camera timestamp, upload schedule, and solar illumination cross-checked against project timelines.',
      color: 'text-navy dark:text-[#7FA8D9]',
      bg: 'bg-navy/10 dark:bg-[#7FA8D9]/10',
    },
    {
      icon: Camera,
      title: 'Visual Duplicate & Hash Detection',
      desc: 'Perceptual hashing detects recycled photos, cross-project image reuse, and stock downloads.',
      color: 'text-saffron-deep dark:text-saffron',
      bg: 'bg-saffron/15',
    },
    {
      icon: Fingerprint,
      title: 'Device & EXIF Metadata Integrity',
      desc: 'Camera model, EXIF headers, editing software signatures, and compression anomalies examined.',
      color: 'text-risk-high',
      bg: 'bg-risk-high/10',
    },
    {
      icon: Layers,
      title: 'Cross-Project & Scheme Correlation',
      desc: 'Identifies if the same physical site evidence was submitted under multiple distinct schemes.',
      color: 'text-india-green',
      bg: 'bg-india-green/10',
    },
    {
      icon: BarChart3,
      title: 'Before / After Historical Progression',
      desc: 'Compares before and after milestones to verify actual physical construction advancement.',
      color: 'text-navy dark:text-[#7FA8D9]',
      bg: 'bg-navy/10 dark:bg-[#7FA8D9]/10',
    },
  ];

  const lifecycleStages = [
    { step: '01', label: 'Evidence Submitted', desc: 'Field officer or citizen uploads photo, GPS location, and milestone details.' },
    { step: '02', label: 'Image & EXIF Analysis', desc: 'Camera metadata, software signatures, and file integrity are validated.' },
    { step: '03', label: 'Geofence & Time Match', desc: 'Coordinates verified against approved site boundary and daytime solar vector.' },
    { step: '04', label: 'Duplicate Detection', desc: 'Perceptual hashes compared against nationwide corpus of submitted works.' },
    { step: '05', label: '7-Signal Cross Fusion', desc: 'Integrity score generated with plain-language explanations for reviewers.' },
    { step: '06', label: 'Officer Review', desc: 'Supervisors resolve field corrections or re-capture out-of-spec evidence.' },
    { step: '07', label: 'Auditor Certification', desc: 'Government reviewer approves milestones and issues digital public certificate.' },
    { step: '08', label: 'Verified Public Record', desc: 'Immutable, tamper-evident public transparency record published for citizens.' },
  ];

  const builtFor = [
    {
      icon: Users,
      title: 'Citizens (नागरिक)',
      sub: 'Public Transparency & Tracking',
      desc: 'Browse public projects in your village or ward. View before/after photos, track completion timelines, and file verified community concerns.',
      cta: 'Open Citizen Portal',
      href: '/login?role=citizen',
      ctaClass: 'bg-saffron text-ink-primary hover:bg-saffron-deep',
      border: 'border-saffron/40',
      badge: 'Public Access',
    },
    {
      icon: Camera,
      title: 'Field Supervisors (सुपरवाइजर)',
      sub: 'Operational Field Tool',
      desc: 'Fast 3-step mobile upload. Run pre-submission checks for GPS location match, inspect duplicate warnings, and fix retakes on site.',
      cta: 'Open Supervisor Portal',
      href: '/login?role=supervisor',
      ctaClass: 'bg-india-green text-surface hover:bg-india-green/90',
      border: 'border-india-green/40',
      badge: 'Field Operations',
    },
    {
      icon: ShieldCheck,
      title: 'Government Reviewers (समीक्षक)',
      sub: 'Evidence Intelligence Platform',
      desc: 'Full-spectrum review queue, 7-signal fusion inspector, before/after structural comparison, GIS geofence map, and audit ledger.',
      cta: 'Reviewer Login',
      href: '/login?role=reviewer',
      ctaClass: 'bg-navy text-surface hover:bg-navy/90 dark:bg-[#7FA8D9] dark:text-navy',
      border: 'border-navy/40 dark:border-[#7FA8D9]/40',
      badge: 'Institutional Desk',
    },
  ];

  const showcaseProject = projects[0]; // PRJ-PMGSY-MH-401

  const filteredPublicProjects = searchQuery.trim()
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.scheme.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {/* ── 1. HERO SECTION ────────────────────────────────────────────── */}
      <section className="bg-surface border-b border-border-hairline pt-10 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-hairline bg-surface-sunken text-xs font-semibold text-ink-secondary">
              <span className="w-2 h-2 rounded-full bg-india-green animate-pulse" />
              Digital Public Infrastructure • Government of India
            </div>

            <div className="space-y-2">
              <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-ink-primary tracking-tight leading-[1.08]">
                Proof-of-Action
              </h1>
              <p className="font-serif font-semibold text-2xl sm:text-3xl text-saffron-deep dark:text-saffron leading-snug">
                Make existing evidence trustworthy.
              </p>
            </div>

            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-xl">
              An evidence intelligence platform that audits photographs, GPS location, timestamp consistency, 
              project claims, and historical baselines to detect duplicate or anomalous submissions before public-works funds are certified.
            </p>

            {/* 3 Dedicated Portal Entry Buttons (Section 3) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/login?role=citizen"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron text-ink-primary font-bold text-xs sm:text-sm hover:bg-saffron-deep transition-all shadow-subtle hover:scale-[1.02]"
              >
                <Users className="w-4 h-4" />
                <span>Citizen Portal</span>
              </Link>
              <Link
                href="/login?role=supervisor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-india-green text-surface font-bold text-xs sm:text-sm hover:bg-india-green/90 transition-all shadow-subtle hover:scale-[1.02]"
              >
                <Camera className="w-4 h-4" />
                <span>Supervisor Portal</span>
              </Link>
              <Link
                href="/login?role=reviewer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-navy text-navy dark:text-[#7FA8D9] dark:border-[#7FA8D9] bg-surface font-bold text-xs sm:text-sm hover:bg-navy/5 transition-all shadow-subtle hover:scale-[1.02]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Reviewer Login</span>
              </Link>
            </div>

            {/* Stats Band */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border-hairline">
              {[
                { value: '1,204', label: 'Active Projects', sub: 'Tracked Nationwide' },
                { value: '38,917', label: 'Evidence Records', sub: 'Spans 4 Schemes' },
                { value: '94.2%', label: 'Integrity Rate', sub: 'Verified Clean' },
                { value: '7', label: 'Signal Checks', sub: 'Fused in Real-time' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-0.5">
                  <div className="font-mono font-bold text-xl sm:text-2xl tabular-nums text-ink-primary">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-ink-secondary">{stat.label}</div>
                  <div className="text-[10px] text-ink-muted">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Animated Fusion Graph Card */}
          <div className="lg:col-span-5 bg-surface-sunken border border-border-hairline rounded-2xl p-6 shadow-dropdown space-y-4">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-india-green" />
                <span className="text-xs font-bold text-ink-primary uppercase tracking-wider">
                  Evidence Fusion Graph
                </span>
              </div>
              <span className="text-[10px] font-mono text-ink-muted">EIIL Core v3.0</span>
            </div>

            <ProofFlowAnimation />

            <div className="pt-2 border-t border-border-hairline grid grid-cols-2 gap-2 text-[11px] text-ink-secondary">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-saffron-deep" />
                <span>Visual Hash &amp; Duplicate Check</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-india-green" />
                <span>Geofence Boundary Match</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-navy dark:bg-[#7FA8D9]" />
                <span>Solar Timestamp Audit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7c3aed]" />
                <span>Cross-Scheme Correlation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. WHAT IS PROOF-OF-ACTION & WHY IT EXISTS (Section 13) ──────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-canvas">
        <div className="max-w-[1280px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest text-saffron-deep dark:text-saffron uppercase">
              Mission &amp; Purpose
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-ink-primary">
              Why Proof-of-Action Exists
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Every year, thousands of crores are sanctioned for public works. Proof-of-Action ensures that photographic and GPS evidence submitted for public expenditure is genuine, geographically accurate, and non-recycled before funds are released.
            </p>
          </div>

          {/* 3 Strategic Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface border border-border-hairline rounded-2xl p-6 space-y-3 shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-saffron/15 text-saffron-deep dark:text-saffron flex items-center justify-center font-bold">
                📸
              </div>
              <h3 className="font-serif font-bold text-base text-ink-primary">Prevent Recycled Photos</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Detects identical or near-identical photographs submitted across multiple years, districts, or different departmental schemes using perceptual hash fingerprints.
              </p>
            </div>

            <div className="bg-surface border border-border-hairline rounded-2xl p-6 space-y-3 shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-india-green/15 text-india-green flex items-center justify-center font-bold">
                📍
              </div>
              <h3 className="font-serif font-bold text-base text-ink-primary">Validate Geofence Boundaries</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Ensures that field evidence was genuinely captured within the sanctioned project radius rather than from an off-site location or neighboring road.
              </p>
            </div>

            <div className="bg-surface border border-border-hairline rounded-2xl p-6 space-y-3 shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-navy/15 dark:bg-[#7FA8D9]/20 text-navy dark:text-[#7FA8D9] flex items-center justify-center font-bold">
                🛡️
              </div>
              <h3 className="font-serif font-bold text-base text-ink-primary">Audit Trail &amp; Certification</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Provides government reviewers with plain-language anomaly explanations, before/after milestone proofs, and cryptographic audit certificates for complete accountability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SECTION 1: WHAT HAPPENS TO SUBMITTED EVIDENCE (Section 13) ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-surface border-y border-border-hairline">
        <div className="max-w-[1280px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest text-india-green uppercase">
              Evidence Lifecycle
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-ink-primary">
              What Happens to Submitted Evidence
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              From field camera to verified digital public record — an 8-stage verification pipeline guarantees integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lifecycleStages.map((item, idx) => (
              <div
                key={item.step}
                className="bg-canvas border border-border-hairline rounded-xl p-5 space-y-3 relative hover:border-ink-muted transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-border-hairline tabular-nums">
                      {item.step}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-surface-sunken border border-border-hairline font-mono text-ink-muted">
                      Stage {idx + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-ink-primary">{item.label}</h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. SECTION 2: WHAT WE CHECK (7 SIGNALS - Section 11) ────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-canvas">
        <div className="max-w-[1280px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest text-navy dark:text-[#7FA8D9] uppercase">
              7-Signal Fusion Core
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-ink-primary">
              The Seven Multi-Signal Integrity Checks
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Every submission is cross-analyzed across 7 distinct physical and mathematical signals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whatWeCheck.map((check) => {
              const Icon = check.icon;
              return (
                <div
                  key={check.title}
                  className="bg-surface border border-border-hairline rounded-xl p-6 space-y-3.5 hover:border-ink-muted transition-colors shadow-subtle"
                >
                  <div className={`w-10 h-10 rounded-lg ${check.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${check.color}`} />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-ink-primary">{check.title}</h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">{check.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. ASSOCIATED PROJECT TIMELINE DEMO (Section 8) ─────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-surface border-y border-border-hairline">
        <div className="max-w-[1280px] mx-auto space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold tracking-widest text-saffron-deep dark:text-saffron uppercase">
              Milestone Consistency Tracking
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink-primary">
              Project-Associated Milestone Timeline
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary">
              Every verification timeline is explicitly bound to a specific sanctioned project, geofence, and contractor.
            </p>
          </div>

          {/* Project Header Box */}
          <div className="bg-canvas border-2 border-border-hairline rounded-2xl p-6 shadow-subtle space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-hairline pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary">
                    {showcaseProject.id}
                  </span>
                  <span className="text-xs font-semibold text-saffron-deep dark:text-saffron">
                    {showcaseProject.scheme}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-ink-primary mt-1">
                  PROJECT: {showcaseProject.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-ink-muted mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{showcaseProject.district}, {showcaseProject.state} ({showcaseProject.block} Block)</span>
                  <span>• Geofence: {showcaseProject.geofenceRadiusMeters}m</span>
                </div>
              </div>

              <div className="text-left md:text-right">
                <span className="text-[11px] text-ink-muted block">Contractor: {showcaseProject.contractor}</span>
                <span className="font-mono font-bold text-sm text-ink-primary">
                  Sanctioned: ₹{(showcaseProject.budgetInr / 10000000).toFixed(2)} Cr
                </span>
              </div>
            </div>

            {/* Step-by-Step Project Timeline (Section 8) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                { year: '2024', stage: 'Project Sanctioned', desc: 'Administrative approval & DPR clearance completed', status: 'done' },
                { year: '2024', stage: 'Site Survey & GPS', desc: 'Centroid waypoints & baseline photos recorded', status: 'done' },
                { year: '2025', stage: 'Construction Started', desc: 'Excavation & subgrade aggregate laying verified', status: 'done' },
                { year: '2025', stage: 'Mid-Project Check', desc: 'DBM base coat inspected by field officer', status: 'done' },
                { year: '2026', stage: 'Current Status', desc: 'Ongoing Progress — 82% Bituminous coat complete', status: 'active' },
                { year: '2026', stage: 'Final Certification', desc: 'Expected completion & digital public audit', status: 'pending' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-xs space-y-2 flex flex-col justify-between ${
                    item.status === 'done'
                      ? 'bg-india-green/5 border-india-green/30'
                      : item.status === 'active'
                      ? 'bg-saffron/10 border-saffron shadow-subtle'
                      : 'bg-surface-sunken border-border-hairline opacity-75'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-ink-muted">{item.year}</span>
                      {item.status === 'done' && <Check className="w-3.5 h-3.5 text-india-green" />}
                      {item.status === 'active' && <span className="w-2 h-2 rounded-full bg-saffron-deep animate-pulse" />}
                    </div>
                    <div className="font-bold text-xs text-ink-primary leading-tight">{item.stage}</div>
                    <p className="text-[11px] text-ink-secondary leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. SECTION 3: BUILT FOR EVERYONE (3 ROLES - Section 14) ─────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-canvas">
        <div className="max-w-[1280px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest text-navy dark:text-[#7FA8D9] uppercase">
              Three Purpose-Built Portals
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-ink-primary">
              Built for Every Stakeholder
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              One platform, three completely distinct user interfaces matched to job role and device.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {builtFor.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={`bg-surface border-2 ${card.border} rounded-2xl p-6 sm:p-7 space-y-5 flex flex-col justify-between shadow-subtle hover:shadow-dropdown transition-shadow`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-surface-sunken border border-border-hairline flex items-center justify-center">
                        <Icon className="w-6 h-6 text-ink-primary" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-surface-sunken border border-border-hairline text-ink-secondary">
                        {card.badge}
                      </span>
                    </div>

                    <div>
                      <div className="font-serif font-bold text-xl text-ink-primary">{card.title}</div>
                      <div className="text-xs font-medium text-ink-muted mt-0.5">{card.sub}</div>
                    </div>

                    <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <Link
                    href={card.href}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${card.ctaClass}`}
                  >
                    <span>{card.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. PUBLIC PROJECTS DIRECTORY PREVIEW ────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-surface border-t border-border-hairline">
        <div className="max-w-[1280px] mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-saffron-deep dark:text-saffron uppercase">
                Public Transparency
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink-primary mt-1">
                Explore Public Works in Your Area
              </h2>
              <p className="text-xs sm:text-sm text-ink-secondary mt-1">
                Browse verified public projects with sanctioned budgets, completion status, and latest update milestones.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by district (e.g. Pune, Jaipur)..."
                className="px-3.5 py-2.5 rounded-xl bg-surface-sunken border border-border-hairline text-xs text-ink-primary placeholder-ink-muted w-64 focus:outline-none"
              />
              <Link
                href="/citizen"
                className="px-4 py-2.5 rounded-xl bg-ink-primary text-surface font-bold text-xs hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                View All Projects →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredPublicProjects.map((project) => (
              <div
                key={project.id}
                className="bg-canvas border border-border-hairline rounded-2xl p-5 space-y-4 shadow-subtle flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-ink-muted">{project.id}</span>
                    <span className="font-semibold text-india-green bg-india-green/10 px-2 py-0.5 rounded">
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-ink-primary leading-snug">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-ink-secondary">
                    <MapPin className="w-3.5 h-3.5 text-ink-muted" />
                    <span>{project.district}, {project.state}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border-hairline space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Scheme:</span>
                    <span className="font-medium text-ink-primary">{project.scheme}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Sanctioned Budget:</span>
                    <span className="font-mono font-semibold text-ink-primary tabular-nums">
                      ₹{(project.budgetInr / 10000000).toFixed(2)} Cr
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Physical Status:</span>
                    <span className="font-bold text-india-green">
                      {project.status === 'COMPLETED' ? '100% Completed' : '82% Ongoing'}
                    </span>
                  </div>

                  <Link
                    href={`/citizen/projects/${project.id}`}
                    className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-surface-sunken hover:bg-surface border border-border-hairline text-xs font-semibold text-ink-primary transition-colors"
                  >
                    <span>View Public Milestone Timeline</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. INSTITUTIONAL FOOTER ─────────────────────────────────────── */}
      <footer className="border-t border-border-hairline bg-surface py-10 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <AbstractMark size={32} />
            <div>
              <div className="font-serif font-bold text-sm text-ink-primary">
                Proof-of-Action (EIIL)
              </div>
              <div className="text-[11px] text-ink-muted">
                Digital Public Infrastructure • Government of India
              </div>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] text-ink-muted space-y-1">
            <p>Built for National Public Works Evidence Auditing &amp; Integrity Verification</p>
            <p className="text-[10px]">
              Disclaimer: No automated signal constitutes final judicial proof. All system findings provide explainable evidence intelligence for human review.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
