import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ExamPhase1BannerProps {
  className?: string;
}

function ExamPhase1Banner({ className }: ExamPhase1BannerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[var(--radius-card)] border border-primary/20 bg-primary-soft px-4 py-3.5",
        className
      )}
    >
      <Info
        className="mt-0.5 size-4 shrink-0 text-primary"
        aria-hidden
      />
      <div>
        <p className="text-sm font-semibold text-text-primary">
          Kho đề Phase 1 — Xem cấu trúc & chuẩn bị từ vựng
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
          Hiện tại bạn có thể xem cấu trúc đề thi, yêu cầu kỹ năng, cách tính điểm và các bộ từ vựng liên quan.
          Tính năng luyện đề trực tiếp sẽ mở trong{" "}
          <strong className="text-text-primary">Phase 2</strong>.
        </p>
      </div>
    </div>
  );
}

export { ExamPhase1Banner };
