'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  FolderGit2,
  MapPin,
  Camera,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ScanLine,
} from 'lucide-react';

export default function SupervisorProjectsPage() {
  const { t } = useI18n();
  const { projects, currentUser } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-surface border-2 border-border-hairline rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary">
            My Assigned Projects (मेरी परियोजनाएं)
          </h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Public works assigned to {currentUser?.name || 'Suresh Patil'} in {currentUser?.district || 'Pune'} jurisdiction.
          </p>
        </div>

        <Link
          href="/supervisor/upload"
          className="px-4 py-2.5 rounded-lg bg-india-green text-surface font-bold text-xs hover:bg-india-green/90 shadow-subtle flex items-center gap-2 self-start sm:self-center shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>Upload Evidence</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-surface border-2 border-border-hairline rounded-2xl p-5 space-y-4 shadow-subtle flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary">
                  {project.id}
                </span>
                <span className="text-xs font-bold text-india-green bg-india-green/10 px-2 py-0.5 rounded">
                  {project.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-ink-primary leading-snug">
                  {project.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-ink-muted mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{project.district}, {project.state} • Geofence {project.geofenceRadiusMeters}m</span>
                </div>
              </div>

              <div className="p-3 bg-surface-sunken rounded-xl border border-border-hairline space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Scheme:</span>
                  <span className="font-semibold text-ink-primary">{project.scheme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Status:</span>
                  <span className="font-bold text-india-green">
                    {project.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Submissions Recorded:</span>
                  <span className="font-mono font-semibold text-ink-primary">{project.totalSubmissions} records</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border-hairline flex gap-2">
              <Link
                href={`/supervisor/upload?projectId=${project.id}`}
                className="flex-1 py-2.5 rounded-lg bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors text-center flex items-center justify-center gap-1.5 shadow-subtle"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </Link>
              <Link
                href={`/supervisor/scan`}
                className="py-2.5 px-3 rounded-lg bg-surface-sunken hover:bg-surface border border-border-hairline text-ink-secondary text-xs font-semibold flex items-center justify-center gap-1"
                title="Scan Photo"
              >
                <ScanLine className="w-4 h-4" />
                <span className="hidden sm:inline">Pre-Scan</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
