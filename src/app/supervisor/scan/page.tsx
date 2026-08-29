'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  Camera,
  Fingerprint,
  ScanLine,
  Loader2,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

type CheckStatus = 'pending' | 'running' | 'ok' | 'warn';

interface ScanCheck {
  id: string;
  icon: React.ElementType;
  label: string;
  hindiLabel: string;
  okText: string;
  warnText: string;
  status: CheckStatus;
  detail?: string;
}

export default function SupervisorScanPage() {
  const { t } = useI18n();
  const { projects } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 'PRJ-PMGSY-MH-401');
  const [isScanning, setIsScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);

  const [checks, setChecks] = useState<ScanCheck[]>([
    {
      id: 'gps',
      icon: MapPin,
      label: 'Site Location Match',
      hindiLabel: 'स्थान मिलान',
      okText: 'GPS coordinates are within the sanctioned project boundary (42m from center).',
      warnText: 'Photo location is 1.4km outside the sanctioned project boundary.',
      status: 'pending',
    },
    {
      id: 'time',
      icon: Clock,
      label: 'Timestamp Consistency',
      hindiLabel: 'समय प्रमाण',
      okText: 'Photo was taken today at 14:15 IST during active daylight work hours.',
      warnText: 'Photo timestamp was modified or does not match server submission time.',
      status: 'pending',
    },
    {
      id: 'photo',
      icon: Camera,
      label: 'Image Originality & Duplicates',
      hindiLabel: 'फोटो मौलिकता',
      okText: 'No duplicate photos found in national public works repository.',
      warnText: 'High visual similarity detected with earlier road culvert submission PRJ-401-E1.',
      status: 'pending',
    },
    {
      id: 'metadata',
      icon: Fingerprint,
      label: 'Camera & EXIF Data',
      hindiLabel: 'डिवाइस फाइल जाँच',
      okText: 'Camera lens, device model (Samsung M32), and EXIF headers are authentic.',
      warnText: 'Photo metadata is stripped or edited using third-party software.',
      status: 'pending',
    },
  ]);

  const runScan = async () => {
    setIsScanning(true);
    setScanDone(false);
    setChecks((prev) => prev.map((c) => ({ ...c, status: 'pending', detail: undefined })));

    const steps = [
      { id: 'gps', status: 'ok' as CheckStatus, detail: 'Sanctioned geofence radius: 500m • Photo location: 18.5204° N, 73.8567° E (Within geofence by 458m)' },
      { id: 'time', status: 'ok' as CheckStatus, detail: 'Capture Time: 29 Aug 2026 14:15:32 IST • Sunlight illumination vector matches afternoon solar azimuth' },
      { id: 'photo', status: 'warn' as CheckStatus, detail: 'Warning: 78.4% visual perceptual match with archived road subgrade photo from June 2026. Reviewer may request retake.' },
      { id: 'metadata', status: 'ok' as CheckStatus, detail: 'Original camera RAW/JPEG headers intact • Hardware signature verified • No editing software detected' },
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setChecks((prev) =>
        prev.map((c) => (c.id === step.id ? { ...c, status: 'running' } : c))
      );
      await new Promise((r) => setTimeout(r, 700));
      setChecks((prev) =>
        prev.map((c) =>
          c.id === step.id ? { ...c, status: step.status, detail: step.detail } : c
        )
      );
    }

    setIsScanning(false);
    setScanDone(true);
  };

  const hasWarnings = checks.some((c) => c.status === 'warn');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="bg-surface border-2 border-border-hairline rounded-2xl p-6 shadow-subtle space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-india-green/10 text-india-green flex items-center justify-center font-bold">
            <ScanLine className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary">
              Pre-Submission Field Scan (जाँच टूल)
            </h1>
            <p className="text-xs text-ink-secondary">
              Scan your site photo and GPS before final upload to prevent reviewer rejection.
            </p>
          </div>
        </div>

        {/* Project Selector */}
        <div className="pt-2">
          <label className="text-xs font-bold text-ink-primary block mb-1">
            Select Assigned Project to Verify Against:
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={isScanning}
            className="w-full px-3.5 py-2.5 rounded-lg bg-surface-sunken border border-border-hairline text-xs font-semibold text-ink-primary focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} — {p.name} ({p.district})
              </option>
            ))}
          </select>
        </div>

        {/* Scan Trigger Button */}
        {!scanDone && (
          <button
            onClick={runScan}
            disabled={isScanning}
            className="w-full mt-3 py-3.5 rounded-xl bg-india-green text-surface font-bold text-sm shadow-subtle hover:bg-india-green/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Automated Site Checks... (जाँच जारी है)</span>
              </>
            ) : (
              <>
                <ScanLine className="w-4 h-4" />
                <span>Start Verification Scan / स्कैन शुरू करें</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Progressive Check Cards */}
      {(isScanning || scanDone) && (
        <div className="space-y-3 animate-page-enter">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Live Field Integrity Checks
            </span>
            <span className="text-xs font-mono text-ink-secondary">
              {checks.filter((c) => c.status === 'ok').length}/4 Passed
            </span>
          </div>

          {checks.map((check) => {
            const Icon = check.icon;
            const isOk = check.status === 'ok';
            const isWarn = check.status === 'warn';
            const isRun = check.status === 'running';
            const isPend = check.status === 'pending';

            return (
              <div
                key={check.id}
                className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                  isOk
                    ? 'bg-india-green/5 border-india-green/30'
                    : isWarn
                    ? 'bg-risk-medium/10 border-risk-medium/40'
                    : isRun
                    ? 'bg-surface-sunken border-saffron animate-pulse'
                    : 'bg-surface border-border-hairline opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isOk
                          ? 'bg-india-green/20 text-india-green'
                          : isWarn
                          ? 'bg-risk-medium/20 text-risk-medium'
                          : 'bg-surface-sunken text-ink-muted'
                      }`}
                    >
                      {isOk && <CheckCircle2 className="w-5 h-5" />}
                      {isWarn && <AlertTriangle className="w-5 h-5" />}
                      {isRun && <Loader2 className="w-5 h-5 animate-spin text-saffron-deep" />}
                      {isPend && <Icon className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="font-bold text-xs sm:text-sm text-ink-primary">
                        {check.label}{' '}
                        <span className="text-xs font-normal text-ink-muted">
                          ({check.hindiLabel})
                        </span>
                      </div>
                      <p className="text-xs text-ink-secondary mt-0.5">
                        {isOk && check.okText}
                        {isWarn && check.warnText}
                        {isRun && 'Inspecting sensor telemetry and digital signature...'}
                        {isPend && 'Waiting to check...'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      isOk
                        ? 'bg-india-green text-surface'
                        : isWarn
                        ? 'bg-risk-medium text-ink-primary'
                        : 'bg-surface-sunken text-ink-muted'
                    }`}
                  >
                    {isOk ? 'OK' : isWarn ? 'WARNING' : isRun ? 'CHECKING' : 'PENDING'}
                  </span>
                </div>

                {check.detail && (
                  <div className="p-2 bg-surface rounded text-[11px] font-mono text-ink-secondary border border-border-hairline">
                    {check.detail}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Final Action Advice Banner */}
      {scanDone && (
        <div
          className={`p-6 rounded-2xl border-2 space-y-4 text-center animate-page-enter ${
            hasWarnings
              ? 'bg-risk-medium/10 border-risk-medium/50'
              : 'bg-india-green/10 border-india-green/50'
          }`}
        >
          <div className="space-y-1">
            <h3
              className={`font-serif font-bold text-lg ${
                hasWarnings ? 'text-risk-medium' : 'text-india-green'
              }`}
            >
              {hasWarnings ? '⚠ Action Advice: Retake Recommended' : '✓ Evidence Clean & Ready'}
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary max-w-md mx-auto">
              {hasWarnings
                ? 'One check flagged a visual similarity warning. Taking a new photo at a slightly different angle from the project site is recommended.'
                : 'All 4 field integrity checks passed. You can safely proceed with submission.'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setScanDone(false);
                setChecks((prev) => prev.map((c) => ({ ...c, status: 'pending', detail: undefined })));
              }}
              className="px-4 py-2 rounded-lg border border-border-hairline bg-surface text-ink-secondary text-xs font-semibold hover:bg-surface-sunken flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Scan Another Photo</span>
            </button>

            <Link
              href={`/supervisor/upload?projectId=${selectedProjectId}`}
              className="px-6 py-2 rounded-lg bg-india-green text-surface text-xs font-bold hover:bg-india-green/90 shadow-subtle flex items-center gap-1.5"
            >
              <span>Continue to Final Upload</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
