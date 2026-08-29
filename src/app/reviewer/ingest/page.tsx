'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { useApp } from '@/lib/store/app-context';
import { IntegrityArc } from '@/components/ui/integrity-arc';
import {
  Cpu,
  Upload,
  Play,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Layers,
  MapPin,
  Clock,
  Camera,
  FileCheck2,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function IngestionSandboxPage() {
  const { t, formatNumber } = useI18n();
  const { addToast } = useApp();

  const presetScenarios = [
    {
      id: 'SCENARIO-1',
      name: '1. Genuine Road Reconstruction (PMGSY)',
      desc: 'All 7 multi-signals align: GPS within 28m, sequential EXIF, 91% structural asphalt change.',
      expectedScore: 94,
      expectedRisk: 'LOW',
      imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
      claim: 'Completed 40mm thick asphalt concrete wearing coat with thermoplastic line markers across 4.20 km road.',
      lat: 18.2814,
      lng: 74.0156,
      geofenceDevMeters: 28,
      duplicateRisk: 3,
      manipulationRisk: 4,
      anomalies: [],
    },
    {
      id: 'SCENARIO-2',
      name: '2. Recycled Cross-District Water Pump (JJM)',
      desc: 'High duplicate risk: 94.7% embedding match with historical evidence from Jodhpur, 318 km away.',
      expectedScore: 28,
      expectedRisk: 'CRITICAL',
      imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      claim: 'Newly installed 5HP dual solar pumping assembly providing 40,000 litres per day discharge into Chaksu tank.',
      lat: 26.6025,
      lng: 75.9515,
      geofenceDevMeters: 62,
      duplicateRisk: 96,
      manipulationRisk: 62,
      anomalies: [
        {
          title: 'Cross-Project Recycled Evidence (94.7% Visual Match)',
          desc: 'Perceptual & embedding similarity matched with historical record EVD-2025-1832 in Jodhpur (318.4 km away).',
        },
      ],
    },
    {
      id: 'SCENARIO-3',
      name: '3. Impossible Travel Teleportation (SSA)',
      desc: 'Temporal-spatial anomaly: 48.4 km geographic jump within 192 seconds (907 km/h implied velocity).',
      expectedScore: 41,
      expectedRisk: 'HIGH',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
      claim: 'Completed concrete polymer structural screeding and elastomeric waterproof coating on school roof.',
      lat: 25.6891,
      lng: 83.3912,
      geofenceDevMeters: 58200,
      duplicateRisk: 8,
      manipulationRisk: 12,
      anomalies: [
        {
          title: 'Impossible Travel Anomaly (48.4 km in 3m 12s)',
          desc: 'Implied transit velocity is 907 km/h, which is physically implausible for vehicle road transit.',
        },
      ],
    },
    {
      id: 'SCENARIO-4',
      name: '4. Claim-to-Evidence Mismatch (SSA Solar)',
      desc: 'Claimed 10 standalone solar street light poles; computer vision detects empty fallow field with 0 poles.',
      expectedScore: 34,
      expectedRisk: 'CRITICAL',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      claim: 'Erected 10 standalone 6-meter galvanized octagonal poles with integrated 40W Lumileds LED.',
      lat: 21.9348,
      lng: 86.7416,
      geofenceDevMeters: 45,
      duplicateRisk: 4,
      manipulationRisk: 10,
      anomalies: [
        {
          title: 'Severe Semantic Disconnect (Expected 10 Solar Lights, Found 0)',
          desc: 'Vision models identified open grassland terrain with zero steel poles, solar PV modules, or luminaire fixtures.',
        },
      ],
    },
  ];

  const [activeScenario, setActiveScenario] = useState(presetScenarios[0]);
  const [pipelineStep, setPipelineStep] = useState<number>(0); // 0 = ready, 1-6 = running, 7 = finished
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const steps = [
    { title: '1. Cryptographic SHA-256 Hashing', desc: 'Generating immutable binary hash signature...' },
    { title: '2. EXIF & Sensor Metadata Extraction', desc: 'Validating camera make, ISO, exposure, and capture timestamp...' },
    { title: '3. Geospatial Geofence Verification', desc: 'Computing Haversine centroid distance against project boundary...' },
    { title: '4. Perceptual Hashing & Cross-Project Search', desc: 'Running pgvector nearest-neighbor search across 1.4M nationwide records...' },
    { title: '5. Visual Manipulation & Object Detection', desc: 'Evaluating JPEG quantization tables and segmenting claimed infrastructure...' },
    { title: '6. Multi-Signal Evidence Fusion Engine', desc: 'Synthesizing weighted integrity & explainable risk score...' },
  ];

  const runPipeline = () => {
    setIsRunning(true);
    setPipelineStep(1);

    const advanceStep = (current: number) => {
      if (current < 6) {
        setTimeout(() => {
          setPipelineStep(current + 1);
          advanceStep(current + 1);
        }, 550);
      } else {
        setTimeout(() => {
          setPipelineStep(7);
          setIsRunning(false);
          addToast({
            title: 'Evidence Ingestion & Audit Complete',
            description: `Integrity Score: ${activeScenario.expectedScore}/100 (${activeScenario.expectedRisk} Risk).`,
            type: activeScenario.expectedScore > 70 ? 'success' : 'warning',
          });
        }, 600);
      }
    };

    advanceStep(1);
  };

  const resetPipeline = () => {
    setPipelineStep(0);
    setIsRunning(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary tracking-tight">
              {t('nav_ingest', 'Live Evidence Ingestion & Fusion Sandbox')}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-navy/15 dark:bg-[#7FA8D9]/20 text-navy dark:text-[#7FA8D9] font-bold">
              SIH Interactive Demo Engine
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-1">
            Real-time end-to-end execution of the 7-signal evidence intelligence pipeline. Select a benchmark test case or observe step-by-step processing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pipelineStep === 7 ? (
            <button
              onClick={resetPipeline}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sandbox</span>
            </button>
          ) : (
            <button
              onClick={runPipeline}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-saffron text-ink-primary hover:bg-saffron-deep font-bold text-xs shadow-subtle disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Processing Pipeline...' : 'Run Ingestion Pipeline'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Scenario Presets Bar */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary block">
          Select Benchmark Test Scenario (SIH Demo Dataset)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presetScenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => {
                setActiveScenario(sc);
                resetPipeline();
              }}
              className={`p-3 rounded border text-left rtl:text-right transition-all flex flex-col justify-between gap-2 ${
                activeScenario.id === sc.id
                  ? 'bg-surface border-saffron shadow-subtle ring-1 ring-saffron'
                  : 'bg-surface-sunken border-border-hairline text-ink-secondary hover:bg-surface'
              }`}
            >
              <div>
                <span className="font-bold text-xs text-ink-primary block">{sc.name}</span>
                <p className="text-[10px] text-ink-secondary mt-1 line-clamp-2">{sc.desc}</p>
              </div>
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-border-hairline">
                <span className="font-mono text-ink-muted">Expected:</span>
                <span
                  className={`font-bold uppercase ${
                    sc.expectedRisk === 'LOW'
                      ? 'text-india-green'
                      : sc.expectedRisk === 'HIGH'
                      ? 'text-risk-high'
                      : 'text-risk-critical'
                  }`}
                >
                  Score {sc.expectedScore} ({sc.expectedRisk})
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live Pipeline Execution Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Active Test Evidence Dossier */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface border border-border-hairline rounded shadow-subtle overflow-hidden">
            <div className="p-3 bg-surface-sunken border-b border-border-hairline font-bold text-xs flex justify-between items-center">
              <span className="text-ink-primary">Input Evidence Payload</span>
              <span className="font-mono text-[10px] text-ink-muted">{activeScenario.id}</span>
            </div>
            <div className="aspect-[4/3] bg-ink-primary relative overflow-hidden">
              <img src={activeScenario.imageUrl} alt="Test Evidence" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-ink-primary/80 backdrop-blur-xs text-surface font-mono text-[10px]">
                {activeScenario.lat.toFixed(4)}° N, {activeScenario.lng.toFixed(4)}° E
              </div>
            </div>
            <div className="p-4 space-y-2 text-xs">
              <span className="text-ink-muted font-bold text-[10px] uppercase block">Contractor Claim:</span>
              <p className="italic text-ink-primary bg-surface-sunken p-2.5 rounded border border-border-hairline leading-relaxed text-[11px]">
                &ldquo;{activeScenario.claim}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Step-by-Step Pipeline Engine & Fusion Outcome */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-surface border border-border-hairline rounded p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-navy dark:text-[#7FA8D9]" />
                <h3 className="font-serif font-bold text-sm text-ink-primary">
                  Multi-Signal Execution Pipeline
                </h3>
              </div>
              <span className="text-[11px] font-mono text-ink-muted">
                {pipelineStep === 0 && 'Ready to Ingest'}
                {pipelineStep > 0 && pipelineStep < 7 && `Step ${pipelineStep} of 6 In Progress...`}
                {pipelineStep === 7 && 'Fusion Completed'}
              </span>
            </div>

            {/* Steps Visualizer */}
            <div className="space-y-2.5">
              {steps.map((step, idx) => {
                const stepNum = idx + 1;
                const isDone = pipelineStep > stepNum || pipelineStep === 7;
                const isCurrent = pipelineStep === stepNum;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded border text-xs transition-all flex items-center justify-between ${
                      isDone
                        ? 'bg-india-green/5 border-india-green/30 text-ink-primary'
                        : isCurrent
                        ? 'bg-saffron/10 border-saffron text-ink-primary shadow-subtle'
                        : 'bg-surface-sunken border-border-hairline text-ink-muted opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                          isDone
                            ? 'bg-india-green text-surface'
                            : isCurrent
                            ? 'bg-saffron text-ink-primary animate-pulse'
                            : 'bg-surface border border-border-hairline text-ink-muted'
                        }`}
                      >
                        {isDone ? '✓' : stepNum}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-ink-primary">{step.title}</span>
                        <span className="text-[10px] text-ink-secondary">{step.desc}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-semibold">
                      {isDone && <span className="text-india-green">PASSED</span>}
                      {isCurrent && <span className="text-saffron-deep dark:text-saffron animate-pulse">ANALYZING...</span>}
                      {!isDone && !isCurrent && <span className="text-ink-muted">PENDING</span>}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pipeline Final Result Box */}
            {pipelineStep === 7 && (
              <div className="p-5 bg-surface-sunken rounded border border-border-hairline space-y-4 animate-page-enter">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left rtl:sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-ink-muted">
                      Synthesized Evidence Integrity Determination
                    </span>
                    <h4 className="font-serif font-bold text-base text-ink-primary">
                      {activeScenario.expectedRisk === 'LOW' && 'Evidence Confirmed Consistent Across All 7 Signals'}
                      {activeScenario.expectedRisk === 'HIGH' && 'High Inconsistency Flagged for Human Audit'}
                      {activeScenario.expectedRisk === 'CRITICAL' && 'Critical Fraud / Recycled Evidence Alert'}
                    </h4>
                  </div>
                  <IntegrityArc score={activeScenario.expectedScore} size="md" showRiskBadge />
                </div>

                {/* Detected Anomalies Explanation */}
                {activeScenario.anomalies.length > 0 && (
                  <div className="p-3 bg-risk-critical/10 border border-risk-critical/30 rounded text-xs space-y-1">
                    <span className="font-bold text-risk-critical block">
                      {activeScenario.anomalies[0].title}
                    </span>
                    <p className="text-[11px] text-ink-primary leading-snug">
                      {activeScenario.anomalies[0].desc}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2 text-xs">
                  <Link
                    href="/queue"
                    className="px-3.5 py-1.5 rounded bg-ink-primary text-surface font-semibold hover:opacity-90"
                  >
                    View in Review Queue
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

