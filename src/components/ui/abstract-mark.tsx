'use client';

import React from 'react';

interface AbstractMarkProps {
  size?: number;
  className?: string;
}

export function AbstractMark({ size = 32, className = '' }: AbstractMarkProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title="EIIL Abstract Digital Public Infrastructure Mark (GIGW 3.0 Standard)"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Proof-of-Action Seal"
      >
        {/* Outer Circular Geodesic Shield */}
        <circle
          cx="20"
          cy="20"
          r="18.5"
          className="stroke-border-hairline"
          strokeWidth="1.5"
        />

        {/* Concentric Tricolour Arc Bands (DPI Structural Motif) */}
        {/* Top Saffron Arc */}
        <path
          d="M 8 20 A 12 12 0 0 1 32 20"
          stroke="var(--saffron)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Bottom Green Arc */}
        <path
          d="M 32 20 A 12 12 0 0 1 8 20"
          stroke="var(--india-green)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Central Geometric Chakra & Verifiable Node Spokes */}
        <circle
          cx="20"
          cy="20"
          r="5.5"
          className="stroke-navy dark:stroke-[#7FA8D9]"
          strokeWidth="1.8"
        />

        {/* Inner Hub Point */}
        <circle
          cx="20"
          cy="20"
          r="2"
          className="fill-navy dark:fill-[#7FA8D9]"
        />

        {/* 8 Geometric Radials representing Multi-Signal Evidence Verification */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="20"
            y1="20"
            x2={20 + 4.8 * Math.cos((angle * Math.PI) / 180)}
            y2={20 + 4.8 * Math.sin((angle * Math.PI) / 180)}
            className="stroke-navy dark:stroke-[#7FA8D9]"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}

        {/* 4 Cardinal Verification Nodes */}
        <circle cx="20" cy="4.5" r="1.5" className="fill-saffron" />
        <circle cx="35.5" cy="20" r="1.5" className="fill-navy dark:fill-[#7FA8D9]" />
        <circle cx="20" cy="35.5" r="1.5" className="fill-india-green" />
        <circle cx="4.5" cy="20" r="1.5" className="fill-navy dark:fill-[#7FA8D9]" />
      </svg>
    </div>
  );
}

