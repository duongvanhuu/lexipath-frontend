import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";

function NotificationLoadingSkeleton() {
  return (
    <div aria-busy="true" aria-label="Đang tải thông báo">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3.5 px-5 py-4 border-b border-border last:border-0"
        >
          {/* Icon placeholder */}
          <Skeleton className="size-9 shrink-0 rounded-[10px]" />

          {/* Text content */}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-48 rounded-md" />
              <Skeleton className="ml-auto h-3 w-14 rounded-md" />
            </div>
            <Skeleton className="h-3.5 w-full rounded-md" />
            <Skeleton className="h-3.5 w-4/5 rounded-md" />
            {/* Button stubs */}
            <div className="flex gap-2 pt-0.5">
              <Skeleton className="h-7 w-28 rounded-lg" />
              <Skeleton className="h-7 w-28 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { NotificationLoadingSkeleton };
