import * as React from "react";
import { RefreshCw, Clock, FileText, XCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ExamToSrsPreviewCardProps {
  className?: string;
}

function ExamToSrsPreviewCard({ className }: ExamToSrsPreviewCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-card)] border border-border bg-card",
        className
      )}
    >
      {/* Head */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-muted px-4 py-3">
        <p className="flex items-center gap-1.5 text-sm font-bold text-text-primary">
          <RefreshCw className="size-3.5 text-primary" aria-hidden />
          Vòng lặp Exam → SRS
        </p>
        <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5 text-[10px] font-bold text-warning-foreground">
          <Clock className="size-2.5" aria-hidden />
          Preview Phase 2
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-4">
        {/* Flow steps */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-3.5 py-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <FileText className="size-3.5" aria-hidden />
            </span>
            <span className="text-sm font-medium text-text-secondary">Làm đề thi</span>
          </div>

          <span className="text-text-muted" aria-hidden>→</span>

          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-3.5 py-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-danger-soft text-danger-foreground">
              <XCircle className="size-3.5" aria-hidden />
            </span>
            <span className="text-sm font-medium text-text-secondary">Câu sai được ghi lại</span>
          </div>

          <span className="text-text-muted" aria-hidden>→</span>

          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted px-3.5 py-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-golden-soft text-golden-foreground">
              <Zap className="size-3.5" aria-hidden />
            </span>
            <span className="text-sm font-medium text-text-secondary">Vào Golden Time ôn tập</span>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-text-secondary">
          Trong Phase 2, mỗi từ vựng bạn trả lời sai trong đề thi sẽ tự động được thêm vào hàng đợi
          Golden Time để ôn luyện có hệ thống. Bạn sẽ không bỏ sót điểm yếu nào.
        </p>
      </div>
    </div>
  );
}

export { ExamToSrsPreviewCard };
