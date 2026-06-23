import * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { SkillKey } from "@/components/lexipath";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type HomeSkillStat = {
  skill: SkillKey;
  pct: number;
};

export type HomeSkillLanesProps = {
  skills: HomeSkillStat[];
  detailHref?: string;
  className?: string;
};

/* -------------------------------------------------------------------------- */
/* Lookup maps                                                                 */
/* -------------------------------------------------------------------------- */

const SKILL_LABELS: Record<SkillKey, string> = {
  meaning: "Nhớ nghĩa",
  listening: "Nghe hiểu",
  spelling: "Chính tả",
  usage: "Cách dùng",
  collocation: "Collocations",
};

const SKILL_FILL: Record<SkillKey, string> = {
  meaning: "bg-skill-meaning",
  listening: "bg-skill-listening",
  spelling: "bg-skill-spelling",
  usage: "bg-skill-usage",
  collocation: "bg-skill-collocation",
};

const WEAK_THRESHOLD: Record<SkillKey, number> = {
  meaning: 60,
  listening: 60,
  spelling: 65,
  usage: 70,
  collocation: 65,
};

/* -------------------------------------------------------------------------- */
/* HomeSkillLanes                                                              */
/* -------------------------------------------------------------------------- */

function HomeSkillLanes({
  skills,
  detailHref = "/stats",
  className,
}: HomeSkillLanesProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card p-5",
        className
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-text-muted">
          Kỹ năng
        </span>
        <Link
          href={detailHref as Route}
          className="text-[13px] font-semibold text-primary no-underline hover:opacity-80"
        >
          Chi tiết
        </Link>
      </div>

      {/* Lane list */}
      <div className="flex flex-col">
        {skills.map((sk, i) => {
          const isWeak = sk.pct < WEAK_THRESHOLD[sk.skill];
          return (
            <div
              key={sk.skill}
              className={cn(
                "flex items-center gap-2.5 py-2",
                i > 0 && "border-t border-border/40"
              )}
            >
              {/* 3px left accent bar */}
              <div
                className={cn("self-stretch rounded-full", SKILL_FILL[sk.skill])}
                style={{ width: 3, minHeight: 40 }}
                aria-hidden
              />

              {/* Body */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-text-primary">
                    {SKILL_LABELS[sk.skill]}
                  </span>
                  <span className="text-[11px] font-semibold text-text-muted">
                    {sk.pct}%
                  </span>
                </div>

                <div
                  className="h-1 w-full overflow-hidden rounded-full bg-border"
                  role="progressbar"
                  aria-valuenow={sk.pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${SKILL_LABELS[sk.skill]}: ${sk.pct}%`}
                >
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      SKILL_FILL[sk.skill],
                      isWeak && "opacity-70"
                    )}
                    style={{ width: `${sk.pct}%` }}
                  />
                </div>

                {isWeak ? (
                  <div className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-danger">
                    <AlertTriangle className="size-2.5" aria-hidden />
                    Cần chú ý
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { HomeSkillLanes };
