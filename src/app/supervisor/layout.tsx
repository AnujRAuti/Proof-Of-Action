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
  Wifi,
  WifiOff,
  Smartphone,
  MapPin,
} from 'lucide-react';

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const { currentUser, logoutUser, supervisorTasks } = useApp();

  const pendingTasksCount = supervisorTasks.filter((t) => t.status === 'PENDING' || t.status === 'NEEDS_RETAKE').length;

  const navItems = [
    { href: '/supervisor', label: 'My Tasks (आज के कार्य)', icon: CheckSquare, badge: pendingTasksCount },
    { href: '/supervisor/upload', label: 'Upload Evidence (फोटो अपलोड)', icon: Camera },
    { href: '/supervisor/uploads', label: 'My Submissions (अपलोड स्थिति)', icon: History },
  ];

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* High-Contrast Sub-Header for Field Use */}
      <div className="bg-surface border-b-2 border-border-hairline py-3 px-4 sm:px-6 sticky top-14 z-30 shadow-subtle">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Link
              href="/supervisor"
              className="flex items-center gap-2 font-bold text-sm sm:text-base text-ink-primary"
            >
              <div className="w-7 h-7 rounded-md bg-india-green text-surface flex items-center justify-center font-bold">
                <Camera className="w-4 h-4" />
              </div>
              <span>फील्ड सुपरवाइजर (Field Portal)</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="hidden sm:inline font-semibold text-ink-secondary">
              👤 {currentUser?.name || 'Suresh Patil (JE)'}
            </span>
            <button
              onClick={logoutUser}
              className="p-1.5 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-secondary flex items-center gap-1"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content (High Contrast, Large Touch Targets) */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 animate-page-enter">
        {children}
      </main>

      {/* Bottom Thumb Bar for Field Mobile */}
      <nav className="sticky bottom-0 bg-surface border-t-2 border-border-hairline sm:hidden flex justify-around p-2 z-40 shadow-dropdown">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-bold ${
                isActive
                  ? 'text-india-green bg-india-green/10'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

