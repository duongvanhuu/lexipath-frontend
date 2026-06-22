import * as React from "react";

import { cn } from "@/lib/utils/cn";
import type { SkillKey } from "@/components/lexipath";
import { WordMasteryHeader } from "./word-mastery-header";
import { WordSensesList } from "./word-senses-list";
import { SkillWeaknessPanel } from "./skill-weakness-panel";
import type { WordSense, WordSkillStat, NextReview } from "./types";

export type WordMasteryCanvasProps = {
  headword: string;
  reading?: string;
  partOfSpeech?: string;
  script?: "latin" | "jp" | "cjk";
  reviewChip?: React.ReactNode;
  senses?: WordSense[];
  skills?: WordSkillStat[];
  nextReview?: NextReview;
  aside?: React.ReactNode;
  onPracticeSkill?: (skill: SkillKey) => void;
  className?: string;
};

function WordMasteryCanvas({
  headword,
  reading,
  partOfSpeech,
  script,
  reviewChip,
  senses = [],
  skills = [],
  nextReview,
  aside,
  onPracticeSkill,
  className,
}: WordMasteryCanvasProps) {
  const hasAside = aside !== undefined || skills.length > 0;

  return (
    <div
      className={cn(
        "grid gap-4",
        hasAside && "md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]",
        className
      )}
    >
      {/* Main column */}
      <div className="flex flex-col gap-4">
        <WordMasteryHeader
          headword={headword}
          {...(reading !== undefined ? { reading } : {})}
          {...(partOfSpeech !== undefined ? { partOfSpeech } : {})}
          {...(script !== undefined ? { script } : {})}
          {...(reviewChip !== undefined ? { reviewChip } : {})}
          {...(nextReview !== undefined ? { nextReview } : {})}
        />
        {senses.length > 0 ? <WordSensesList senses={senses} /> : null}
      </div>

      {/* Aside column */}
      {hasAside ? (
        <div className="flex flex-col gap-4">
          {skills.length > 0 ? (
            <SkillWeaknessPanel
              skills={skills}
              {...(onPracticeSkill !== undefined ? { onPractice: onPracticeSkill } : {})}
            />
          ) : null}
          {aside}
        </div>
      ) : null}
    </div>
  );
}

export { WordMasteryCanvas };
