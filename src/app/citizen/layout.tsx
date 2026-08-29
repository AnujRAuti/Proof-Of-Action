'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  Compass,
  FileText,
  Clock,
  ShieldCheck,
  Building,
  User,
  LogOut,
  FolderGit2,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const { currentUser, logoutUser, complaints } = useApp();

  const navItems = [
    { href: '/citizen', label: 'Explore (परियोजनाएं)', icon: Compass, exact: true },
    { href: '/citizen/submissions', label: 'My Submissions (मेरी प्रस्तुतियां)', icon: FileText },
    { href: '/citizen/status', label: 'Track Status (स्थिति जांचें)', icon: Clock },
    { href: '/citizen/projects', label: 'Public Projects (सरकारी कार्य)', icon: FolderGit2 },
    { href: '/citizen/complaints', label: 'Concerns (शिकायतें)', icon: FileText, badge: complaints.length > 0 ? `${complaints.length}` : null },
    { href: '/citizen/profile', label: 'Profile (प्रोफाइल)', icon: User },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || (href !== '/citizen' && pathname.startsWith(href));
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Citizen Top Navigation Bar */}
      <div className="bg-surface border-b border-border-hairline py-3 px-4 sm:px-6 sticky top-14 z-30 shadow-subtle">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/citizen"
              className="flex items-center gap-2 font-serif font-bold text-base sm:text-lg text-ink-primary"
            >
              <div className="w-8 h-8 rounded-lg bg-saffron text-ink-primary flex items-center justify-center font-bold shadow-subtle">
                🏛️
              </div>
              <span>जनता पोर्टल (Citizen Portal)</span>
            </Link>

            {currentUser?.isAadhaarVerified ? (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-india-green/10 text-india-green text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Aadhaar Verified: XXXX XXXX 4821 (Demo)
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-sunken text-ink-muted text-[11px]">
                📍 {currentUser?.district || 'Pune'}, {currentUser?.state || 'Maharashtra'}
              </span>
            )}
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    active
                      ? 'bg-surface-sunken text-saffron-deep dark:text-saffron font-bold shadow-subtle'
                      : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-sunken/60'
                  }`}
                >
                  {item.label.split(' ')[0]}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={logoutUser}
              className="p-1.5 px-2.5 rounded-lg bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-secondary hover:text-ink-primary flex items-center gap-1.5 text-xs font-semibold transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-page-enter">
        {children}
      </main>

      {/* Mobile Bottom Thumb Bar */}
      <nav className="sticky bottom-0 bg-surface border-t border-border-hairline lg:hidden flex justify-around p-2 z-40 shadow-dropdown">
        {[
          { href: '/citizen', label: 'Explore', icon: Compass },
          { href: '/citizen/submissions', label: 'Submissions', icon: FileText },
          { href: '/citizen/status', label: 'Status', icon: Clock },
          { href: '/citizen/complaints', label: 'Concerns', icon: FileText },
          { href: '/citizen/profile', label: 'Profile', icon: User },
        ].map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.href === '/citizen');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-bold ${
                active
                  ? 'text-saffron-deep dark:text-saffron bg-saffron/10'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
