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
    { id: 'photo', label: 'Photo', x: 15, y: 30, char: 'P', color: 'var(--saffron-deep)' },
    { id: 'gps',   label: 'GPS',   x: 30, y: 12, char: 'G', color: 'var(--india-green)' },
    { id: 'time',  label: 'Time',  x: 30, y: 48, char: 'T', color: 'var(--navy)' },
    { id: 'fusion', label: 'AI Fusion', x: 50, y: 30, char: '⚙', color: '#7c3aed', isEngine: true },
  ];

  return (
    <div className="w-full relative select-none" style={{ aspectRatio: '16/8' }} aria-hidden="true">
      <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <style>{`
          @keyframes dashDraw {
            from { stroke-dashoffset: 16; opacity: 0.3; }
            to { stroke-dashoffset: 0; opacity: 0.85; }
          }
          @keyframes pulseScale {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.06); }
          }
          .edge-stream {
            stroke-dasharray: 2 1.5;
            animation: dashDraw 2.4s linear infinite;
          }
          .pulse-node {
            transform-origin: center;
            animation: pulseScale 3s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .edge-stream, .pulse-node {
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
            strokeWidth="0.8"
            className="edge-stream"
            style={{ animationDelay: `${idx * 0.4}s` }}
          />
        ))}

        {/* Input & Engine Nodes */}
        {nodes.map((node) => (
          <g key={node.id} className={node.isEngine ? 'pulse-node' : ''}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.isEngine ? 7.5 : 5.5}
              fill="var(--bg-surface)"
              stroke={node.color}
              strokeWidth={node.isEngine ? 1.5 : 1}
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
              y={node.y + (node.isEngine ? 11 : 9)}
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

        {/* Final Output: Verified Node */}
        <g className="pulse-node" style={{ animationDelay: '1.2s' }}>
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

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const { t } = useI18n();
  const { projects } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const whatWeCheck = [
    {
      icon: MapPin,
      title: 'Location Match',
      desc: 'GPS coordinates verified against the sanctioned project geofence. Out-of-zone photos detected instantly.',
      color: 'text-india-green',
      bg: 'bg-india-green/10',
    },
    {
      icon: Clock,
      title: 'Time Consistency',
      desc: 'Camera timestamp, upload schedule, and solar illumination cross-checked against project timelines.',
      color: 'text-navy dark:text-[#7FA8D9]',
      bg: 'bg-navy/10 dark:bg-[#7FA8D9]/10',
    },
    {
      icon: Camera,
      title: 'Visual Similarity & Duplicates',
      desc: 'Perceptual hashing detects recycled photos, cross-project image reuse, and stock downloads.',
      color: 'text-saffron-deep dark:text-saffron',
      bg: 'bg-saffron/15',
    },
    {
      icon: Fingerprint,
      title: 'Metadata Integrity',
      desc: 'Camera model, EXIF headers, editing software signatures, and compression anomalies examined.',
      color: 'text-risk-high',
      bg: 'bg-risk-high/10',
    },
    {
      icon: Layers,
      title: 'Cross-Project Consistency',
      desc: 'Identifies the same construction site submitted under multiple different government schemes.',
      color: 'text-india-green',
      bg: 'bg-india-green/10',
    },
    {
      icon: BarChart3,
      title: 'Historical Baseline',
      desc: 'Compares before/during/after milestones to verify actual physical progress on the ground.',
      color: 'text-navy dark:text-[#7FA8D9]',
      bg: 'bg-navy/10 dark:bg-[#7FA8D9]/10',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      label: 'Submit Evidence',
      desc: 'Field supervisors capture photos, GPS location, and milestone reports directly at the project site.',
    },
    {
      step: '02',
      label: 'Analyze',
      desc: '7 independent signal checks verify spatial boundary, timestamps, metadata, and visual authenticity.',
    },
    {
      step: '03',
      label: 'Correlate',
      desc: 'Cross-checks submissions against state-wide project dossiers, prior history, and neighboring works.',
    },
    {
      step: '04',
      label: 'Identify Anomalies',
      desc: 'Integrity scores are generated with plain-language explanations. High-risk items flag for inspection.',
    },
    {
      step: '05',
      label: 'Human Verification',
      desc: 'Government reviewers make final decisions, request field retakes, or certify completed works.',
    },
  ];

  const builtFor = [
    {
      icon: Users,
      title: 'Citizens',
      hindiTitle: 'नागरिक',
      desc: 'Track public works in your village or ward. Browse before/after photos, monitor budgets, and submit local concerns.',
      cta: 'Citizen Portal',
      href: '/citizen',
      ctaClass: 'bg-saffron text-ink-primary hover:bg-saffron-deep',
      border: 'border-saffron/40',
      badge: 'Public Access',
    },
    {
      icon: Camera,
      title: 'Field Supervisors',
      hindiTitle: 'फील्ड सुपरवाइजर',
      desc: '3-step mobile upload wizard. Scan photos instantly for location match, check warnings, and fix retakes in the field.',
      cta: 'Supervisor Portal',
      href: '/supervisor',
      ctaClass: 'bg-india-green text-surface hover:bg-india-green/90',
      border: 'border-india-green/40',
      badge: 'Operational',
    },
    {
      icon: ShieldCheck,
      title: 'Government Reviewers',
      hindiTitle: 'समीक्षक एवं ऑडिटर',
      desc: 'Evidence intelligence dashboard. Review queue, 7-signal fusion, geofence GIS, audit ledger, and certificates.',
      cta: 'Reviewer Login',
      href: '/login',
      ctaClass: 'bg-navy text-surface hover:bg-navy/90 dark:bg-[#7FA8D9] dark:text-navy',
      border: 'border-navy/40 dark:border-[#7FA8D9]/40',
      badge: 'Official Desk',
    },
  ];

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
              An evidence intelligence platform that analyzes photographs, location, time, 
              project claims, and historical records to identify inconsistencies and prioritize 
              field verification across public works schemes.
            </p>

            {/* 3 Portal Entry Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/citizen"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-saffron text-ink-primary font-bold text-xs sm:text-sm hover:bg-saffron-deep transition-all shadow-subtle hover:scale-[1.02]"
              >
                <Users className="w-4 h-4" />
                <span>Citizen Portal</span>
              </Link>
              <Link
                href="/supervisor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-india-green text-surface font-bold text-xs sm:text-sm hover:bg-india-green/90 transition-all shadow-subtle hover:scale-[1.02]"
              >
                <Camera className="w-4 h-4" />
                <span>Supervisor Portal</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-navy text-navy dark:text-[#7FA8D9] dark:border-[#7FA8D9] bg-surface font-bold text-xs sm:text-sm hover:bg-navy/5 transition-all shadow-subtle hover:scale-[1.02]"
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
                <span>Visual Hash Consistency</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-india-green" />
                <span>Geofence GPS Polygon</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-navy dark:bg-[#7FA8D9]" />
                <span>Timestamp Verification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7c3aed]" />
                <span>Multi-Scheme Correlation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SECTION 1: HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-canvas">
        <div className="max-w-[1280px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest text-saffron-deep dark:text-saffron uppercase">
              End-to-End Workflow
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-ink-primary">
              How Proof-of-Action Works
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              From field camera to verified digital public record — five structured stages ensure absolute evidence consistency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {howItWorks.map((item, idx) => (
              <div
                key={item.step}
                className="bg-surface border border-border-hairline rounded-xl p-5 space-y-3 relative hover:border-ink-muted transition-all flex flex-col justify-between"
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

      {/* ── 3. SECTION 2: WHAT WE CHECK ────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-surface border-y border-border-hairline">
        <div className="max-w-[1280px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest text-india-green uppercase">
              7-Signal Fusion Core
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-ink-primary">
              What We Check on Every Submission
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Seven independent evidence signals are fused into a unified explainable integrity score.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whatWeCheck.map((check) => {
              const Icon = check.icon;
              return (
                <div
                  key={check.title}
                  className="bg-canvas border border-border-hairline rounded-xl p-6 space-y-3.5 hover:border-ink-muted transition-colors shadow-subtle"
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

      {/* ── 4. SECTION 3: BUILT FOR EVERYONE (3 ROLES) ──────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-canvas">
        <div className="max-w-[1280px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest text-navy dark:text-[#7FA8D9] uppercase">
              Role Separation
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-ink-primary">
              Built for Every Stakeholder
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Three purpose-built portals matched to user role, technical literacy, and device.
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
                      <div className="text-xs font-medium text-ink-muted mt-0.5">{card.hindiTitle}</div>
                    </div>

                    <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <Link
                    href={card.href}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-xs sm:text-sm transition-all ${card.ctaClass}`}
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

      {/* ── 5. PUBLIC PROJECTS PREVIEW ─────────────────────────────────── */}
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
                className="px-3 py-2 rounded bg-surface-sunken border border-border-hairline text-xs text-ink-primary placeholder-ink-muted w-64"
              />
              <Link
                href="/citizen"
                className="px-4 py-2 rounded bg-ink-primary text-surface font-bold text-xs hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                View All Projects →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredPublicProjects.map((project) => (
              <div
                key={project.id}
                className="bg-canvas border border-border-hairline rounded-xl p-5 space-y-4 shadow-subtle flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-ink-muted">{project.id}</span>
                    <span className="font-semibold text-india-green bg-india-green/10 px-2 py-0.5 rounded">
                      {project.status}
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
                    <span className="text-ink-muted">Physical Completion:</span>
                    <span className="font-bold text-india-green">{project.status === 'COMPLETED' ? '100%' : '82%'}</span>
                  </div>

                  <Link
                    href={`/citizen/projects/${project.id}`}
                    className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 rounded bg-surface-sunken hover:bg-surface border border-border-hairline text-xs font-semibold text-ink-primary transition-colors"
                  >
                    <span>View Public Timeline</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FOOTER ──────────────────────────────────────────────────── */}
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
            <p>Built for National Public Works Evidence Auditing &amp; Transparency</p>
            <p className="text-[10px]">
              Disclaimer: No automated check constitutes final legal determination. All system outputs are advisory signals for human review.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
