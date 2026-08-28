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
  Smartphone,
} from 'lucide-react';

export function DpiHeader() {
  const { t, language, setLanguage, currentLanguage } = useI18n();
  const { theme, setTheme } = useTheme();
  const { role, setRole, setIsCommandPaletteOpen, setIsShortcutsModalOpen } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [langQuery, setLangQuery] = useState('');
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
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

  const roles: { key: UserRole; label: string; desc: string }[] = [
    { key: 'FIELD_OFFICER', label: 'फील्ड अधिकारी (Field Officer)', desc: 'सरल 3-स्टेप फोटो एवं निरीक्षण' },
    { key: 'REVIEWER', label: t('role_reviewer', 'Evidence Reviewer'), desc: 'Assess anomalies, verify before/after, approve/reject' },
    { key: 'PROGRAM_ADMIN', label: t('role_admin', 'Program Administrator'), desc: 'Macro monitoring, policy thresholds, project health' },
    { key: 'AUDITOR', label: t('role_auditor', 'Senior Auditor'), desc: 'Cross-scheme audit, forensic graphs, certificate issue' },
    { key: 'API_CLIENT', label: t('role_api', 'API Client'), desc: 'Automated webhook ingestion & SDK token management' },
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
                <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded bg-surface-sunken border border-border-hairline text-[10px] font-semibold text-ink-secondary tracking-wide uppercase">
                  EIIL DPI v2.4
                </span>
              </div>
              <span className="text-[11px] text-ink-secondary font-medium tracking-tight truncate max-w-[220px] sm:max-w-none">
                {t('dept_label', 'Government of India • Digital Public Infrastructure')}
              </span>
            </div>
          </Link>
        </div>

        {/* Prominent Quick "Field Mode (सरल फील्ड मोड)" button for easy one-tap access */}
        <div className="flex items-center gap-2">
          <Link
            href="/field"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-india-green text-surface hover:bg-india-green/90 font-bold text-xs shadow-subtle transition-all transform hover:scale-105 active:scale-95"
            title="सरल फील्ड फोटो मोड खोलें (Open Simple 3-Step Field Camera)"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>सरल फील्ड मोड (Field Camera)</span>
          </Link>
        </div>

        {/* Center Search & Command Palette Trigger */}
        <div className="hidden xl:flex items-center flex-1 max-w-sm mx-2">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-md bg-surface-sunken border border-border-hairline text-ink-muted hover:text-ink-secondary hover:border-ink-muted text-xs transition-colors focus:outline-none"
            title="Search projects, evidence hash, district (Cmd+K)"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-ink-muted" />
              <span>{t('btn_search_placeholder', 'Search projects, hash...')}</span>
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface border border-border-hairline text-[10px] font-mono text-ink-secondary">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right Utility Bar: Role Switcher, Language Palette, Theme Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Active Persona / Role Switcher */}
          <div className="relative" ref={roleRef}>
            <button
              onClick={() => setIsRoleOpen(!isRoleOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-sunken border border-border-hairline text-ink-primary hover:border-ink-muted text-xs font-medium transition-colors"
              title="Switch Active User Role for Testing"
            >
              <UserCheck className="w-3.5 h-3.5 text-saffron-deep dark:text-saffron" />
              <span className="hidden sm:inline-block max-w-[100px] truncate">
                {roles.find((r) => r.key === role)?.label || role}
              </span>
              <ChevronDown className="w-3 h-3 text-ink-muted" />
            </button>

            {isRoleOpen && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-1.5 w-64 rounded-md bg-surface border border-border-hairline shadow-dropdown p-1.5 z-50 animate-page-enter">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink-muted border-b border-border-hairline mb-1">
                  Active Persona &amp; Permissions
                </div>
                {roles.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => {
                      setRole(r.key);
                      setIsRoleOpen(false);
                    }}
                    className={`w-full text-left rtl:text-right px-2.5 py-1.5 rounded text-xs flex flex-col gap-0.5 transition-colors ${
                      role === r.key
                        ? 'bg-surface-sunken font-semibold text-ink-primary'
                        : 'text-ink-secondary hover:bg-surface-sunken/60 hover:text-ink-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{r.label}</span>
                      {role === r.key && <Check className="w-3.5 h-3.5 text-india-green" />}
                    </div>
                    <span className="text-[10px] text-ink-muted font-normal leading-tight">{r.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Selector Command-Palette Modal */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-sunken border border-border-hairline text-ink-primary hover:border-ink-muted text-xs font-medium transition-colors"
              title="Select Platform Language (12 Indian Languages Supported)"
              aria-label="Language Selector"
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
                  {filteredLanguages.length === 0 && (
                    <div className="px-2 py-3 text-center text-xs text-ink-muted">No language matches</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Segmented Control (Light / Dark / System) */}
          <div
            className="flex items-center bg-surface-sunken border border-border-hairline rounded p-0.5"
            role="group"
            aria-label="Theme switcher"
          >
            <button
              onClick={() => setTheme('light')}
              className={`p-1 rounded text-xs transition-colors ${
                theme === 'light'
                  ? 'bg-surface text-saffron-deep shadow-subtle'
                  : 'text-ink-muted hover:text-ink-secondary'
              }`}
              title="Light Mode"
              aria-label="Light Theme"
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
              aria-label="Dark Theme"
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
              aria-label="System Theme"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Keyboard Shortcuts Trigger */}
          <button
            onClick={() => setIsShortcutsModalOpen(true)}
            className="hidden sm:flex items-center justify-center p-1.5 rounded bg-surface-sunken border border-border-hairline text-ink-muted hover:text-ink-primary text-xs transition-colors"
            title="Keyboard Shortcuts (?)"
            aria-label="Keyboard Shortcuts"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
