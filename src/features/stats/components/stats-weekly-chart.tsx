"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { WeekDay } from "@/features/stats";

export type StatsWeeklyChartProps = {
  days: WeekDay[];
  langName: string;
  scope: string;
  streakStatus: "active" | "at-risk" | "broken";
  streakRemaining: number;
};

type MetricId = "xp" | "learned" | "reviewed" | "mins";

const METRICS: { id: MetricId; label: string; unit: string }[] = [
  { id: "xp", label: "XP", unit: "XP" },
  { id: "learned", label: "Từ mới", unit: "từ" },
  { id: "reviewed", label: "Lượt ôn", unit: "từ" },
  { id: "mins", label: "Phút học", unit: "phút" },
];

function StatsWeeklyChart({ days, langName, scope, streakStatus, streakRemaining }: StatsWeeklyChartProps) {
  const [metric, setMetric] = React.useState<MetricId>("xp");

  const am = METRICS.find((m) => m.id === metric)!;
  const total = days.reduce((s, d) => s + (d[metric] ?? 0), 0);
  const activeDays = days.filter((d) => d.active).length;
  const missedDays = days.filter((d) => !d.active && !d.isToday).length;
  const scopeLbl = scope === "account" ? "Toàn tài khoản" : langName;
  const atRisk = streakStatus === "at-risk";
  const broken = streakStatus === "broken";

  const chartData = days.map((d) => ({
    day: d.day,
    value: d[metric] ?? 0,
    isToday: d.isToday,
    active: d.active,
  }));

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-text-primary">Hoạt động tuần này</p>
            <p className="mt-0.5 text-xs text-text-muted">
              {activeDays}/7 ngày · {total} {am.unit} · {scopeLbl}
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
            <Link href={"/stats/heatmap" as never}>
              Chi tiết
              <span className="sr-only">hoạt động học tập</span>
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-3">
        {atRisk && (
          <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-golden/30 bg-golden-soft px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span role="img" aria-label="streak">🔥</span>
              <span className="text-xs font-semibold text-golden-foreground">
                Còn {streakRemaining} từ để giữ streak {langName} hôm nay
              </span>
            </div>
            <Button asChild size="sm">
              <Link href={"/learn" as never}>Học ngay</Link>
            </Button>
          </div>
        )}

        {broken && (
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-danger/30 bg-danger-soft px-4 py-2.5">
            <span role="img" aria-label="broken streak">💔</span>
            <span className="text-xs font-semibold text-danger-foreground">
              Streak đã bị gián đoạn — hôm nay bắt đầu lại nhé!
            </span>
          </div>
        )}

        <div className="mb-3 flex flex-wrap gap-1.5">
          {METRICS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMetric(m.id)}
              aria-pressed={metric === m.id}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                metric === m.id
                  ? "border-primary bg-primary-soft text-primary-soft-foreground"
                  : "border-border bg-background text-text-secondary hover:border-primary/40"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div
          role="img"
          aria-label={`Biểu đồ ${am.label} 7 ngày`}
          className="h-24"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                formatter={(v) => [`${String(v)} ${am.unit}`, am.label]}
                cursor={{ fill: "var(--surface-muted)" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} name={am.label}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.isToday
                        ? "var(--primary)"
                        : !entry.active
                          ? "var(--surface-muted)"
                          : "var(--success-soft)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="mt-1 text-[11px] text-text-muted">
          {activeDays} ngày hoạt động
          {missedDays > 0 ? `, ${missedDays} ngày bỏ lỡ` : ""}, tổng {total} {am.unit} trong tuần.
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="secondary">
            {total} {am.unit} · {scopeLbl}
          </Badge>
          {missedDays > 0 && (
            <Badge variant="outline" className="border-warning/40 text-warning-foreground">
              {missedDays} ngày bỏ lỡ
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { StatsWeeklyChart };
