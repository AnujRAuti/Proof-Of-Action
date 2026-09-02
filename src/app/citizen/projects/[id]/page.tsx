'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import { getProjectImage } from '@/lib/data/mock-dataset';
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
  const { projects, fileComplaint, addToast } = useApp();

  const project = projects.find((p) => p.id === resolvedParams.id) || projects[0];
  if (!project) return notFound();

  // Feedback states
  const [feedbackVote, setFeedbackVote] = useState<'UP' | 'DOWN' | null>(null);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [grievanceCategory, setGrievanceCategory] = useState('Construction Quality');
  const [grievanceText, setGrievanceText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const milestones = [
    { title: 'Started', titleHi: 'कार्य शुरू', done: true, desc: 'Site survey and foundational inspection completed' },
    { title: 'Halfway', titleHi: 'आधा कार्य पूर्ण', done: true, desc: 'Core structural execution verified by field engineer' },
    { title: 'Nearing Completion', titleHi: 'अंतिम चरण', done: project.status === 'COMPLETED', desc: 'Finishing touches and quality assurance' },
    { title: 'Completed', titleHi: 'कार्य पूर्ण', done: project.status === 'COMPLETED', desc: 'Certified and accessible for public use' },
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

    fileComplaint({
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

  const isSchoolWithBeforeAfter = project.id === 'PRJ-SSA-UP-512';
  const projectImg = project.imageUrl || getProjectImage(project.id);

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
      <div className="bg-surface border border-border-hairline rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
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

        <div className="p-3 bg-surface-sunken rounded-xl border border-border-hairline flex flex-wrap justify-between gap-3 text-xs">
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

      {/* Plain-Language Milestone Progress Bar */}
      <div className="bg-surface border border-border-hairline rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
        <h2 className="font-serif font-bold text-base text-ink-primary">
          Project Progress Timeline (कार्य की प्रगति)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {milestones.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
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

      {/* Field Photos Gallery (Section 2 & 7) */}
      <div className="bg-surface border border-border-hairline rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-base text-ink-primary">
            Photos from the Work Site (स्थल की तस्वीरें)
          </h2>
          <span className="text-xs text-ink-muted">Verified Field Records</span>
        </div>

        {isSchoolWithBeforeAfter ? (
          /* School has dedicated Before/After pair */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before Photo */}
            <div className="space-y-1.5">
              <div className="aspect-[4/3] bg-ink-primary rounded-xl overflow-hidden relative border border-border-hairline">
                <img
                  src="/images/projects/school-before.jpg"
                  alt="Before School Repair"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-ink-primary/80 text-surface text-xs font-bold font-mono">
                  BEFORE (कार्य शुरू होने से पहले)
                </div>
              </div>
              <span className="text-xs text-ink-secondary block">
                Pre-repair condition survey showing weathered classroom roof and masonry
              </span>
            </div>

            {/* After / Current Photo */}
            <div className="space-y-1.5">
              <div className="aspect-[4/3] bg-ink-primary rounded-xl overflow-hidden relative border border-border-hairline">
                <img
                  src="/images/projects/school-after.jpg"
                  alt="After School Repair"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-india-green text-surface text-xs font-bold font-mono">
                  AFTER (कार्य पूर्ण)
                </div>
              </div>
              <span className="text-xs text-ink-secondary block">
                Completed structural roof screed and fresh exterior masonry paint
              </span>
            </div>
          </div>
        ) : (
          /* Single Dedicated Project Photograph (No false before/after) */
          <div className="space-y-2">
            <div className="aspect-[16/9] max-h-[420px] bg-ink-primary rounded-2xl overflow-hidden relative border border-border-hairline">
              <img
                src={projectImg}
                alt={project.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-ink-primary/80 text-surface text-xs font-bold font-mono">
                OFFICIAL SITE PHOTOGRAPH (स्थल का साक्ष्य)
              </div>
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-surface/90 text-ink-primary text-xs font-semibold backdrop-blur-sm">
                📍 {project.district}, {project.state} • Geofence {project.geofenceRadiusMeters}m
              </div>
            </div>
            <p className="text-xs text-ink-secondary">
              GPS-anchored photographic evidence recorded on site by the jurisdictional field officer.
            </p>
          </div>
        )}
      </div>

      {/* "Does this look right to you?" Citizen Feedback Card */}
      <div className="bg-surface border-2 border-saffron/40 rounded-2xl p-5 sm:p-6 shadow-dropdown space-y-4">
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
            className={`flex-1 py-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              feedbackVote === 'UP'
                ? 'bg-india-green text-surface border-india-green'
                : 'bg-surface border-india-green/40 text-india-green hover:bg-india-green/10'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>हाँ, कार्य सही है (Looks Good)</span>
          </button>

          <button
            onClick={() => handleQuickVote('DOWN')}
            className={`flex-1 py-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              feedbackVote === 'DOWN'
                ? 'bg-risk-high text-surface border-risk-high'
                : 'bg-surface border-risk-high/40 text-risk-high hover:bg-risk-high/10'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>कुछ समस्या है (Report Concern)</span>
          </button>
        </div>
      </div>

      {/* Grievance Modal if user clicked ThumbsDown */}
      {showGrievanceModal && (
        <div className="fixed inset-0 z-50 bg-ink-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface border border-border-hairline rounded-2xl p-6 space-y-4 shadow-dropdown animate-page-enter">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-serif font-bold text-base text-ink-primary">
                Report a Site Concern (शिकायत दर्ज करें)
              </h3>
              <button
                onClick={() => setShowGrievanceModal(false)}
                className="text-ink-muted hover:text-ink-primary font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitGrievance} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-ink-primary block mb-1">Issue Category:</label>
                <select
                  value={grievanceCategory}
                  onChange={(e) => setGrievanceCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface-sunken border border-border-hairline text-ink-primary"
                >
                  <option>Construction Quality (खराब गुणवत्ता)</option>
                  <option>Work Stopped / Incomplete (कार्य रुका हुआ है)</option>
                  <option>Drainage / Waterlogging (जलभराव या नाली की समस्या)</option>
                  <option>Potholes / Surface Crack (सड़क पर गड्ढे)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-ink-primary block mb-1">Describe the problem:</label>
                <textarea
                  value={grievanceText}
                  onChange={(e) => setGrievanceText(e.target.value)}
                  placeholder="Tell us what is wrong with this work..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-surface-sunken border border-border-hairline text-xs text-ink-primary"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleToggleVoice}
                className={`w-full py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 ${
                  isRecording ? 'bg-risk-high text-surface border-risk-high animate-pulse' : 'bg-surface-sunken text-ink-primary'
                }`}
              >
                <Mic className="w-4 h-4 text-saffron-deep" />
                <span>{isRecording ? 'Listening in Hindi/Marathi...' : 'Or Tap to Speak (बोलकर बताएं)'}</span>
              </button>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGrievanceModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-surface border border-border-hairline text-ink-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-saffron text-ink-primary font-bold hover:bg-saffron-deep"
                >
                  Submit to District Reviewer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
