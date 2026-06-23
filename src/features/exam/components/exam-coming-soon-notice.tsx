"use client";

import * as React from "react";
import { Clock, Lock, Bell, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ExamComingSoonNoticeProps {
  title?: string;
  description?: string;
  className?: string;
}

function ExamComingSoonNotice({
  title = "Tính năng làm đề sẽ mở trong Phase 2",
  description = "Hiện tại bạn có thể xem cấu trúc đề, yêu cầu kỹ năng và bộ từ liên quan.",
  className,
}: ExamComingSoonNoticeProps) {
  const [notified, setNotified] = React.useState(false);

  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-[var(--radius-card)] border border-dashed border-border bg-surface-muted px-6 py-5",
        className
      )}
    >
      {/* Icon */}
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-text-muted">
        <Clock className="size-5" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        {/* Phase badge */}
        <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-warning-soft px-2.5 py-0.5 text-[10px] font-bold text-warning-foreground">
          <Lock className="size-2.5" aria-hidden />
          Phase 2
        </span>
        <p className="text-[15px] font-bold text-text-primary">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">{description}</p>

        {/* Notify CTA */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setNotified(true)}
            disabled={notified}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border border-dashed px-3.5 py-1.5 text-sm font-semibold transition-all",
              notified
                ? "border-success/40 bg-success-soft text-success-foreground cursor-default"
                : "border-border bg-surface-muted text-text-secondary hover:border-primary hover:bg-primary-soft hover:text-primary"
            )}
          >
            {notified ? (
              <>
                <Check className="size-3.5" aria-hidden />
                Đã đăng ký nhận thông báo
              </>
            ) : (
              <>
                <Bell className="size-3.5" aria-hidden />
                Nhận thông báo khi mở làm đề
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export { ExamComingSoonNotice };
