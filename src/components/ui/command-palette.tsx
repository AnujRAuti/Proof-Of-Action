'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store/app-context';
import { Search, FolderGit2, FileText, ArrowRight, ShieldCheck, MapPin, X } from 'lucide-react';

export function CommandPalette() {
  const router = useRouter();
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, evidenceList, projects } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredProjects = projects.filter(
    (p) =>
      p.id.toLowerCase().includes(query.toLowerCase()) ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.state.toLowerCase().includes(query.toLowerCase()) ||
      p.scheme.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEvidence = evidenceList.filter(
    (e) =>
      e.id.toLowerCase().includes(query.toLowerCase()) ||
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.sha256.toLowerCase().includes(query.toLowerCase()) ||
      e.location.district.toLowerCase().includes(query.toLowerCase())
  );

  const quickActions = [
    { title: 'Open Review Queue', icon: FileText, href: '/queue' },
    { title: 'Open Before/After Comparison Tool', icon: ArrowRight, href: '/compare' },
    { title: 'Open Geofence & Anomaly Map', icon: MapPin, href: '/map' },
    { title: 'Open Live Ingestion Sandbox', icon: ShieldCheck, href: '/ingest' },
    { title: 'Open Immutable Audit Log Ledger', icon: FileText, href: '/audit' },
  ].filter((a) => a.title.toLowerCase().includes(query.toLowerCase()));

  const allResults = [
    ...filteredEvidence.map((e) => ({
      type: 'evidence' as const,
      id: e.id,
      title: `${e.id} • ${e.title}`,
      subtitle: `${e.scheme} • ${e.location.district}, ${e.location.state} • Score: ${e.integrityScore}`,
      href: `/evidence/${e.id}`,
    })),
    ...filteredProjects.map((p) => ({
      type: 'project' as const,
      id: p.id,
      title: `${p.id} • ${p.name}`,
      subtitle: `${p.scheme} • ${p.district}, ${p.state} • Health: ${p.evidenceHealthScore}/100`,
      href: `/projects/${p.id}`,
    })),
    ...quickActions.map((a, i) => ({
      type: 'action' as const,
      id: `action-${i}`,
      title: a.title,
      subtitle: 'Quick System Action',
      href: a.href,
    })),
  ];

  const handleSelect = (href: string) => {
    setIsCommandPaletteOpen(false);
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && allResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(allResults[selectedIndex].href);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-ink-primary/50 backdrop-blur-sm animate-page-enter">
      <div
        className="w-full max-w-xl bg-surface border border-border-hairline rounded-lg shadow-dropdown overflow-hidden flex flex-col"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Box */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-hairline bg-surface-sunken/40">
          <Search className="w-4 h-4 text-ink-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type project ID, evidence hash, district, or action..."
            className="w-full bg-transparent text-sm text-ink-primary placeholder-ink-muted focus:outline-none"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded text-ink-muted hover:text-ink-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {allResults.length === 0 ? (
            <div className="p-6 text-center text-xs text-ink-muted">
              No matching records or actions found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            allResults.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.href)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full text-left rtl:text-right px-3 py-2 rounded text-xs flex items-center justify-between transition-colors ${
                  selectedIndex === idx
                    ? 'bg-surface-sunken border border-border-hairline font-medium text-ink-primary'
                    : 'text-ink-secondary hover:bg-surface-sunken/60 hover:text-ink-primary'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {item.type === 'evidence' && <FileText className="w-3.5 h-3.5 text-saffron-deep dark:text-saffron shrink-0" />}
                  {item.type === 'project' && <FolderGit2 className="w-3.5 h-3.5 text-navy dark:text-[#7FA8D9] shrink-0" />}
                  {item.type === 'action' && <ArrowRight className="w-3.5 h-3.5 text-india-green shrink-0" />}
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-ink-primary">{item.title}</span>
                    <span className="text-[10px] text-ink-muted truncate">{item.subtitle}</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-semibold text-ink-muted px-1.5 py-0.5 rounded bg-surface-sunken border border-border-hairline shrink-0 ml-2">
                  {item.type}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-3 py-2 bg-surface-sunken/60 border-t border-border-hairline flex items-center justify-between text-[10px] text-ink-muted">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>ESC to close</span>
          </div>
          <span>GIGW 3.0 Accessible</span>
        </div>
      </div>
    </div>
  );
}

