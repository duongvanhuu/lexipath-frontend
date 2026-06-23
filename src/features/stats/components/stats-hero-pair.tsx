import * as React from "react";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { LangStats, StatsScope, AccountStats } from "@/features/stats";

export type StatsHeroPairProps = {
  langStats: LangStats;
  accountStats: AccountStats;
  scope: StatsScope;
};

function StatsHeroPair({ langStats, accountStats, scope }: StatsHeroPairProps) {
  const streak = scope === "account" ? accountStats.streak : langStats.streak;
  const streakRecord = scope === "account" ? accountStats.streakRecord : langStats.streakRecord;
  const xpTotal = scope === "account" ? accountStats.xpTotal : langStats.xpTotal;
  const xpWeek = langStats.xpWeek;
  const scopeLabel = scope === "account" ? "Toàn tài khoản" : langStats.name;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Streak hero */}
      <Link href="/stats/streak" className="block">
        <Card
          className={cn(
            "h-full cursor-pointer border-golden/30 bg-golden-soft transition-shadow hover:shadow-md"
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl leading-none" role="img" aria-label="streak">🔥</span>
              <div>
                <div className="text-2xl font-bold leading-none text-golden-foreground">
                  {streak} ngày
                </div>
                <div className="mt-1 text-xs text-text-secondary">
                  Streak · {scopeLabel}
                </div>
                <div className="mt-1 text-xs font-medium text-golden-foreground">
                  Kỷ lục: {streakRecord} ngày
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-golden-foreground">
              <ChevronRight className="size-3" aria-hidden />
              Xem chi tiết streak
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* XP card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-golden-soft">
              <Star className="size-6 text-golden-foreground" aria-hidden />
            </div>
            <div>
              <div className="text-xl font-bold leading-none">
                {xpTotal.toLocaleString("vi")}
                <span className="ml-1 text-xs font-normal text-text-secondary">XP</span>
              </div>
              <div className="mt-1 text-xs text-text-secondary">{scopeLabel}</div>
              <div className="mt-1 text-xs font-medium text-primary">
                +{xpWeek} XP tuần này · {langStats.name}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { StatsHeroPair };
