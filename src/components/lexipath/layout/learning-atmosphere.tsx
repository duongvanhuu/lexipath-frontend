import * as React from "react";
import { Clock, Flame, Star } from "lucide-react";

import { cn } from "@/lib/utils/cn";

/* -------------------------------------------------------------------------- */
/* LearningAtmosphere                                                         */
/* -------------------------------------------------------------------------- */

export type LearningAtmosphereProps = {
  streak?: number;
  xp?: number;
  goldenTimeActive?: boolean;
  goldenQueueCount?: number;
  className?: string;
};

/**
 * LearningAtmosphere — ambient progress/status strip shown at the top of
 * learning pages. Displays streak, XP, and Golden Time status as stat pills.
 */
function LearningAtmosphere({
  streak,
  xp,
  goldenTimeActive,
  goldenQueueCount,
  className,
}: LearningAtmosphereProps) {
  const hasStats =
    typeof streak === "number" ||
    typeof xp === "number" ||
    goldenTimeActive;

  if (!hasStats) return null;

  return (
    <div
      className={cn(
        "border-b border-border bg-surface-muted",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        {typeof streak === "number" ? (
          <StatPill
            icon={<Flame className="size-3.5 text-golden" aria-hidden />}
            label={`${streak} ngày`}
            aria-label={`Streak: ${streak} ngày`}
          />
        ) : null}

        {typeof xp === "number" ? (
          <StatPill
            icon={<Star className="size-3.5 text-golden-foreground" aria-hidden />}
            label={`${xp} XP`}
            aria-label={`Kinh nghiệm: ${xp} XP`}
          />
        ) : null}

        {goldenTimeActive ? (
          <StatPill
            icon={<Clock className="size-3.5 text-golden-foreground" aria-hidden />}
            label={
              typeof goldenQueueCount === "number"
                ? `Golden Time · ${goldenQueueCount}`
                : "Golden Time"
            }
            golden
            aria-label={
              typeof goldenQueueCount === "number"
                ? `Golden Time đang mở · ${goldenQueueCount} từ`
                : "Golden Time đang mở"
            }
          />
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* StatPill — local sub-component                                             */
/* -------------------------------------------------------------------------- */

type StatPillProps = {
  icon: React.ReactNode;
  label: string;
  golden?: boolean;
  "aria-label"?: string;
};

function StatPill({ icon, label, golden, "aria-label": ariaLabel }: StatPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-medium",
        golden
          ? "bg-golden-soft text-golden-foreground"
          : "bg-card text-text-secondary"
      )}
      aria-label={ariaLabel}
    >
      {icon}
      {label}
    </span>
  );
}

export { LearningAtmosphere };
