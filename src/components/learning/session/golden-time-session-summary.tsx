import * as React from "react";
import {
  BookOpen,
  Calendar,
  Headphones,
  Info,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { LexiButton } from "@/components/shared";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";
import type { SessionSkillBreakdownItem } from "@/features/learning/types/session.types";

export type GoldenTimeSessionSummaryProps = {
  correctCount: number;
  incorrectCount: number;
  totalXp: number;
  durationLabel: string;
  skillBreakdown: SessionSkillBreakdownItem[];
  nextReviewLabel?: string;
  onHome: () => void;
  onReviewWeak?: () => void;
  onViewNotebook?: () => void;
  className?: string;
};

// ── Stat tile ─────────────────────────────────────────────────────────────────

type StatTileTone = "success" | "warning" | "golden" | "info";

function StatTile({
  value,
  label,
  tone,
}: {
  value: string | number;
  label: string;
  tone: StatTileTone;
}) {
  const cls: Record<StatTileTone, string> = {
    success: "bg-success-soft text-success-foreground",
    warning: "bg-warning-soft text-warning-foreground",
    golden: "bg-golden-soft text-golden-foreground",
    info: "bg-muted text-muted-foreground",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 rounded-xl px-3 py-4",
        cls[tone]
      )}
    >
      <span className="text-2xl font-bold leading-none">{value}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}

// ── Info row ──────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
  last = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 py-2.5 text-sm",
        !last && "border-b border-border"
      )}
    >
      <span className="flex items-center gap-2 text-text-secondary">
        <Icon className="size-4 shrink-0 text-text-muted" aria-hidden />
        {label}
      </span>
      <span className="font-semibold text-text-primary whitespace-nowrap">
        {value}
      </span>
    </div>
  );
}

// ── Skill bar ─────────────────────────────────────────────────────────────────

function SkillBar({ item }: { item: SessionSkillBreakdownItem }) {
  const accuracy = item.total > 0 ? item.correct / item.total : 0;
  const indicatorCls =
    accuracy >= 0.8
      ? "[&>[data-slot=progress-indicator]]:bg-primary"
      : accuracy >= 0.5
        ? "[&>[data-slot=progress-indicator]]:bg-warning"
        : "[&>[data-slot=progress-indicator]]:bg-danger";

  return (
    <li className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-text-primary">{item.label}</span>
        <span className="text-text-secondary">
          {item.correct}/{item.total} đúng
        </span>
      </div>
      <Progress
        value={Math.round(accuracy * 100)}
        className={cn("h-1.5", indicatorCls)}
      />
    </li>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getWeakestSkill(
  breakdown: SessionSkillBreakdownItem[]
): SessionSkillBreakdownItem | undefined {
  if (breakdown.length === 0) return undefined;
  return [...breakdown].sort((a, b) => {
    const accA = a.total > 0 ? a.correct / a.total : 0;
    const accB = b.total > 0 ? b.correct / b.total : 0;
    return accA - accB;
  })[0];
}

// ── Main component ────────────────────────────────────────────────────────────

function GoldenTimeSessionSummary({
  correctCount,
  incorrectCount,
  totalXp,
  durationLabel,
  skillBreakdown,
  nextReviewLabel = "Ngày mai",
  onHome,
  onReviewWeak,
  onViewNotebook,
  className,
}: GoldenTimeSessionSummaryProps) {
  const total = correctCount + incorrectCount;
  const weakest = getWeakestSkill(skillBreakdown);
  const hasBreakdown = skillBreakdown.length > 0;

  const headerMsg =
    correctCount === total
      ? "Tuyệt vời! Bạn nhớ tất cả từ trong buổi này."
      : correctCount >= Math.ceil(total * 0.7)
        ? "Làm tốt lắm! Ôn thêm một chút nữa là vững."
        : "Tiếp tục ôn thêm — mỗi lần lặp giúp bạn nhớ lâu hơn.";

  return (
    <div className={cn("mx-auto w-full max-w-md space-y-5", className)}>
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <span
          aria-hidden
          className="flex size-16 items-center justify-center rounded-full bg-golden-soft text-4xl leading-none"
        >
          ⭐
        </span>
        <h1 className="text-2xl font-bold text-text-primary">Ôn tập xong!</h1>
        <p className="text-sm text-text-secondary">{headerMsg}</p>
        <p className="text-xs text-text-muted">
          Thời gian:{" "}
          <span className="font-medium text-text-primary">{durationLabel}</span>
        </p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatTile value={correctCount} label="Đã nhớ" tone="success" />
        <StatTile
          value={incorrectCount}
          label="Cần ôn thêm"
          tone={incorrectCount === 0 ? "info" : "warning"}
        />
        <StatTile value={`+${totalXp}`} label="XP" tone="golden" />
      </div>

      {/* Detail rows */}
      <div className="rounded-card border border-border bg-card px-4">
        {weakest ? (
          <InfoRow
            icon={Headphones}
            label="Kỹ năng cần cải thiện"
            value={weakest.label}
          />
        ) : null}
        <InfoRow
          icon={Calendar}
          label="Lần ôn tiếp theo"
          value={nextReviewLabel}
        />
        <InfoRow
          icon={TrendingUp}
          label="Từ chuyển lên (nhớ tốt)"
          value={`${correctCount} từ`}
        />
        <InfoRow
          icon={TrendingDown}
          label="Từ ôn sớm hơn (cần thêm)"
          value={`${incorrectCount} từ`}
          last
        />
      </div>

      {/* Skill breakdown */}
      {hasBreakdown ? (
        <div className="rounded-card border border-border bg-card p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Kỹ năng trong buổi ôn
          </p>
          <ul className="space-y-3" role="list">
            {skillBreakdown.map((item) => (
              <SkillBar key={item.skill} item={item} />
            ))}
          </ul>
        </div>
      ) : null}

      {/* Golden Time insight */}
      <div className="flex items-start gap-3 rounded-card border border-golden/20 bg-golden-soft/40 px-4 py-3">
        <Info
          className="mt-0.5 size-4 shrink-0 text-golden-foreground"
          aria-hidden
        />
        <p className="text-sm text-golden-foreground">
          <span className="font-semibold">Tại sao Golden Time hiệu quả?</span>{" "}
          Ôn đúng thời điểm trước khi quên giúp não bộ củng cố ký ức lâu dài —
          bạn cần ôn ít hơn mà nhớ nhiều hơn.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-2">
        <LexiButton variant="golden" fullWidth onClick={onHome}>
          Về trang chủ
        </LexiButton>
        {onReviewWeak ? (
          <LexiButton
            variant="outline"
            fullWidth
            onClick={onReviewWeak}
            iconLeft={<Target className="size-4" aria-hidden />}
          >
            Ôn thêm từ yếu
          </LexiButton>
        ) : null}
        {onViewNotebook ? (
          <LexiButton
            variant="quiet"
            fullWidth
            onClick={onViewNotebook}
            iconLeft={<BookOpen className="size-4" aria-hidden />}
          >
            Xem Notebook
          </LexiButton>
        ) : null}
      </div>
    </div>
  );
}

export { GoldenTimeSessionSummary };
