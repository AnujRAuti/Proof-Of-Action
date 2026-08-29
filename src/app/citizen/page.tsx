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

  const getProjectImg = (scheme: string) => {
    if (scheme.includes('Jal') || scheme.includes('Water')) {
      return 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80';
    }
    if (scheme.includes('Shiksha') || scheme.includes('School')) {
      return 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=400&q=80';
    }
    if (scheme.includes('KUSUM') || scheme.includes('Solar')) {
      return 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=400&q=80';
    }
    return 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80';
  };

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
      <div className="bg-surface border border-border-hairline rounded-2xl p-5 sm:p-6 shadow-subtle space-y-3">
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
            className="px-4 py-2.5 rounded-xl bg-surface-sunken hover:bg-surface border border-border-hairline text-ink-primary font-bold text-xs flex items-center gap-1.5 self-start sm:self-center shrink-0 shadow-subtle"
          >
            <AlertCircle className="w-4 h-4 text-saffron-deep dark:text-saffron" />
            <span>Report a Concern (शिकायत दर्ज करें)</span>
          </Link>
        </div>

        {/* Latest Community Update */}
        <div className="p-3.5 bg-india-green/10 border border-india-green/25 rounded-xl flex items-start gap-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-india-green shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-india-green block">Latest Update in Your Area:</span>
            <p className="text-ink-primary text-[11px] leading-snug">
              Purandar Taluka Bitumen Road (Km 0 to 4.2) wearing coat is 82% completed. Verified by field quality engineer.
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
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-border-hairline text-xs sm:text-sm text-ink-primary placeholder-ink-muted focus:outline-none focus:border-saffron"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-surface-sunken border border-border-hairline rounded-lg p-0.5 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('LIST')}
              className={`p-1.5 rounded flex items-center gap-1 text-xs font-semibold ${
                viewMode === 'LIST' ? 'bg-surface text-ink-primary shadow-subtle' : 'text-ink-muted'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('MAP')}
              className={`p-1.5 rounded flex items-center gap-1 text-xs font-semibold ${
                viewMode === 'MAP' ? 'bg-surface text-ink-primary shadow-subtle' : 'text-ink-muted'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === c.key
                  ? 'bg-saffron text-ink-primary shadow-subtle'
                  : 'bg-surface-sunken hover:bg-surface border border-border-hairline text-ink-secondary'
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
                className="bg-surface border border-border-hairline rounded-2xl p-4 sm:p-5 shadow-subtle hover:border-ink-muted transition-all flex flex-col sm:flex-row gap-4 items-start justify-between"
              >
                <div className="flex gap-4 items-start">
                  <img
                    src={getProjectImg(p.scheme)}
                    alt={p.name}
                    className="w-24 sm:w-28 h-24 rounded-xl object-cover bg-ink-primary shrink-0 border border-border-hairline"
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
                            : 'bg-saffron/15 text-saffron-deep dark:text-saffron'
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
                      Budget: <strong>₹{(p.budgetInr / 10000000).toFixed(2)} Cr</strong> • Target: {p.endDate}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/citizen/projects/${p.id}`}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-sunken hover:bg-surface border border-border-hairline text-ink-primary font-bold text-xs flex items-center justify-center gap-1 self-stretch sm:self-center shrink-0 transition-colors shadow-subtle"
                >
                  <span>View Photos &amp; Progress</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        /* Simple Clean Citizen Map View */
        <div className="bg-surface border border-border-hairline rounded-2xl p-4 shadow-subtle">
          <div className="aspect-[16/9] bg-surface-sunken rounded-xl flex items-center justify-center relative overflow-hidden border border-border-hairline">
            <div className="text-center space-y-2 p-6">
              <MapIcon className="w-8 h-8 text-saffron-deep dark:text-saffron mx-auto" />
              <h3 className="font-serif font-bold text-base text-ink-primary">
                Village Works Map (गाँव के विकास कार्य)
              </h3>
              <p className="text-xs text-ink-secondary max-w-sm">
                Showing {filtered.length} sanctioned public works in your block.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
