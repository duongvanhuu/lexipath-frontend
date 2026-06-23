import * as React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { LexiButton } from "@/components/shared";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";
import type { SessionSkillBreakdownItem } from "@/features/learning/types/session.types";

export type LearningSessionSummaryProps = {
  lessonTitle: string;
  correctCount: number;
  incorrectCount: number;
  totalXp: number;
  durationLabel: string;
  skillBreakdown: SessionSkillBreakdownItem[];
  onHome: () => void;
  onContinue?: () => void;
  onReviewWeak?: () => void;
  className?: string;
};

// ── Stat tile ────────────────────────────────────────────────────────────────

const statTileVariants = cva(
  "flex flex-col items-center gap-1 rounded-md px-3 py-3",
  {
    variants: {
      tone: {
        primary: "bg-primary/10 text-primary",
        warning: "bg-warning-soft text-warning-foreground",
        danger: "bg-danger-soft text-danger-foreground",
        streak: "bg-golden-soft text-golden-foreground",
        info: "bg-muted text-muted-foreground",
        muted: "bg-muted/50 text-muted-foreground",
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

// ── Skill accuracy mini-bar ───────────────────────────────────────────────────

function AccuracyBar({ accuracy }: { accuracy: number }) {
  const indicatorClass =
    accuracy >= 0.8
      ? "[&>[data-slot=progress-indicator]]:bg-primary"
      : accuracy >= 0.5
        ? "[&>[data-slot=progress-indicator]]:bg-warning"
        : "[&>[data-slot=progress-indicator]]:bg-danger";

  return (
    <Progress
      value={Math.round(accuracy * 100)}
      className={cn("h-1.5", indicatorClass)}
    />
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getAccuracySubtitle(accuracy: number): string {
  if (accuracy >= 0.9) return "Xuất sắc! Bạn nắm vững bài học này.";
  if (accuracy >= 0.7) return "Tốt lắm! Tiếp tục ôn luyện để củng cố.";
  return "Cố gắng lên! Ôn lại bài sẽ giúp bạn tiến bộ nhanh hơn.";
}

function getWeakestSkill(
  breakdown: SessionSkillBreakdownItem[]
): SessionSkillBreakdownItem | null {
  const sorted = [...breakdown].sort((a, b) => {
    const accA = a.total > 0 ? a.correct / a.total : 0;
    const accB = b.total > 0 ? b.correct / b.total : 0;
    return accA - accB;
  });
  const weakest = sorted[0];
  if (!weakest) return null;
  const acc = weakest.total > 0 ? weakest.correct / weakest.total : 0;
  return acc < 0.6 ? weakest : null;
}

function getAccuracyTone(pct: number): StatTileTone {
  if (pct >= 80) return "primary";
  if (pct >= 50) return "warning";
  return "danger";
}

// ── Main component ────────────────────────────────────────────────────────────

function LearningSessionSummary({
  lessonTitle,
  correctCount,
  incorrectCount,
  totalXp,
  durationLabel,
  skillBreakdown,
  onHome,
  onContinue,
  onReviewWeak,
  className,
}: LearningSessionSummaryProps) {
  const total = correctCount + incorrectCount;
  const accuracy = total > 0 ? correctCount / total : 0;
  const accuracyPct = Math.round(accuracy * 100);
  const hasBreakdown = skillBreakdown.length > 0;
  const weakestSkill = hasBreakdown ? getWeakestSkill(skillBreakdown) : null;

  return (
    <div className={cn("mx-auto w-full max-w-md space-y-5", className)}>
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <CheckCircle2 className="size-12 text-primary" aria-hidden />
        <h1 className="text-2xl font-bold text-text-primary">
          Phiên học hoàn thành!
        </h1>
        <p className="text-sm text-text-secondary">
          {getAccuracySubtitle(accuracy)}
        </p>
        <p className="text-xs text-text-muted">
          Bạn vừa hoàn thành:{" "}
          <span className="font-medium">{lessonTitle}</span>
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile
          value={total > 0 ? `${correctCount}/${total}` : correctCount}
          label="Đúng"
          tone="primary"
        />
        <StatTile
          value={incorrectCount}
          label="Sai"
          tone={incorrectCount === 0 ? "muted" : "warning"}
        />
        <StatTile
          value={`${accuracyPct}%`}
          label="Độ chính xác"
          tone={getAccuracyTone(accuracyPct)}
        />
        <StatTile value={`+${totalXp}`} label="XP nhận được" tone="streak" />
        <StatTile value={durationLabel} label="Thời gian" tone="info" />
      </div>

      {/* Skill breakdown */}
      {hasBreakdown ? (
        <div className="rounded-card border border-border bg-card p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Kỹ năng trong buổi học
          </p>
          <ul className="space-y-3" role="list">
            {skillBreakdown.map((item) => {
              const itemAccuracy =
                item.total > 0 ? item.correct / item.total : 0;
              return (
                <li key={item.skill} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-text-primary">
                      {item.label}
                    </span>
                    <span className="text-text-secondary">
                      {item.correct}/{item.total} đúng
                    </span>
                  </div>
                  <AccuracyBar accuracy={itemAccuracy} />
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {/* Weak area hint */}
      {hasBreakdown ? (
        weakestSkill ? (
          <div className="flex items-start gap-3 rounded-md bg-warning-soft px-4 py-3">
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0 text-warning-foreground"
              aria-hidden
            />
            <p className="text-sm text-warning-foreground">
              {`Kỹ năng ${weakestSkill.label} còn cần ôn thêm — thử Golden Time để củng cố.`}
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-md bg-success-soft px-4 py-3">
            <CheckCircle2
              className="mt-0.5 size-4 shrink-0 text-success-foreground"
              aria-hidden
            />
            <p className="text-sm text-success-foreground">
              Bạn làm tốt tất cả kỹ năng trong buổi học!
            </p>
          </div>
        )
      ) : null}

      {/* CTAs */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <LexiButton variant="quiet" onClick={onHome}>
          Về trang chủ
        </LexiButton>
        {onReviewWeak ? (
          <LexiButton variant="path" onClick={onReviewWeak}>
            Ôn từ yếu
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

export { LearningSessionSummary };
