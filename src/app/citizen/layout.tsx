'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  Compass,
  FileText,
  AlertCircle,
  User,
  LogOut,
  MapPin,
  ShieldCheck,
  Building,
} from 'lucide-react';

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const { currentUser, logoutUser, complaints } = useApp();

  const navItems = [
    { href: '/citizen', label: 'Explore Projects (परियोजनाएं)', icon: Compass },
    { href: '/citizen/complaints', label: 'My Concerns (मेरी शिकायतें)', icon: FileText, badge: complaints.length },
  ];

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Sub-Header Bar for Citizen Portal */}
      <div className="bg-surface border-b border-border-hairline py-3 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/citizen"
              className="flex items-center gap-2 font-serif font-bold text-base text-ink-primary"
            >
              <span>जनता पोर्टल (Citizen View)</span>
            </Link>
            {currentUser?.isAadhaarVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-india-green/10 text-india-green text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Resident
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="hidden sm:inline text-ink-muted">
              📍 {currentUser?.district || 'Pune'}, {currentUser?.state || 'Maharashtra'}
            </span>
            <button
              onClick={logoutUser}
              className="p-1.5 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-secondary hover:text-ink-primary flex items-center gap-1 text-xs"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area (Spacious, Large Type) */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-page-enter">
        {children}
      </main>

      {/* Mobile Friendly Bottom Nav */}
      <nav className="sticky bottom-0 bg-surface border-t border-border-hairline sm:hidden flex justify-around p-2 z-40">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded text-xs font-semibold ${
                isActive ? 'text-saffron-deep dark:text-saffron' : 'text-ink-muted hover:text-ink-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

