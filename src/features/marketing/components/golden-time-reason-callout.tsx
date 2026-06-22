import * as React from "react";

import { skillBadgeVariants } from "@/lib/styles/variants";
import { cn } from "@/lib/utils/cn";

import type { MarketingSkillTone } from "../types/marketing.types";

export type GoldenTimeReasonCalloutProps = {
  reason: string;
  skill?: MarketingSkillTone;
  className?: string;
};

/**
 * GoldenTimeReasonCallout — a skill-toned pill explaining *why* a word sits in
 * Golden Time ("Sai nghĩa 2 lần"). Reinforces the "review reason" identity.
 */
function GoldenTimeReasonCallout({
  reason,
  skill = "meaning",
  className,
}: GoldenTimeReasonCalloutProps) {
  return (
    <span className={cn(skillBadgeVariants({ skill }), className)}>
      <span className="size-1.5 shrink-0 rounded-full bg-current opacity-60" />
      {reason}
    </span>
  );
}

export { GoldenTimeReasonCallout };
