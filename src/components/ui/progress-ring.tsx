import * as React from "react";

import { cn } from "@/lib/utils/cn";

/**
 * ProgressRing — circular progress indicator. There is no shadcn equivalent, so
 * this is a typed, accessible SVG built on LexiPath tokens (no inline colors).
 * Server-Component friendly: purely presentational, no hooks.
 *
 * Accessibility: exposes `role="progressbar"` with `aria-valuenow/min/max`.
 * Pass `aria-label` (or rely on the visible `label`) to name it.
 */
const RING_TONE: Record<string, string> = {
  primary: "stroke-primary",
  golden: "stroke-golden-strong",
  success: "stroke-success",
  warning: "stroke-warning",
  danger: "stroke-danger",
  skill: "stroke-skill-meaning",
};

export type ProgressRingTone = keyof typeof RING_TONE;

export type ProgressRingProps = {
  /** Current value (0…max). */
  value: number;
  /** Maximum value the ring represents. */
  max?: number;
  /** Outer diameter in px. */
  size?: number;
  /** Ring thickness in px. */
  strokeWidth?: number;
  tone?: ProgressRingTone;
  /** Show the centered percentage. Ignored when `label` is set. */
  showLabel?: boolean;
  /** Custom centered content (overrides the percentage). */
  label?: React.ReactNode;
  className?: string;
  "aria-label"?: string;
};

function ProgressRing({
  value,
  max = 100,
  size = 64,
  strokeWidth = 5,
  tone = "primary",
  showLabel = true,
  label,
  className,
  "aria-label": ariaLabel,
}: ProgressRingProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const center = size / 2;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            RING_TONE[tone] ?? RING_TONE.primary,
            "transition-[stroke-dashoffset] duration-700 ease-out"
          )}
        />
      </svg>
      {label ?? (showLabel ? (
        <span className="absolute text-xs font-semibold text-text-primary">
          {Math.round(pct)}%
        </span>
      ) : null)}
    </div>
  );
}

export { ProgressRing };
