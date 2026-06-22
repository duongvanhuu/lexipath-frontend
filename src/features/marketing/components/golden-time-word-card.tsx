import * as React from "react";
import { Clock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { skillBadgeVariants } from "@/lib/styles/variants";
import { cn } from "@/lib/utils/cn";

import type { MarketingSkillTone } from "../types/marketing.types";

export type GoldenTimeWordCardProps = {
  word: string;
  /** Phonetic / reading line (IPA, kana, pinyin…). */
  reading?: string;
  meaning?: string;
  skillLabel?: string;
  skillTone?: MarketingSkillTone;
  /** Relative next-review timing, e.g. "trong 2 giờ". */
  nextReview?: string;
  className?: string;
};

/**
 * GoldenTimeWordCard — preview of a word queued for Golden Time review (word,
 * reading, meaning, skill badge, next-review timing). Landing preview only.
 */
function GoldenTimeWordCard({
  word,
  reading,
  meaning,
  skillLabel = "Meaning",
  skillTone = "meaning",
  nextReview,
  className,
}: GoldenTimeWordCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xl font-semibold text-text-primary">{word}</span>
          {reading ? (
            <span className="text-sm text-text-muted">{reading}</span>
          ) : null}
          {meaning ? (
            <span className="text-sm text-text-secondary">{meaning}</span>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className={skillBadgeVariants({ skill: skillTone })}>
            {skillLabel}
          </span>
          {nextReview ? (
            <span className="flex items-center gap-1 text-xs text-golden-foreground">
              <Clock className="size-3" aria-hidden />
              {nextReview}
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export { GoldenTimeWordCard };
