import * as React from "react";
import { Star, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

import type { XpData } from "./types";

export type XpStatCardProps = {
  xp: XpData;
  className?: string;
};

function XpStatCard({ xp, className }: XpStatCardProps) {
  const weekTotal = xp.weekHistory.reduce((sum, d) => sum + d.xp, 0);

  return (
    <Card className={cn("rounded-card shadow-card", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Star className="size-4 text-golden-foreground" aria-hidden />
          XP của bạn
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* Total XP */}
        <div className="flex flex-col">
          <span className="text-3xl font-bold leading-none text-golden-foreground">
            {xp.totalXp.toLocaleString()}
          </span>
          <span className="mt-0.5 text-xs text-text-muted">tổng XP</span>
        </div>

        {/* Sub-stats */}
        <div className="flex items-center gap-4 border-t border-border pt-3">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-text-primary">
              +{xp.todayXp}
            </span>
            <span className="text-xs text-text-muted">hôm nay</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-pill bg-success-soft px-2.5 py-1">
            <TrendingUp className="size-3.5 text-success-foreground" aria-hidden />
            <span className="text-xs font-medium text-success-foreground">
              +{weekTotal} tuần này
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { XpStatCard };
