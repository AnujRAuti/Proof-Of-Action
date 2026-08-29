'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  Camera,
  MapPin,
  CheckCircle2,
  Upload,
  Mic,
  MicOff,
  RotateCcw,
  Wifi,
  WifiOff,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Layers,
  FileCheck,
  ChevronRight,
} from 'lucide-react';

export default function FieldOfficerSimplePage() {
  const { t, formatDate } = useI18n();
  const { evidenceList, projects, addToast } = useApp();

  // 3-Step Wizard state: 1 = Choose Task, 2 = Click Photo, 3 = Confirm & Submit
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(evidenceList[0]?.id);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceNoteText, setVoiceNoteText] = useState<string>('');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeEvidence = evidenceList.find((e) => e.id === selectedCaseId) || evidenceList[0];
  const activeProject = projects.find((p) => p.id === activeEvidence.projectId) || projects[0];

  // Simulated instant photo capture
  const handleSnapPhoto = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setCapturedImage(activeEvidence.imageUrl);
      setIsCapturing(false);
      setCurrentStep(3);
      addToast({
        title: 'फोटो खींची गई (Photo Captured)',
        description: 'GPS लोकेशन और समय फोटो के साथ सुरक्षित जोड़ दिया गया है।',
        type: 'success',
      });
    }, 400);
  };

  // Real File Upload handler (from user's phone or computer)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        setCurrentStep(3);
        addToast({
          title: 'फोटो अपलोड हो गई',
          description: 'स्थान और समय स्वतः सत्यापित किया गया।',
          type: 'success',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleVoice = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
    } else {
      setIsRecordingVoice(true);
      setTimeout(() => {
        setVoiceNoteText(
          'स्थल पर 4.2 किमी सड़क का डामरीकरण कार्य पूर्ण हो चुका है। किनारे की सफेद पट्टियां खींच दी गई हैं।'
        );
        setIsRecordingVoice(false);
        addToast({
          title: 'आवाज से टिप्पणी दर्ज (Voice Note Recorded)',
          description: 'आवाज को टेक्स्ट में बदल दिया गया है।',
          type: 'info',
        });
      }, 1500);
    }
  };

  const handleFinalSubmit = () => {
    setIsSuccess(true);
    addToast({
      title: isOffline ? 'ऑफलाइन सुरक्षित (Saved Offline)' : 'साक्ष्य सफलता से भेजा गया (Uploaded)',
      description: isOffline
        ? 'फोटो फोन में सुरक्षित है। नेटवर्क मिलने पर खुद पोर्टल पर अपलोड हो जाएगी।'
        : `परियोजना #${activeProject.id} के लिए साक्ष्य रिकॉर्ड हो गया है।`,
      type: 'success',
    });
  };

  const handleReset = () => {
    setCapturedImage(null);
    setVoiceNoteText('');
    setIsSuccess(false);
    setCurrentStep(1);
  };

  return (
    <div className="p-3 sm:p-6 max-w-xl mx-auto space-y-4">
      {/* Top Friendly Header Bar */}
      <div className="bg-surface border border-border-hairline rounded-lg p-3 shadow-subtle flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-saffron/20 flex items-center justify-center text-saffron-deep font-bold">
            📱
          </div>
          <div>
            <h1 className="font-bold text-xs sm:text-sm text-ink-primary">
              फील्ड साथी (Field Companion)
            </h1>
            <span className="text-[10px] text-ink-secondary">
              सरल फोटो अपलोड प्रणाली • Government of India
            </span>
          </div>
        </div>

        {/* Offline / Online Network Indicator */}
        <button
          onClick={() => {
            setIsOffline(!isOffline);
            addToast({
              title: !isOffline ? 'ऑफलाइन मोड चालू (Offline Mode)' : 'इंटरनेट कनेक्टेड (Online)',
              description: !isOffline
                ? 'बिना इंटरनेट के भी फोटो खींची जा सकती है।'
                : 'पोर्टल से लाइव कनेक्ट हो गया है।',
              type: 'info',
            });
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
            isOffline
              ? 'bg-saffron/15 text-saffron-deep border-saffron/30'
              : 'bg-india-green/15 text-india-green border-india-green/30'
          }`}
          title="Click to toggle simulated network condition"
        >
          {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
          <span>{isOffline ? 'ऑफलाइन (Offline)' : 'इंटरनेट चालू (Online)'}</span>
        </button>
      </div>

      {/* 3-Step Wizard Tracker (Visual, simple numbers) */}
      {!isSuccess && (
        <div className="bg-surface border border-border-hairline rounded-lg p-3 shadow-subtle flex items-center justify-between text-xs">
          {/* Step 1 */}
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-1.5 font-bold ${
              currentStep === 1
                ? 'text-saffron-deep dark:text-saffron'
                : currentStep > 1
                ? 'text-india-green'
                : 'text-ink-muted'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs ${
                currentStep === 1
                  ? 'bg-saffron text-ink-primary'
                  : currentStep > 1
                  ? 'bg-india-green text-surface'
                  : 'bg-surface-sunken text-ink-muted border'
              }`}
            >
              {currentStep > 1 ? '✓' : '1'}
            </span>
            <span className="hidden sm:inline">1. कार्य चुनें (Select Site)</span>
          </button>

          <span className="text-ink-muted text-xs">→</span>

          {/* Step 2 */}
          <button
            onClick={() => {
              if (selectedCaseId) setCurrentStep(2);
            }}
            className={`flex items-center gap-1.5 font-bold ${
              currentStep === 2
                ? 'text-saffron-deep dark:text-saffron'
                : currentStep > 2
                ? 'text-india-green'
                : 'text-ink-muted'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs ${
                currentStep === 2
                  ? 'bg-saffron text-ink-primary'
                  : currentStep > 2
                  ? 'bg-india-green text-surface'
                  : 'bg-surface-sunken text-ink-muted border'
              }`}
            >
              {currentStep > 2 ? '✓' : '2'}
            </span>
            <span className="hidden sm:inline">2. फोटो खींचें (Photo)</span>
          </button>

          <span className="text-ink-muted text-xs">→</span>

          {/* Step 3 */}
          <button
            onClick={() => {
              if (capturedImage) setCurrentStep(3);
            }}
            className={`flex items-center gap-1.5 font-bold ${
              currentStep === 3 ? 'text-saffron-deep dark:text-saffron' : 'text-ink-muted'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs ${
                currentStep === 3
                  ? 'bg-saffron text-ink-primary'
                  : 'bg-surface-sunken text-ink-muted border'
              }`}
            >
              3
            </span>
            <span className="hidden sm:inline">3. भेजें (Submit)</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: CHOOSE MY ASSIGNED TASK (कार्य चुनें)                             */}
      {/* ========================================================================= */}
      {currentStep === 1 && !isSuccess && (
        <div className="space-y-3 animate-page-enter">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-ink-primary">
              1. आपके कार्य एवं साइट (Select Assigned Work Site)
            </h2>
            <span className="text-[11px] text-ink-muted">कुल 3 कार्य उपलब्ध</span>
          </div>

          <div className="space-y-2.5">
            {evidenceList.slice(0, 3).map((item) => {
              const isSelected = item.id === selectedCaseId;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedCaseId(item.id)}
                  className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-surface border-saffron shadow-subtle ring-1 ring-saffron'
                      : 'bg-surface border-border-hairline hover:bg-surface-sunken/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-surface-sunken font-mono text-[11px] font-bold text-ink-primary">
                          #{item.id}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-navy/10 text-navy dark:text-[#7FA8D9]">
                          {item.scheme}
                        </span>
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm text-ink-primary leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-ink-secondary flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-india-green" />
                        <span>{item.location.district}, {item.location.state}</span>
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-india-green/10 text-india-green text-[10px] font-bold">
                        <Check className="w-3 h-3" /> साइट पर मौजूद (22m)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Big Next Button */}
          <button
            onClick={() => setCurrentStep(2)}
            className="w-full py-3.5 rounded-lg bg-saffron text-ink-primary font-bold text-sm shadow-subtle hover:bg-saffron-deep transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <span>आगे बढ़ें • फोटो खींचें (Next: Click Photo)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: POINT CAMERA & SNAP PHOTO (फोटो खींचें)                          */}
      {/* ========================================================================= */}
      {currentStep === 2 && !isSuccess && (
        <div className="space-y-3 animate-page-enter">
          {/* Site reminder banner */}
          <div className="p-2.5 bg-surface-sunken rounded border border-border-hairline flex items-center justify-between text-xs">
            <div className="truncate">
              <span className="text-ink-muted text-[10px] block">चुना हुआ कार्य (Selected Work):</span>
              <span className="font-bold text-ink-primary truncate block">{activeEvidence.title}</span>
            </div>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs text-saffron-deep font-semibold underline shrink-0 ml-2"
            >
              बदलें (Change)
            </button>
          </div>

          {/* High-Contrast Live Camera Viewfinder */}
          <div className="bg-ink-primary rounded-xl overflow-hidden relative aspect-[4/3] flex flex-col items-center justify-center text-surface shadow-dropdown select-none border-2 border-border-hairline">
            {/* Real-time GPS Stamp Overlay on screen */}
            <div className="absolute top-2 inset-x-2 flex items-center justify-between text-[11px] font-mono bg-ink-primary/80 backdrop-blur-xs px-3 py-1 rounded text-surface">
              <span className="flex items-center gap-1 text-india-green font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>GPS लॉक: {activeEvidence.location.lat.toFixed(4)}° N, {activeEvidence.location.lng.toFixed(4)}° E</span>
              </span>
              <span className="text-saffron font-semibold">त्रुटि: ±3m</span>
            </div>

            {/* Target Alignment Crosshair / Framing Box */}
            <div className="w-48 h-36 border-2 border-dashed border-surface/50 rounded-lg flex flex-col items-center justify-center p-2 text-center">
              <Camera className="w-8 h-8 text-surface/80 mb-1" />
              <span className="text-[11px] text-surface/90 font-medium leading-tight">
                सड़क / निर्माण कार्य को इस फ्रेम के अंदर रखें
              </span>
            </div>

            {/* Bottom Shutter & Upload Buttons */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
              {/* Gallery / File Picker */}
              <label
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-lg bg-surface/20 hover:bg-surface/30 backdrop-blur-xs text-surface text-xs font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>गैलरी (Gallery)</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Big Shutter Button */}
              <button
                onClick={handleSnapPhoto}
                disabled={isCapturing}
                className="w-14 h-14 rounded-full bg-saffron text-ink-primary border-4 border-surface flex items-center justify-center shadow-dropdown hover:scale-105 active:scale-95 transition-transform"
                title="Click photo"
              >
                <Camera className="w-6 h-6" />
              </button>

              <button
                onClick={() => setCurrentStep(1)}
                className="px-3 py-2 rounded-lg bg-surface/20 hover:bg-surface/30 backdrop-blur-xs text-surface text-xs font-semibold flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>पीछे (Back)</span>
              </button>
            </div>
          </div>

          <p className="text-center text-[11px] text-ink-muted">
            💡 टिप: कैमरा सीधा रखें ताकि सड़क या ढांचा साफ दिखाई दे।
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: PREVIEW & ONE-TAP SUBMIT (समीक्षा और सबमिट)                         */}
      {/* ========================================================================= */}
      {currentStep === 3 && !isSuccess && (
        <div className="space-y-4 animate-page-enter">
          {/* Photo Preview Card with Automatic Government Watermark */}
          <div className="bg-surface border border-border-hairline rounded-lg overflow-hidden shadow-subtle space-y-2">
            <div className="relative aspect-[4/3] bg-ink-primary">
              <img
                src={capturedImage || activeEvidence.imageUrl}
                alt="Captured Proof"
                className="w-full h-full object-cover"
              />

              {/* Automatic Digital Watermark on the bottom of the photo */}
              <div className="absolute bottom-0 inset-x-0 bg-ink-primary/85 backdrop-blur-xs p-2 text-surface font-mono text-[10px] space-y-0.5">
                <div className="flex justify-between font-bold text-saffron">
                  <span>{activeProject.scheme}</span>
                  <span>{formatDate(new Date(), { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between text-surface/90">
                  <span>📍 {activeEvidence.location.lat.toFixed(4)}° N, {activeEvidence.location.lng.toFixed(4)}° E</span>
                  <span>{activeEvidence.location.district}</span>
                </div>
              </div>

              {/* Retake Button */}
              <button
                onClick={() => setCurrentStep(2)}
                className="absolute top-2 right-2 px-2.5 py-1 rounded bg-ink-primary/80 text-surface text-xs font-semibold border border-surface/30 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>दोबारा खींचें (Retake)</span>
              </button>
            </div>

            {/* Optional Voice Note / Hindi Text Input */}
            <div className="p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-ink-primary">
                  टिप्पणी / विवरण (Optional Voice Note):
                </label>

                {/* Big Mic button for spoken notes */}
                <button
                  onClick={handleToggleVoice}
                  type="button"
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded font-bold transition-colors ${
                    isRecordingVoice
                      ? 'bg-risk-critical text-surface animate-pulse'
                      : 'bg-saffron/20 text-saffron-deep hover:bg-saffron/30'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isRecordingVoice ? 'सुन रहे हैं... (Listening)' : 'बोलकर लिखें (Voice)'}</span>
                </button>
              </div>

              <textarea
                rows={2}
                value={voiceNoteText}
                onChange={(e) => setVoiceNoteText(e.target.value)}
                placeholder="यहाँ कुछ भी लिखें या ऊपर माइक बटन दबाकर बोलें (e.g. कार्य संतोषजनक पाया गया)..."
                className="w-full px-3 py-2 rounded bg-surface-sunken border border-border-hairline text-ink-primary text-xs focus:outline-none focus:border-saffron"
              />
            </div>
          </div>

          {/* Big Green 1-Tap Submit Button */}
          <button
            onClick={handleFinalSubmit}
            className="w-full py-4 rounded-xl bg-india-green text-surface font-bold text-base shadow-dropdown hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>
              {isOffline
                ? 'फोन में सुरक्षित करें (Save to Offline Queue)'
                : 'साक्ष्य अपलोड करें (Submit Evidence Now)'}
            </span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUCCESS CONFIRMATION RECEIPT (सफलतापूर्वक दर्ज)                           */}
      {/* ========================================================================= */}
      {isSuccess && (
        <div className="bg-surface border-2 border-india-green/40 rounded-xl p-6 shadow-dropdown text-center space-y-4 animate-page-enter">
          <div className="w-16 h-16 rounded-full bg-india-green/15 text-india-green flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-ink-primary">
              फोटो सफलता से दर्ज हो गई!
            </h3>
            <p className="text-xs text-ink-secondary">
              {isOffline
                ? 'यह फोटो आपके फोन में सुरक्षित है। इंटरनेट मिलते ही अपने आप पोर्टल पर भेज दी जाएगी।'
                : 'साक्ष्य पोर्टल पर पहुंच गया है और सत्यापन के लिए दर्ज हो चुका है।'}
            </p>
          </div>

          {/* Printable / Viewable Receipt Slip */}
          <div className="p-3.5 bg-surface-sunken rounded-lg border border-border-hairline text-left text-xs space-y-2 font-mono">
            <div className="flex justify-between border-b border-border-hairline pb-1.5">
              <span className="text-ink-muted">रसीद सं (Receipt #):</span>
              <span className="font-bold text-ink-primary">EIIL-{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between border-b border-border-hairline pb-1.5">
              <span className="text-ink-muted">कार्य (Work):</span>
              <span className="font-semibold text-ink-primary truncate max-w-[180px]">{activeEvidence.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">समय एवं स्थान:</span>
              <span className="text-ink-primary">{formatDate(new Date(), { hour: '2-digit', minute: '2-digit' })} • {activeEvidence.location.district}</span>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 py-3 rounded-lg bg-ink-primary text-surface font-bold text-xs hover:opacity-90"
            >
              अगला कार्य करें (Next Work Site)
            </button>
            <Link
              href="/"
              className="px-4 py-3 rounded-lg bg-surface border border-border-hairline text-ink-primary font-semibold text-xs hover:bg-surface-sunken flex items-center justify-center"
            >
              मुख्य पृष्ठ (Home)
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
