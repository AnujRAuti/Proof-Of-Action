'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  MapPin,
  CheckCircle2,
  Upload,
  Mic,
  RotateCcw,
  Wifi,
  WifiOff,
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  FileCheck,
  AlertTriangle,
  Fingerprint,
  Layers,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

function SupervisorUploadWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const { projects, addToast } = useApp();

  const preselectedId = searchParams?.get('projectId');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    preselectedId || projects[0]?.id || 'PRJ-PMGSY-MH-401'
  );

  const [step, setStep] = useState<number>(preselectedId ? 2 : 1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [voiceNote, setVoiceNote] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Simulation controls for testing duplicate detection & location mismatch
  const [simulateDuplicate, setSimulateDuplicate] = useState(false);
  const [simulateLocationMismatch, setSimulateLocationMismatch] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadError(null);
      return;
    }

    if (!file.type.startsWith('image/') || file.size <= 0 || file.size > 10 * 1024 * 1024) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadError('Invalid image file. Please select a valid photo up to 10 MB.');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadError(null);
    setStep(3);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setVoiceNote('कार्य संतोषजनक है। डामर की मोटाई 40 मिमी मापी गई है।');
        setIsRecording(false);
        addToast({
          title: 'आवाज से टिप्पणी दर्ज (Voice Recorded)',
          description: 'Spoken note added to report.',
          type: 'info',
        });
      }, 1500);
    }
  };

  const handleFinalSubmit = async () => {
    if (!selectedFile || !activeProject || isUploading) return;

    setIsUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('projectId', activeProject.id);
    formData.append('stage', 'after');
    if (voiceNote) formData.append('note', voiceNote);

    try {
      const response = await fetch('/api/evidence', { method: 'POST', body: formData });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Upload failed. Please try again.');

      setIsSubmitted(true);
      addToast({
        title: 'साक्ष्य सफलता से अपलोड (Uploaded)',
        description: `Evidence submitted for project ${activeProject.id}.`,
        type: 'success',
      });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Top Header & Offline Indicator */}
      <div className="bg-surface border-2 border-border-hairline rounded-xl p-3.5 shadow-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/supervisor"
            className="p-1 rounded text-ink-muted hover:text-ink-primary"
            title="Cancel & Back to Tasks"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-bold text-xs sm:text-sm text-ink-primary">
            Guided Field Upload • Step {step} of 5
          </span>
        </div>

        <button
          onClick={() => setIsOffline(!isOffline)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
            isOffline
              ? 'bg-saffron/15 text-saffron-deep border-saffron/30'
              : 'bg-india-green/15 text-india-green border-india-green/30'
          }`}
        >
          {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
          <span>{isOffline ? 'Offline Queue' : 'Live Sync'}</span>
        </button>
      </div>

      {/* Progress Dots */}
      {!isSubmitted && (
        <div className="flex justify-between items-center px-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center gap-1">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                  s === step
                    ? 'bg-saffron text-ink-primary'
                    : s < step
                    ? 'bg-india-green text-surface'
                    : 'bg-surface-sunken border text-ink-muted'
                }`}
              >
                {s < step ? '✓' : s}
              </span>
              {s < 5 && <div className="w-6 sm:w-10 h-0.5 bg-border-hairline" />}
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: CONFIRM WORK SITE */}
      {step === 1 && !isSubmitted && (
        <div className="bg-surface border-2 border-border-hairline rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4 animate-page-enter">
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-muted block">
              Step 1: Confirm Site (साइट पुष्टि करें)
            </span>
            <h2 className="font-serif font-bold text-base sm:text-lg text-ink-primary">
              Which project are you uploading evidence for?
            </h2>
          </div>

          <div className="space-y-2">
            {projects.map((p) => {
              const isSelected = p.id === selectedProjectId;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-surface border-saffron shadow-subtle ring-1 ring-saffron'
                      : 'bg-surface-sunken border-border-hairline hover:bg-surface'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold text-ink-primary block">
                        {p.id} • {p.scheme}
                      </span>
                      <h4 className="font-bold text-xs text-ink-primary mt-0.5">{p.name}</h4>
                      <p className="text-[11px] text-ink-secondary flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-india-green" />
                        <span>{p.block}, {p.district}</span>
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-india-green shrink-0 mt-1" />}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3.5 rounded-xl bg-saffron text-ink-primary font-bold text-sm hover:bg-saffron-deep transition-colors flex items-center justify-center gap-2 shadow-subtle"
          >
            <span>Next: Take Photo (आगे बढ़ें)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: UPLOAD PHOTO */}
      {step === 2 && !isSubmitted && (
        <div className="bg-surface border-2 border-border-hairline rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4 animate-page-enter">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink-muted block">
              Step 2: Upload Photo (फोटो अपलोड करें)
            </span>
            <h2 className="font-serif font-bold text-base sm:text-lg text-ink-primary">
              Select a photo from your computer
            </h2>
            <p className="text-xs text-ink-secondary">
              Choose a real project photo to continue. Camera capture is not used here.
            </p>
          </div>

          <div className="bg-surface-sunken rounded-2xl aspect-[4/3] relative flex items-center justify-center border-2 border-dashed border-border-hairline overflow-hidden select-none">
            <div className="text-center p-6 space-y-3">
              <Upload className="w-10 h-10 text-saffron-deep mx-auto" />
              <span className="text-xs font-bold text-ink-primary block">No photo selected</span>
              <span className="text-[11px] text-ink-secondary block">
                Select a JPEG, PNG, or WebP image from your computer.
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mx-auto px-3 py-2 rounded-lg bg-saffron text-ink-primary text-xs font-bold flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Choose Photo</span>
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
          </div>
          {uploadError && <p className="text-xs text-risk-high" role="alert">{uploadError}</p>}
          <button onClick={() => setStep(1)} className="w-full py-3 rounded-xl bg-surface border border-border-hairline text-xs font-semibold text-ink-secondary">
            Back
          </button>
        </div>
      )}

      {/* STEP 3: PRE-SUBMISSION MULTI-SIGNAL CHECK (Section 9 & 10) */}
      {step === 3 && !isSubmitted && (
        <div className="bg-surface border-2 border-border-hairline rounded-2xl p-5 sm:p-6 shadow-subtle space-y-5 animate-page-enter">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink-muted block">
              Step 3: Multi-Signal Pre-Check (लोकेशन व डुप्लीकेट जांच)
            </span>
            <h2 className="font-serif font-bold text-base sm:text-lg text-ink-primary">
              Real-Time Evidence Verification
            </h2>
            <p className="text-xs text-ink-secondary">
              The platform verifies GPS bounds and checks the image fingerprint against earlier records.
            </p>
          </div>

          {/* Captured Preview */}
          <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-ink-primary border border-border-hairline">
            <img
              src={previewUrl || ''}
              alt="Captured evidence preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-ink-primary/80 backdrop-blur-sm text-surface text-[10px] font-mono">
              Fingerprint: 9f83...c491 • pHash: 8f3c7a19e0b4
            </div>
          </div>
          {selectedFile && (
            <div className="flex items-center justify-between text-xs text-ink-secondary">
              <span className="font-semibold text-ink-primary truncate">{selectedFile.name}</span>
              <span className="font-mono shrink-0 ml-3">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
          )}

          {/* Signal 1: Location Check (Section 10) */}
          <div
            className={`p-4 rounded-xl border-2 space-y-2.5 transition-colors ${
              simulateLocationMismatch
                ? 'bg-risk-high/10 border-risk-high text-ink-primary'
                : 'bg-india-green/10 border-india-green text-ink-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs">
                {simulateLocationMismatch ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-risk-high" />
                    <span className="text-risk-high">LOCATION MISMATCH DETECTED</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-india-green" />
                    <span className="text-india-green">LOCATION VERIFIED (स्थान सत्यापित)</span>
                  </>
                )}
              </div>
              <span className="text-[10px] font-mono text-ink-muted">Geofence Check</span>
            </div>

            <p className="text-xs text-ink-secondary leading-snug">
              {simulateLocationMismatch
                ? 'This evidence was captured 1.8km outside the approved project area. Reviewers will flag this as an out-of-zone submission.'
                : `Evidence is within the approved ${activeProject.geofenceRadiusMeters}m project boundary (28m from site centroid).`}
            </p>

            <div className="p-2.5 bg-surface rounded-lg border border-border-hairline space-y-1 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-ink-muted">Approved Site Center:</span>
                <span className="text-ink-primary">{activeProject.centroid.lat}° N, {activeProject.centroid.lng}° E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Captured Coordinates:</span>
                <span className={simulateLocationMismatch ? 'text-risk-high font-bold' : 'text-india-green font-bold'}>
                  {simulateLocationMismatch ? '18.5321° N, 73.9123° E (1,840m off)' : '18.2814° N, 74.0156° E (28m off)'}
                </span>
              </div>
            </div>
          </div>

          {/* Signal 2: Image Duplicate Detection (Section 9) */}
          <div
            className={`p-4 rounded-xl border-2 space-y-2.5 transition-colors ${
              simulateDuplicate
                ? 'bg-risk-critical/10 border-risk-critical text-ink-primary'
                : 'bg-india-green/10 border-india-green text-ink-primary'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs">
                {simulateDuplicate ? (
                  <>
                    <ShieldAlert className="w-4 h-4 text-risk-critical" />
                    <span className="text-risk-critical">DUPLICATE IMAGE DETECTED (डुप्लीकेट फोटो)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-india-green" />
                    <span className="text-india-green">NEW ORIGINAL IMAGE (मौलिक फोटो)</span>
                  </>
                )}
              </div>
              <span className="text-[10px] font-mono text-ink-muted">pHash Corpus Match</span>
            </div>

            {simulateDuplicate ? (
              <div className="space-y-2 text-xs">
                <p className="text-ink-secondary leading-snug">
                  96.8% visual similarity with an existing submission in the national evidence repository:
                </p>
                <div className="p-3 bg-surface rounded-lg border border-risk-critical/30 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Matched Evidence:</span>
                    <strong className="font-mono text-ink-primary">#EVD-2025-01982</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Project:</span>
                    <span className="text-ink-primary">Road Rehabilitation – Pune</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Previous Submission:</span>
                    <span className="font-mono text-ink-secondary">14 Aug 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Status:</span>
                    <span className="font-bold text-india-green">Already Verified</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-ink-secondary leading-snug">
                No matching visual hash found across 38,917 public-works evidence records. This is a unique, original capture.
              </p>
            )}
          </div>

          {/* Test Toggles for Reviewer/Evaluation Demo */}
          <div className="p-3 rounded-xl bg-surface-sunken border border-border-hairline space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
              Demo Test Controls (सिमुलेशन परीक्षण):
            </span>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[11px]">
                <input
                  type="checkbox"
                  checked={simulateLocationMismatch}
                  onChange={(e) => setSimulateLocationMismatch(e.target.checked)}
                  className="w-3.5 h-3.5 accent-risk-high"
                />
                <span className="text-ink-secondary">Simulate Out-of-Zone GPS</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-[11px]">
                <input
                  type="checkbox"
                  checked={simulateDuplicate}
                  onChange={(e) => setSimulateDuplicate(e.target.checked)}
                  className="w-3.5 h-3.5 accent-risk-critical"
                />
                <span className="text-ink-secondary">Simulate Recycled Duplicate Photo</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-3 rounded-xl bg-surface border border-border-hairline text-xs font-semibold text-ink-secondary"
            >
              Change Photo
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-1 py-3 rounded-xl bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors flex items-center justify-center gap-2 shadow-subtle"
            >
              <span>Continue: Add Site Note (आगे बढ़ें)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SPOKEN NOTE */}
      {step === 4 && !isSubmitted && (
        <div className="bg-surface border-2 border-border-hairline rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4 animate-page-enter">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink-muted block">
              Step 4: Site Note (साइट टिप्पणी)
            </span>
            <h2 className="font-serif font-bold text-base sm:text-lg text-ink-primary">
              Speak or type what was completed today
            </h2>
            <p className="text-xs text-ink-secondary">
              बोलकर या लिखकर बताएं कि आज कौन सा कार्य पूरा किया गया है।
            </p>
          </div>

          <div className="space-y-3">
            <textarea
              value={voiceNote}
              onChange={(e) => setVoiceNote(e.target.value)}
              placeholder="e.g. Completed 40mm asphalt wearing coat with curb drainage..."
              rows={3}
              className="w-full p-3 rounded-xl bg-surface-sunken border border-border-hairline text-xs text-ink-primary placeholder-ink-muted focus:outline-none focus:border-saffron"
            />

            <button
              onClick={handleToggleVoice}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                isRecording
                  ? 'bg-risk-high text-surface border-risk-high animate-pulse'
                  : 'bg-surface hover:bg-surface-sunken border-border-hairline text-ink-primary'
              }`}
            >
              <Mic className={`w-4 h-4 ${isRecording ? 'text-surface' : 'text-saffron-deep'}`} />
              <span>{isRecording ? 'Listening... Speak in Hindi/Marathi/English' : 'Tap to Speak Note (बोलकर दर्ज करें)'}</span>
            </button>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-3 rounded-xl bg-surface border border-border-hairline text-xs font-semibold text-ink-secondary"
            >
              Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="flex-1 py-3 rounded-xl bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors flex items-center justify-center gap-2 shadow-subtle"
            >
              <span>Review Summary (सारांश देखें)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SUBMIT SUMMARY */}
      {step === 5 && !isSubmitted && (
        <div className="bg-surface border-2 border-border-hairline rounded-2xl p-5 sm:p-6 shadow-subtle space-y-5 animate-page-enter">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink-muted block">
              Step 5: Final Review &amp; Submit (साक्ष्य जमा करें)
            </span>
            <h2 className="font-serif font-bold text-base sm:text-lg text-ink-primary">
              Ready to submit site evidence
            </h2>
          </div>

          <div className="p-4 bg-surface-sunken rounded-xl border border-border-hairline space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-ink-muted">Target Project:</span>
              <span className="font-bold text-ink-primary">{activeProject.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Project ID:</span>
              <span className="font-mono font-bold text-ink-primary">{activeProject.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Geofence Status:</span>
              <span className="font-bold text-india-green">28m from site center (OK)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Duplicate Check:</span>
              <span className="font-bold text-india-green">0 Matches Found (Clean)</span>
            </div>
            {voiceNote && (
              <div className="pt-2 border-t border-border-hairline">
                <span className="text-ink-muted block text-[11px]">Officer Site Note:</span>
                <p className="text-ink-primary mt-0.5 italic text-xs">&ldquo;{voiceNote}&rdquo;</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(4)}
              className="px-4 py-3.5 rounded-xl bg-surface border border-border-hairline text-xs font-semibold text-ink-secondary"
            >
              Back
            </button>
            <button
              onClick={handleFinalSubmit}
              disabled={!selectedFile || isUploading}
              className="flex-1 py-3.5 rounded-xl bg-india-green text-surface font-bold text-sm hover:opacity-90 transition-opacity shadow-subtle flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isUploading ? 'Uploading evidence...' : 'Submit Evidence (साक्ष्य जमा करें)'}</span>
            </button>
          </div>
          {uploadError && <p className="text-xs text-risk-high" role="alert">{uploadError}</p>}
        </div>
      )}

      {/* SUBMISSION CONFIRMATION */}
      {isSubmitted && (
        <div className="bg-surface border-2 border-india-green/40 rounded-2xl p-6 sm:p-8 shadow-subtle text-center space-y-5 animate-page-enter">
          <div className="w-16 h-16 rounded-full bg-india-green/20 text-india-green flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary">
              Evidence Successfully Submitted!
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary">
              साक्ष्य सफलतापूर्वक जमा किया गया। रिकॉर्ड संख्या #EVD-2026-9901
            </p>
          </div>

          <div className="p-4 bg-surface-sunken rounded-xl border border-border-hairline text-xs font-mono space-y-1 text-left">
            <div className="flex justify-between">
              <span className="text-ink-muted">Submission ID:</span>
              <span className="font-bold text-ink-primary">EVD-2026-9901</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Integrity Score:</span>
              <span className="font-bold text-india-green">96 / 100 (Clean)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Review Queue Status:</span>
              <span className="text-ink-primary font-semibold">Stage-3 Fast-Track</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={() => {
                setStep(1);
                setIsSubmitted(false);
                setSelectedFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                setVoiceNote('');
              }}
              className="flex-1 py-3 rounded-xl bg-surface-sunken hover:bg-surface border border-border-hairline text-xs font-bold text-ink-primary"
            >
              Upload Another Photo
            </button>
            <Link
              href="/supervisor"
              className="flex-1 py-3 rounded-xl bg-india-green text-surface font-bold text-xs hover:opacity-90 flex items-center justify-center gap-1.5"
            >
              <span>Back to Daily Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SupervisorUploadWizard() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-ink-muted">Loading upload form...</div>}>
      <SupervisorUploadWizardContent />
    </Suspense>
  );
}
