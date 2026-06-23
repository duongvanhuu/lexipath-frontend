import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Flame, Trophy, Star, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatsHeatmapGrid } from "@/features/stats/components/stats-heatmap-grid";
import { StatsWeeklyMetricList } from "@/features/stats/components/stats-weekly-metric-list";
import { MOCK_LANG_STATS, MOCK_ACCOUNT_STATS } from "@/features/stats";
import type { LangCode, StatsScope } from "@/features/stats";

export const metadata: Metadata = { title: "Hoạt động học tập" };

export default async function StatsHeatmapPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; scope?: string }>;
}) {
  const params = await searchParams;
  const lang = (params.lang as LangCode) ?? "ja";
  const scope = (params.scope as StatsScope) ?? "lang";
  const langStats = MOCK_LANG_STATS[lang] ?? MOCK_LANG_STATS.ja;

  const streak = scope === "account" ? MOCK_ACCOUNT_STATS.streak : langStats.streak;
  const record = scope === "account" ? MOCK_ACCOUNT_STATS.streakRecord : langStats.streakRecord;
  const atRisk = langStats.streakStatus === "at-risk";

  const weekXp   = langStats.week.reduce((s, d) => s + d.xp,   0);
  const weekMins = langStats.week.reduce((s, d) => s + d.mins, 0);

  const tiles = [
    { icon: <Flame className="size-4 text-golden-foreground" aria-hidden />, value: `${streak} ngày`, label: "Streak hiện tại", sub: langStats.name },
    { icon: <Trophy className="size-4 text-golden-foreground" aria-hidden />, value: `${record} ngày`, label: "Kỷ lục",           sub: "ngày"          },
    { icon: <Star className="size-4 text-golden-foreground" aria-hidden />,  value: weekXp,            label: "XP tuần này",     sub: langStats.name  },
    { icon: <Clock className="size-4 text-primary-soft-foreground" aria-hidden />, value: `${weekMins} ph`, label: "Tổng thời gian", sub: "tuần này"   },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link href="/stats">
            <ArrowLeft className="size-4" aria-hidden />
            Thống kê
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Hoạt động học tập</h1>
        <Badge variant="secondary">
          {langStats.flag} {langStats.name}
        </Badge>
      </div>

      {/* At-risk streak banner */}
      {atRisk && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-golden/30 bg-golden-soft px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xl" role="img" aria-label="streak lửa">🔥</span>
            <span className="text-sm font-semibold text-golden-foreground">
              Còn {langStats.streakRemaining} từ để giữ streak {langStats.name} hôm nay
            </span>
          </div>
          <Button asChild size="sm">
            <Link href={"/learn" as never}>Học ngay</Link>
          </Button>
        </div>
      )}

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <Card key={t.label}>
            <CardContent className="p-4">
              <div className="mb-1 flex items-center gap-2">
                {t.icon}
                <span className="text-xs text-text-muted">{t.label}</span>
              </div>
              <div className="text-xl font-bold">{t.value}</div>
              <div className="mt-0.5 text-xs text-text-muted">{t.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 18-week heatmap */}
      <Card>
        <CardContent className="pt-5">
          <StatsHeatmapGrid cells={langStats.heatmapCells} langName={langStats.name} />
        </CardContent>
      </Card>

      {/* 7-day metric list */}
      <section aria-labelledby="weekly-metric-heading">
        <h2
          id="weekly-metric-heading"
          className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary"
        >
          7 ngày này
        </h2>
        <StatsWeeklyMetricList days={langStats.week} langName={langStats.name} />
      </section>
    </div>
  );
}
