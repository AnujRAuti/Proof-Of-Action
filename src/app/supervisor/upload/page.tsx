'use client';

import React, { useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  Camera,
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
} from 'lucide-react';

function SupervisorUploadWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProjectId = searchParams?.get('projectId') || undefined;

  const { t, formatDate } = useI18n();
  const { projects, addToast } = useApp();

  const [step, setStep] = useState<number>(1); // 1 = Confirm Site, 2 = Photo/Video, 3 = Confirm Location, 4 = Spoken Note, 5 = Submit
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || projects[0]?.id);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleSnap = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setCapturedPhoto(
        'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80'
      );
      setIsCapturing(false);
      setStep(3);
    }, 450);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedPhoto(event.target?.result as string);
        setStep(3);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleFinalSubmit = () => {
    setIsSubmitted(true);
    addToast({
      title: isOffline ? 'ऑफलाइन सुरक्षित (Saved Offline)' : 'साक्ष्य सफलता से अपलोड (Uploaded)',
      description: isOffline
        ? 'Report saved in device queue. Will upload automatically when online.'
        : `Evidence submitted for project ${activeProject.id}.`,
      type: 'success',
    });
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
        <div className="bg-surface border-2 border-border-hairline rounded-xl p-5 shadow-subtle space-y-4 animate-page-enter">
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
                  className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
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
            className="w-full py-3.5 rounded-lg bg-saffron text-ink-primary font-bold text-sm hover:bg-saffron-deep transition-colors flex items-center justify-center gap-2 shadow-subtle"
          >
            <span>Next: Take Photo (आगे बढ़ें)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: CAPTURE PHOTO */}
      {step === 2 && !isSubmitted && (
        <div className="bg-surface border-2 border-border-hairline rounded-xl p-5 shadow-subtle space-y-4 animate-page-enter">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink-muted block">
              Step 2: Point &amp; Snap (फोटो खींचें)
            </span>
            <h2 className="font-serif font-bold text-base sm:text-lg text-ink-primary">
              Stand where you can see the whole work area
            </h2>
            <p className="text-xs text-ink-secondary">
              कैमरा ऐसे रखें कि पूरी सड़क या जल आपूर्ति का ढांचा स्पष्ट दिखाई दे।
            </p>
          </div>

          <div className="bg-ink-primary rounded-xl aspect-[4/3] relative flex items-center justify-center text-surface border-2 border-border-hairline overflow-hidden select-none">
            <div className="text-center p-6 space-y-2">
              <Camera className="w-10 h-10 text-surface/80 mx-auto" />
              <span className="text-xs font-bold block">Live Camera Shutter</span>
              <span className="text-[11px] text-surface/70 block">
                Tap the big yellow button below to snap photo
              </span>
            </div>

            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-lg bg-surface/20 text-surface text-xs font-bold flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Gallery</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                onClick={handleSnap}
                disabled={isCapturing}
                className="w-14 h-14 rounded-full bg-saffron text-ink-primary border-4 border-surface flex items-center justify-center shadow-dropdown hover:scale-105 transition-transform"
              >
                <Camera className="w-6 h-6" />
              </button>

              <button
                onClick={() => setStep(1)}
                className="px-3 py-2 rounded-lg bg-surface/20 text-surface text-xs font-semibold"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIRM GPS LOCATION */}
      {step === 3 && !isSubmitted && (
        <div className="bg-surface border-2 border-border-hairline rounded-xl p-5 shadow-subtle space-y-4 animate-page-enter">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink-muted block">
              Step 3: Location Lock (लोकेशन जांचें)
            </span>
            <h2 className="font-serif font-bold text-base sm:text-lg text-ink-primary">
              Location Confirmed ✓ (स्थान सत्यापित)
            </h2>
          </div>

          <div className="p-4 bg-india-green/10 border border-india-green/30 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-india-green font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>You are at the verified work site (28m from center)</span>
            </div>

            <div className="p-3 bg-surface rounded-lg border border-border-hairline space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-ink-muted">District &amp; Block:</span>
                <span className="text-ink-primary font-bold">{activeProject.block}, {activeProject.district}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Accuracy:</span>
                <span className="text-india-green font-bold">±3.5 metres (GPS Locked)</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-3 rounded-lg bg-surface border border-border-hairline text-xs font-semibold text-ink-secondary"
            >
              Retake Photo
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-1 py-3 rounded-lg bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors flex items-center justify-center gap-2"
            >
              <span>Confirm Location (स्थान सही है)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: OPTIONAL VOICE NOTE */}
      {step === 4 && !isSubmitted && (
        <div className="bg-surface border-2 border-border-hairline rounded-xl p-5 shadow-subtle space-y-4 animate-page-enter">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink-muted block">
              Step 4: Observation Note (टिप्पणी)
            </span>
            <h2 className="font-serif font-bold text-base sm:text-lg text-ink-primary">
              Add a quick note or speak into the mic
            </h2>
          </div>

          <div className="space-y-2">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  isRecording
                    ? 'bg-risk-critical text-surface animate-pulse'
                    : 'bg-saffron/20 text-saffron-deep'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRecording ? 'सुन रहे हैं... (Listening)' : 'बोलकर लिखें (Voice Note)'}</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={voiceNote}
              onChange={(e) => setVoiceNote(e.target.value)}
              placeholder="e.g. कार्य संतोषजनक है, डामरीकरण पूर्ण हुआ..."
              className="w-full px-3 py-2 rounded-lg bg-surface-sunken border border-border-hairline text-xs text-ink-primary focus:outline-none focus:border-saffron"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-3 rounded-lg bg-surface border border-border-hairline text-xs font-semibold text-ink-secondary"
            >
              Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="flex-1 py-3 rounded-lg bg-saffron text-ink-primary font-bold text-xs hover:bg-saffron-deep transition-colors flex items-center justify-center gap-2"
            >
              <span>Next: Review &amp; Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & FINAL SUBMIT */}
      {step === 5 && !isSubmitted && (
        <div className="bg-surface border-2 border-border-hairline rounded-xl p-5 shadow-subtle space-y-4 animate-page-enter">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink-muted block">
              Step 5: Review &amp; Submit (अंतिम समीक्षा)
            </span>
            <h2 className="font-serif font-bold text-base sm:text-lg text-ink-primary">
              Ready to submit site evidence
            </h2>
          </div>

          {/* Photo Summary */}
          <div className="aspect-[16/10] bg-ink-primary rounded-lg overflow-hidden relative border border-border-hairline">
            <img src={capturedPhoto || ''} alt="Evidence Preview" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-ink-primary/80 backdrop-blur-xs p-2 text-surface text-[10px] font-mono flex justify-between">
              <span>📍 {activeProject.block}, {activeProject.district}</span>
              <span>{formatDate(new Date(), { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {voiceNote && (
            <div className="p-3 bg-surface-sunken rounded-lg border border-border-hairline text-xs">
              <span className="text-ink-muted block text-[10px]">Supervisor Note:</span>
              <p className="text-ink-primary italic mt-0.5">&ldquo;{voiceNote}&rdquo;</p>
            </div>
          )}

          <button
            onClick={handleFinalSubmit}
            className="w-full py-4 rounded-xl bg-india-green text-surface font-bold text-base shadow-dropdown hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>
              {isOffline
                ? 'Save to Offline Queue (फोन में सुरक्षित करें)'
                : 'Submit Evidence Now (साक्ष्य भेजें)'}
            </span>
          </button>
        </div>
      )}

      {/* SUBMISSION CONFIRMATION */}
      {isSubmitted && (
        <div className="bg-surface border-2 border-india-green/40 rounded-xl p-6 shadow-dropdown text-center space-y-4 animate-page-enter">
          <div className="w-16 h-16 rounded-full bg-india-green/15 text-india-green flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-ink-primary">
              साक्ष्य सफलतापूर्वक दर्ज हुआ! (Upload Successful)
            </h3>
            <p className="text-xs text-ink-secondary">
              {isOffline
                ? 'फोटो फोन में सुरक्षित है और नेटवर्क चालू होते ही स्वतः अपलोड हो जाएगी।'
                : 'Evidence has been transmitted to the Reviewer Hub with verified GPS location.'}
            </p>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                setCapturedPhoto(null);
                setVoiceNote('');
                setIsSubmitted(false);
                setStep(1);
              }}
              className="flex-1 py-3 rounded-lg bg-ink-primary text-surface font-bold text-xs hover:opacity-90"
            >
              Upload Next Site (अगला कार्य)
            </button>
            <Link
              href="/supervisor/uploads"
              className="px-4 py-3 rounded-lg bg-surface border border-border-hairline text-ink-primary font-semibold text-xs hover:bg-surface-sunken flex items-center justify-center"
            >
              My Uploads (स्थिति)
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SupervisorUploadWizardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-ink-muted">Loading field upload...</div>}>
      <SupervisorUploadWizardContent />
    </Suspense>
  );
}

