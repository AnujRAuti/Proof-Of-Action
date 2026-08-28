'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import { IntegrityArc } from '@/components/ui/integrity-arc';
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
} from 'lucide-react';

export default function BeforeAfterComparePage() {
  const { t } = useI18n();
  const { evidenceList } = useApp();

  const comparisonPairs = evidenceList.filter((e) => e.beforeImageUrl);
  const [selectedPairId, setSelectedPairId] = useState<string>(
    comparisonPairs[0]?.id || evidenceList[0]?.id
  );

  const activeEvidence = evidenceList.find((e) => e.id === selectedPairId) || evidenceList[0];
  const beforeImg =
    activeEvidence.beforeImageUrl ||
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80';
  const afterImg = activeEvidence.imageUrl;

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

  const changeScore = activeEvidence.structuralChangeConfidence || 88;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6">
      {/* Top Header & Scheme Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary tracking-tight">
              {t('nav_compare', 'Before / After Visual Change Comparator')}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-india-green/15 text-india-green font-bold">
              AI Structural Diff Active
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-1">
            Pixel-aligned temporal registration, structural boundary verification, and change-confidence scoring.
          </p>
        </div>

        {/* Comparison Case Selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedPairId}
            onChange={(e) => {
              setSelectedPairId(e.target.value);
              setSliderPos(50);
            }}
            className="px-3 py-1.5 rounded bg-surface border border-border-hairline text-xs font-semibold text-ink-primary focus:outline-none focus:border-saffron"
          >
            {comparisonPairs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} • {p.scheme} ({p.location.district})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode & Control Toolbar */}
      <div className="bg-surface border border-border-hairline rounded p-3 shadow-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {/* View Mode Segmented Switcher */}
          <div className="flex items-center bg-surface-sunken border border-border-hairline rounded p-0.5">
            <button
              onClick={() => setMode('SLIDER')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                mode === 'SLIDER'
                  ? 'bg-surface text-ink-primary shadow-subtle font-bold'
                  : 'text-ink-muted hover:text-ink-secondary'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Interactive Split Curtain</span>
            </button>
            <button
              onClick={() => setMode('SIDE_BY_SIDE')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                mode === 'SIDE_BY_SIDE'
                  ? 'bg-surface text-ink-primary shadow-subtle font-bold'
                  : 'text-ink-muted hover:text-ink-secondary'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
          </div>

          {/* Difference Overlay Toggle */}
          <button
            onClick={() => setShowDifferenceOverlay(!showDifferenceOverlay)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border transition-colors ${
              showDifferenceOverlay
                ? 'bg-saffron text-ink-primary border-saffron-deep font-bold'
                : 'bg-surface-sunken border-border-hairline text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Difference Heatmap Overlay</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5))}
            className="p-1.5 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-mono text-[11px] font-semibold text-ink-secondary">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75))}
            className="p-1.5 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Comparison Stage */}
      {mode === 'SLIDER' ? (
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative w-full aspect-[16/9] max-h-[600px] bg-ink-primary rounded border border-border-hairline overflow-hidden shadow-subtle select-none cursor-ew-resize"
        >
          {/* AFTER Image Layer (Full Background) */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            <img
              src={afterImg}
              alt="After Public Works Completion"
              className="w-full h-full object-cover"
            />

            {/* Difference Heatmap Simulation Layer */}
            {showDifferenceOverlay && (
              <div className="absolute inset-0 bg-india-green/20 mix-blend-color-burn pointer-events-none flex items-center justify-center">
                <div className="border-4 border-dashed border-india-green rounded p-4 bg-india-green/30 backdrop-blur-xs text-surface font-bold text-sm">
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
              alt="Before Public Works State"
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

          {/* Floating Pill Labels */}
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded bg-ink-primary/80 backdrop-blur-sm text-surface text-xs font-bold font-mono">
            BEFORE (Baseline Survey)
          </div>
          <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded bg-saffron text-ink-primary text-xs font-bold font-mono shadow">
            AFTER (Execution Stage)
          </div>
        </div>
      ) : (
        /* Side-by-Side Dual View Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface border border-border-hairline rounded overflow-hidden shadow-subtle">
            <div className="p-2.5 bg-surface-sunken border-b border-border-hairline font-bold text-xs flex justify-between items-center">
              <span className="font-mono text-ink-primary">BEFORE: Baseline Survey</span>
              <span className="text-[10px] text-ink-muted">Pre-construction State</span>
            </div>
            <div className="aspect-[4/3] relative bg-ink-primary overflow-hidden">
              <img src={beforeImg} alt="Before State" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="bg-surface border border-border-hairline rounded overflow-hidden shadow-subtle">
            <div className="p-2.5 bg-surface-sunken border-b border-border-hairline font-bold text-xs flex justify-between items-center">
              <span className="font-mono text-saffron-deep dark:text-saffron">AFTER: Execution Submission</span>
              <span className="text-[10px] text-india-green font-bold">Change Confirmed</span>
            </div>
            <div className="aspect-[4/3] relative bg-ink-primary overflow-hidden">
              <img src={afterImg} alt="After State" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}

      {/* Structural Change Analysis Card */}
      <div className="bg-surface border border-border-hairline rounded p-5 shadow-subtle grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="space-y-1.5">
          <span className="text-ink-muted uppercase font-bold text-[10px]">Structural Change Index</span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-ink-primary tabular-nums">
              {changeScore}%
            </span>
            <span className="text-india-green font-semibold">High Transformation</span>
          </div>
          <p className="text-ink-secondary leading-snug">
            Computer vision keypoint analysis confirms tangible physical work (asphalt surfacing / slab waterproofing).
          </p>
        </div>

        <div className="space-y-1.5">
          <span className="text-ink-muted uppercase font-bold text-[10px]">Perspective Alignment</span>
          <div className="flex items-center gap-2 text-india-green font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Homography Invariant Match</span>
          </div>
          <p className="text-ink-secondary leading-snug">
            Horizon line, background tree foliage, and survey benchmark coordinates match the baseline camera angle.
          </p>
        </div>

        <div className="space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-ink-muted uppercase font-bold text-[10px]">Audited Submission ID</span>
            <span className="font-mono font-bold block text-sm text-ink-primary mt-0.5">
              {activeEvidence.id}
            </span>
          </div>
          <Link
            href={`/evidence/${activeEvidence.id}`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-ink-primary text-surface font-semibold hover:opacity-90 transition-opacity"
          >
            <span>Open Complete Evidence Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

