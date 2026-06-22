import * as React from "react";
import type { Route } from "next";
import Link from "next/link";
import { CheckCircle2, Lock, Play, BookOpen } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";
import { statusBadgeVariants } from "@/lib/styles/variants";

import type { LessonSummary } from "./types";

export type LessonCardProps = {
  lesson: LessonSummary;
  className?: string;
};

type StatusConfig = {
  label: string;
  icon: React.ReactElement;
  badgeTone: "neutral" | "info" | "golden" | "success";
};

const STATUS_CONFIG: Record<LessonSummary["status"], StatusConfig> = {
  locked: {
    label: "Khoá",
    icon: <Lock className="size-3" aria-hidden />,
    badgeTone: "neutral",
  },
  available: {
    label: "Sẵn sàng",
    icon: <BookOpen className="size-3" aria-hidden />,
    badgeTone: "info",
  },
  current: {
    label: "Đang học",
    icon: <Play className="size-3" aria-hidden />,
    badgeTone: "golden",
  },
  completed: {
    label: "Hoàn thành",
    icon: <CheckCircle2 className="size-3" aria-hidden />,
    badgeTone: "success",
  },
};

function LessonCardInner({ lesson }: { lesson: LessonSummary }) {
  const config = STATUS_CONFIG[lesson.status];
  const pct =
    lesson.itemCount > 0
      ? Math.round((lesson.completedCount / lesson.itemCount) * 100)
      : 0;

  return (
    <>
      <CardHeader className="flex-row items-start justify-between gap-2">
        <CardTitle className="text-base leading-snug">{lesson.title}</CardTitle>
        <span
          className={cn(
            statusBadgeVariants({ status: config.badgeTone }),
            "shrink-0"
          )}
        >
          {config.icon}
          {config.label}
        </span>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {lesson.completedCount}/{lesson.itemCount} từ
          </span>
          <span className="font-medium text-primary">{pct}%</span>
        </div>
        <Progress
          value={pct}
          aria-label={`Bài học ${pct}% hoàn thành`}
          className="h-1.5"
        />
      </CardContent>
    </>
  );
}

function LessonCard({ lesson, className }: LessonCardProps) {
  const isLocked = lesson.status === "locked";

  const cardClass = cn(
    "overflow-hidden transition-shadow",
    isLocked && "opacity-60",
    className
  );

  if (lesson.href && !isLocked) {
    return (
      <Card className={cardClass}>
        <Link href={lesson.href as Route} className="flex flex-col">
          <LessonCardInner lesson={lesson} />
        </Link>
      </Card>
    );
  }

  return (
    <Card className={cardClass}>
      <LessonCardInner lesson={lesson} />
    </Card>
  );
}

export { LessonCard };
