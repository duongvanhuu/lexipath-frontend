"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  TrendingUp,
  Award,
  BookOpen,
  Target,
  AlarmClock,
  Flame,
  Ear,
  Gift,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatsChipFilter } from "@/features/stats/components/stats-chip-filter";
import { MOCK_XP_LEDGER, LANG_META } from "@/features/stats";
import type { XpEntryType } from "@/features/stats";
import { cn } from "@/lib/utils/cn";

const LEDGER_ICON_MAP: Record<string, LucideIcon> = {
  "book-open":   BookOpen,
  "target":      Target,
  "alarm-clock": AlarmClock,
  "flame":       Flame,
  "ear":         Ear,
  "gift":        Gift,
};

const XP_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "lesson", label: "Học bài" },
  { id: "golden", label: "Golden Time" },
  { id: "daily", label: "Daily Goal" },
  { id: "streak", label: "Streak" },
  { id: "weak", label: "Kỹ năng yếu" },
  { id: "bonus", label: "Bonus" },
];

export default function StatsXpPage() {
  const [filter, setFilter] = React.useState<string>("all");

  const todayXp = MOCK_XP_LEDGER.filter((x) => x.time.startsWith("Hôm nay")).reduce((s, x) => s + x.xp, 0);
  const weekXp = MOCK_XP_LEDGER.reduce((s, x) => s + x.xp, 0);

  const byLang = MOCK_XP_LEDGER.reduce<Record<string, number>>((acc, x) => {
    acc[x.lang] = (acc[x.lang] ?? 0) + x.xp;
    return acc;
  }, {});

  const filtered = filter === "all" ? MOCK_XP_LEDGER : MOCK_XP_LEDGER.filter((x) => x.type === filter);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link href="/stats">
            <ArrowLeft className="size-4" aria-hidden />
            Thống kê
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">XP & Lịch sử</h1>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Star className="size-4 text-golden-foreground" />, value: `+${todayXp}`, label: "XP hôm nay", sub: "Toàn tài khoản" },
          { icon: <TrendingUp className="size-4 text-primary-soft-foreground" />, value: `+${weekXp}`, label: "XP tuần này", sub: "Toàn tài khoản" },
          { icon: <Award className="size-4 text-text-muted" />, value: "4.820", label: "Tổng XP", sub: "Toàn tài khoản" },
        ].map((t) => (
          <Card key={t.label}>
            <CardContent className="p-3">
              <div className="mb-1 flex items-center gap-1.5">
                {t.icon}
                <span className="text-xs text-text-muted">{t.label}</span>
              </div>
              <div className="text-xl font-bold">{t.value}</div>
              <div className="text-[11px] text-text-muted">{t.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* XP by language */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">XP theo ngôn ngữ · tuần này</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {Object.entries(byLang).map(([lc, xp]) => {
            const lm = LANG_META[lc as keyof typeof LANG_META];
            const pct = weekXp > 0 ? Math.round((xp / weekXp) * 100) : 0;
            return (
              <div key={lc} className="flex items-center gap-3">
                <span className="text-base shrink-0">{lm.flag}</span>
                <span className="min-w-[96px] shrink-0 text-xs text-text-secondary">{lm.name}</span>
                <div className="flex-1 h-2 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                    role="presentation"
                  />
                </div>
                <span className="min-w-[48px] text-right text-xs font-bold">+{xp} XP</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Level progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Cấp độ hiện tại</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-golden-soft">
              <Award className="size-6 text-golden-foreground" aria-hidden />
            </div>
            <div className="flex-1">
              <div className="mb-1.5 flex justify-between">
                <span className="text-sm font-bold">Cấp 8</span>
                <span className="text-sm font-bold text-text-secondary">Cấp 9</span>
              </div>
              <Progress value={83} className="h-2" />
            </div>
          </div>
          <p className="text-xs text-text-secondary">
            Cần thêm <strong>260 XP</strong> để lên cấp 9 — tiếp tục học đều là đủ!
          </p>
        </CardContent>
      </Card>

      {/* Ledger */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">
          Lịch sử hoạt động
        </h2>
        <div className="mb-3">
          <StatsChipFilter items={XP_FILTERS} active={filter} onChange={setFilter} />
        </div>
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-sm text-text-secondary">Không có hoạt động nào phù hợp.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="divide-y divide-border">
              {filtered.map((x, i) => {
                const lm = LANG_META[x.lang];
                return (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", x.bgClass, x.fgClass)}>
                      {React.createElement(LEDGER_ICON_MAP[x.icon] ?? Star, { className: "size-4", "aria-hidden": true })}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold">{x.label}</div>
                      <div className="mt-0.5 text-xs text-text-secondary">
                        {x.detail}
                        <span className="text-text-muted"> · {lm.flag} {lm.name}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-bold text-primary">+{x.xp} XP</div>
                      <div className="text-[11px] text-text-muted">{x.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
