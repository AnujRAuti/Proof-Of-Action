'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import { getProjectImage } from '@/lib/data/mock-dataset';
import {
  MapPin,
  Search,
  CheckCircle2,
  FolderGit2,
  ChevronRight,
  Filter,
  Calendar,
  Building2,
} from 'lucide-react';

export default function CitizenPublicProjectsPage() {
  const { t } = useI18n();
  const { projects } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScheme, setSelectedScheme] = useState('ALL');

  const filtered = projects.filter((p) => {
    if (selectedScheme !== 'ALL' && !p.scheme.includes(selectedScheme)) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.block.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border-2 border-border-hairline rounded-2xl p-6 sm:p-7 shadow-subtle space-y-4">
        <div>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary">
            Public Works Directory (सार्वजनिक विकास कार्य)
          </h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Transparent public information on government-funded roads, drinking water, school repairs, and solar installations.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-1">
          <div className="w-full sm:w-80 relative">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name or village..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-surface-sunken border border-border-hairline text-xs font-semibold text-ink-primary placeholder-ink-muted focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedScheme}
              onChange={(e) => setSelectedScheme(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-surface border border-border-hairline text-xs font-semibold text-ink-primary focus:outline-none w-full sm:w-auto"
            >
              <option value="ALL">All Schemes (सभी योजनाएं)</option>
              <option value="PMGSY">PMGSY (Rural Roads)</option>
              <option value="Jal Jeevan">Jal Jeevan (Water)</option>
              <option value="Samagra">Samagra Shiksha (Schools)</option>
              <option value="KUSUM">PM-KUSUM (Solar)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid with Local Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((project) => {
          const projectImg = project.imageUrl || getProjectImage(project.id);
          return (
            <div
              key={project.id}
              className="bg-surface border-2 border-border-hairline rounded-2xl p-5 sm:p-6 space-y-4 shadow-subtle flex flex-col justify-between hover:border-ink-muted transition-colors"
            >
              <div className="space-y-3">
                <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-ink-primary border border-border-hairline relative">
                  <img
                    src={projectImg}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-ink-primary/80 text-surface backdrop-blur-sm">
                    {project.id}
                  </div>
                  <div className="absolute top-2 right-2 text-[10px] font-bold text-surface bg-india-green px-2 py-0.5 rounded shadow">
                    {project.status.replace('_', ' ')}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-ink-primary leading-snug">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-ink-secondary mt-1">
                    <MapPin className="w-3.5 h-3.5 text-ink-muted" />
                    <span>{project.district}, {project.state} ({project.block} Block)</span>
                  </div>
                </div>

                <div className="p-3 bg-surface-sunken rounded-xl border border-border-hairline space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Scheme Track:</span>
                    <span className="font-semibold text-ink-primary">{project.scheme}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Sanctioned Public Budget:</span>
                    <span className="font-mono font-bold text-ink-primary tabular-nums">
                      ₹{(project.budgetInr / 10000000).toFixed(2)} Cr
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Physical Status:</span>
                    <span className="font-bold text-india-green">
                      {project.status === 'COMPLETED' ? '100% Completed' : 'Under Active Construction (82%)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Last Field Update:</span>
                    <span className="font-mono text-ink-secondary">28 Aug 2026</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/citizen/projects/${project.id}`}
                className="w-full py-2.5 rounded-xl bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors shadow-subtle flex items-center justify-center gap-2"
              >
                <span>View Milestone Evidence &amp; Photos</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
