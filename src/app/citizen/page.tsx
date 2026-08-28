'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  MapPin,
  Search,
  List,
  Map as MapIcon,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';

export default function CitizenHomePage() {
  const { t, formatDate } = useI18n();
  const { projects, currentUser } = useApp();

  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { key: 'ALL', label: 'All Projects (सभी)' },
    { key: 'ROAD', label: 'Roads (सड़क)' },
    { key: 'WATER', label: 'Water (पेयजल)' },
    { key: 'SCHOOL', label: 'Schools (विद्यालय)' },
    { key: 'SOLAR', label: 'Solar (सौर ऊर्जा)' },
  ];

  const filtered = projects.filter((p) => {
    if (selectedCategory === 'ROAD' && !p.scheme.includes('Road') && !p.scheme.includes('PMGSY')) return false;
    if (selectedCategory === 'WATER' && !p.scheme.includes('Jal') && !p.scheme.includes('Water')) return false;
    if (selectedCategory === 'SCHOOL' && !p.scheme.includes('Shiksha') && !p.scheme.includes('School')) return false;
    if (selectedCategory === 'SOLAR' && !p.scheme.includes('Solar') && !p.scheme.includes('KUSUM')) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.block.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Citizen Welcome & Notification Card */}
      <div className="bg-surface border border-border-hairline rounded-xl p-5 sm:p-6 shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary">
              Namaste, {currentUser?.name || 'Citizen'}! 🙏
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
              Showing public works in {currentUser?.district || 'Pune'} District, {currentUser?.state || 'Maharashtra'}.
            </p>
          </div>

          <Link
            href="/citizen/complaints"
            className="px-4 py-2 rounded-lg bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary font-bold text-xs flex items-center gap-1.5 self-start sm:self-center shrink-0"
          >
            <AlertCircle className="w-4 h-4 text-saffron-deep" />
            <span>Report a Concern (शिकायत दर्ज करें)</span>
          </Link>
        </div>

        {/* Latest Community Update */}
        <div className="p-3 bg-india-green/10 border border-india-green/20 rounded-lg flex items-start gap-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-india-green shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-india-green block">Latest Update in Your Area:</span>
            <p className="text-ink-primary text-[11px] leading-snug">
              Purandar Taluka Bitumen Road (Km 0 to 4.2) wearing coat is 85% completed.
            </p>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-80 relative">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your village or road..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-border-hairline text-xs sm:text-sm text-ink-primary placeholder-ink-muted focus:outline-none focus:border-saffron"
            />
          </div>

          {/* List / Map View Switcher */}
          <div className="flex items-center bg-surface-sunken border border-border-hairline rounded-lg p-0.5 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('LIST')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                viewMode === 'LIST'
                  ? 'bg-surface text-ink-primary shadow-subtle'
                  : 'text-ink-muted hover:text-ink-secondary'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('MAP')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                viewMode === 'MAP'
                  ? 'bg-surface text-ink-primary shadow-subtle'
                  : 'text-ink-muted hover:text-ink-secondary'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 text-xs">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                selectedCategory === c.key
                  ? 'bg-ink-primary text-surface'
                  : 'bg-surface border border-border-hairline text-ink-secondary hover:bg-surface-sunken'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List View */}
      {viewMode === 'LIST' ? (
        <div className="space-y-4">
          {filtered.map((p) => {
            const isCompleted = p.status === 'COMPLETED';
            return (
              <div
                key={p.id}
                className="bg-surface border border-border-hairline rounded-xl p-4 sm:p-5 shadow-subtle hover:border-ink-muted transition-all flex flex-col sm:flex-row gap-4 items-start justify-between"
              >
                <div className="flex gap-4 items-start">
                  <img
                    src="https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80"
                    alt={p.name}
                    className="w-24 sm:w-28 h-24 rounded-lg object-cover bg-ink-primary shrink-0 border border-border-hairline"
                  />

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-saffron-deep dark:text-saffron">
                        {p.scheme}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-india-green/15 text-india-green'
                            : 'bg-saffron/15 text-saffron-deep'
                        }`}
                      >
                        {isCompleted ? '✓ Completed (पूर्ण)' : '🔨 In Progress (प्रगति पर)'}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-sm sm:text-base text-ink-primary leading-snug">
                      {p.name}
                    </h3>

                    <p className="text-xs text-ink-secondary flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-ink-muted" />
                      <span>{p.block}, {p.district}</span>
                    </p>

                    <div className="text-[11px] text-ink-muted pt-0.5">
                      Sanctioned Budget: ₹{(p.budgetInr / 10000000).toFixed(2)} Cr
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border-hairline">
                  <Link
                    href={`/citizen/projects/${p.id}`}
                    className="w-full sm:w-auto text-center px-4 py-2 rounded-lg bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors shadow-subtle flex items-center justify-center gap-1"
                  >
                    <span>Track Progress (प्रगति देखें)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Map View */
        <div className="bg-surface border border-border-hairline rounded-xl p-6 shadow-subtle text-center space-y-3">
          <p className="text-xs text-ink-secondary">
            Showing project locations in your district. Click any marker to view photos.
          </p>
          <div className="aspect-[16/9] bg-surface-sunken rounded-lg border border-border-hairline flex items-center justify-center">
            <span className="text-xs font-semibold text-ink-muted">
              Interactive Map with {filtered.length} Local Work Sites
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

