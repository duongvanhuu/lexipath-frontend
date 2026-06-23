"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Users, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatsChipFilter } from "@/features/stats/components/stats-chip-filter";
import { MOCK_LEADERBOARD } from "@/features/stats";
import { cn } from "@/lib/utils/cn";

const PERIOD_FILTERS = [
  { id: "weekly", label: "Tuần này" },
  { id: "monthly", label: "Tháng này" },
];

const PODIUM_MEDALS = ["🥈", "🥇", "🥉"];
const PODIUM_HEIGHTS = ["h-14", "h-20", "h-11"];
const PODIUM_COLORS = ["bg-text-muted/30", "bg-golden", "bg-warning-foreground/40"];

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function StatsLeaderboardPage() {
  const [period, setPeriod] = React.useState("weekly");
  const [lbState, setLbState] = React.useState("active");

  const me = MOCK_LEADERBOARD.find((u) => u.isMe);
  const top3 = MOCK_LEADERBOARD.slice(0, 3);
  const rest = MOCK_LEADERBOARD.slice(3);
  const totalUsers = MOCK_LEADERBOARD.length;
  const myRank = me?.rank ?? 4;
  const topPercent = Math.round((myRank / totalUsers) * 100);

  // podium order: silver(2nd), gold(1st), bronze(3rd)
  const podiumOrder = [top3[1], top3[0], top3[2]];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link href="/stats">
            <ArrowLeft className="size-4" aria-hidden />
            Thống kê
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Bảng xếp hạng</h1>
      </div>

      {/* State switch for demo */}
      <div className="flex flex-wrap items-center gap-1.5">
        {[
          { id: "active", label: "Đang hoạt động" },
          { id: "not-eligible", label: "Chưa đủ điều kiện" },
          { id: "no-data", label: "Chưa có ai" },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setLbState(s.id)}
            aria-pressed={lbState === s.id}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              lbState === s.id
                ? "border-primary bg-primary-soft text-primary-soft-foreground"
                : "border-border bg-background text-text-secondary"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {lbState === "not-eligible" && (
        <Card>
          <CardContent className="flex flex-col items-center py-14 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-surface-muted">
              <Lock className="size-7 text-text-muted" aria-hidden />
            </div>
            <h2 className="mt-4 text-xl font-bold">Chưa đủ điều kiện tham gia</h2>
            <p className="mt-2 max-w-sm text-sm text-text-secondary leading-relaxed">
              Hoàn thành ít nhất 3 bài học trong tuần này để xuất hiện trên bảng xếp hạng.
            </p>
            <Button asChild className="mt-6">
              <Link href={"/learn" as never}>
                <Play className="mr-1.5 size-4" aria-hidden />
                Bắt đầu học ngay
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {lbState === "no-data" && (
        <Card>
          <CardContent className="flex flex-col items-center py-14 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary-soft">
              <Users className="size-7 text-primary-soft-foreground" aria-hidden />
            </div>
            <h2 className="mt-4 text-xl font-bold">Chưa có ai trong bảng này</h2>
            <p className="mt-2 max-w-sm text-sm text-text-secondary leading-relaxed">
              Hãy mời bạn bè học cùng để cạnh tranh thân thiện.
            </p>
          </CardContent>
        </Card>
      )}

      {lbState === "active" && (
        <>
          {/* Period filter */}
          <StatsChipFilter items={PERIOD_FILTERS} active={period} onChange={setPeriod} />

          {/* Friendly banner */}
          <div className="rounded-xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm text-primary-soft-foreground">
            Cùng nhau tiến bộ mỗi tuần — không cần so sánh, chỉ cần kiên trì 💙
          </div>

          {/* My rank card */}
          {me && (
            <Card className="border-success/30 bg-success-soft">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <span className="min-w-[44px] text-center text-2xl font-bold text-primary">
                    #{me.rank}
                  </span>
                  <Avatar className="size-10 shrink-0">
                    <AvatarFallback className="text-xs">{getInitials(me.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{me.name} (bạn)</div>
                    <div className="mt-0.5 text-xs text-text-secondary">🔥 {me.streak} ngày streak</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{me.xp.toLocaleString()}</div>
                    <div className="text-[11px] text-text-muted">XP tuần này</div>
                  </div>
                </div>
                <div className="mt-3 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
                  Bạn đang trong top {topPercent}% tuần này — tiếp tục phấn đấu! 🎯
                </div>
              </CardContent>
            </Card>
          )}

          {/* Podium top 3 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Top 3 {period === "weekly" ? "tuần này" : "tháng này"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-center gap-6 py-4">
                {podiumOrder.map((u, pi) =>
                  u ? (
                    <div key={u.rank} className="flex flex-col items-center gap-2">
                      <span className="text-2xl" aria-hidden>{PODIUM_MEDALS[pi]}</span>
                      <Avatar className="size-10">
                        <AvatarFallback className="text-xs">{getInitials(u.name)}</AvatarFallback>
                      </Avatar>
                      <div className="text-center text-xs font-semibold leading-tight">{u.name}</div>
                      <div className="text-center text-[11px] text-text-secondary">+{u.xp.toLocaleString()} XP</div>
                      <div
                        className={cn(
                          "flex w-16 items-center justify-center rounded-t-lg font-extrabold text-xl text-white",
                          PODIUM_HEIGHTS[pi],
                          PODIUM_COLORS[pi]
                        )}
                      >
                        {u.rank}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ranks 4+ */}
          <Card className="overflow-hidden">
            <div className="divide-y divide-border">
              {rest.map((u) => (
                <div
                  key={u.rank}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3",
                    u.isMe && "bg-primary-soft"
                  )}
                >
                  <span
                    className={cn(
                      "w-7 shrink-0 text-center text-sm",
                      u.isMe ? "font-bold text-primary" : "text-text-muted"
                    )}
                  >
                    #{u.rank}
                  </span>
                  <Avatar className="size-8 shrink-0">
                    <AvatarFallback className="text-xs">
                      {u.isPrivate ? "?" : getInitials(u.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className={cn("text-sm", u.isMe ? "font-bold text-primary-soft-foreground" : "font-medium")}>
                      {u.isPrivate ? "Người dùng ẩn danh" : u.name}
                      {u.isMe ? <span className="ml-1.5 text-xs font-normal opacity-70">(bạn)</span> : null}
                    </div>
                    <div className="mt-0.5 text-[11px] text-text-muted">
                      {u.isPrivate ? "Ẩn danh" : `🔥 ${u.streak} ngày · ${u.status === "closed" ? "Nghỉ tuần này" : "Đang hoạt động"}`}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className={cn("text-sm font-bold", u.isMe ? "text-primary" : u.isPrivate ? "text-text-muted" : "text-text-primary")}>
                      {u.isPrivate ? "—" : u.xp.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-text-muted">XP</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
