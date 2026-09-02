'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
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
  AlertTriangle,
} from 'lucide-react';

export function SidebarNav() {
  const pathname = usePathname();
  const { t, isRtl } = useI18n();
  const { evidenceList } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('eiil_sidebar_collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('eiil_sidebar_collapsed', String(nextState));
  };

  const pendingCount = evidenceList.filter((e) => e.auditStatus === 'PENDING').length;
  const flaggedCount = evidenceList.filter((e) => e.riskLevel === 'CRITICAL' || e.riskLevel === 'HIGH').length;

  const navItems = [
    {
      href: '/',
      label: t('nav_dashboard', 'Reviewer Dashboard'),
      icon: LayoutDashboard,
      badge: null,
    },
    {
      href: '/queue',
      label: t('nav_queue', 'Review Queue'),
      icon: Inbox,
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: 'bg-saffron text-ink-primary font-bold',
    },
    {
      href: '/compare',
      label: t('nav_compare', 'Before / After Viewer'),
      icon: SplitSquareVertical,
      badge: null,
    },
    {
      href: '/map',
      label: t('nav_map', 'Geofence Map'),
      icon: MapPin,
      badge: flaggedCount > 0 ? `${flaggedCount} flags` : null,
      badgeColor: 'bg-risk-high/15 text-risk-high border border-risk-high/30',
    },
    {
      href: '/projects/PRJ-PMGSY-MH-401',
      label: t('nav_projects', 'Project Dossiers'),
      icon: FolderGit2,
      badge: null,
    },
    {
      href: '/audit',
      label: t('nav_audit', 'Audit Log Ledger'),
      icon: FileCheck2,
      badge: null,
    },
    {
      href: '/analytics',
      label: t('nav_analytics', 'Analytics & Certificates'),
      icon: BarChart3,
      badge: null,
    },
    {
      href: '/field',
      label: t('nav_field', 'Field Inspection (Mobile)'),
      icon: Smartphone,
      badge: 'Mobile',
      badgeColor: 'bg-india-green/15 text-india-green border border-india-green/30',
    },
    {
      href: '/ingest',
      label: t('nav_ingest', 'Live Ingestion Sandbox'),
      icon: Cpu,
      badge: 'Live',
      badgeColor: 'bg-navy/15 dark:bg-[#7FA8D9]/20 text-navy dark:text-[#7FA8D9] border border-navy/30',
    },
    {
      href: '/settings',
      label: t('nav_settings', 'Settings & APIs'),
      icon: Settings,
      badge: null,
    },
    {
      href: '/about',
      label: t('nav_about', 'About Platform'),
      icon: Info,
      badge: null,
    },
  ];

  return (
    <aside
      className={`relative z-30 bg-surface border-r rtl:border-r-0 rtl:border-l border-border-hairline transition-all duration-200 flex flex-col justify-between shrink-0 ${
        isCollapsed ? 'w-16' : 'w-60 lg:w-64'
      }`}
      aria-label="Sidebar Navigation"
    >
      <div className="flex flex-col py-3 px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
        {/* Navigation Link Items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href.startsWith('/projects') && pathname.startsWith('/projects'));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors group relative ${
                isActive
                  ? 'bg-surface-sunken text-ink-primary font-semibold border-l-2 rtl:border-l-0 rtl:border-r-2 border-saffron'
                  : 'text-ink-secondary hover:bg-surface-sunken/60 hover:text-ink-primary'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive
                    ? 'text-saffron-deep dark:text-saffron'
                    : 'text-ink-muted group-hover:text-ink-secondary'
                }`}
              />

              {!isCollapsed && (
                <span className="truncate flex-1 text-left rtl:text-right">{item.label}</span>
              )}

              {!isCollapsed && item.badge !== null && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${item.badgeColor || 'bg-surface-sunken border border-border-hairline text-ink-secondary'}`}
                >
                  {item.badge}
                </span>
              )}

              {/* Collapsed Tooltip */}
              {isCollapsed && (
                <div className="absolute left-full rtl:left-auto rtl:right-full ml-2 rtl:ml-0 rtl:mr-2 px-2 py-1 bg-ink-primary text-surface text-[11px] rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-dropdown">
                  {item.label}
                  {item.badge !== null && ` (${item.badge})`}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Collapse Toggle Button */}
      <div className="p-2 border-t border-border-hairline flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-2 text-[11px] text-ink-muted">
            <span className="w-2 h-2 rounded-full bg-india-green" />
            <span>AI Fusion Core Active</span>
          </div>
        )}
        <button
          onClick={toggleCollapse}
          className="p-1.5 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-muted hover:text-ink-primary text-xs transition-colors mx-auto"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar to Icons'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            isRtl ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </aside>
  );
}

