import * as React from "react";
import type { Metadata } from "next";
import { BarChart3, Play } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatsFilterBar } from "@/features/stats/components/stats-filter-bar";
import { StatsHeroPair } from "@/features/stats/components/stats-hero-pair";
import { StatsTodaySection } from "@/features/stats/components/stats-today-section";
import { StatsWeeklyChart } from "@/features/stats/components/stats-weekly-chart";
import { StatsNavGrid } from "@/features/stats/components/stats-nav-grid";
import {
  MOCK_LANG_STATS,
  MOCK_ACCOUNT_STATS,
  MOCK_COLLECTIONS,
  MOCK_SKILLS,
} from "@/features/stats";
import type { LangCode, StatsScope, StatsRange } from "@/features/stats";

export const metadata: Metadata = {
  title: "Thống kê học tập",
};

type SearchParams = {
  scope?: string;
  range?: string;
  lang?: string;
  demo?: string;
};

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const lang = (params.lang as LangCode) ?? "ja";
  const scope = (params.scope as StatsScope) ?? "lang";
  const range = (params.range as StatsRange) ?? "7d";
  const demo = params.demo;

  const langStats = MOCK_LANG_STATS[lang] ?? MOCK_LANG_STATS.ja;
  const skills = MOCK_SKILLS[lang] ?? MOCK_SKILLS.ja;
  const collections = MOCK_COLLECTIONS[lang] ?? MOCK_COLLECTIONS.ja;
  const learningColls = collections.filter((c) => c.status === "learning");

  const today = langStats.today;
  const goalDone = today.metGoal;

  const weakSkill = skills
    .filter((s) => s.status !== "no-data")
    .sort((a, b) => a.accuracy - b.accuracy)[0];

  const motivation = goalDone
    ? "Bạn đã đạt mục tiêu hôm nay — xuất sắc! 🎉"
    : today.progress >= today.goal * 0.8
      ? `Gần đạt rồi — còn ${today.goal - today.progress} từ nữa thôi! 💪`
      : langStats.streak >= 10
        ? `${langStats.streak} ngày liên tiếp — bạn đang trong đà tuyệt vời! 🔥`
        : "Mỗi từ học hôm nay đều tích lũy theo thời gian 📈";

  if (demo === "new-user") {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Thống kê học tập</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center px-8 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-success-soft">
              <BarChart3 className="size-8 text-success-foreground" aria-hidden />
            </div>
            <h2 className="mt-5 text-xl font-bold">Bắt đầu học để xem tiến độ của bạn</h2>
            <p className="mt-2 max-w-sm text-sm text-text-secondary leading-relaxed">
              Thống kê sẽ xuất hiện sau phiên học đầu tiên.
            </p>
            <Button asChild className="mt-6">
              <Link href={"/learn" as never}>
                <Play className="mr-1.5 size-4" aria-hidden />
                Bắt đầu bài đầu tiên
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <StatsFilterBar
        scope={scope}
        range={range}
        lang={lang}
        langName={langStats.name}
        langFlag={langStats.flag}
        motivation={motivation}
      />

      <StatsHeroPair
        langStats={langStats}
        accountStats={MOCK_ACCOUNT_STATS}
        scope={scope}
      />

      <section aria-labelledby="today-heading">
        <h2 id="today-heading" className="mb-3 text-sm font-semibold text-text-secondary uppercase tracking-wide">
          Hôm nay
        </h2>
        <StatsTodaySection
          today={today}
          langName={langStats.name}
          goalDone={goalDone}
        />
      </section>

      <section aria-labelledby="week-heading">
        <h2 id="week-heading" className="mb-3 text-sm font-semibold text-text-secondary uppercase tracking-wide">
          Tuần này
        </h2>
        <StatsWeeklyChart
          days={langStats.week}
          langName={langStats.name}
          scope={scope}
          streakStatus={langStats.streakStatus}
          streakRemaining={langStats.streakRemaining}
        />
      </section>

      <section aria-labelledby="detail-heading">
        <h2 id="detail-heading" className="mb-3 text-sm font-semibold text-text-secondary uppercase tracking-wide">
          Chi tiết
        </h2>
        <StatsNavGrid
          weakSkillLabel={weakSkill?.label}
          collectionsCount={learningColls.length}
          todayXp={today.xp}
          leaderboardRank={4}
        />
      </section>
    </div>
  );
}
