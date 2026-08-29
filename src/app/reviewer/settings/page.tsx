'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { useApp } from '@/lib/store/app-context';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/languages';
import {
  Settings,
  Key,
  Webhook,
  Bell,
  Globe,
  Sun,
  Moon,
  Laptop,
  Copy,
  Check,
  Play,
  Code,
  ShieldCheck,
} from 'lucide-react';

export default function SettingsPage() {
  const { language, setLanguage, currentLanguage } = useI18n();
  const { theme, setTheme } = useTheme();
  const { role, setRole, addToast } = useApp();

  const [apiKey, setApiKey] = useState<string>('eiil_live_9f83a48e71b29d8164bc77f202e88a01');
  const [isCopiedKey, setIsCopiedKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://pmgsy.nic.in/api/v1/eiil-webhook');
  const [webhookEvent, setWebhookEvent] = useState('evidence.flagged_critical');
  const [webhookResponse, setWebhookResponse] = useState<string | null>(null);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopiedKey(true);
    setTimeout(() => setIsCopiedKey(false), 2000);
    addToast({
      title: 'API Key Copied',
      description: 'Bearer token copied to clipboard.',
      type: 'info',
    });
  };

  const handleGenerateKey = () => {
    const newKey = 'eiil_live_' + Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    setApiKey(newKey);
    addToast({
      title: 'New API Key Provisioned',
      description: 'Previous key invalidated. Update your client service headers.',
      type: 'success',
    });
  };

  const handleTestWebhook = () => {
    setWebhookResponse('Dispatching event payload...');
    setTimeout(() => {
      setWebhookResponse(
        JSON.stringify(
          {
            event: webhookEvent,
            evidenceId: 'EVD-2026-9041',
            projectId: 'PRJ-JJM-RJ-108',
            scheme: 'Jal Jeevan Mission',
            integrityScore: 28,
            riskLevel: 'CRITICAL',
            detectedAnomalies: [
              {
                type: 'CROSS_PROJECT_DUPLICATE',
                confidence: 94.7,
                matchedTarget: 'EVD-2025-1832 (Jodhpur district, 318.4 km away)',
              },
            ],
            timestamp: new Date().toISOString(),
            status: 200,
            delivered: true,
          },
          null,
          2
        )
      );
      addToast({
        title: 'Webhook Test Event Dispatched',
        description: `HTTP 200 OK received from ${webhookUrl}`,
        type: 'success',
      });
    }, 450);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-border-hairline">
        <h1 className="font-serif font-bold text-xl sm:text-2xl text-ink-primary tracking-tight">
          Platform Configuration &amp; API Management
        </h1>
        <p className="text-xs text-ink-secondary mt-1">
          Customise localization, theme preferences, webhook endpoints, and programmatic ingestion API keys.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Appearance, Locale & Persona */}
        <div className="lg:col-span-6 space-y-4">
          {/* Theme Settings */}
          <div className="bg-surface border border-border-hairline rounded p-5 shadow-subtle space-y-3">
            <div className="flex items-center gap-2 border-b border-border-hairline pb-2">
              <Sun className="w-4 h-4 text-saffron-deep" />
              <h3 className="font-serif font-bold text-sm text-ink-primary">
                Theme &amp; Visual Mode
              </h3>
            </div>
            <p className="text-xs text-ink-secondary">
              Strictly WCAG AA compliant custom CSS variables in both Light and Dark themes.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {[
                { key: 'light', label: 'Light Mode', icon: Sun },
                { key: 'dark', label: 'Dark Mode', icon: Moon },
                { key: 'system', label: 'System Default', icon: Laptop },
              ].map((tMode) => {
                const Icon = tMode.icon;
                return (
                  <button
                    key={tMode.key}
                    onClick={() => setTheme(tMode.key as any)}
                    className={`flex-1 py-2 px-3 rounded border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      theme === tMode.key
                        ? 'bg-surface-sunken border-saffron text-ink-primary shadow-subtle ring-1 ring-saffron'
                        : 'bg-surface border-border-hairline text-ink-secondary hover:bg-surface-sunken'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tMode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Selection */}
          <div className="bg-surface border border-border-hairline rounded p-5 shadow-subtle space-y-3">
            <div className="flex items-center gap-2 border-b border-border-hairline pb-2">
              <Globe className="w-4 h-4 text-navy dark:text-[#7FA8D9]" />
              <h3 className="font-serif font-bold text-sm text-ink-primary">
                Official Indic Languages &amp; RTL Support
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`p-2 rounded border text-left rtl:text-right text-xs transition-all ${
                    language === l.code
                      ? 'bg-surface-sunken border-saffron font-bold text-ink-primary ring-1 ring-saffron'
                      : 'bg-surface border-border-hairline text-ink-secondary hover:bg-surface-sunken'
                  }`}
                >
                  <span className="block text-ink-primary">{l.nativeName}</span>
                  <span className="text-[10px] text-ink-muted">
                    {l.name} {l.isRtl ? '(RTL)' : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 6 Cols: API Keys & Webhook Simulation */}
        <div className="lg:col-span-6 space-y-4">
          {/* API Key Management */}
          <div className="bg-surface border border-border-hairline rounded p-5 shadow-subtle space-y-3">
            <div className="flex items-center justify-between border-b border-border-hairline pb-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-saffron-deep" />
                <h3 className="font-serif font-bold text-sm text-ink-primary">
                  Ingestion REST API Credentials
                </h3>
              </div>
              <button
                onClick={handleGenerateKey}
                className="text-[11px] text-saffron-deep font-semibold hover:underline"
              >
                Regenerate Key
              </button>
            </div>

            <p className="text-xs text-ink-secondary">
              Use this bearer token to submit evidence programmatically via external mobile apps or state portal webhooks.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="w-full px-3 py-1.5 rounded bg-surface-sunken border border-border-hairline font-mono text-xs text-ink-primary focus:outline-none"
              />
              <button
                onClick={handleCopyKey}
                className="px-3 py-1.5 rounded bg-surface-sunken hover:bg-surface-sunken/80 border border-border-hairline text-ink-primary text-xs font-semibold flex items-center gap-1 shrink-0"
              >
                {isCopiedKey ? <Check className="w-3.5 h-3.5 text-india-green" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopiedKey ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Curl Sample Snippet */}
            <div className="bg-ink-primary text-surface p-3 rounded text-[10px] font-mono overflow-x-auto space-y-1">
              <span className="text-saffron block"># Sample Evidence Ingestion Command</span>
              <div>curl -X POST https://eiil.gov.in/api/v1/evidence \</div>
              <div className="pl-4">-H &ldquo;Authorization: Bearer {apiKey.slice(0, 14)}...&rdquo; \</div>
              <div className="pl-4">-F &ldquo;file=@wearing_coat.jpg&rdquo; \</div>
              <div className="pl-4">-F &ldquo;projectId=PRJ-PMGSY-MH-401&rdquo;</div>
            </div>
          </div>

          {/* Webhook Dispatch Simulator */}
          <div className="bg-surface border border-border-hairline rounded p-5 shadow-subtle space-y-3">
            <div className="flex items-center gap-2 border-b border-border-hairline pb-2">
              <Webhook className="w-4 h-4 text-india-green" />
              <h3 className="font-serif font-bold text-sm text-ink-primary">
                Webhook Event Simulator
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="font-semibold text-ink-primary block mb-1">Target Endpoint:</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-surface-sunken border border-border-hairline font-mono text-xs text-ink-primary"
                />
              </div>

              <div>
                <label className="font-semibold text-ink-primary block mb-1">Event Trigger:</label>
                <select
                  value={webhookEvent}
                  onChange={(e) => setWebhookEvent(e.target.value)}
                  className="w-full px-3 py-1.5 rounded bg-surface-sunken border border-border-hairline text-ink-primary text-xs"
                >
                  <option value="evidence.flagged_critical">evidence.flagged_critical</option>
                  <option value="evidence.approved">evidence.approved</option>
                  <option value="evidence.override_recorded">evidence.override_recorded</option>
                </select>
              </div>

              <button
                onClick={handleTestWebhook}
                className="w-full py-2 rounded bg-ink-primary text-surface font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Dispatch Test Webhook Payload</span>
              </button>

              {webhookResponse && (
                <div className="bg-surface-sunken p-3 rounded border border-border-hairline space-y-1 font-mono text-[10px]">
                  <span className="text-india-green font-bold block">HTTP 200 OK Response:</span>
                  <pre className="overflow-x-auto text-ink-primary">{webhookResponse}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

