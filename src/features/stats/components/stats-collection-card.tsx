import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";
import type { CollectionStat } from "@/features/stats";

export type StatsCollectionCardProps = {
  collection: CollectionStat;
};

function StatsCollectionCard({ collection: c }: StatsCollectionCardProps) {
  const isLearning = c.status === "learning";
  const isNotStarted = c.status === "not-started";
  const isPro = c.access === "pro";

  return (
    <Card className={cn(isPro && isNotStarted && "opacity-80")}>
      <CardContent className="p-4">
        <div className={cn("flex items-center gap-3", isLearning && "mb-4")}>
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl",
              isLearning ? "bg-success-soft text-success-foreground" : "bg-surface-muted text-text-muted"
            )}
          >
            <span className="text-base" aria-hidden>📚</span>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight">{c.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {isPro && <Badge variant="secondary" className="text-[10px]">Pro</Badge>}
              {isLearning && <Badge variant="secondary" className="bg-primary-soft text-primary-soft-foreground text-[10px]">Đang học</Badge>}
              {isNotStarted && <Badge variant="outline" className="text-[10px]">Chưa bắt đầu</Badge>}
              {c.lastStudied !== "—" && (
                <span className="text-[11px] text-text-muted">Học lần cuối: {c.lastStudied}</span>
              )}
            </div>
          </div>
          {isLearning ? (
            <Button asChild size="sm" variant="outline">
              <Link href={`/collections/${c.id}` as never}>Tiếp tục học</Link>
            </Button>
          ) : isPro ? (
            <Button asChild size="sm" variant="outline">
              <Link href={"/subscription" as never}>Nâng cấp</Link>
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link href={`/collections/${c.id}` as never}>Bắt đầu</Link>
            </Button>
          )}
        </div>

        {isLearning && (
          <>
            <div className="mb-3">
              <div className="mb-1.5 flex justify-between">
                <span className="text-xs text-text-secondary">Tiến độ tổng thể</span>
                <span className="text-xs font-bold text-primary">{c.progress}%</span>
              </div>
              <Progress value={c.progress} className="h-1.5" />
            </div>
            <div className="mb-3 grid grid-cols-4 gap-2">
              {[
                { label: "Đã học", value: `${c.learned}/${c.total}` },
                { label: "Thành thạo", value: c.mastered },
                { label: "Chính xác", value: c.accuracy > 0 ? `${c.accuracy}%` : "—" },
                { label: "Thời gian", value: c.timeSpent },
              ].map((it) => (
                <div key={it.label} className="rounded-lg bg-surface-muted px-2 py-2 text-center">
                  <div className="text-sm font-bold">{it.value}</div>
                  <div className="mt-0.5 text-[10px] text-text-muted">{it.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-success-soft px-3 py-2">
              <ArrowRight className="size-3 shrink-0 text-primary" aria-hidden />
              <span className="text-xs text-text-secondary">Bài tiếp theo:</span>
              <span className="text-xs font-semibold text-text-primary">{c.nextLesson}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export { StatsCollectionCard };
