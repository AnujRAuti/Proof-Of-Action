'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store/app-context';
import { AbstractMark } from '@/components/ui/abstract-mark';
import {
  LayoutDashboard,
  Inbox,
  SplitSquareVertical,
  MapPin,
  FolderGit2,
  FileCheck2,
  BarChart3,
  Smartphone,
  Cpu,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'WORKSPACE',
    items: [
      { href: '/reviewer', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/reviewer/queue', label: 'Review Queue', icon: Inbox },
    ],
  },
  {
    label: 'INVESTIGATION',
    items: [
      { href: '/reviewer/compare', label: 'Before / After', icon: SplitSquareVertical },
      { href: '/reviewer/map', label: 'Geofence Map', icon: MapPin },
      { href: '/reviewer/projects/PRJ-PMGSY-MH-401', label: 'Project Dossiers', icon: FolderGit2 },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { href: '/reviewer/field', label: 'Field Inspections', icon: Smartphone },
      { href: '/reviewer/ingest', label: 'Live Ingestion', icon: Cpu },
    ],
  },
  {
    label: 'GOVERNANCE',
    items: [
      { href: '/reviewer/audit', label: 'Audit Log Ledger', icon: FileCheck2 },
      { href: '/reviewer/analytics', label: 'Analytics & Certs', icon: BarChart3 },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { href: '/reviewer/settings', label: 'Settings & APIs', icon: Settings },
      { href: '/reviewer/about', label: 'About Platform', icon: Info },
    ],
  },
];

export default function ReviewerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, logoutUser, evidenceList } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('eiil_sidebar_collapsed');
    if (saved !== null) setIsCollapsed(saved === 'true');
  }, []);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('eiil_sidebar_collapsed', String(next));
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href);
  };

  const pendingCount = evidenceList.filter((e) => e.auditStatus === 'PENDING').length;

  return (
    <div className="flex flex-1 min-h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Reviewer Sidebar */}
      <aside
        className={`relative z-30 bg-surface border-r border-border-hairline flex flex-col shrink-0 transition-all duration-200 ${
          isCollapsed ? 'w-16' : 'w-60 lg:w-64'
        }`}
        aria-label="Reviewer Navigation"
      >
        {/* Top Header Badge */}
        {!isCollapsed && (
          <div className="p-3 border-b border-border-hairline flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-navy text-surface dark:bg-[#7FA8D9] dark:text-navy flex items-center justify-center font-bold text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-serif font-bold text-xs text-ink-primary">
                Reviewer Workspace
              </span>
            </div>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-india-green/10 text-india-green">
              LIVE
            </span>
          </div>
        )}

        {/* Scrollable nav area */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 min-h-0">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              {!isCollapsed && (
                <div className="px-3 pb-1">
                  <span className="text-[9px] font-bold tracking-widest text-ink-muted uppercase">
                    {section.label}
                  </span>
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href, item.exact);
                  const isQueue = item.href.includes('queue');

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={isCollapsed ? item.label : undefined}
                      className={`relative flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors group ${
                        active
                          ? 'bg-surface-sunken text-ink-primary font-semibold border-l-2 border-saffron'
                          : 'text-ink-secondary hover:bg-surface-sunken/60 hover:text-ink-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            active
                              ? 'text-saffron-deep dark:text-saffron'
                              : 'text-ink-muted group-hover:text-ink-secondary'
                          }`}
                        />
                        {!isCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </div>

                      {!isCollapsed && isQueue && pendingCount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-saffron text-ink-primary tabular-nums">
                          {pendingCount}
                        </span>
                      )}

                      {/* Collapsed tooltip */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-ink-primary text-surface text-[11px] rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-dropdown">
                          {item.label}
                          {isQueue && pendingCount > 0 && ` (${pendingCount})`}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom: User info + Logout + Collapse toggle */}
        <div className="border-t border-border-hairline p-2 space-y-2 shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-surface-sunken">
              <div className="w-6 h-6 rounded-full bg-navy/20 dark:bg-[#7FA8D9]/20 flex items-center justify-center text-[10px] font-bold text-navy dark:text-[#7FA8D9] shrink-0">
                {(currentUser?.name || 'R').charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-ink-primary truncate">
                  {currentUser?.name || 'Rajesh Sharma'}
                </div>
                <div className="text-[9px] text-ink-muted truncate">
                  {currentUser?.district || 'Pune'} • REVIEWER
                </div>
              </div>
              <button
                onClick={logoutUser}
                title="Logout"
                className="p-1 rounded hover:bg-surface text-ink-muted hover:text-risk-high transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between px-1">
            {!isCollapsed && (
              <div className="flex items-center gap-1.5 text-[10px] text-ink-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-india-green" />
                <span>AI Fusion Core Active</span>
              </div>
            )}
            <button
              onClick={toggleCollapse}
              className="p-1.5 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-muted hover:text-ink-primary text-xs transition-colors mx-auto"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 bg-canvas animate-page-enter">
        {children}
      </div>
    </div>
  );
}
