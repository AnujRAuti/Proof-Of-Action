'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import { IntegrityArc } from '@/components/ui/integrity-arc';
import {
  MapPin,
  Layers,
  Filter,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Info,
  Maximize2,
} from 'lucide-react';

export default function GeofenceMapPage() {
  const { t, formatNumber } = useI18n();
  const { projects, evidenceList } = useApp();

  const [selectedScheme, setSelectedScheme] = useState<string>('ALL');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id);
  const [showAnomaliesOnly, setShowAnomaliesOnly] = useState<boolean>(false);

  const filteredProjects = projects.filter((p) => {
    if (selectedScheme !== 'ALL' && !p.scheme.includes(selectedScheme)) return false;
    if (showAnomaliesOnly && p.flaggedCount === 0) return false;
    return true;
  });

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const projectEvidence = evidenceList.filter((e) => e.projectId === activeProject.id);

  // SVG India Coordinate Projection Helper (Simplified Lat/Lng mapping for India bounding box)
  // Lat: 8 to 36 N, Lng: 68 to 97 E
  const projectToSvg = (lat: number, lng: number) => {
    const minLat = 8.0;
    const maxLat = 35.5;
    const minLng = 68.0;
    const maxLng = 96.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary tracking-tight">
              {t('nav_map', 'Geofence Map & Anomaly Density Hotspots')}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-surface-sunken border border-border-hairline text-ink-secondary font-semibold">
              Live GIS Substrate
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-1">
            Nationwide spatial distribution of public works project geofences and multi-scheme anomaly clusters.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedScheme}
            onChange={(e) => setSelectedScheme(e.target.value)}
            className="px-3 py-1.5 rounded bg-surface border border-border-hairline font-semibold text-ink-primary focus:outline-none"
          >
            <option value="ALL">All National Schemes</option>
            <option value="PMGSY">PMGSY (Rural Roads)</option>
            <option value="Jal Jeevan">Jal Jeevan Mission</option>
            <option value="Samagra">Samagra Shiksha (Schools)</option>
            <option value="KUSUM">PM-KUSUM (Solar)</option>
          </select>

          <button
            onClick={() => setShowAnomaliesOnly(!showAnomaliesOnly)}
            className={`px-3 py-1.5 rounded border font-semibold transition-colors ${
              showAnomaliesOnly
                ? 'bg-risk-high text-surface border-risk-high'
                : 'bg-surface border-border-hairline text-ink-secondary hover:text-ink-primary'
            }`}
          >
            {showAnomaliesOnly ? 'Showing Flagged Hotspots Only' : 'Filter Anomaly Hotspots'}
          </button>
        </div>
      </div>

      {/* Main Map Viewport & Project Inspection Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Interactive Themed Map Canvas */}
        <div className="lg:col-span-8 bg-surface border border-border-hairline rounded shadow-subtle overflow-hidden relative flex flex-col">
          {/* Map Status HUD Top Bar */}
          <div className="p-3 bg-surface-sunken/80 border-b border-border-hairline flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-navy dark:text-[#7FA8D9]" />
              <span className="font-semibold text-ink-primary">India Geospatial Viewport</span>
              <span className="text-[10px] text-ink-muted">(WGS84 EPSG:4326 Datum)</span>
            </div>
            <span className="text-[11px] font-mono text-ink-secondary">
              {filteredProjects.length} Active Geofence Nodes
            </span>
          </div>

          {/* Interactive SVG / Canvas Map */}
          <div className="relative w-full aspect-[4/3] bg-surface-sunken/40 flex items-center justify-center p-6 select-none overflow-hidden">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--border-hairline)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60" />

            {/* Simulated India Continental Geometry Outline */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full max-h-[550px]"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Subtle India Boundary Polygon */}
              <polygon
                points="30,10 40,8 55,12 70,18 85,22 92,30 88,38 78,45 68,48 62,58 55,75 50,88 45,78 38,62 30,52 20,42 22,30 28,18"
                fill="var(--bg-surface)"
                stroke="var(--border-hairline)"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                className="opacity-70"
              />

              {/* State & Regional Nodes */}
              {filteredProjects.map((project) => {
                const { x, y } = projectToSvg(project.centroid.lat, project.centroid.lng);
                const isSelected = project.id === selectedProjectId;
                const hasFlags = project.flaggedCount > 0;

                return (
                  <g
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    className="cursor-pointer group"
                  >
                    {/* Geofence Radar Pulse for Flagged Hotspots */}
                    {hasFlags && (
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill="none"
                        stroke="var(--risk-critical)"
                        strokeWidth="1"
                        className="animate-ping opacity-75"
                      />
                    )}

                    {/* Geofence Boundary Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? '5.5' : '3.8'}
                      fill={
                        hasFlags
                          ? 'var(--risk-critical)'
                          : project.evidenceHealthScore > 80
                          ? 'var(--india-green)'
                          : 'var(--saffron)'
                      }
                      stroke="var(--bg-surface)"
                      strokeWidth="1.5"
                      className="transition-all duration-200"
                    />

                    {/* Pin Label on Hover or Selection */}
                    <text
                      x={x + 3}
                      y={y + 1}
                      fill="var(--ink-primary)"
                      fontSize="3.2"
                      fontFamily="var(--font-sans)"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="pointer-events-none"
                    >
                      {project.district} ({project.scheme.split(' ')[0]})
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend (GIGW 3.0 Standard) */}
            <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-sm border border-border-hairline p-2.5 rounded text-[11px] space-y-1.5 shadow-subtle">
              <span className="font-bold text-ink-primary block text-[10px] uppercase">
                Geofence Health Legend
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-india-green" />
                <span className="text-ink-secondary">Consistent (Score &gt; 80)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-saffron" />
                <span className="text-ink-secondary">In Progress / Minor Deviation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-risk-critical" />
                <span className="text-risk-critical font-semibold">Anomaly Hotspot / Duplicate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Active Project Dossier Drawer */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface border border-border-hairline rounded p-5 shadow-subtle space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-border-hairline pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-ink-primary block">
                  {activeProject.id}
                </span>
                <h3 className="font-serif font-bold text-sm text-ink-primary mt-0.5 leading-snug">
                  {activeProject.name}
                </h3>
              </div>
              <IntegrityArc score={activeProject.evidenceHealthScore} size="sm" showLabel />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-ink-muted">Scheme Track:</span>
                <span className="font-semibold text-ink-primary">{activeProject.scheme}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Jurisdiction:</span>
                <span className="text-ink-primary font-medium">{activeProject.district}, {activeProject.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Sanctioned Budget:</span>
                <span className="font-mono font-bold text-ink-primary tabular-nums">
                  ₹{(activeProject.budgetInr / 10000000).toFixed(2)} Cr
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Sanctioned Geofence:</span>
                <span className="font-mono text-ink-primary font-bold">
                  {activeProject.geofenceRadiusMeters}m radius
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Total Submissions:</span>
                <span className="font-mono text-ink-primary">{activeProject.totalSubmissions} records</span>
              </div>
            </div>

            {/* Evidence Requirements Checklist Preview */}
            <div className="pt-2 border-t border-border-hairline space-y-2">
              <h4 className="text-[11px] font-bold uppercase text-ink-secondary">
                Mandatory Evidence Checklist
              </h4>
              <div className="space-y-1.5 text-xs">
                {activeProject.requiredEvidenceList.map((req) => (
                  <div key={req.key} className="flex items-center justify-between p-1.5 bg-surface-sunken rounded">
                    <span className="text-[11px] text-ink-primary truncate max-w-[180px]">{req.label}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
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
            </div>

            <Link
              href={`/projects/${activeProject.id}`}
              className="w-full flex items-center justify-center gap-2 py-2 rounded bg-ink-primary text-surface text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <span>Inspect Full Project Dossier</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

