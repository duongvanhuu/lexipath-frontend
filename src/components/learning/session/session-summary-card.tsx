import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { LexiButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";

export type SessionSummaryCardProps = {
  wordsLearned?: number;
  wordsReviewed?: number;
  accuracy?: number;
  xpEarned: number;
  streakDays?: number;
  durationLabel?: string;
  onContinue?: () => void;
  onHome?: () => void;
  className?: string;
};

const statTileVariants = cva(
  "flex flex-col items-center gap-1 rounded-md px-3 py-3",
  {
    variants: {
      tone: {
        primary: "bg-primary/10 text-primary",
        info: "bg-muted text-muted-foreground",
        warning: "bg-warning-soft text-warning-foreground",
        streak: "bg-golden-soft text-golden-foreground",
      },
    },
    defaultVariants: { tone: "primary" },
  }
);

type StatTileTone = NonNullable<VariantProps<typeof statTileVariants>["tone"]>;

function StatTile({
  value,
  label,
  tone = "primary",
}: {
  value: string | number;
  label: string;
  tone?: StatTileTone;
}) {
  return (
    <div className={statTileVariants({ tone })}>
      <span className="text-xl font-bold leading-none">{value}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}

function SessionSummaryCard({
  wordsLearned,
  wordsReviewed,
  accuracy,
  xpEarned,
  streakDays,
  durationLabel,
  onContinue,
  onHome,
  className,
}: SessionSummaryCardProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-md rounded-card border border-border bg-card px-8 py-8 text-center",
        className
      )}
    >
      <p className="text-3xl" aria-hidden>
        🎉
      </p>
      <h2 className="mt-2 text-2xl font-bold text-text-primary">Tuyệt vời!</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Bạn đã hoàn thành buổi học.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {typeof wordsLearned === "number" && wordsLearned > 0 ? (
          <StatTile value={wordsLearned} label="Từ mới" tone="primary" />
        ) : null}
        {typeof wordsReviewed === "number" && wordsReviewed > 0 ? (
          <StatTile value={wordsReviewed} label="Đã ôn" tone="info" />
        ) : null}
        {typeof accuracy === "number" ? (
          <StatTile
            value={`${Math.round(accuracy)}%`}
            label="Chính xác"
            tone={accuracy >= 80 ? "primary" : "warning"}
          />
        ) : null}
        <StatTile value={`+${xpEarned}`} label="XP" tone="streak" />
        {typeof streakDays === "number" ? (
          <StatTile value={streakDays} label="Streak" tone="streak" />
        ) : null}
        {durationLabel ? (
          <StatTile value={durationLabel} label="Thời gian" tone="info" />
        ) : null}
      </div>
      <div className="mt-7 flex justify-center gap-2">
        {onHome ? (
          <LexiButton variant="quiet" onClick={onHome}>
            Trang chủ
          </LexiButton>
        ) : null}
        {onContinue ? (
          <LexiButton variant="nextStep" onClick={onContinue}>
            Học tiếp
          </LexiButton>
        ) : null}
      </div>
    </div>
  );
}

export { SessionSummaryCard };
