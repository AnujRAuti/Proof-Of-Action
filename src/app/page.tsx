'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import { AbstractMark } from '@/components/ui/abstract-mark';
import {
  Search,
  MapPin,
  CheckCircle2,
  Users,
  Camera,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building2,
  Layers,
  HelpCircle,
  FileText,
  Clock,
} from 'lucide-react';

export default function PublicStartingPage() {
  const { t, formatDate, formatNumber } = useI18n();
  const { projects } = useApp();

  const [searchLocation, setSearchLocation] = useState('');
  const [selectedMapProject, setSelectedMapProject] = useState(projects[0]);

  const filteredProjects = searchLocation.trim()
    ? projects.filter(
        (p) =>
          p.district.toLowerCase().includes(searchLocation.toLowerCase()) ||
          p.state.toLowerCase().includes(searchLocation.toLowerCase()) ||
          p.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
          p.block.toLowerCase().includes(searchLocation.toLowerCase())
      )
    : projects;

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Civic Hero Section with Real State Numbers */}
      <section className="bg-surface border-b border-border-hairline pt-8 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left 7 Columns: Core Civic Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-india-green/10 text-india-green text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-india-green animate-pulse" />
              <span>National Public Works Transparency Portal</span>
            </div>

            <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-ink-primary tracking-tight leading-[1.15]">
              1,204 public works projects being tracked across your state see what’s happening near you.
            </h1>

            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-xl">
              Roads, clean drinking water tanks, school repairs, and solar street lights funded by public money. Verified by digital evidence, open for every citizen to track.
            </p>

            {/* Primary Action: "Find projects near me" Search Bar */}
            <div className="space-y-2 max-w-lg">
              <div className="flex flex-col sm:flex-row gap-2 bg-surface-sunken p-1.5 rounded-lg border border-border-hairline shadow-subtle">
                <div className="flex items-center gap-2.5 px-3 py-2 flex-1">
                  <MapPin className="w-4 h-4 text-saffron-deep dark:text-saffron shrink-0" />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Enter village, district, or pincode (e.g. Pune, Jaipur)..."
                    className="w-full bg-transparent text-xs sm:text-sm text-ink-primary placeholder-ink-muted focus:outline-none"
                  />
                </div>
                <Link
                  href={searchLocation ? `/citizen?search=${encodeURIComponent(searchLocation)}` : '/citizen'}
                  className="px-5 py-2.5 rounded-md bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors flex items-center justify-center gap-2 shrink-0 shadow-subtle"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Projects Near Me</span>
                </Link>
              </div>

              <div className="flex items-center justify-between text-[11px] text-ink-muted px-1">
                <span>Try: &ldquo;Pune&rdquo;, &ldquo;Jaipur&rdquo;, &ldquo;Varanasi&rdquo;, &ldquo;Tumakuru&rdquo;</span>
                <Link href="/login" className="text-ink-secondary hover:text-ink-primary font-medium underline">
                  Sign in as staff / reviewer →
                </Link>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Live Sample Civic Project Card */}
          <div className="lg:col-span-5">
            <div className="bg-surface border-2 border-border-hairline rounded-xl p-5 shadow-dropdown space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-border-hairline pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-india-green" />
                  <span className="font-bold text-xs text-ink-primary">Live Public Project</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-india-green/15 text-india-green">
                  In Progress (85%)
                </span>
              </div>

              <div className="aspect-[16/10] bg-ink-primary rounded-lg overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80"
                  alt="Purandar Rural Road Construction"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-ink-primary/80 backdrop-blur-xs text-surface font-mono text-[10px]">
                  📍 Purandar Block, Pune, Maharashtra
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-ink-muted uppercase font-bold tracking-wide">
                  PMGSY • Rural Roads Scheme
                </span>
                <h3 className="font-serif font-bold text-base text-ink-primary leading-snug">
                  Purandar Taluka Rural Bitumen Road (Km 0 to 4.20)
                </h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Connecting 3 village habitations with all-weather bituminous road and drainage culverts.
                </p>
              </div>

              <div className="pt-2 border-t border-border-hairline flex items-center justify-between text-xs">
                <span className="text-ink-muted">Sanctioned: ₹3.45 Cr</span>
                <Link
                  href="/citizen/projects/PRJ-PMGSY-MH-401"
                  className="font-bold text-saffron-deep dark:text-saffron hover:underline flex items-center gap-1"
                >
                  <span>Explore Citizen View</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works: Three Short Plain-Language Panels (Section 1.3) */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink-primary">
            How Proof-of-Action Works for Everyone
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
            A single trustworthy system connecting citizens, field workers, and government auditors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Citizen */}
          <div className="bg-surface border border-border-hairline rounded-lg p-6 shadow-subtle space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-saffron/15 text-saffron-deep dark:text-saffron flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-ink-primary">
                For Local Citizens
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                See the projects being built in your area, track before/after photo progress, and tell us if something looks wrong. Voice note complaints supported.
              </p>
            </div>
            <Link
              href="/citizen"
              className="font-bold text-xs text-saffron-deep dark:text-saffron flex items-center gap-1 pt-2 hover:underline"
            >
              <span>Explore as Citizen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pillar 2: Supervisor */}
          <div className="bg-surface border border-border-hairline rounded-lg p-6 shadow-subtle space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-india-green/15 text-india-green flex items-center justify-center font-bold">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-ink-primary">
                For Field Supervisors
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Upload photo, video, and GPS evidence from the work site using a clean 3-step wizard that works even when there is no mobile network.
              </p>
            </div>
            <Link
              href="/supervisor"
              className="font-bold text-xs text-india-green flex items-center gap-1 pt-2 hover:underline"
            >
              <span>Supervisor Field Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pillar 3: Reviewer */}
          <div className="bg-surface border border-border-hairline rounded-lg p-6 shadow-subtle space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-navy/15 dark:bg-[#7FA8D9]/20 text-navy dark:text-[#7FA8D9] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-ink-primary">
                For Reviewers &amp; Auditors
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Review multi-signal evidence integrity, detect recycled photos across districts, and approve milestones with full cryptographic audit logs.
              </p>
            </div>
            <Link
              href="/reviewer"
              className="font-bold text-xs text-navy dark:text-[#7FA8D9] flex items-center gap-1 pt-2 hover:underline"
            >
              <span>Open Reviewer Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Embedded Interactive Public Read-Only Map (Section 1.4) */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-hairline pb-4">
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary">
              Public Works Explorer Map
            </h2>
            <p className="text-xs text-ink-secondary mt-0.5">
              Explore ongoing infrastructure works across India without signing in.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-surface-sunken border border-border-hairline text-ink-secondary font-mono">
            {filteredProjects.length} Public Works Available
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map Viewport */}
          <div className="lg:col-span-8 bg-surface border border-border-hairline rounded-xl overflow-hidden shadow-subtle relative aspect-[16/10] flex items-center justify-center p-6 select-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--border-hairline)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />

            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[420px]" preserveAspectRatio="xMidYMid meet">
              <polygon
                points="30,10 40,8 55,12 70,18 85,22 92,30 88,38 78,45 68,48 62,58 55,75 50,88 45,78 38,62 30,52 20,42 22,30 28,18"
                fill="var(--bg-surface)"
                stroke="var(--border-hairline)"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />

              {filteredProjects.map((p) => {
                const minLat = 8.0, maxLat = 35.5, minLng = 68.0, maxLng = 96.0;
                const x = ((p.centroid.lng - minLng) / (maxLng - minLng)) * 100;
                const y = ((maxLat - p.centroid.lat) / (maxLat - minLat)) * 100;
                const isSelected = p.id === selectedMapProject.id;

                return (
                  <g key={p.id} onClick={() => setSelectedMapProject(p)} className="cursor-pointer group">
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? '5' : '3.5'}
                      fill={isSelected ? 'var(--saffron)' : 'var(--india-green)'}
                      stroke="var(--bg-surface)"
                      strokeWidth="1.5"
                    />
                    <text
                      x={x + 3}
                      y={y + 1}
                      fill="var(--ink-primary)"
                      fontSize="3.2"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="pointer-events-none"
                    >
                      {p.district}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-xs border border-border-hairline p-2 rounded text-[10px] space-y-1">
              <span className="font-bold text-ink-primary block">Click any marker to inspect</span>
              <div className="flex items-center gap-1.5 text-india-green font-semibold">
                <span className="w-2 h-2 rounded-full bg-india-green" /> Verified Public Works
              </div>
            </div>
          </div>

          {/* Selected Project Card */}
          <div className="lg:col-span-4 bg-surface border border-border-hairline rounded-xl p-5 shadow-subtle flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-ink-primary px-2 py-0.5 rounded bg-surface-sunken border border-border-hairline">
                  {selectedMapProject.id}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-india-green/15 text-india-green">
                  {selectedMapProject.status.replace('_', ' ')}
                </span>
              </div>

              <h3 className="font-serif font-bold text-base text-ink-primary leading-snug">
                {selectedMapProject.name}
              </h3>

              <div className="space-y-1.5 text-xs text-ink-secondary">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Scheme:</span>
                  <span className="font-medium text-ink-primary">{selectedMapProject.scheme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Location:</span>
                  <span className="text-ink-primary">{selectedMapProject.block}, {selectedMapProject.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Budget:</span>
                  <span className="font-mono font-bold text-ink-primary">
                    ₹{(selectedMapProject.budgetInr / 10000000).toFixed(2)} Cr
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={`/citizen/projects/${selectedMapProject.id}`}
              className="w-full py-2.5 rounded bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors flex items-center justify-center gap-2"
            >
              <span>View Full Citizen Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Trust & Transparency Footer (Section 1.5) */}
      <footer className="border-t border-border-hairline pt-10 px-4 sm:px-6 lg:px-8 text-xs text-ink-secondary">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <AbstractMark size={24} />
              <span className="font-serif font-bold text-sm text-ink-primary">
                Proof-of-Action (EIIL)
              </span>
            </div>
            <p className="text-[11px] text-ink-secondary leading-relaxed max-w-md">
              A national Digital Public Infrastructure initiative ensuring spatial, temporal, and visual integrity for public works evidence across Indian states.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase text-ink-primary">Public Access</h4>
            <ul className="space-y-1 text-[11px]">
              <li><Link href="/citizen" className="hover:underline">Explore Projects Near Me</Link></li>
              <li><Link href="/citizen/complaints" className="hover:underline">File / Track Concern</Link></li>
              <li><Link href="/signup" className="hover:underline">Citizen Sign Up (Free)</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase text-ink-primary">Institutional</h4>
            <ul className="space-y-1 text-[11px]">
              <li><Link href="/login" className="hover:underline">Staff / Supervisor Login</Link></li>
              <li><Link href="/about" className="hover:underline">Platform Architecture &amp; Ethics</Link></li>
              <li><Link href="/reviewer" className="hover:underline">Reviewer Operations Suite</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto pt-6 border-t border-border-hairline flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-ink-muted">
          <span>GIGW 3.0 Standard • State Emblem of India Act 2005 Compliant</span>
          <span>Open Data &amp; Civic Accountability Portal</span>
        </div>
      </footer>
    </div>
  );
}
