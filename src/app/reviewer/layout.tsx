'use client';

import React from 'react';
import { SidebarNav } from '@/components/layout/sidebar-nav';

export default function ReviewerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 min-h-[calc(100vh-3.5rem)]">
      <SidebarNav />
      <div className="flex-1 overflow-x-hidden min-w-0 bg-canvas animate-page-enter">
        {children}
      </div>
    </div>
  );
}

