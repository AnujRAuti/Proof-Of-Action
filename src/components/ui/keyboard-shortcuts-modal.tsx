'use client';

import React from 'react';
import { useApp } from '@/lib/store/app-context';
import { X, Keyboard } from 'lucide-react';

export function KeyboardShortcutsModal() {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useApp();

  if (!isShortcutsModalOpen) return null;

  const shortcuts = [
    { key: 'j', desc: 'Navigate down to the next evidence row in Review Queue' },
    { key: 'k', desc: 'Navigate up to the previous evidence row' },
    { key: 'a', desc: 'Approve selected evidence item (optimistic)' },
    { key: 'r', desc: 'Reject selected evidence item' },
    { key: 'f', desc: 'Flag selected evidence for on-site physical inspection' },
    { key: 'Enter', desc: 'Open deep Evidence Inspector for selected item' },
    { key: 'Cmd/Ctrl + K', desc: 'Open Global Command Palette & Search' },
    { key: '?', desc: 'Toggle this Keyboard Shortcuts Helper modal' },
    { key: 'ESC', desc: 'Close open modal, drawer, or dialog' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/50 backdrop-blur-sm animate-page-enter"
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-shortcuts-title"
    >
      <div className="w-full max-w-lg bg-surface border border-border-hairline rounded-lg shadow-dropdown overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-hairline bg-surface-sunken/40">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-saffron-deep dark:text-saffron" />
            <h3 id="keyboard-shortcuts-title" className="font-serif font-bold text-sm text-ink-primary">
              High-Velocity Reviewer Shortcuts
            </h3>
          </div>
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="p-1 rounded text-ink-muted hover:text-ink-primary"
            aria-label="Close keyboard shortcuts"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
          <p className="text-xs text-ink-secondary mb-3 leading-relaxed">
            Designed for institutional reviewers auditing dozens of public works daily. No mouse clicks needed.
          </p>
          <div className="divide-y divide-border-hairline">
            {shortcuts.map((s) => (
              <div key={s.key} className="py-2 flex items-center justify-between gap-4">
                <span className="text-xs text-ink-primary">{s.desc}</span>
                <kbd className="px-2 py-0.5 rounded bg-surface-sunken border border-border-hairline font-mono text-xs font-semibold text-ink-primary shadow-subtle shrink-0">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 bg-surface-sunken/60 border-t border-border-hairline flex justify-end">
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="px-3 py-1.5 rounded bg-ink-primary text-surface text-xs font-medium hover:opacity-90"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
