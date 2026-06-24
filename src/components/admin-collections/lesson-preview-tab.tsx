"use client";

import * as React from "react";
import { Lock, Zap, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AdminLesson, AdminLessonItem } from "@/features/admin-collections/types";

export interface LessonPreviewTabProps {
  lesson: AdminLesson;
  items: AdminLessonItem[];
}

type PlanMode = "free" | "pro";

export function LessonPreviewTab({ lesson, items }: LessonPreviewTabProps) {
  const [plan, setPlan] = React.useState<PlanMode>("free");
  const isLocked = plan === "free" && !lesson.is_free && lesson.min_plan !== "free";

  return (
    <div className="max-w-sm">
      {/* Plan toggle */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm font-medium">Xem trước với gói:</span>
        <div className="flex overflow-hidden rounded-lg border border-border">
          {(["free", "pro"] as PlanMode[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlan(p)}
              className={`px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none ${
                plan === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              {p === "free" ? "Miễn phí" : "Pro"}
            </button>
          ))}
        </div>
        {isLocked && (
          <Badge className="bg-warning-soft text-warning-foreground">Bị khóa</Badge>
        )}
      </div>

      {/* Lesson card preview */}
      <Card className="relative overflow-hidden">
        {isLocked && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-background/90">
            <div className="flex size-12 items-center justify-center rounded-full bg-surface-muted">
              <Lock className="size-5 text-text-muted" aria-hidden />
            </div>
            <p className="text-sm font-semibold">Yêu cầu gói Pro</p>
            <Button type="button" size="sm" disabled>
              <Zap className="mr-1.5 size-3.5" />
              Nâng cấp
            </Button>
          </div>
        )}
        <CardContent className="pt-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="font-bold">{lesson.title}</p>
            {lesson.is_new && (
              <Badge className="bg-info-soft text-info-foreground text-xs">Mới</Badge>
            )}
          </div>
          {lesson.subtitle && (
            <p className="mb-3 text-sm text-text-secondary">{lesson.subtitle}</p>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <BookOpen className="size-3" aria-hidden />
              {lesson.item_count || items.length} từ
            </span>
            {lesson.estimated_minutes > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="size-3" aria-hidden />
                {lesson.estimated_minutes} phút
              </span>
            )}
            {lesson.is_free && (
              <span className="text-primary font-medium">Miễn phí</span>
            )}
          </div>
          <Progress value={0} className="mt-3 h-1" />
          <div className="mt-3.5 flex items-center justify-between">
            <span className="text-[11px] text-text-muted">
              0 / {lesson.item_count || items.length} từ
            </span>
            <Button type="button" size="sm" disabled={isLocked}>
              Bắt đầu học
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Word preview */}
      {!isLocked && items.length > 0 && (
        <Card className="mt-4">
          <CardContent className="pt-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
              Từ vựng ({Math.min(items.length, 5)}/{items.length})
            </p>
            <div className="divide-y divide-border">
              {items.slice(0, 5).map((item, i) => (
                <div key={item.id} className="flex items-center gap-3 py-2">
                  <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-surface-muted text-[11px] font-bold text-text-muted">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <span className="mr-2 font-semibold">{item.word}</span>
                    <span className="text-xs text-text-muted">{item.reading}</span>
                  </div>
                  <span className="text-sm text-text-secondary">{item.meaning}</span>
                  {item.is_key_item && (
                    <Badge className="bg-primary/10 text-primary text-[10px] px-1.5">
                      Key
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
