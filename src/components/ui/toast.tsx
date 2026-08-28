'use client';

import React from 'react';
import { useApp } from '@/lib/store/app-context';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, Undo2 } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 rtl:right-auto rtl:left-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="assertive"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-surface border border-border-hairline shadow-dropdown rounded-lg p-3 flex items-start gap-3 animate-page-enter transition-all"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-india-green shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-risk-critical shrink-0 mt-0.5" />}
          {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-risk-high shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-navy dark:text-[#7FA8D9] shrink-0 mt-0.5" />}

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-ink-primary leading-tight">{toast.title}</h4>
            <p className="text-[11px] text-ink-secondary mt-0.5 leading-snug">{toast.description}</p>

            {toast.undoAction && (
              <button
                onClick={() => {
                  toast.undoAction?.();
                  removeToast(toast.id);
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-sunken border border-border-hairline text-xs font-semibold text-saffron-deep dark:text-saffron hover:bg-surface-sunken/80 transition-colors"
              >
                <Undo2 className="w-3 h-3" />
                <span>{toast.undoLabel || 'Undo'}</span>
              </button>
            )}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-ink-muted hover:text-ink-primary shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

