import * as React from "react";

import { cn } from "@/lib/utils/cn";

import type { EyebrowTone } from "../types/marketing.types";

export type MarketingEyebrowBadgeProps = {
  tone?: EyebrowTone;
  /** Optional leading dot/icon (e.g. a `lucide-react` icon). */
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

const toneClass: Record<EyebrowTone, string> = {
  primary: "bg-primary-soft text-primary-soft-foreground",
  golden: "bg-golden-soft text-golden-foreground",
  neutral: "bg-surface-muted text-text-secondary",
};

/**
 * MarketingEyebrowBadge — uppercase pill placed above a section title or hero
 * headline. Draws the eye before the heading.
 */
function MarketingEyebrowBadge({
  tone = "primary",
  icon,
  className,
  children,
}: MarketingEyebrowBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        toneClass[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export { MarketingEyebrowBadge };
