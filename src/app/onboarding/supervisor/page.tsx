'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import {
  Camera,
  MapPin,
  WifiOff,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Smartphone,
} from 'lucide-react';

export default function SupervisorOnboardingPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      icon: Camera,
      badge: 'नियम 1 (Rule 1)',
      title: 'Stand where the entire work is visible',
      titleHi: 'कैमरा ऐसे रखें कि पूरा निर्माण कार्य साफ दिखे',
      desc: 'Do not take close-up photos of ground or people. Step back 10–15 metres so the road surface, water pump, or school roof is clearly framed.',
      descHi: 'सड़क या ढांचे से 10-15 मीटर पीछे खड़े होकर फोटो लें ताकि पूरा काम साफ दिखाई दे।',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    },
    {
      icon: MapPin,
      badge: 'नियम 2 (Rule 2)',
      title: 'Always take photos at the real work site',
      titleHi: 'हमेशा वास्तविक कार्य स्थल पर जाकर ही फोटो खींचें',
      desc: 'The system checks GPS coordinates automatically. Never upload photos received over WhatsApp from other locations — it will be flagged.',
      descHi: 'सिस्टम अपने आप लोकेशन चेक करता है। किसी अन्य जगह से या व्हाट्सएप से आई पुरानी फोटो न डालें।',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    },
    {
      icon: WifiOff,
      badge: 'नियम 3 (Rule 3)',
      title: 'Works even without internet connection',
      titleHi: 'बिना इंटरनेट के भी फोटो खींची जा सकती है',
      desc: 'In remote rural areas with zero signal, keep taking photos. They stay safely saved on your phone and will upload automatically once you reach network.',
      descHi: 'दूरदराज के इलाकों में बिना नेटवर्क के भी फोटो खींचें। नेटवर्क मिलने पर फोटो अपने आप पोर्टल पर चली जाएगी।',
      image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const current = slides[slide];
  const Icon = current.icon;

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      router.push('/supervisor');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-surface border border-border-hairline rounded-xl shadow-dropdown overflow-hidden">
        <div className="tricolour-hairline" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Progress Indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-india-green" />
              <span className="font-bold text-xs text-ink-primary">
                फील्ड गाइड • Step {slide + 1} of 3
              </span>
            </div>
            <button
              onClick={() => router.push('/supervisor')}
              className="text-xs text-ink-muted hover:text-ink-primary"
            >
              Skip Walkthrough →
            </button>
          </div>

          {/* Slide Visual and Content */}
          <div className="space-y-4 animate-page-enter">
            <div className="aspect-[16/9] bg-ink-primary rounded-lg overflow-hidden relative">
              <img src={current.image} alt={current.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-saffron text-ink-primary font-bold text-[10px]">
                {current.badge}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-serif font-bold text-lg sm:text-xl text-ink-primary leading-snug">
                {current.title}
              </h2>
              <h3 className="font-bold text-xs text-saffron-deep dark:text-saffron">
                {current.titleHi}
              </h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                {current.desc}
              </p>
              <p className="text-xs text-ink-muted leading-relaxed italic">
                {current.descHi}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-border-hairline">
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === slide ? 'bg-saffron w-6' : 'bg-surface-sunken border border-border-hairline'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {slide > 0 && (
                <button
                  onClick={() => setSlide(slide - 1)}
                  className="px-3.5 py-2 rounded bg-surface border border-border-hairline text-xs font-semibold text-ink-secondary hover:bg-surface-sunken flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded bg-india-green text-surface font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-subtle"
              >
                <span>{slide === slides.length - 1 ? 'Go to Field Tasks (कार्य सूची)' : 'Next (अगला)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

