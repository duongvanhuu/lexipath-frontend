import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";
import type { FeatureUsage } from "./types";

export interface FeatureUsageCardProps {
  usage: FeatureUsage;
  className?: string;
}

function FeatureUsageCard({ usage, className }: FeatureUsageCardProps) {
  const { label, usedCount, limitCount, unit, overage = false } = usage;

  const percentage = limitCount > 0
    ? Math.min(Math.round((usedCount / limitCount) * 100), 100)
    : 0;

  const fractionLabel = unit
    ? `${usedCount} / ${limitCount} ${unit}`
    : `${usedCount} / ${limitCount}`;

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">{fractionLabel}</span>
          <span
            className={cn(
              "font-semibold tabular-nums",
              overage ? "text-danger-foreground" : "text-text-primary"
            )}
          >
            {percentage}%
          </span>
        </div>

        <Progress
          value={percentage}
          className={cn(
            "h-2",
            overage && "[&>[data-slot=progress-indicator]]:bg-danger"
          )}
          aria-label={`${label}: ${fractionLabel}`}
        />

        {overage ? (
          <div
            role="alert"
            className="flex items-center gap-1.5 text-xs text-danger-foreground"
          >
            <AlertTriangle className="size-3.5 shrink-0" aria-hidden />
            <span>Vượt quá giới hạn cho phép</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { FeatureUsageCard };
