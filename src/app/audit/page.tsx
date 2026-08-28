'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  FileCheck2,
  Search,
  Filter,
  Download,
  Copy,
  Check,
  ShieldCheck,
  UserCheck,
  Cpu,
  Clock,
  ExternalLink,
} from 'lucide-react';

export default function AuditLogPage() {
  const { t, formatDate } = useI18n();
  const { auditEvents, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActorFilter, setSelectedActorFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredEvents = auditEvents.filter((ev) => {
    if (selectedActorFilter !== 'ALL' && !ev.actorRole.includes(selectedActorFilter)) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        ev.id.toLowerCase().includes(q) ||
        ev.evidenceId.toLowerCase().includes(q) ||
        ev.projectId.toLowerCase().includes(q) ||
        ev.actorName.toLowerCase().includes(q) ||
        ev.reason.toLowerCase().includes(q) ||
        ev.sha256Hash.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    addToast({
      title: 'Cryptographic Hash Copied',
      description: `Event SHA-256 copied to clipboard.`,
      type: 'info',
    });
  };

  const handleExportAuditJson = () => {
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredEvents, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `EIIL_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Audit Ledger Exported',
      description: 'Cryptographically signed audit log saved as JSON.',
      type: 'success',
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary tracking-tight">
              {t('nav_audit', 'Immutable Event Ledger & Audit Trail')}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-india-green/15 text-india-green font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Tamper-Evident SHA-256 Ledger
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-1">
            Section 58 compliance: Cryptographically hashed event chain recording every upload, AI scoring, and human reviewer decision.
          </p>
        </div>

        <button
          onClick={handleExportAuditJson}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary text-xs font-semibold transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Ledger (JSON)</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-surface border border-border-hairline rounded p-3 shadow-subtle flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Event ID, Evidence ID, Reason, Hash..."
            className="w-full px-3 py-1.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary placeholder-ink-muted focus:outline-none focus:border-saffron"
          />
        </div>

        <select
          value={selectedActorFilter}
          onChange={(e) => setSelectedActorFilter(e.target.value)}
          className="px-3 py-1.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary font-medium focus:outline-none"
        >
          <option value="ALL">All Actor Categories</option>
          <option value="AI">AI Automated Engines</option>
          <option value="REVIEWER">Evidence Reviewers</option>
          <option value="ADMIN">Program Administrators</option>
          <option value="OFFICER">Field Officers</option>
        </select>
      </div>

      {/* Immutable Event Timeline & Table */}
      <div className="bg-surface border border-border-hairline rounded shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse text-xs">
            <thead>
              <tr className="bg-surface-sunken border-b border-border-hairline text-ink-secondary font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4">Event ID</th>
                <th className="py-2.5 px-4">Evidence &amp; Project</th>
                <th className="py-2.5 px-4">Actor &amp; Role</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">State Transition</th>
                <th className="py-2.5 px-4">Reason &amp; Justification</th>
                <th className="py-2.5 px-4">Cryptographic Hash</th>
                <th className="py-2.5 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-surface-sunken/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-ink-primary whitespace-nowrap">
                    {ev.id}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-0.5">
                      <Link
                        href={`/evidence/${ev.evidenceId}`}
                        className="font-mono font-semibold text-ink-primary hover:text-saffron-deep flex items-center gap-1"
                      >
                        <span>{ev.evidenceId}</span>
                        <ExternalLink className="w-3 h-3 text-ink-muted" />
                      </Link>
                      <span className="text-[10px] text-ink-muted">{ev.projectId}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {ev.actorRole.includes('AI') ? (
                        <Cpu className="w-3.5 h-3.5 text-navy dark:text-[#7FA8D9] shrink-0" />
                      ) : (
                        <UserCheck className="w-3.5 h-3.5 text-saffron-deep dark:text-saffron shrink-0" />
                      )}
                      <div className="flex flex-col">
                        <span className="font-semibold text-ink-primary">{ev.actorName}</span>
                        <span className="text-[10px] text-ink-muted">{ev.actorRole}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ev.action === 'APPROVE'
                          ? 'bg-india-green/15 text-india-green'
                          : ev.action === 'FLAG_CRITICAL'
                          ? 'bg-risk-critical/15 text-risk-critical'
                          : ev.action === 'OVERRIDE'
                          ? 'bg-saffron/15 text-saffron-deep dark:text-saffron'
                          : 'bg-surface-sunken text-ink-primary'
                      }`}
                    >
                      {ev.action}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 font-mono text-[11px]">
                      <span className="text-ink-muted">{ev.previousState}</span>
                      <span>→</span>
                      <span className="font-bold text-ink-primary">{ev.newState}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-xs text-ink-secondary text-[11px] leading-relaxed">
                    {ev.reason}
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleCopyHash(ev.sha256Hash, ev.id)}
                      className="font-mono text-[10px] text-ink-muted hover:text-ink-primary flex items-center gap-1"
                      title="Click to copy SHA-256 hash"
                    >
                      <span>{ev.sha256Hash.slice(0, 8)}...</span>
                      {copiedId === ev.id ? (
                        <Check className="w-3 h-3 text-india-green" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap text-ink-muted text-[11px]">
                    {formatDate(ev.timestamp, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

