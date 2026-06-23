import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Target, TrendingUp, AlertCircle, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StatsSkillCard } from "@/features/stats/components/stats-skill-card";
import { MOCK_SKILLS, MOCK_LANG_STATS } from "@/features/stats";
import type { LangCode } from "@/features/stats";

export const metadata: Metadata = { title: "Kỹ năng học tập" };

export default async function StatsSkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const lang = (params.lang as LangCode) ?? "ja";
  const langStats = MOCK_LANG_STATS[lang] ?? MOCK_LANG_STATS.ja;
  const allSkills = MOCK_SKILLS[lang] ?? MOCK_SKILLS.ja;
  const realSkills = allSkills.filter((s) => s.status !== "no-data");

  const weakest = realSkills.length
    ? realSkills.reduce((a, b) => (a.accuracy < b.accuracy ? a : b))
    : allSkills[0];
  const allStrong = realSkills.every((s) => s.accuracy >= 85);
  const avgAcc = realSkills.length
    ? Math.round(realSkills.reduce((s, sk) => s + sk.accuracy, 0) / realSkills.length)
    : 0;
  const improving = allSkills.filter((s) => s.trendDir === 1).length;
  const totalWeak = allSkills.reduce((s, sk) => s + sk.weakItems, 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Back + header */}
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link href="/stats">
            <ArrowLeft className="size-4" aria-hidden />
            Thống kê
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Kỹ năng học tập</h1>
        <Badge variant="secondary">
          {langStats.flag} {langStats.name}
        </Badge>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Target className="size-5 text-primary" />, value: `${avgAcc}%`, label: "Trung bình chung", sub: `${realSkills.length} kỹ năng` },
          { icon: <TrendingUp className="size-5 text-primary-soft-foreground" />, value: `${improving}/${allSkills.length}`, label: "Đang tiến bộ", sub: "7 ngày gần nhất" },
          { icon: <AlertCircle className="size-5 text-warning-foreground" />, value: totalWeak, label: "Tổng từ yếu", sub: "Cần ôn thêm" },
        ].map((t) => (
          <Card key={t.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                {t.icon}
                <span className="text-xs text-text-muted">{t.label}</span>
              </div>
              <div className="text-2xl font-bold">{t.value}</div>
              <div className="text-xs text-text-muted mt-0.5">{t.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weakest skill highlight / all strong */}
      {allStrong ? (
        <Card className="border-success/30 bg-success-soft">
          <CardContent className="flex flex-col items-center py-10 text-center">
            <span className="text-4xl" role="img" aria-label="target">🎯</span>
            <h3 className="mt-3 text-lg font-bold text-success-foreground">Tất cả kỹ năng đều tốt!</h3>
            <p className="mt-1 max-w-xs text-sm text-text-secondary">
              Bạn đang học rất đều và chính xác. Tiếp tục nhé!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger/20">
              <AlertCircle className="size-5 text-danger-foreground" aria-hidden />
            </span>
            <div>
              <div className="text-sm font-semibold">
                Kỹ năng yếu nhất:{" "}
                <span className="text-danger-foreground">{weakest?.label}</span>
              </div>
              <div className="mt-0.5 text-xs text-text-secondary">
                {weakest?.accuracy}% chính xác · {weakest?.weakItems} từ cần ôn thêm
              </div>
            </div>
          </div>
          <Button asChild size="sm">
            <Link href={"/learn" as never}>
              <Play className="mr-1 size-3" aria-hidden />
              Luyện ngay
            </Link>
          </Button>
        </div>
      )}

      {/* Skill cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {allSkills.map((sk) => (
          <StatsSkillCard key={sk.id} skill={sk} practiceHref={"/learn" as never} />
        ))}
      </div>
    </div>
  );
}
