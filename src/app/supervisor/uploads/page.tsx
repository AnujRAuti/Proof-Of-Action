'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  History,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Camera,
  ArrowRight,
  RotateCcw,
  MapPin,
} from 'lucide-react';

export default function SupervisorUploadsPage() {
  const { t, formatDate } = useI18n();
  const { evidenceList } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-surface border-2 border-border-hairline rounded-xl p-5 sm:p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary">
            My Submissions &amp; Status (अपलोड स्थिति)
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Check whether your uploaded photos were accepted or need another retake.
          </p>
        </div>

        <Link
          href="/supervisor/upload"
          className="px-4 py-2 rounded-lg bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors shadow-subtle flex items-center gap-1.5 self-start sm:self-center shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>New Upload (नया फोटो)</span>
        </Link>
      </div>

      <div className="space-y-4">
        {evidenceList.map((item) => {
          const isApproved = item.auditStatus === 'APPROVED';
          const isFlagged = item.auditStatus === 'FLAGGED' || item.riskLevel === 'CRITICAL';
          const isPending = item.auditStatus === 'PENDING';

          return (
            <div
              key={item.id}
              className={`bg-surface border-2 rounded-xl p-4 sm:p-5 shadow-subtle space-y-3 ${
                isFlagged ? 'border-risk-high/40 bg-risk-high/5' : 'border-border-hairline'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-hairline pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary">
                    #{item.id}
                  </span>
                  <span className="text-xs font-semibold text-saffron-deep dark:text-saffron">
                    {item.scheme}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isApproved
                      ? 'bg-india-green/15 text-india-green'
                      : isFlagged
                      ? 'bg-risk-high text-surface animate-pulse'
                      : 'bg-surface-sunken text-ink-secondary border'
                  }`}
                >
                  {isApproved
                    ? '✓ Accepted (स्वीकृत)'
                    : isFlagged
                    ? '⚠️ Needs Another Photo (दोबारा फोटो चाहिए)'
                    : '⏳ Under Review (जांच जारी)'}
                </span>
              </div>

              <div className="flex gap-4 items-start">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-24 sm:w-28 h-20 rounded-lg object-cover bg-ink-primary shrink-0 border border-border-hairline"
                />

                <div className="space-y-1.5 flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-ink-primary leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-ink-secondary flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-ink-muted" />
                    <span>{item.location.block}, {item.location.district}</span>
                  </p>

                  <span className="text-[10px] text-ink-muted block">
                    Uploaded: {formatDate(item.uploadedAt, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Actionable plain instruction if flagged */}
              {isFlagged && (
                <div className="p-3 bg-surface rounded-lg border-2 border-risk-high/30 space-y-1.5 text-xs">
                  <span className="font-bold text-risk-high block">
                    📋 Action Required from Reviewer (सुपरवाइजर निर्देश):
                  </span>
                  <p className="text-ink-primary text-xs leading-relaxed">
                    {item.detectedAnomalies.length > 0 && item.detectedAnomalies[0].type.includes('DUPLICATE')
                      ? 'यह फोटो पुरानी फोटो जैसी दिख रही है — कृपया आज कार्य स्थल पर जाकर ताज़ा लाइव फोटो दोबारा खींचें।'
                      : item.detectedAnomalies.length > 0 && item.detectedAnomalies[0].type.includes('LOCATION')
                      ? 'इस फोटो का स्थान कार्य स्थल से मेल नहीं खा रहा है — कृपया सही स्थल पर जाकर दोबारा फोटो खींचें।'
                      : 'कृपया कार्य स्थल से एक स्पष्ट और चौड़ा फोटो दोबारा अपलोड करें।'}
                  </p>

                  <Link
                    href={`/supervisor/upload?projectId=${item.projectId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-risk-high text-surface font-bold text-xs hover:opacity-90 transition-opacity mt-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Photo Now (दोबारा फोटो खींचें)</span>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

