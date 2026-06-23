import * as React from "react";
import {
  Brain,
  Ear,
  Type,
  PenTool,
  Link as LinkIcon,
  Music,
  Languages,
  Hash,
  BookOpen,
  PenLine,
  GitBranch,
  TrendingUp,
  TrendingDown,
  Minus,
  Play,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { SkillStat, SkillStatus } from "@/features/stats";

const ICON_MAP: Record<string, React.FC<{ className?: string; "aria-hidden"?: boolean }>> = {
  brain: Brain,
  ear: Ear,
  type: Type,
  "pen-tool": PenTool,
  link: LinkIcon,
  music: Music,
  languages: Languages,
  hash: Hash,
  "book-open": BookOpen,
  "pen-line": PenLine,
  "git-branch": GitBranch,
};

const STATUS_STYLES: Record<SkillStatus, { label: string; bg: string; color: string }> = {
  good: { label: "Nhớ tốt", bg: "bg-success-soft", color: "text-success-foreground" },
  improving: { label: "Đang tiến bộ", bg: "bg-primary-soft", color: "text-primary-soft-foreground" },
  stable: { label: "Ổn định", bg: "bg-surface-muted", color: "text-text-muted" },
  attention: { label: "Cần chú ý", bg: "bg-golden-soft", color: "text-golden-foreground" },
  weak: { label: "Cần luyện thêm", bg: "bg-danger-soft", color: "text-danger-foreground" },
  "no-data": { label: "Chưa đủ dữ liệu", bg: "bg-surface-muted", color: "text-text-muted" },
};

function AccBar({ v }: { v: number }) {
  const color =
    v >= 85 ? "bg-primary" : v >= 70 ? "bg-primary/70" : v >= 55 ? "bg-golden" : "bg-danger";
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
      <div
        className={cn("h-full rounded-full transition-all", color)}
        style={{ width: `${v}%` }}
        role="presentation"
      />
    </div>
  );
}

function TrendPill({ dir }: { dir: 0 | 1 | -1 }) {
  if (dir === 1)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-medium text-success-foreground">
        <TrendingUp className="size-3" aria-hidden /> Tốt hơn
      </span>
    );
  if (dir === -1)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-danger-soft px-2 py-0.5 text-[11px] font-medium text-danger-foreground">
        <TrendingDown className="size-3" aria-hidden /> Đang giảm
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-text-muted">
      <Minus className="size-3" aria-hidden /> Ổn định
    </span>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;
  return (
    <div className="flex items-end gap-0.5 h-5" aria-hidden>
      {values.map((v, i) => {
        const h = ((v - minV) / range) * 14 + 4;
        return (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-sm",
              i === values.length - 1 ? "bg-primary" : "bg-success-soft opacity-70"
            )}
            style={{ height: h }}
          />
        );
      })}
    </div>
  );
}

export type StatsSkillCardProps = {
  skill: SkillStat;
  practiceHref?: string;
};

function StatsSkillCard({ skill, practiceHref }: StatsSkillCardProps) {
  const Icon = ICON_MAP[skill.icon] ?? Brain;
  const status = STATUS_STYLES[skill.status];
  const isWeak = skill.status === "weak" || skill.status === "attention";
  const noData = skill.status === "no-data";
  const acColor =
    skill.accuracy >= 85
      ? "text-primary"
      : skill.accuracy >= 70
        ? "text-text-primary"
        : skill.accuracy >= 55
          ? "text-golden-foreground"
          : "text-danger-foreground";

  return (
    <Card className={cn(isWeak && skill.status === "weak" && "border-danger/30")}>
      <CardContent className="p-4">
        <div className="mb-3 flex items-start gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              isWeak ? "bg-danger-soft" : "bg-surface-muted",
              isWeak ? "text-danger-foreground" : "text-text-secondary"
            )}
          >
            <Icon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-semibold">{skill.label}</span>
              <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", status.bg, status.color)}>
                {status.label}
              </span>
            </div>
            <div className="mt-0.5 text-xs text-text-secondary">
              {skill.attempts} lần luyện
              {skill.weakItems > 0 ? ` · ${skill.weakItems} từ yếu` : ""}
            </div>
          </div>
          <div className="shrink-0 text-right">
            {noData ? (
              <div className="text-sm italic text-text-muted">—</div>
            ) : (
              <div className={cn("text-xl font-bold", acColor)}>{skill.accuracy}%</div>
            )}
            <div className="text-[10px] text-text-muted">chính xác</div>
          </div>
        </div>

        {!noData && (
          <>
            <AccBar v={skill.accuracy} />
            <div className="mt-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] text-text-muted">7 phiên gần nhất</span>
                <TrendPill dir={skill.trendDir} />
              </div>
              <Sparkline values={skill.recent} />
              <div className="mt-1 flex justify-between text-[10px] text-text-muted">
                <span>{skill.recent[0]}%</span>
                <span>{skill.recent[skill.recent.length - 1]}%</span>
              </div>
            </div>
          </>
        )}

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="flex-1 text-xs text-text-secondary leading-snug">{skill.rec}</span>
          <Button
            asChild
            size="sm"
            variant={isWeak ? "default" : "outline"}
          >
            <a href={practiceHref ?? "/learn"}>
              <Play className="mr-1 size-3" aria-hidden />
              Luyện 5 phút
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { StatsSkillCard };
