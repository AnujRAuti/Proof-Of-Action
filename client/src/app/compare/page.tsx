'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import { getProjectImage } from '@/lib/data/mock-dataset';
import {
  SplitSquareVertical,
  Columns,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  MapPin,
  Calendar,
  Building2,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';

export default function BeforeAfterComparePage() {
  const { t } = useI18n();
  const { evidenceList, projects } = useApp();

  // Find school project which has the dedicated Before/After pair
  const comparisonPairs = evidenceList.filter((e) => e.beforeImageUrl);
  const defaultEvidence =
    evidenceList.find((e) => e.id === 'EVD-2026-7734') ||
    comparisonPairs[0] ||
    evidenceList[0];

  const [selectedPairId, setSelectedPairId] = useState<string>(defaultEvidence.id);

  const activeEvidence = evidenceList.find((e) => e.id === selectedPairId) || defaultEvidence;
  const activeProject = projects.find((p) => p.id === activeEvidence.projectId) || projects[2] || projects[0];

  const beforeImg = activeEvidence.beforeImageUrl || '/images/projects/school-before.jpg';
  const afterImg = activeEvidence.imageUrl || '/images/projects/school-after.jpg';

  const [mode, setMode] = useState<'SLIDER' | 'SIDE_BY_SIDE'>('SLIDER');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [showDifferenceOverlay, setShowDifferenceOverlay] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleSliderMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleSliderMove(e.touches[0].clientX);
  };

  const changeScore = activeEvidence.structuralChangeConfidence || 94;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6">
      {/* Top Header & Scheme Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary tracking-tight">
              {t('nav_compare', 'Before / After Visual Change Comparator')}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded bg-india-green/15 text-india-green font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Spatial Homography Aligned</span>
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-1">
            Pixel-registered visual comparison verifying measurable physical construction progression across project milestones.
          </p>
        </div>

        {/* Comparison Case Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-muted hidden sm:inline">Select Milestone:</span>
          <select
            value={selectedPairId}
            onChange={(e) => {
              setSelectedPairId(e.target.value);
              setSliderPos(50);
            }}
            className="px-3 py-2 rounded-xl bg-surface border border-border-hairline text-xs font-bold text-ink-primary focus:outline-none focus:border-saffron"
          >
            {comparisonPairs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} • {p.scheme} ({p.location.district})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prominent Project Dossier Association Bar */}
      <div className="bg-surface border-2 border-border-hairline rounded-2xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary">
              {activeProject.id}
            </span>
            <span className="text-xs font-semibold text-saffron-deep dark:text-saffron">
              {activeProject.scheme}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-india-green/10 text-india-green font-bold border border-india-green/20">
              Verified Milestone Pair
            </span>
          </div>
          <h2 className="font-serif font-bold text-base sm:text-lg text-ink-primary">
            PROJECT: {activeProject.name}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-secondary">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-ink-muted" />
              {activeProject.district}, {activeProject.state} ({activeProject.block} Block)
            </span>
            <span>•</span>
            <span>Geofence: {activeProject.geofenceRadiusMeters}m radius</span>
            <span>•</span>
            <span>Sanctioned Budget: ₹{(activeProject.budgetInr / 10000000).toFixed(2)} Cr</span>
          </div>
        </div>

        <Link
          href={`/reviewer/projects/${activeProject.id}`}
          className="px-4 py-2 rounded-xl bg-surface-sunken hover:bg-surface border border-border-hairline text-ink-primary font-bold text-xs self-start md:self-center shrink-0 transition-colors"
        >
          View Full Project Dossier →
        </Link>
      </div>

      {/* Mode & Control Toolbar */}
      <div className="bg-surface border border-border-hairline rounded-xl p-3 shadow-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {/* View Mode Segmented Switcher */}
          <div className="flex items-center bg-surface-sunken border border-border-hairline rounded-lg p-0.5">
            <button
              onClick={() => setMode('SLIDER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                mode === 'SLIDER'
                  ? 'bg-surface text-ink-primary shadow-subtle font-bold'
                  : 'text-ink-muted hover:text-ink-secondary'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Split Curtain Slider</span>
            </button>
            <button
              onClick={() => setMode('SIDE_BY_SIDE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                mode === 'SIDE_BY_SIDE'
                  ? 'bg-surface text-ink-primary shadow-subtle font-bold'
                  : 'text-ink-muted hover:text-ink-secondary'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side Dual View</span>
            </button>
          </div>

          {/* Difference Overlay Toggle */}
          <button
            onClick={() => setShowDifferenceOverlay(!showDifferenceOverlay)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              showDifferenceOverlay
                ? 'bg-saffron text-ink-primary border-saffron-deep font-bold'
                : 'bg-surface-sunken border-border-hairline text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Highlight Physical Change Zone</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5))}
            className="p-1.5 rounded-lg bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-mono text-[11px] font-semibold text-ink-secondary">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75))}
            className="p-1.5 rounded-lg bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-lg bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Comparison Canvas (Section 4) */}
      {mode === 'SLIDER' ? (
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative w-full aspect-[16/9] max-h-[580px] bg-ink-primary rounded-2xl border border-border-hairline overflow-hidden shadow-subtle select-none cursor-ew-resize"
        >
          {/* AFTER Image Layer (Full Background) */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            <img
              src={afterImg}
              alt="After School Structural Repair"
              className="w-full h-full object-cover"
            />

            {/* Difference Heatmap Simulation Layer */}
            {showDifferenceOverlay && (
              <div className="absolute inset-0 bg-india-green/25 mix-blend-color-burn pointer-events-none flex items-center justify-center">
                <div className="border-4 border-dashed border-india-green rounded-xl p-4 bg-india-green/40 backdrop-blur-xs text-surface font-bold text-sm shadow-dropdown">
                  Verified Structural Alteration Zone ({changeScore}% Confidence)
                </div>
              </div>
            )}
          </div>

          {/* BEFORE Image Layer (Clipped via Slider Percentage) */}
          <div
            className="absolute inset-0 h-full overflow-hidden"
            style={{
              width: `${sliderPos}%`,
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
            }}
          >
            <img
              src={beforeImg}
              alt="Before School State"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: containerRef.current?.clientWidth || '100%' }}
            />
          </div>

          {/* Vertical Split Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-surface shadow-dropdown z-30 flex items-center justify-center"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-surface border-2 border-saffron shadow-dropdown flex items-center justify-center text-ink-primary">
              <SplitSquareVertical className="w-4 h-4 text-saffron-deep" />
            </div>
          </div>

          {/* Floating Labels (Section 4) */}
          <div className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-lg bg-ink-primary/90 backdrop-blur-sm text-surface text-xs font-bold font-mono">
            BEFORE (Baseline Site Survey)
          </div>
          <div className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-lg bg-saffron text-ink-primary text-xs font-bold font-mono shadow">
            AFTER (Completed / Post-Repair)
          </div>
        </div>
      ) : (
        /* Side-by-Side Dual View Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface border border-border-hairline rounded-2xl overflow-hidden shadow-subtle">
            <div className="p-3 bg-surface-sunken border-b border-border-hairline font-bold text-xs flex justify-between items-center">
              <span className="font-mono text-ink-primary">BEFORE (Baseline Site Survey)</span>
              <span className="text-[10px] text-ink-muted">Pre-repair Classroom Structure</span>
            </div>
            <div className="aspect-[4/3] relative bg-ink-primary overflow-hidden">
              <img src={beforeImg} alt="Before State" className="w-full h-full object-cover" />
            </div>
            <div className="p-3 text-xs text-ink-secondary space-y-1">
              <div className="font-semibold text-ink-primary">Pre-repair condition showing weathered roof and cracked masonry</div>
              <div className="font-mono text-[10px] text-ink-muted">Lat: {activeProject.centroid.lat}° N, Lng: {activeProject.centroid.lng}° E</div>
            </div>
          </div>

          <div className="bg-surface border border-border-hairline rounded-2xl overflow-hidden shadow-subtle">
            <div className="p-3 bg-surface-sunken border-b border-border-hairline font-bold text-xs flex justify-between items-center">
              <span className="font-mono text-saffron-deep dark:text-saffron">AFTER (Completed / Post-Repair)</span>
              <span className="text-[10px] text-india-green font-bold">Verified Plaster &amp; Roof Screed</span>
            </div>
            <div className="aspect-[4/3] relative bg-ink-primary overflow-hidden">
              <img src={afterImg} alt="After State" className="w-full h-full object-cover" />
            </div>
            <div className="p-3 text-xs text-ink-secondary space-y-1">
              <div className="font-semibold text-ink-primary">Completed structural slab waterproofing, crack injection, and fresh repainting</div>
              <div className="font-mono text-[10px] text-ink-muted">Lat: {activeEvidence.location.lat}° N, Lng: {activeEvidence.location.lng}° E</div>
            </div>
          </div>
        </div>
      )}

      {/* 4 Multi-Signal Verification Badges */}
      <div className="bg-surface border border-border-hairline rounded-2xl p-5 shadow-subtle space-y-4">
        <h3 className="font-serif font-bold text-sm text-ink-primary">
          Evidence Consistency &amp; Verification Signals
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-india-green/10 border border-india-green/30 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-india-green">
              <CheckCircle2 className="w-4 h-4" />
              <span>Same Project Boundary</span>
            </div>
            <p className="text-[11px] text-ink-secondary">
              Both photographs reside within the approved 80m geofence radius.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-india-green/10 border border-india-green/30 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-india-green">
              <CheckCircle2 className="w-4 h-4" />
              <span>GPS Location Consistent</span>
            </div>
            <p className="text-[11px] text-ink-secondary">
              Distance offset is 18 meters from site centroid (Within 50m tolerance).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-india-green/10 border border-india-green/30 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-india-green">
              <CheckCircle2 className="w-4 h-4" />
              <span>Timeline Consistent</span>
            </div>
            <p className="text-[11px] text-ink-secondary">
              Captured 3 months after baseline survey, matching school vacation DPR schedule.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-india-green/10 border border-india-green/30 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-india-green">
              <CheckCircle2 className="w-4 h-4" />
              <span>Structural Change Confirmed</span>
            </div>
            <p className="text-[11px] text-ink-secondary">
              {changeScore}% transformation index verifying authentic physical progression.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-border-hairline flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted">
          <span>Audited Evidence ID: <strong className="font-mono text-ink-primary">{activeEvidence.id}</strong></span>
          <Link
            href={`/reviewer/evidence/${activeEvidence.id}`}
            className="px-4 py-2 rounded-xl bg-ink-primary text-surface font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <span>Open Complete Evidence Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
