import * as React from "react";
import {
  Star,
  Zap,
  Flame,
  Trophy,
  BookOpen,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProfileStatTile } from "./profile-stat-tile";
import type { ProfileStats } from "@/features/profile/types";

const LANG_LABELS: Record<"en" | "ja" | "zh", string> = {
  en: "Tiếng Anh",
  ja: "Tiếng Nhật",
  zh: "Tiếng Trung",
};

export type ProfileLearningStatsProps = {
  stats: ProfileStats;
};

function ProfileLearningStats({ stats }: ProfileLearningStatsProps) {
  const activeLangName = LANG_LABELS[stats.activeLang];

  return (
    <section aria-labelledby="learning-stats-heading">
      <div className="mb-3 flex items-center justify-between">
        <h2
          id="learning-stats-heading"
          className="text-xs font-semibold uppercase tracking-wide text-text-muted"
        >
          Tiến độ học tập
        </h2>
        <Badge className="gap-1.5 bg-primary-soft text-primary-soft-foreground">
          <span className="size-1.5 rounded-full bg-primary" aria-hidden />
          {activeLangName} · đang hoạt động
        </Badge>
      </div>

      {/* Row 1: 4-tile grid */}
      <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <ProfileStatTile
          icon={<Star className="size-3.5 text-primary" aria-hidden />}
          scope="XP ngôn ngữ"
          value={stats.langXp.toLocaleString()}
          unit="xp"
        />
        <ProfileStatTile
          icon={<Zap className="size-3.5 text-secondary-foreground" aria-hidden />}
          scope="Tổng XP"
          value={stats.totalXp.toLocaleString()}
          unit="xp"
        />
        <ProfileStatTile
          icon={<Flame className="size-3.5 text-orange-500" aria-hidden />}
          scope="Streak"
          value={String(stats.langStreak)}
          unit="ngày"
        />
        <ProfileStatTile
          icon={<Trophy className="size-3.5 text-amber-500" aria-hidden />}
          scope="Kỷ lục"
          value={String(stats.longestStreak)}
          unit="ngày"
        />
      </div>

      {/* Row 2: 3-tile grid */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <ProfileStatTile
          icon={<BookOpen className="size-3.5 text-text-secondary" aria-hidden />}
          scope="Từ đã học"
          value={stats.wordsLearned.toLocaleString()}
          unit="từ"
        />
        <ProfileStatTile
          icon={<CheckCircle2 className="size-3.5 text-primary" aria-hidden />}
          scope="Đã thành thạo"
          value={stats.wordsMastered.toLocaleString()}
          unit="từ"
        />
        <ProfileStatTile
          icon={<Layers className="size-3.5 text-text-secondary" aria-hidden />}
          scope="Phiên học"
          value={String(stats.totalSessions)}
          unit="phiên"
        />
      </div>
    </section>
  );
}

export { ProfileLearningStats };
