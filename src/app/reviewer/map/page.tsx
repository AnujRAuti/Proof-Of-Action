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
  Search,
  Building2,
  FileText,
} from 'lucide-react';

export default function GeofenceMapPage() {
  const { t, formatNumber } = useI18n();
  const { projects, evidenceList } = useApp();

  const [selectedScheme, setSelectedScheme] = useState<string>('ALL');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'PRJ-PMGSY-MH-401');
  const [showAnomaliesOnly, setShowAnomaliesOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  const filteredProjects = projects.filter((p) => {
    if (selectedScheme !== 'ALL' && !p.scheme.includes(selectedScheme)) return false;
    if (showAnomaliesOnly && p.flaggedCount === 0) return false;
    if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.district.toLowerCase().includes(searchQuery.toLowerCase()) && !p.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const projectEvidence = evidenceList.filter((e) => e.projectId === activeProject?.id);

  // SVG India Coordinate Projection Helper (Lat: 8 to 36 N, Lng: 68 to 97 E)
  const projectToSvg = (lat: number, lng: number) => {
    const minLat = 8.0;
    const maxLat = 35.5;
    const minLng = 68.0;
    const maxLng = 96.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return { x: Math.max(8, Math.min(92, x)), y: Math.max(8, Math.min(92, y)) };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary tracking-tight">
              Geofence GIS &amp; Multi-Scheme Spatial Map
            </h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded bg-surface-sunken border border-border-hairline text-ink-secondary font-semibold">
              WGS84 EPSG:4326
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-1">
            Nationwide spatial distribution of public works project geofences, satellite boundaries, and verified evidence pins.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border-hairline">
            <Search className="w-3.5 h-3.5 text-ink-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search district, project ID..."
              className="bg-transparent text-xs text-ink-primary placeholder-ink-muted focus:outline-none w-36 sm:w-48"
            />
          </div>

          <select
            value={selectedScheme}
            onChange={(e) => setSelectedScheme(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-surface border border-border-hairline font-semibold text-ink-primary focus:outline-none text-xs"
          >
            <option value="ALL">All National Schemes</option>
            <option value="PMGSY">PMGSY (Rural Roads)</option>
            <option value="Jal Jeevan">Jal Jeevan Mission</option>
            <option value="Samagra">Samagra Shiksha (Schools)</option>
            <option value="KUSUM">PM-KUSUM (Solar)</option>
          </select>

          <button
            onClick={() => setShowAnomaliesOnly(!showAnomaliesOnly)}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors text-xs ${
              showAnomaliesOnly
                ? 'bg-risk-high text-surface border-risk-high shadow-subtle'
                : 'bg-surface border-border-hairline text-ink-secondary hover:text-ink-primary'
            }`}
          >
            {showAnomaliesOnly ? 'Showing Flagged Only' : 'Filter Anomalies'}
          </button>
        </div>
      </div>

      {/* Main Map Viewport & Project Inspection Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Interactive Professional GIS Canvas */}
        <div className="lg:col-span-8 bg-surface border border-border-hairline rounded-2xl shadow-subtle overflow-hidden relative flex flex-col">
          {/* Map Status HUD Top Bar */}
          <div className="p-3 bg-surface-sunken/80 border-b border-border-hairline flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-navy dark:text-[#7FA8D9]" />
              <span className="font-semibold text-ink-primary">Geospatial Boundary Viewport</span>
              <span className="text-[10px] text-ink-muted">(Subtle Geofence Ring Representation)</span>
            </div>
            <span className="text-[11px] font-mono text-ink-secondary">
              {filteredProjects.length} Active Nodes
            </span>
          </div>

          {/* Interactive SVG / Canvas Map (Section 18, 19, 20 - NO RADAR ANIMATION) */}
          <div className="relative w-full aspect-[4/3] bg-surface-sunken/30 flex items-center justify-center p-6 select-none overflow-hidden">
            {/* Subtle GIS Coordinate Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--border-hairline)_1px,transparent_1px)] bg-[size:28px_28px] opacity-50" />

            <svg
              viewBox="0 0 100 100"
              className="w-full h-full max-h-[560px]"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Subtle India Boundary Polygon (Restrained DPI aesthetic) */}
              <polygon
                points="30,10 40,8 55,12 70,18 85,22 92,30 88,38 78,45 68,48 62,58 55,75 50,88 45,78 38,62 30,52 20,42 22,30 28,18"
                fill="var(--bg-surface)"
                stroke="var(--border-hairline)"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                className="opacity-75"
              />

              {/* State & Project Geofence Nodes */}
              {filteredProjects.map((project) => {
                const { x, y } = projectToSvg(project.centroid.lat, project.centroid.lng);
                const isSelected = project.id === selectedProjectId;
                const isHovered = project.id === hoveredProjectId;
                const hasFlags = project.flaggedCount > 0;

                return (
                  <g
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    onMouseEnter={() => setHoveredProjectId(project.id)}
                    onMouseLeave={() => setHoveredProjectId(null)}
                    className="cursor-pointer transition-all duration-200"
                  >
                    {/* Subtle Geofence Radius Boundary Ring (Static, Clean) */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? '9' : isHovered ? '7.5' : '5.5'}
                      fill={
                        hasFlags
                          ? 'rgba(217, 83, 79, 0.08)'
                          : 'rgba(19, 136, 8, 0.06)'
                      }
                      stroke={
                        hasFlags
                          ? 'var(--risk-critical)'
                          : project.evidenceHealthScore > 80
                          ? 'var(--india-green)'
                          : 'var(--saffron)'
                      }
                      strokeWidth={isSelected ? '1.5' : '0.8'}
                      strokeDasharray={isSelected ? 'none' : '1.5 1.5'}
                      className="transition-all duration-200"
                    />

                    {/* Center Core Marker Pin (Enlarges on Hover/Click) */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? '4' : isHovered ? '3.5' : '2.8'}
                      fill={
                        hasFlags
                          ? 'var(--risk-critical)'
                          : project.evidenceHealthScore > 80
                          ? 'var(--india-green)'
                          : 'var(--saffron)'
                      }
                      stroke="var(--bg-surface)"
                      strokeWidth="1"
                      className="transition-all duration-200"
                    />

                    {/* Pin Label on Selection / Hover */}
                    {(isSelected || isHovered) && (
                      <text
                        x={x + 4.5}
                        y={y + 1.2}
                        fill="var(--ink-primary)"
                        fontSize="3.2"
                        fontFamily="var(--font-sans, sans-serif)"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {project.district} • {project.scheme.split(' ')[0]}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Map Legend (GIGW Standard - Clean & Restrained) */}
            <div className="absolute bottom-3 left-3 bg-surface/95 backdrop-blur-sm border border-border-hairline p-3 rounded-xl text-[11px] space-y-1.5 shadow-subtle">
              <span className="font-bold text-ink-primary block text-[10px] uppercase tracking-wider">
                Geofence Health Legend
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-india-green" />
                <span className="text-ink-secondary">Consistent (Score &gt; 80)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-saffron" />
                <span className="text-ink-secondary">Minor Deviation / In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-risk-critical" />
                <span className="text-risk-critical font-semibold">Flagged Anomaly / Mismatch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Selected Project Inspection Drawer */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface border border-border-hairline rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-border-hairline pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-ink-primary block">
                  {activeProject.id}
                </span>
                <h3 className="font-serif font-bold text-sm sm:text-base text-ink-primary mt-0.5 leading-snug">
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
              <div className="flex justify-between">
                <span className="text-ink-muted">Flagged Issues:</span>
                <span className={`font-bold ${activeProject.flaggedCount > 0 ? 'text-risk-critical' : 'text-india-green'}`}>
                  {activeProject.flaggedCount > 0 ? `${activeProject.flaggedCount} flags detected` : '0 issues'}
                </span>
              </div>
            </div>

            {/* Evidence Requirements Checklist */}
            <div className="pt-2 border-t border-border-hairline space-y-2">
              <h4 className="text-[11px] font-bold uppercase text-ink-secondary">
                Mandatory Evidence Checklist
              </h4>
              <div className="space-y-1.5 text-xs">
                {activeProject.requiredEvidenceList.map((req) => (
                  <div key={req.key} className="flex items-center justify-between p-2 bg-surface-sunken rounded-lg">
                    <span className="text-[11px] text-ink-primary truncate max-w-[180px]">{req.label}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
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
              href={`/reviewer/projects/${activeProject.id}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-ink-primary text-surface text-xs font-bold hover:opacity-90 transition-opacity shadow-subtle"
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
