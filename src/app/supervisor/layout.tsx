'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  Camera,
  CheckSquare,
  History,
  LogOut,
  ScanLine,
  FolderGit2,
  AlertTriangle,
  User,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const { currentUser, logoutUser, supervisorTasks } = useApp();

  const pendingTasksCount = supervisorTasks.filter((t) => t.status === 'PENDING' || t.status === 'NEEDS_RETAKE').length;
  const correctionsCount = supervisorTasks.filter((t) => t.status === 'NEEDS_RETAKE').length;

  const navItems = [
    { href: '/supervisor', label: 'Dashboard (डैशबोर्ड)', icon: LayoutDashboard, exact: true },
    { href: '/supervisor/upload', label: 'Upload Evidence (फोटो अपलोड)', icon: Camera },
    { href: '/supervisor/scan', label: 'Scan / Verify (जाँच करें)', icon: ScanLine },
    { href: '/supervisor/projects', label: 'My Projects (परियोजनाएं)', icon: FolderGit2 },
    { href: '/supervisor/uploads', label: 'Results & History (स्थिति)', icon: History },
    { href: '/supervisor/corrections', label: 'Corrections (सुधार कार्य)', icon: AlertTriangle, badge: correctionsCount > 0 ? `${correctionsCount}` : null },
    { href: '/supervisor/profile', label: 'Profile (प्रोफाइल)', icon: User },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || (href !== '/supervisor' && pathname.startsWith(href));
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-3.5rem)] bg-canvas">
      {/* Desktop Sidebar (Anchored Bottom User Area) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-surface border-r border-border-hairline shrink-0 sticky top-14 h-[calc(100vh-3.5rem)]">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border-hairline">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-india-green text-surface flex items-center justify-center font-bold shadow-subtle">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm text-ink-primary">
                Field Portal
              </div>
              <div className="text-[11px] text-ink-muted">
                फील्ड सुपरवाइजर कार्यक्षेत्र
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-[9px] font-bold tracking-widest text-ink-muted uppercase">
            Supervisor Operations
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? 'bg-surface-sunken text-india-green font-bold border-l-4 border-india-green shadow-subtle'
                    : 'text-ink-secondary hover:bg-surface-sunken/60 hover:text-ink-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      active ? 'text-india-green' : 'text-ink-muted'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-risk-high text-surface">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Area — Anchored at Bottom (Section 12 Fix) */}
        <div className="p-4 border-t border-border-hairline bg-surface-sunken/40 space-y-3 mt-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-india-green/20 text-india-green flex items-center justify-center font-bold text-xs shrink-0">
              {(currentUser?.name || 'S').charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs text-ink-primary truncate">
                {currentUser?.name || 'Suresh Patil (JE)'}
              </div>
              <div className="text-[10px] text-ink-muted truncate">
                ID: SP-MH-4019 • {currentUser?.district || 'Pune'}
              </div>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="w-full py-2 px-3 rounded-lg border border-border-hairline bg-surface hover:bg-surface-sunken text-ink-secondary hover:text-risk-high text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-subtle"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out / लॉगआउट</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-surface border-b border-border-hairline p-3 sticky top-14 z-30 flex items-center justify-between shadow-subtle">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-india-green text-surface flex items-center justify-center font-bold">
            <Camera className="w-4 h-4" />
          </div>
          <span className="font-bold text-xs text-ink-primary">Field Supervisor Portal</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-ink-secondary truncate max-w-[120px]">
            {currentUser?.name || 'Suresh Patil'}
          </span>
          <button
            onClick={logoutUser}
            className="p-1 rounded bg-surface-sunken text-ink-muted hover:text-risk-high"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl overflow-y-auto animate-page-enter">
        {children}
      </main>

      {/* Mobile Bottom Thumb Bar */}
      <nav className="md:hidden sticky bottom-0 bg-surface border-t border-border-hairline flex justify-around p-2 z-40 shadow-dropdown">
        {[
          { href: '/supervisor', label: 'Tasks', icon: CheckSquare },
          { href: '/supervisor/upload', label: 'Upload', icon: Camera },
          { href: '/supervisor/scan', label: 'Scan', icon: ScanLine },
          { href: '/supervisor/uploads', label: 'Status', icon: History },
          { href: '/supervisor/corrections', label: 'Fix', icon: AlertTriangle, badge: correctionsCount > 0 ? correctionsCount : null },
        ].map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.href === '/supervisor');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-bold ${
                active
                  ? 'text-india-green bg-india-green/10'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-risk-high" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
