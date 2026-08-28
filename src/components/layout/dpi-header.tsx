'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { useApp, UserRole } from '@/lib/store/app-context';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/languages';
import { AbstractMark } from '../ui/abstract-mark';
import {
  Sun,
  Moon,
  Laptop,
  Globe,
  Search,
  Keyboard,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  Check,
  Camera,
  Users,
  Building2,
  LogIn,
} from 'lucide-react';

export function DpiHeader() {
  const { t, language, setLanguage, currentLanguage } = useI18n();
  const { theme, setTheme } = useTheme();
  const { role, loginUser, currentUser, setIsCommandPaletteOpen, setIsShortcutsModalOpen } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [langQuery, setLangQuery] = useState('');
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(langQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(langQuery.toLowerCase()) ||
      l.script.toLowerCase().includes(langQuery.toLowerCase())
  );

  const roleConfigs: { key: UserRole; label: string; desc: string; href: string }[] = [
    { key: 'CITIZEN', label: 'Citizen (नागरिक)', desc: 'Track local projects & voice concerns', href: '/citizen' },
    { key: 'SUPERVISOR', label: 'Field Supervisor (सुपरवाइजर)', desc: 'Guided outdoor 3-step evidence upload', href: '/supervisor' },
    { key: 'REVIEWER', label: 'Government Reviewer (समीक्षक)', desc: '7-signal fusion, review queue & audit', href: '/reviewer' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border-hairline shadow-subtle">
      {/* Structural Tricolour Hairline (GIGW 3.0 Specification) */}
      <div className="tricolour-hairline" />

      {/* Main Header Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Brand & Emblem Lockup */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Proof of Action Home"
          >
            <AbstractMark size={34} />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-ink-primary tracking-tight group-hover:text-saffron-deep dark:group-hover:text-saffron transition-colors">
                  {t('app_title', 'Proof-of-Action')}
                </span>
              
              </div>
              <span className="text-[11px] text-ink-secondary font-medium tracking-tight truncate max-w-[200px] sm:max-w-none">
                {t('dept_label', 'Government of India • Digital Public Infrastructure')}
              </span>
            </div>
          </Link>
        </div>

        {/* 3 Direct Role Quick Switcher Pills for Jury / Evaluation */}
        <div className="hidden md:flex items-center gap-1 bg-surface-sunken p-1 rounded-lg border border-border-hairline text-xs font-semibold">
          <Link
            href="/citizen"
            onClick={() => loginUser('CITIZEN')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
              role === 'CITIZEN'
                ? 'bg-surface text-saffron-deep dark:text-saffron shadow-subtle font-bold'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Citizen</span>
          </Link>
          <Link
            href="/supervisor"
            onClick={() => loginUser('SUPERVISOR')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
              role === 'SUPERVISOR'
                ? 'bg-surface text-india-green shadow-subtle font-bold'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Supervisor</span>
          </Link>
          <Link
            href="/reviewer"
            onClick={() => loginUser('REVIEWER')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
              role === 'REVIEWER' || role === 'PROGRAM_ADMIN' || role === 'AUDITOR'
                ? 'bg-surface text-navy dark:text-[#7FA8D9] shadow-subtle font-bold'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Reviewer</span>
          </Link>
        </div>

        {/* Right Utility Bar: Search, Language Palette, Theme Toggle, Auth */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Global Search (Cmd+K) */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-sunken border border-border-hairline text-ink-muted hover:text-ink-secondary text-xs"
            title="Search projects, evidence hash (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search...</span>
            <kbd className="text-[10px] font-mono bg-surface px-1 py-0.2 rounded border">⌘K</kbd>
          </button>

          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-sunken border border-border-hairline text-ink-primary hover:border-ink-muted text-xs font-medium transition-colors"
              title="Select Platform Language (12 Indian Languages Supported)"
            >
              <Globe className="w-3.5 h-3.5 text-navy dark:text-[#7FA8D9]" />
              <span className="text-xs font-semibold">{currentLanguage.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-ink-muted" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-1.5 w-72 rounded-md bg-surface border border-border-hairline shadow-dropdown p-2 z-50 animate-page-enter">
                <div className="flex items-center gap-2 px-2 pb-2 mb-1 border-b border-border-hairline">
                  <Search className="w-3.5 h-3.5 text-ink-muted" />
                  <input
                    type="text"
                    value={langQuery}
                    onChange={(e) => setLangQuery(e.target.value)}
                    placeholder="Search 12 official languages..."
                    className="w-full bg-transparent text-xs text-ink-primary placeholder-ink-muted focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="max-h-56 overflow-y-auto space-y-0.5">
                  {filteredLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left rtl:text-right px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                        language === l.code
                          ? 'bg-surface-sunken font-bold text-ink-primary'
                          : 'text-ink-secondary hover:bg-surface-sunken/60 hover:text-ink-primary'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-ink-primary">{l.nativeName}</span>
                        <span className="text-[10px] text-ink-muted">
                          {l.name} • {l.script} {l.isRtl ? '(RTL)' : ''}
                        </span>
                      </div>
                      {language === l.code && <Check className="w-4 h-4 text-india-green" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Segmented Control (Light / Dark / System) */}
          <div
            className="flex items-center bg-surface-sunken border border-border-hairline rounded p-0.5"
            role="group"
          >
            <button
              onClick={() => setTheme('light')}
              className={`p-1 rounded text-xs transition-colors ${
                theme === 'light'
                  ? 'bg-surface text-saffron-deep shadow-subtle'
                  : 'text-ink-muted hover:text-ink-secondary'
              }`}
              title="Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1 rounded text-xs transition-colors ${
                theme === 'dark'
                  ? 'bg-surface text-[#7FA8D9] shadow-subtle'
                  : 'text-ink-muted hover:text-ink-secondary'
              }`}
              title="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`p-1 rounded text-xs transition-colors ${
                theme === 'system'
                  ? 'bg-surface text-ink-primary shadow-subtle'
                  : 'text-ink-muted hover:text-ink-secondary'
              }`}
              title="System Theme Preference"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sign In / Sign Up Link */}
          <Link
            href="/login"
            className="px-3 py-1 rounded bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors shadow-subtle flex items-center gap-1"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
