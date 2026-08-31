'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import { IntegrityArc } from '@/components/ui/integrity-arc';
import {
  Inbox,
  Filter,
  CheckSquare,
  Square,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowUpDown,
  SlidersHorizontal,
  Download,
  Eye,
  Info,
  MapPin,
  Sparkles,
  Layers,
  Check,
} from 'lucide-react';

export default function ReviewQueuePage() {
  const router = useRouter();
  const { t, formatNumber, formatDate } = useI18n();
  const {
    evidenceList,
    density,
    setDensity,
    selectedEvidenceIds,
    toggleSelectEvidence,
    selectAllEvidence,
    clearSelection,
    approveEvidence,
    rejectEvidence,
    flagEvidence,
    batchApprove,
    batchFlag,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [activeRowIndex, setActiveRowIndex] = useState<number>(0);
  const [hoveredAnomaly, setHoveredAnomaly] = useState<{ id: string; title: string; desc: string } | null>(null);

  // Filter pipeline
  const filteredList = evidenceList.filter((item) => {
    // Tab filter
    if (activeTab === 'PENDING' && item.auditStatus !== 'PENDING' && item.auditStatus !== 'FLAGGED') return false;
    if (activeTab === 'CRITICAL' && item.riskLevel !== 'CRITICAL' && item.riskLevel !== 'HIGH') return false;
    if (activeTab === 'DUPLICATES' && !item.detectedAnomalies.some((a) => a.type.includes('DUPLICATE'))) return false;
    if (activeTab === 'GEOFENCE' && !item.detectedAnomalies.some((a) => a.type.includes('LOCATION') || a.type.includes('IMPOSSIBLE'))) return false;
    if (activeTab === 'PMGSY' && !item.scheme.includes('PMGSY')) return false;
    if (activeTab === 'JJM' && !item.scheme.includes('Jal Jeevan')) return false;

    // Risk Filter
    if (selectedRiskFilter !== 'ALL' && item.riskLevel !== selectedRiskFilter) return false;

    // Status Filter
    if (selectedStatusFilter !== 'ALL' && item.auditStatus !== selectedStatusFilter) return false;

    // Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.projectName.toLowerCase().includes(q) ||
        item.scheme.toLowerCase().includes(q) ||
        item.location.district.toLowerCase().includes(q) ||
        item.location.state.toLowerCase().includes(q) ||
        item.sha256.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Keyboard navigation always follows the current filters rather than a
  // previously rendered list.
  useEffect(() => {
    setActiveRowIndex((previous) => Math.min(previous, Math.max(filteredList.length - 1, 0)));
  }, [filteredList.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (filteredList.length === 0) return;

      const currentItem = filteredList[activeRowIndex];
      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveRowIndex((prev) => Math.min(prev + 1, filteredList.length - 1));
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveRowIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && currentItem) {
        e.preventDefault();
        router.push(`/evidence/${currentItem.id}`);
      } else if (e.key === 'a' && currentItem) {
        e.preventDefault();
        approveEvidence(currentItem.id, 'Keyboard shortcut approval');
      } else if (e.key === 'r' && currentItem) {
        e.preventDefault();
        rejectEvidence(currentItem.id, 'Keyboard shortcut rejection');
      } else if (e.key === 'f' && currentItem) {
        e.preventDefault();
        flagEvidence(currentItem.id, 'Keyboard shortcut flag for field verification');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeRowIndex, approveEvidence, filteredList, flagEvidence, rejectEvidence, router]);

  const isAllSelected =
    filteredList.length > 0 && filteredList.every((item) => selectedEvidenceIds.includes(item.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAllEvidence(filteredList.map((item) => item.id));
    }
  };

  const handleExportCsv = () => {
    const headers = ['Evidence ID', 'Project ID', 'Scheme', 'State', 'District', 'Integrity Score', 'Risk Level', 'Audit Status', 'SHA256'];
    const rows = filteredList.map((e) => [
      e.id,
      e.projectId,
      `"${e.scheme}"`,
      `"${e.location.state}"`,
      `"${e.location.district}"`,
      e.integrityScore,
      e.riskLevel,
      e.auditStatus,
      e.sha256,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EIIL_Evidence_Queue_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Evidence Queue Exported',
      description: `CSV file with ${filteredList.length} evidence records generated.`,
      type: 'success',
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-5">
      {/* Top Header & Fast Filter Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary tracking-tight">
              {t('nav_queue', 'Evidence Review Queue')}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-surface-sunken border border-border-hairline text-ink-secondary tabular-nums font-semibold">
              {filteredList.length} records
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-1">
            Keyboard-first triage queue: Use <kbd className="px-1.5 py-0.5 rounded bg-surface-sunken border border-border-hairline font-mono text-[10px]">j</kbd>/<kbd className="px-1.5 py-0.5 rounded bg-surface-sunken border border-border-hairline font-mono text-[10px]">k</kbd> to move, <kbd className="px-1.5 py-0.5 rounded bg-surface-sunken border border-border-hairline font-mono text-[10px]">a</kbd> approve, <kbd className="px-1.5 py-0.5 rounded bg-surface-sunken border border-border-hairline font-mono text-[10px]">r</kbd> reject, <kbd className="px-1.5 py-0.5 rounded bg-surface-sunken border border-border-hairline font-mono text-[10px]">f</kbd> flag, <kbd className="px-1.5 py-0.5 rounded bg-surface-sunken border border-border-hairline font-mono text-[10px]">Enter</kbd> inspect.
          </p>
        </div>

        {/* View Controls & Density Switcher */}
        <div className="flex items-center gap-2">
          {/* Density Toggle (Compact vs Comfortable) */}
          <div className="flex items-center bg-surface-sunken border border-border-hairline rounded p-0.5">
            <button
              onClick={() => setDensity('comfortable')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                density === 'comfortable'
                  ? 'bg-surface text-ink-primary shadow-subtle font-semibold'
                  : 'text-ink-muted hover:text-ink-secondary'
              }`}
              title="Comfortable row height with full metadata previews"
            >
              Comfortable
            </button>
            <button
              onClick={() => setDensity('compact')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                density === 'compact'
                  ? 'bg-surface text-ink-primary shadow-subtle font-semibold'
                  : 'text-ink-muted hover:text-ink-secondary'
              }`}
              title="High-density compact view for power reviewers"
            >
              Compact
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary text-xs font-medium transition-colors"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Saved Views / Tab Presets */}
      <div className="flex flex-wrap gap-1.5 border-b border-border-hairline pb-2 text-xs">
        {[
          { key: 'ALL', label: 'All Submissions' },
          { key: 'PENDING', label: 'Pending Review' },
          { key: 'CRITICAL', label: 'Critical & High Risk' },
          { key: 'DUPLICATES', label: 'Cross-Project Duplicates' },
          { key: 'GEOFENCE', label: 'Geofence Mismatches' },
          { key: 'PMGSY', label: 'PMGSY (Rural Roads)' },
          { key: 'JJM', label: 'Jal Jeevan Mission' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setActiveRowIndex(0);
            }}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-ink-primary text-surface font-semibold'
                : 'bg-surface-sunken text-ink-secondary hover:bg-surface-sunken/80 hover:text-ink-primary border border-border-hairline'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-surface border border-border-hairline rounded p-3 shadow-subtle">
        <div className="w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, title, district, SHA-256..."
            className="w-full px-3 py-1.5 rounded bg-surface-sunken border border-border-hairline text-xs text-ink-primary placeholder-ink-muted focus:outline-none focus:border-saffron"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Risk Level Filter */}
          <select
            value={selectedRiskFilter}
            onChange={(e) => setSelectedRiskFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-surface-sunken border border-border-hairline text-xs text-ink-primary focus:outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical Flags</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-surface-sunken border border-border-hairline text-xs text-ink-primary focus:outline-none"
          >
            <option value="ALL">All Audit Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="FLAGGED">Flagged</option>
            <option value="OVERRIDDEN">Overridden</option>
          </select>
        </div>
      </div>

      {/* Main Evidence Table */}
      <div className="bg-surface border border-border-hairline rounded shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse text-xs">
            <thead>
              <tr className="bg-surface-sunken border-b border-border-hairline text-ink-secondary font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 w-10 text-center">
                  <button onClick={toggleSelectAll} className="p-1 hover:text-ink-primary">
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-saffron-deep dark:text-saffron" />
                    ) : (
                      <Square className="w-4 h-4 text-ink-muted" />
                    )}
                  </button>
                </th>
                <th className="py-2.5 px-3 w-28">Integrity Arc</th>
                <th className="py-2.5 px-3">Evidence ID &amp; Title</th>
                <th className="py-2.5 px-3">Project / Scheme</th>
                <th className="py-2.5 px-3">Location &amp; Geofence</th>
                <th className="py-2.5 px-3">Multi-Signal Findings</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right rtl:text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-ink-muted">
                    No evidence submissions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, idx) => {
                  const isSelected = selectedEvidenceIds.includes(item.id);
                  const isKeyboardActive = activeRowIndex === idx;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setActiveRowIndex(idx)}
                      className={`transition-colors cursor-pointer ${
                        isKeyboardActive
                          ? 'bg-surface-sunken/80 border-l-2 rtl:border-l-0 rtl:border-r-2 border-saffron'
                          : isSelected
                          ? 'bg-surface-sunken/40'
                          : 'hover:bg-surface-sunken/30'
                      } ${density === 'compact' ? 'py-1.5' : 'py-3'}`}
                    >
                      {/* Checkbox */}
                      <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => toggleSelectEvidence(item.id)} className="p-1">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-saffron-deep dark:text-saffron" />
                          ) : (
                            <Square className="w-4 h-4 text-ink-muted" />
                          )}
                        </button>
                      </td>

                      {/* Integrity Arc Score */}
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <IntegrityArc
                            score={item.integrityScore}
                            size={density === 'compact' ? 'sm' : 'md'}
                            showLabel
                          />
                          {density === 'comfortable' && (
                            <div className="flex flex-col">
                              <span
                                className={`text-[10px] font-bold uppercase ${
                                  item.riskLevel === 'CRITICAL'
                                    ? 'text-risk-critical'
                                    : item.riskLevel === 'HIGH'
                                    ? 'text-risk-high'
                                    : item.riskLevel === 'MEDIUM'
                                    ? 'text-risk-medium'
                                    : 'text-risk-low'
                                }`}
                              >
                                {item.riskLevel}
                              </span>
                              <span className="text-[9px] text-ink-muted font-mono">
                                SHA:{item.sha256.slice(0, 6)}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Evidence ID & Title */}
                      <td className="py-2 px-3 min-w-[200px]">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-ink-primary">{item.id}</span>
                            <span className="text-[10px] uppercase font-semibold text-ink-muted px-1.5 py-0.2 rounded bg-surface-sunken border border-border-hairline">
                              {item.stage}
                            </span>
                          </div>
                          <span className="text-xs text-ink-primary font-medium line-clamp-1">
                            {item.title}
                          </span>
                          {density === 'comfortable' && (
                            <span className="text-[10px] text-ink-muted flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Captured: {formatDate(item.capturedAt, { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Project & Scheme */}
                      <td className="py-2 px-3 min-w-[180px]">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-ink-primary font-medium truncate max-w-[220px]">
                            {item.projectName}
                          </span>
                          <span className="text-[10px] text-ink-secondary">{item.scheme}</span>
                        </div>
                      </td>

                      {/* Location & Geofence Status */}
                      <td className="py-2 px-3 min-w-[150px]">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-ink-primary font-medium flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-ink-muted" /> {item.location.district}, {item.location.state}
                          </span>
                          <span
                            className={`text-[10px] font-semibold flex items-center gap-1 ${
                              item.location.status === 'CONSISTENT'
                                ? 'text-india-green'
                                : item.location.status === 'DEVIATION'
                                ? 'text-risk-medium'
                                : 'text-risk-critical'
                            }`}
                          >
                            {item.location.status === 'CONSISTENT' && <Check className="w-3 h-3" />}
                            {item.location.status !== 'CONSISTENT' && <AlertTriangle className="w-3 h-3" />}
                            {item.location.geofenceDistanceMeters > 1000
                              ? `${(item.location.geofenceDistanceMeters / 1000).toFixed(1)} km dev`
                              : `${item.location.geofenceDistanceMeters}m from site`}
                          </span>
                        </div>
                      </td>

                      {/* Multi-Signal Detected Anomalies with Hover Popover */}
                      <td className="py-2 px-3 min-w-[220px]">
                        {item.detectedAnomalies.length === 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-india-green font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> All 7 Signals Valid
                          </span>
                        ) : (
                          <div className="relative group">
                            <button
                              className={`text-left rtl:text-right px-2 py-1 rounded text-[11px] font-semibold border flex items-center gap-1.5 transition-colors ${
                                item.detectedAnomalies[0].severity === 'CRITICAL'
                                  ? 'bg-risk-critical/10 text-risk-critical border-risk-critical/30'
                                  : item.detectedAnomalies[0].severity === 'HIGH'
                                  ? 'bg-risk-high/10 text-risk-high border-risk-high/30'
                                  : 'bg-risk-medium/10 text-risk-medium border-risk-medium/30'
                              }`}
                            >
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                              <span className="truncate max-w-[170px]">
                                {item.detectedAnomalies[0].title}
                              </span>
                            </button>

                            {/* Inline Hover Explanation Card */}
                            <div className="absolute left-0 rtl:left-auto rtl:right-0 bottom-full mb-1 w-80 p-2.5 rounded bg-ink-primary text-surface shadow-dropdown opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 text-xs">
                              <span className="font-bold block text-saffron mb-1">
                                {item.detectedAnomalies[0].title}
                              </span>
                              <p className="text-[11px] text-surface/90 leading-relaxed">
                                {item.detectedAnomalies[0].description}
                              </p>
                              {item.detectedAnomalies[0].supportingData && (
                                <div className="mt-1.5 pt-1.5 border-t border-surface/20 text-[10px] font-mono text-surface/70">
                                  {item.detectedAnomalies[0].supportingData}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Audit Status Badge */}
                      <td className="py-2 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            item.auditStatus === 'APPROVED'
                              ? 'bg-india-green/15 text-india-green border border-india-green/30'
                              : item.auditStatus === 'REJECTED'
                              ? 'bg-risk-critical/15 text-risk-critical border border-risk-critical/30'
                              : item.auditStatus === 'FLAGGED'
                              ? 'bg-risk-high/15 text-risk-high border border-risk-high/30'
                              : item.auditStatus === 'OVERRIDDEN'
                              ? 'bg-navy/15 text-navy dark:text-[#7FA8D9] border border-navy/30'
                              : 'bg-surface-sunken text-ink-secondary border border-border-hairline'
                          }`}
                        >
                          {item.auditStatus}
                        </span>
                      </td>

                      {/* Row Quick Action Buttons */}
                      <td className="py-2 px-3 text-right rtl:text-left" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end rtl:justify-start gap-1">
                          <Link
                            href={`/evidence/${item.id}`}
                            className="p-1.5 rounded hover:bg-surface-sunken text-ink-muted hover:text-ink-primary transition-colors"
                            title="Open Deep Evidence Inspector (Enter)"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => approveEvidence(item.id)}
                            className="p-1.5 rounded hover:bg-india-green/10 text-ink-muted hover:text-india-green transition-colors"
                            title="Approve Evidence (a)"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => flagEvidence(item.id, 'Flagged from review queue')}
                            className="p-1.5 rounded hover:bg-risk-high/10 text-ink-muted hover:text-risk-high transition-colors"
                            title="Flag for Physical Inspection (f)"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Selection Toolbar for Bulk Actions */}
      {selectedEvidenceIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-ink-primary text-surface rounded-lg shadow-dropdown px-4 py-2.5 flex items-center gap-4 animate-page-enter">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-5 h-5 rounded-full bg-saffron text-ink-primary flex items-center justify-center font-mono text-[11px]">
              {selectedEvidenceIds.length}
            </span>
            <span>Items Selected</span>
          </div>

          <div className="h-4 w-px bg-surface/30" />

          <div className="flex items-center gap-2">
            <button
              onClick={() => batchApprove(selectedEvidenceIds)}
              className="px-3 py-1 rounded bg-india-green text-surface text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Batch Approve
            </button>
            <button
              onClick={() => batchFlag(selectedEvidenceIds)}
              className="px-3 py-1 rounded bg-risk-high text-surface text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Batch Flag
            </button>
            <button
              onClick={clearSelection}
              className="px-2 py-1 rounded text-xs text-surface/70 hover:text-surface transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
