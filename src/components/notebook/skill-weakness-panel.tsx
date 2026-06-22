import * as React from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";

import { SkillProgressLane } from "@/components/lexipath";
import { LexiButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";
import type { SkillKey } from "@/components/lexipath";
import type { WordSkillStat } from "./types";

export type SkillWeaknessPanelProps = {
  title?: string;
  skills: WordSkillStat[];
  threshold?: number;
  onPractice?: (skill: SkillKey) => void;
  className?: string;
};

function SkillWeaknessPanel({
  title = "Kỹ năng cần củng cố",
  skills,
  threshold = 70,
  onPractice,
  className,
}: SkillWeaknessPanelProps) {
  const sorted = [...skills].sort(
    (a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0)
  );
  const weakest = sorted[0];
  const isWeak =
    weakest !== undefined && (weakest.accuracy ?? 0) < threshold;

  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 rounded-card border border-border bg-card p-4",
        className
      )}
    >
      <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </div>

      {isWeak ? (
        <div className="flex items-center gap-3 rounded-md bg-danger-soft p-3">
          <span className="inline-flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-card text-danger-foreground">
            <AlertTriangle className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text-primary">
              {weakest.label} là kỹ năng yếu nhất
            </p>
            <p className="text-xs text-text-secondary">
              Chính xác {weakest.accuracy}%
              {weakest.attempts != null
                ? ` · ${weakest.attempts} lần thử`
                : ""}
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2.5">
        {sorted.map((s) => (
          <SkillProgressLane
            key={s.skill}
            skill={s.skill}
            masteredCount={s.accuracy}
            totalCount={100}
            accuracyPct={s.accuracy}
          />
        ))}
      </div>

      {isWeak && onPractice ? (
        <LexiButton
          variant="primary"
          size="sm"
          className="self-start"
          onClick={() => onPractice(weakest.skill)}
        >
          Luyện {weakest.label}
          <ArrowRight className="ml-1.5 size-3.5" aria-hidden />
        </LexiButton>
      ) : null}
    </div>
  );
}

export { SkillWeaknessPanel };
