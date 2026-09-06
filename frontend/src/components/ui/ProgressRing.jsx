import { useEffect, useState } from 'react';
import { useReducedMotion } from '../../lib/useReducedMotion';

export default function ProgressRing({ value = 0, size = 56, strokeWidth = 6, label }) {
  const reduced = useReducedMotion();
  const clamped = Math.min(Math.max(value, 0), 100);
  const [animated, setAnimated] = useState(reduced ? clamped : 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (reduced) return undefined;
    const raf = requestAnimationFrame(() => setAnimated(clamped));
    return () => cancelAnimationFrame(raf);
  }, [clamped, reduced]);

  const displayValue = reduced ? clamped : animated;
  const offset = circumference - (displayValue / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${clamped}%`}>
      <g style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border-strong)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: reduced ? 'none' : 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </g>
      {label && (
        <text
          x="50%"
          y="50%"
          dy="0.35em"
          textAnchor="middle"
          style={{
            fill: 'var(--color-text-primary)',
            fontSize: size * 0.24,
            fontWeight: 700,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {label}
        </text>
      )}
    </svg>
  );
}
