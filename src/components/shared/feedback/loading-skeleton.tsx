import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

export type LoadingSkeletonVariant =
  | "text"
  | "card"
  | "row"
  | "avatar"
  | "block";

export type LoadingSkeletonProps = {
  variant?: LoadingSkeletonVariant;
  /** Number of lines for the `text` / `card` variants. */
  rows?: number;
  /** Accessible loading label. */
  label?: string;
  className?: string;
};

function SkeletonBody({
  variant,
  rows,
}: {
  variant: LoadingSkeletonVariant;
  rows: number;
}) {
  if (variant === "avatar") {
    return <Skeleton className="size-9 rounded-full" />;
  }

  if (variant === "block") {
    return <Skeleton className="h-28 w-full rounded-card" />;
  }

  if (variant === "card") {
    return (
      <div className="flex flex-col gap-3 rounded-card border border-border p-4">
        <Skeleton className="h-3.5 w-2/5" />
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton
            key={index}
            className={cn("h-3", index === rows - 1 ? "w-3/5" : "w-full")}
          />
        ))}
      </div>
    );
  }

  if (variant === "row") {
    return (
      <div className="flex items-center gap-3 py-3">
        <Skeleton className="size-8 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-2.5 w-1/3" />
        </div>
        <Skeleton className="h-3 w-14" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-3", index === rows - 1 ? "w-3/5" : "w-full")}
        />
      ))}
    </div>
  );
}

/**
 * LoadingSkeleton — shimmer placeholder matching the shape of the content it
 * stands in for. Built on the shadcn `Skeleton`; announces itself to assistive
 * tech via `role="status"` + `aria-busy`.
 */
function LoadingSkeleton({
  variant = "text",
  rows = 3,
  label = "Đang tải",
  className,
}: LoadingSkeletonProps) {
  return (
    <div role="status" aria-busy className={className}>
      <SkeletonBody variant={variant} rows={rows} />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export { LoadingSkeleton };
