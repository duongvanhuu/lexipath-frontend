import * as React from "react";
import Link from "next/link";
import {
  Brain,
  Library,
  Coins,
  Users,
  ChevronRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

type NavCardProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  sub: string;
  value?: string | undefined;
  iconBg: string;
  iconColor: string;
};

function NavCard({ href, icon, label, sub, value, iconBg, iconColor }: NavCardProps) {
  return (
    <Link href={href as never} className="block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl [&_svg]:size-5",
                iconBg,
                iconColor
              )}
            >
              {icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{label}</div>
              <div className="mt-0.5 text-xs text-text-secondary">{sub}</div>
            </div>
            {value ? (
              <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold", iconBg, iconColor)}>
                {value}
              </span>
            ) : null}
            <ChevronRight className="size-3.5 shrink-0 text-text-muted" aria-hidden />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export type StatsNavGridProps = {
  weakSkillLabel?: string | undefined;
  collectionsCount?: number | undefined;
  todayXp?: number | undefined;
  leaderboardRank?: number | undefined;
};

function StatsNavGrid({ weakSkillLabel, collectionsCount, todayXp, leaderboardRank }: StatsNavGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <NavCard
        href="/stats/skills"
        icon={<Brain />}
        label="Kỹ năng học"
        sub="Độ chính xác từng kỹ năng"
        value={weakSkillLabel ? "1 kỹ năng yếu" : undefined}
        iconBg="bg-success-soft"
        iconColor="text-success-foreground"
      />
      <NavCard
        href="/stats/collections"
        icon={<Library />}
        label="Bộ sưu tập"
        sub="Tiến độ các bộ đang học"
        value={collectionsCount ? `${collectionsCount} bộ` : undefined}
        iconBg="bg-primary-soft"
        iconColor="text-primary-soft-foreground"
      />
      <NavCard
        href="/stats/xp"
        icon={<Coins />}
        label="XP & Lịch sử"
        sub="Điểm kinh nghiệm chi tiết"
        value={todayXp ? `+${todayXp} XP` : undefined}
        iconBg="bg-golden-soft"
        iconColor="text-golden-foreground"
      />
      <NavCard
        href="/stats/leaderboard"
        icon={<Users />}
        label="Bảng xếp hạng"
        sub="Cùng nhau tiến bộ tuần này"
        value={leaderboardRank ? `#${leaderboardRank} tuần này` : undefined}
        iconBg="bg-warning-soft"
        iconColor="text-warning-foreground"
      />
    </div>
  );
}

export { StatsNavGrid };
