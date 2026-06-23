import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Flame, Trophy, CalendarCheck, CheckCircle, XCircle, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsStreakCalendar } from "@/features/stats/components/stats-streak-calendar";
import { MOCK_LANG_STATS, MOCK_ACCOUNT_STATS } from "@/features/stats";
import type { LangCode, StatsScope } from "@/features/stats";

export const metadata: Metadata = { title: "Chi tiết streak" };

export default async function StatsStreakPage({
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
  const scopeLabel = scope === "account" ? "Toàn tài khoản" : langStats.name;

  const cal = langStats.streakCalendar;
  const completedDays = cal.filter(Boolean).length;
  const missedDays = cal.filter((d) => !d).length;
  const atRisk = langStats.streakStatus === "at-risk";
  const broken = langStats.streakStatus === "broken";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link href="/stats">
            <ArrowLeft className="size-4" aria-hidden />
            Thống kê
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Chi tiết streak</h1>
        <Badge variant="secondary">{langStats.flag} {scopeLabel}</Badge>
      </div>

      {atRisk && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-golden/30 bg-golden-soft px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label="streak fire">🔥</span>
            <div>
              <div className="text-sm font-semibold text-golden-foreground">Streak đang có nguy cơ!</div>
              <div className="mt-0.5 text-xs text-text-secondary">
                Còn {langStats.streakRemaining} từ để giữ streak {langStats.name} hôm nay.
              </div>
            </div>
          </div>
          <Button asChild size="sm">
            <Link href={"/learn" as never}>Học ngay</Link>
          </Button>
        </div>
      )}

      {broken && (
        <div className="flex items-center gap-3 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3">
          <span className="text-2xl" role="img" aria-label="broken">💔</span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-danger-foreground">Streak đã bị gián đoạn</div>
            <div className="mt-0.5 text-xs text-text-secondary">
              Hôm nay học đều để bắt đầu chuỗi mới nhé!
            </div>
          </div>
          <Button asChild size="sm">
            <Link href={"/learn" as never}>Bắt đầu lại</Link>
          </Button>
        </div>
      )}

      {/* Summary tiles */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Flame className="size-5 text-golden-foreground" />, value: `${streak} ngày`, label: "Streak hiện tại", sub: scopeLabel },
          { icon: <Trophy className="size-5 text-golden-foreground" />, value: `${record} ngày`, label: "Kỷ lục cá nhân", sub: scopeLabel },
          { icon: <CalendarCheck className="size-5 text-primary-soft-foreground" />, value: completedDays, label: "Ngày hoàn thành", sub: "28 ngày qua" },
        ].map((t) => (
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

      {/* 28-day calendar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            28 ngày qua
            <span className="ml-1.5 font-normal text-text-muted">· {scopeLabel}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StatsStreakCalendar calendar={cal} />
        </CardContent>
      </Card>

      {/* Completed vs missed pair */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success-soft text-success-foreground">
              <CheckCircle className="size-5" aria-hidden />
            </span>
            <div>
              <div className="text-xl font-bold">{completedDays}</div>
              <div className="text-xs text-text-secondary">Ngày hoàn thành</div>
              <div className="mt-0.5 text-[10px] font-medium text-primary">28 ngày qua</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger-soft text-danger-foreground">
              <XCircle className="size-5" aria-hidden />
            </span>
            <div>
              <div className="text-xl font-bold text-danger-foreground">{missedDays}</div>
              <div className="text-xs text-text-secondary">Ngày bỏ lỡ</div>
              <div className="mt-0.5 text-[10px] font-medium text-text-muted">28 ngày qua</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info card */}
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-success-soft text-primary">
            <Info className="size-5" aria-hidden />
          </span>
          <div>
            <div className="text-sm font-semibold">Yêu cầu giữ streak mỗi ngày</div>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">
              Hoàn thành ít nhất 1 bài học hoặc 5 lượt ôn Golden Time mỗi ngày để giữ streak {langStats.name}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
