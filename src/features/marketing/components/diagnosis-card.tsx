import * as React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

import { skillFillClass } from "../constants/skill-tones";
import type { DiagnosisSkill } from "../types/marketing.types";

export type DiagnosisCardProps = {
  /** Level label, e.g. "TOEIC ~650". */
  level?: string;
  score?: number;
  maxScore?: number;
  description?: string;
  skills?: DiagnosisSkill[];
  className?: string;
};

/**
 * DiagnosisCard — previews the post-exam level diagnosis (level, score, and a
 * per-skill breakdown) for the "Chẩn đoán năng lực" landing section.
 */
function DiagnosisCard({
  level,
  score,
  maxScore = 990,
  description,
  skills = [],
  className,
}: DiagnosisCardProps) {
  return (
    <Card className={cn("gap-4 p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        {level ? (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-wide text-text-muted uppercase">
              Trình độ hiện tại
            </span>
            <span className="text-xl font-bold text-primary">{level}</span>
          </div>
        ) : null}
        {score != null ? (
          <div className="text-right">
            <span className="text-2xl font-bold text-text-primary">{score}</span>
            <span className="block text-xs text-text-muted">/ {maxScore}</span>
          </div>
        ) : null}
      </div>

      {description ? (
        <p className="text-sm text-text-secondary">{description}</p>
      ) : null}

      {skills.length > 0 ? (
        <ul className="flex flex-col gap-2.5">
          {skills.map((sk) => (
            <li key={sk.label} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs text-text-secondary">
                {sk.label}
              </span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-pill bg-surface-muted">
                <span
                  className={cn(
                    "block h-full rounded-pill",
                    skillFillClass[sk.tone ?? "meaning"]
                  )}
                  style={{ width: `${Math.min(Math.max(sk.pct, 0), 100)}%` }}
                />
              </span>
              <span className="w-8 shrink-0 text-right text-xs text-text-muted">
                {sk.pct}%
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}

export { DiagnosisCard };
