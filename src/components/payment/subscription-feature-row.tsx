import * as React from "react";
import {
  AlarmClock,
  BarChart2,
  BookOpen,
  CheckCircle2,
  Layers,
  Library,
  Lock,
  NotebookPen,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";
import type { SubscriptionFeature } from "@/features/subscription/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  sparkles: Sparkles,
  library: Library,
  "notebook-pen": NotebookPen,
  "alarm-clock": AlarmClock,
  "bar-chart-2": BarChart2,
  "book-open": BookOpen,
  layers: Layers,
};

function FeatureIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] ?? Layers;
  return <Icon className={cn("size-4", className)} />;
}

export interface SubscriptionFeatureRowProps {
  feature: SubscriptionFeature;
}

function SubscriptionFeatureRow({ feature }: SubscriptionFeatureRowProps) {
  const { type, label, icon } = feature;

  if (type === "locked") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-[13px]">
        <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] bg-violet-100 text-violet-700">
          <Lock className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-primary">{label}</p>
          <p className="mt-0.5 text-xs font-medium text-violet-700">
            {feature.lockedNote ?? "Cần nâng cấp lên Pro"}
          </p>
        </div>
        <Badge className="shrink-0 bg-violet-100 text-violet-700 hover:bg-violet-100">
          Bị khóa
        </Badge>
      </div>
    );
  }

  if (type === "available") {
    return (
      <div className="flex items-center gap-3 rounded-xl border px-4 py-[13px]">
        <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] bg-success-soft text-success-foreground">
          <CheckCircle2 className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-primary">{label}</p>
          <p className="mt-0.5 text-xs text-success-foreground">
            {feature.availNote ?? "Khả dụng với gói hiện tại"}
          </p>
        </div>
        <Badge className="shrink-0 bg-success-soft text-success-foreground hover:bg-success-soft">
          Khả dụng
        </Badge>
      </div>
    );
  }

  /* quota */
  const used = feature.used ?? 0;
  const limit = feature.limit ?? 0;
  const pct = limit > 0 ? Math.round((used / limit) * 100) : 0;
  const atLimit = used >= limit && limit > 0;
  const nearLimit = pct >= 80 && !atLimit;
  const isWarn = atLimit || nearLimit;

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-[13px]",
        atLimit && "border-warning-foreground/30"
      )}
    >
      <div className="mb-2.5 flex items-center gap-2.5">
        <span
          className={cn(
            "flex size-[34px] shrink-0 items-center justify-center rounded-[9px]",
            isWarn
              ? "bg-warning-soft text-warning-foreground"
              : "bg-primary-soft text-primary-soft-foreground"
          )}
        >
          <FeatureIcon name={icon} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-primary">{label}</p>
          <p
            className={cn(
              "mt-0.5 text-xs",
              atLimit
                ? "text-warning-foreground"
                : "text-text-secondary"
            )}
          >
            {atLimit
              ? "Đã dùng hết hạn mức hôm nay"
              : nearLimit
                ? `${used}/${limit} · Sắp đạt giới hạn`
                : `${used}/${limit}`}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 text-sm font-bold tabular-nums",
            atLimit
              ? "text-warning-foreground"
              : nearLimit
                ? "text-warning-foreground"
                : "text-text-primary"
          )}
        >
          {used}/{limit}
        </span>
      </div>
      <Progress
        value={pct}
        className={cn(
          "h-1.5",
          isWarn &&
            "[&>[data-slot=progress-indicator]]:bg-warning-foreground"
        )}
        aria-label={`${label}: ${used} / ${limit}`}
      />
    </div>
  );
}

export { SubscriptionFeatureRow };
