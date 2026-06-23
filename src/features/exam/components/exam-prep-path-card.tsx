import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { BookOpen, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

import type { RelatedCollection } from "@/features/exam/types";

export interface ExamPrepPathCardProps {
  collection: RelatedCollection;
  className?: string;
}

function ExamPrepPathCard({ collection, className }: ExamPrepPathCardProps) {
  return (
    <Link
      href={`/collections/${collection.collId}` as Route}
      className={cn(
        "flex items-center gap-3.5 rounded-[var(--radius-card)] border border-border bg-card px-4 py-3.5 transition-all duration-140 hover:border-primary hover:shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <BookOpen className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text-primary">{collection.title}</p>
        <p className="text-xs text-text-muted">{collection.items} từ vựng · Bộ sưu tập chuẩn bị</p>
      </div>
      <ArrowRight className="size-4 shrink-0 text-text-muted" aria-hidden />
    </Link>
  );
}

export { ExamPrepPathCard };
