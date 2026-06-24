import { cn } from "@/lib/utils/cn";
import type { ReviewDiffRow } from "@/features/admin-review";

interface ReviewDiffViewerProps {
  rows: ReviewDiffRow[];
  className?: string;
}

export function ReviewDiffViewer({ rows, className }: ReviewDiffViewerProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border", className)}>
      <div className="grid grid-cols-2">
        <div className="border-b border-border bg-danger-soft px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-danger-foreground">
          Trước
        </div>
        <div className="border-b border-l border-border bg-success-soft px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-success-foreground">
          Sau
        </div>

        {rows.map((row, i) => {
          const isLast = i === rows.length - 1;
          return (
            <>
              <div
                key={`before-${i}`}
                className={cn(
                  "px-3 py-2",
                  !isLast && "border-b border-border",
                )}
              >
                <p className="mb-1 text-[10px] text-text-muted">{row.field}</p>
                <span
                  className={cn(
                    "inline-block rounded px-1.5 py-0.5 text-xs text-danger-foreground",
                    "bg-danger/8",
                    row.before !== "(trống)" && "line-through",
                  )}
                >
                  {row.before}
                </span>
              </div>
              <div
                key={`after-${i}`}
                className={cn(
                  "border-l border-border px-3 py-2",
                  !isLast && "border-b border-border",
                )}
              >
                <p className="mb-1 text-[10px] text-text-muted">{row.field}</p>
                <span className="inline-block rounded bg-success/8 px-1.5 py-0.5 text-xs text-success-foreground">
                  {row.after}
                </span>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}
