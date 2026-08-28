'use client';

import React, { useEffect, useState } from 'react';

interface IntegrityArcProps {
  score: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  showRiskBadge?: boolean;
  className?: string;
  animate?: boolean;
}

export function IntegrityArc({
  score,
  size = 'md',
  showLabel = true,
  showRiskBadge = false,
  className = '',
  animate = true,
}: IntegrityArcProps) {
  const [displayScore, setDisplayScore] = useState<number>(animate ? 0 : score);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }
    // Animate once on initial mount
    const duration = 400; // 400ms ease-out
    const startTime = performance.now();
    const startVal = 0;
    const endVal = score;

    let frameId: number;
    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(startVal + (endVal - startVal) * ease));

      if (progress < 1) {
        frameId = requestAnimationFrame(update);
      }
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [score, animate]);

  // Dimension settings
  const sizeMap = {
    sm: { width: 44, height: 44, strokeWidth: 3.5, fontSize: 'text-xs', fontClass: 'text-[11px] font-semibold', radius: 18 },
    md: { width: 68, height: 68, strokeWidth: 4.5, fontSize: 'text-base', fontClass: 'text-sm font-bold', radius: 28 },
    lg: { width: 104, height: 104, strokeWidth: 6, fontSize: 'text-2xl', fontClass: 'text-2xl font-bold', radius: 44 },
    xl: { width: 152, height: 152, strokeWidth: 8, fontSize: 'text-4xl', fontClass: 'text-4xl font-bold', radius: 64 },
  };

  const config = sizeMap[size];
  const center = config.width / 2;
  const radius = config.radius;
  const circumference = 2 * Math.PI * radius;

  // Arc sweeps 260 degrees (leaving 100 degrees open at bottom)
  const arcDegree = 270;
  const arcLength = (arcDegree / 360) * circumference;
  const dashOffset = arcLength - (displayScore / 100) * arcLength;

  // Determine risk level and color
  let riskColor = 'var(--risk-low)';
  let riskLabel = 'LOW';
  let riskBg = 'rgba(19, 136, 8, 0.1)';

  if (score < 40) {
    riskColor = 'var(--risk-critical)';
    riskLabel = 'CRITICAL';
    riskBg = 'rgba(192, 57, 43, 0.12)';
  } else if (score < 60) {
    riskColor = 'var(--risk-high)';
    riskLabel = 'HIGH';
    riskBg = 'rgba(232, 89, 12, 0.12)';
  } else if (score < 80) {
    riskColor = 'var(--risk-medium)';
    riskLabel = 'MEDIUM';
    riskBg = 'rgba(217, 164, 0, 0.12)';
  }

  // Segmented structural background (Saffron -> Neutral -> Green subtle guide markers)
  const segment1Length = arcLength * 0.33;
  const segment2Length = arcLength * 0.33;
  const segment3Length = arcLength * 0.34;

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: config.width, height: config.height }}>
        <svg
          width={config.width}
          height={config.height}
          viewBox={`0 0 ${config.width} ${config.height}`}
          className="transform -rotate-[225deg]"
          aria-hidden="true"
        >
          {/* Substrate Segment 1: Saffron track guide */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--saffron)"
            strokeWidth={config.strokeWidth}
            strokeDasharray={`${segment1Length} ${circumference}`}
            strokeDashoffset={0}
            strokeOpacity={0.25}
            strokeLinecap="round"
          />

          {/* Substrate Segment 2: Neutral track guide */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--ink-muted)"
            strokeWidth={config.strokeWidth}
            strokeDasharray={`${segment2Length} ${circumference}`}
            strokeDashoffset={-segment1Length}
            strokeOpacity={0.2}
          />

          {/* Substrate Segment 3: Green track guide */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--india-green)"
            strokeWidth={config.strokeWidth}
            strokeDasharray={`${segment3Length} ${circumference}`}
            strokeDashoffset={-(segment1Length + segment2Length)}
            strokeOpacity={0.25}
            strokeLinecap="round"
          />

          {/* Active Evidence Integrity Sweep Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={riskColor}
            strokeWidth={config.strokeWidth + 0.8}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{
              transition: animate ? 'stroke-dashoffset 80ms ease-out' : 'none',
            }}
          />
        </svg>

        {/* Center Numerical Score in Fraunces Serif typography */}
        {showLabel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className={`font-serif tabular-nums tracking-tight leading-none text-ink-primary ${config.fontClass}`}
            >
              {displayScore}
            </span>
            {size === 'xl' && (
              <span className="text-[10px] uppercase font-semibold text-ink-secondary tracking-widest mt-1">
                / 100
              </span>
            )}
          </div>
        )}
      </div>

      {showRiskBadge && (
        <span
          className="mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase"
          style={{ backgroundColor: riskBg, color: riskColor }}
        >
          {riskLabel}
        </span>
      )}
    </div>
  );
}

