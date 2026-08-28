'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Camera,
  Mic,
  MicOff,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Share2,
} from 'lucide-react';

export default function CitizenProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { t, formatDate } = useI18n();
  const { projects, evidenceList, fileComplaint, addToast } = useApp();

  const project = projects.find((p) => p.id === resolvedParams.id) || projects[0];
  if (!project) return notFound();

  // Feedback states
  const [feedbackVote, setFeedbackVote] = useState<'UP' | 'DOWN' | null>(null);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [grievanceCategory, setGrievanceCategory] = useState('Construction Quality');
  const [grievanceText, setGrievanceText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const milestones = [
    { title: 'Started', titleHi: 'कार्य शुरू', done: true, desc: 'Site survey and earthwork foundation' },
    { title: 'Halfway', titleHi: 'आधा कार्य पूर्ण', done: true, desc: 'Base material and drainage construction' },
    { title: 'Nearing Completion', titleHi: 'अंतिम चरण', done: project.status === 'COMPLETED', desc: 'Final asphalt wearing surface' },
    { title: 'Completed', titleHi: 'कार्य पूर्ण', done: project.status === 'COMPLETED', desc: 'Opened for public transit' },
  ];

  const handleQuickVote = (vote: 'UP' | 'DOWN') => {
    setFeedbackVote(vote);
    addToast({
      title: vote === 'UP' ? 'धन्यवाद! (Feedback Recorded)' : 'प्रतिक्रिया दर्ज हुई (Feedback Noted)',
      description: vote === 'UP' ? 'You confirmed this work looks right.' : 'You indicated concerns. You can file a formal report below.',
      type: vote === 'UP' ? 'success' : 'warning',
    });
    if (vote === 'DOWN') {
      setShowGrievanceModal(true);
    }
  };

  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setGrievanceText('सड़क के किनारे की नाली अभी भी मलबे से बंद है, कृपया इसे साफ करवाएं।');
        setIsRecording(false);
        addToast({
          title: 'आवाज से शिकायत दर्ज हुई (Voice Transcribed)',
          description: 'Spoken note converted to text.',
          type: 'info',
        });
      }, 1500);
    }
  };

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceText.trim()) return;

    const newCmp = fileComplaint({
      projectId: project.id,
      projectName: project.name,
      category: grievanceCategory,
      description: grievanceText,
      filedBy: 'Resident of ' + project.district,
      isVerifiedCitizen: true,
    });

    setShowGrievanceModal(false);
    router.push('/citizen/complaints');
  };

  return (
    <div className="space-y-6">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/citizen"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-secondary hover:text-ink-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects (वापस जाएं)</span>
        </Link>
      </div>

      {/* Project Overview Card */}
      <div className="bg-surface border border-border-hairline rounded-xl p-5 sm:p-6 shadow-subtle space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-saffron/15 text-saffron-deep font-bold text-xs">
            {project.scheme}
          </span>
          <span className="text-xs text-ink-muted">
            📍 {project.block}, {project.district}, {project.state}
          </span>
        </div>

        <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary leading-tight">
          {project.name}
        </h1>

        <div className="p-3 bg-surface-sunken rounded-lg border border-border-hairline flex flex-wrap justify-between gap-3 text-xs">
          <div>
            <span className="text-ink-muted block text-[10px]">Government Sanction:</span>
            <span className="font-bold text-ink-primary">₹{(project.budgetInr / 10000000).toFixed(2)} Crore</span>
          </div>
          <div>
            <span className="text-ink-muted block text-[10px]">Contractor:</span>
            <span className="font-medium text-ink-primary">{project.contractor}</span>
          </div>
          <div>
            <span className="text-ink-muted block text-[10px]">Target Date:</span>
            <span className="font-medium text-ink-primary">{project.endDate}</span>
          </div>
        </div>
      </div>

      {/* Plain-Language Milestone Progress Bar (Section 4.2) */}
      <div className="bg-surface border border-border-hairline rounded-xl p-5 sm:p-6 shadow-subtle space-y-4">
        <h2 className="font-serif font-bold text-base text-ink-primary">
          Project Progress Timeline (कार्य की प्रगति)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {milestones.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg border text-xs space-y-1 transition-all ${
                m.done
                  ? 'bg-india-green/10 border-india-green/30 text-ink-primary'
                  : 'bg-surface-sunken border-border-hairline text-ink-muted'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] ${
                    m.done ? 'bg-india-green text-surface' : 'bg-surface border'
                  }`}
                >
                  {m.done ? '✓' : i + 1}
                </span>
                <span>{m.title}</span>
              </div>
              <span className="text-[10px] text-ink-secondary block">{m.titleHi}</span>
              <p className="text-[10px] text-ink-muted leading-tight pt-1">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Field Photos Gallery (Before & After — NO Technical Jargon) */}
      <div className="bg-surface border border-border-hairline rounded-xl p-5 sm:p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-base text-ink-primary">
            Photos from the Work Site (स्थल की तस्वीरें)
          </h2>
          <span className="text-xs text-ink-muted">Verified Field Records</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Before Photo */}
          <div className="space-y-1.5">
            <div className="aspect-[4/3] bg-ink-primary rounded-lg overflow-hidden relative border border-border-hairline">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
                alt="Before Construction"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-ink-primary/80 text-surface text-xs font-bold font-mono">
                BEFORE (कार्य शुरू होने से पहले)
              </div>
            </div>
            <span className="text-xs text-ink-secondary block">
              Pre-repair condition survey photograph
            </span>
          </div>

          {/* After / Current Photo */}
          <div className="space-y-1.5">
            <div className="aspect-[4/3] bg-ink-primary rounded-lg overflow-hidden relative border border-border-hairline">
              <img
                src="https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80"
                alt="Current Construction State"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-india-green text-surface text-xs font-bold font-mono">
                RECENT WORK (हालिया स्थिति)
              </div>
            </div>
            <span className="text-xs text-ink-secondary block">
              Completed bituminous road surface with line marking
            </span>
          </div>
        </div>
      </div>

      {/* "Does this look right to you?" Citizen Feedback Card */}
      <div className="bg-surface border-2 border-saffron/40 rounded-xl p-5 sm:p-6 shadow-dropdown space-y-4">
        <div className="space-y-1">
          <h2 className="font-serif font-bold text-lg text-ink-primary">
            Does this look right to you? (क्या यह कार्य सही लग रहा है?)
          </h2>
          <p className="text-xs text-ink-secondary">
            Your feedback helps keep local contractors accountable. Let us know if the road or water facility is functioning well in your area.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleQuickVote('UP')}
            className={`flex-1 py-3 rounded-lg border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              feedbackVote === 'UP'
                ? 'bg-india-green text-surface border-india-green'
                : 'bg-surface border-india-green/40 text-india-green hover:bg-india-green/10'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Yes, looks good! (हाँ, कार्य सही है)</span>
          </button>

          <button
            onClick={() => handleQuickVote('DOWN')}
            className={`flex-1 py-3 rounded-lg border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              feedbackVote === 'DOWN'
                ? 'bg-risk-high text-surface border-risk-high'
                : 'bg-surface border-risk-high/40 text-risk-high hover:bg-risk-high/10'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>No, something is wrong (शिकायत है)</span>
          </button>
        </div>
      </div>

      {/* Formal Grievance Redressal Modal */}
      {showGrievanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/50 backdrop-blur-sm animate-page-enter">
          <div className="w-full max-w-lg bg-surface border border-border-hairline rounded-xl shadow-dropdown overflow-hidden">
            <form onSubmit={handleSubmitGrievance}>
              <div className="px-5 py-4 border-b border-border-hairline bg-surface-sunken">
                <h3 className="font-serif font-bold text-base text-ink-primary">
                  Report a Concern (शिकायत दर्ज करें)
                </h3>
                <p className="text-xs text-ink-secondary mt-0.5">
                  Regarding: {project.name}
                </p>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-ink-primary block mb-1">
                    What is the issue? (समस्या का प्रकार):
                  </label>
                  <select
                    value={grievanceCategory}
                    onChange={(e) => setGrievanceCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-surface-sunken border border-border-hairline text-ink-primary text-xs font-medium"
                  >
                    <option>Construction Quality (खराब गुणवत्ता)</option>
                    <option>Drainage / Rain Water Blockage (नाली बंद)</option>
                    <option>Work Delayed or Stopped (कार्य रुका हुआ)</option>
                    <option>Asset Not Working (सुविधा चालू नहीं)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-ink-primary">
                      Describe what you observed (विवरण):
                    </label>
                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        isRecording
                          ? 'bg-risk-critical text-surface animate-pulse'
                          : 'bg-saffron/20 text-saffron-deep'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>{isRecording ? 'सुन रहे हैं... (Listening)' : 'बोलकर लिखें (Voice)'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={grievanceText}
                    onChange={(e) => setGrievanceText(e.target.value)}
                    placeholder="कृपया बताएं कि क्या कमी है..."
                    className="w-full px-3 py-2 rounded bg-surface-sunken border border-border-hairline text-ink-primary text-xs focus:outline-none focus:border-saffron"
                    required
                  />
                </div>
              </div>

              <div className="px-5 py-3 bg-surface-sunken border-t border-border-hairline flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowGrievanceModal(false)}
                  className="px-4 py-2 rounded bg-surface border border-border-hairline text-ink-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-india-green text-surface font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5"
                >
                  <span>Submit Concern (शिकायत भेजें)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

