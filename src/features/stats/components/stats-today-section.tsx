import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  RefreshCw,
  Target,
  Clock,
  CheckCircle2,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";
import type { TodayStats } from "@/features/stats";

export type StatsTodaySectionProps = {
  today: TodayStats;
  langName: string;
  goalDone: boolean;
};

type Tile = {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  sub: string;
  tone?: "primary" | "warning" | "danger" | "default";
};

function TodayTile({ icon, value, label, sub, tone = "default" }: Tile) {
  const valueColor =
    tone === "primary"
      ? "text-primary"
      : tone === "warning"
        ? "text-golden-foreground"
        : tone === "danger"
          ? "text-danger-foreground"
          : "text-text-primary";
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-background p-3">
      <div className="flex items-center gap-1.5">
        <span className="text-text-muted [&_svg]:size-4">{icon}</span>
        <span className="text-xs text-text-muted">{label}</span>
      </div>
      <span className={cn("text-xl font-bold leading-none", valueColor)}>{value}</span>
      <span className="text-[11px] text-text-muted">{sub}</span>
    </div>
  );
}

function DeltaIcon({ delta }: { delta: number }) {
  if (delta > 0) return <TrendingUp className="size-3 text-primary" aria-hidden />;
  if (delta < 0) return <TrendingDown className="size-3 text-danger-foreground" aria-hidden />;
  return <Minus className="size-3 text-text-muted" aria-hidden />;
}

function StatsTodaySection({ today, langName, goalDone }: StatsTodaySectionProps) {
  const goalPct = Math.min(100, Math.round((today.progress / today.goal) * 100));

  const accuracySub =
    today.accuracyDelta > 0
      ? `Tăng ${today.accuracyDelta}% so với hôm qua`
      : today.accuracyDelta < 0
        ? `Giảm ${Math.abs(today.accuracyDelta)}%`
        : "Ổn định";

  const newSub =
    today.newDelta > 0
      ? `Nhiều hơn hôm qua ${today.newDelta} từ`
      : today.newDelta < 0
        ? `Ít hơn hôm qua ${Math.abs(today.newDelta)} từ`
        : "Như hôm qua";

  const xpSub =
    today.xpDelta > 0
      ? `Hơn hôm qua +${today.xpDelta} XP`
      : "Toàn tài khoản";

  const tiles: Tile[] = [
    { icon: <BookOpen />, value: today.newItems, label: "Từ mới đã học", sub: newSub },
    { icon: <RefreshCw />, value: today.reviewItems, label: "Lượt ôn", sub: "Golden Time hôm nay", tone: "primary" },
    {
      icon: <Target />,
      value: `${today.accuracy}%`,
      label: "Độ chính xác",
      sub: accuracySub,
      tone: today.accuracy >= 85 ? "primary" : today.accuracy >= 70 ? "default" : "danger",
    },
    { icon: <Clock />, value: today.time, label: "Thời gian học", sub: "Hôm nay" },
    { icon: <CheckCircle2 />, value: today.lessons, label: "Bài hoàn thành", sub: "Hôm nay", tone: "primary" },
    { icon: <Star />, value: `+${today.xp}`, label: "XP · " + langName, sub: xpSub, tone: "warning" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {goalDone ? (
        <div className="flex items-center gap-3 rounded-xl border border-success-foreground/20 bg-success-soft px-4 py-3">
          <span className="text-lg" role="img" aria-label="goal achieved">🎉</span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-success-foreground">
              Bạn đã đạt mục tiêu hôm nay!
            </div>
            <div className="mt-0.5 text-xs text-primary">
              Học thêm vài từ để tăng XP và giữ đà nhé.
            </div>
          </div>
          <Button asChild size="sm">
            <Link href={"/learn" as never}>Học thêm</Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-background px-4 py-3">
          <div className="flex size-12 shrink-0 flex-col items-center justify-center">
            <div className="relative flex size-12 items-center justify-center">
              <svg className="size-12 -rotate-90" viewBox="0 0 36 36" aria-hidden>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--surface-muted)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke={goalPct >= 80 ? "var(--success)" : "var(--primary)"}
                  strokeWidth="3"
                  strokeDasharray={`${goalPct} ${100 - goalPct}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-text-primary">{goalPct}%</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">
              Mục tiêu hằng ngày
              <span className="ml-1 font-normal text-text-secondary">· {langName}</span>
            </div>
            <div className="mt-0.5 text-xs text-text-secondary">
              {today.progress}/{today.goal} từ — còn {today.goal - today.progress} từ nữa
            </div>
            <Progress value={goalPct} className="mt-1.5 h-1.5" />
          </div>
          <Button asChild size="sm">
            <Link href={"/learn" as never}>Tiếp tục</Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
        {tiles.map((t, i) => (
          <TodayTile key={i} {...t} />
        ))}
      </div>
    </div>
  );
}

export { StatsTodaySection };
