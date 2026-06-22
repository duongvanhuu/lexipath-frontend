import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

/**
 * Content workflow status — the publishing lifecycle for vocabulary / exam
 * content in admin. Presentational mapper only (no backend coupling): callers
 * map their DTO enum to one of these keys.
 */
export const contentStatusBadgeVariants = cva("", {
  variants: {
    status: {
      draft: "bg-surface-muted text-text-secondary",
      in_review: "bg-warning-soft text-warning-foreground",
      approved: "bg-primary-soft text-primary-soft-foreground",
      published: "bg-success-soft text-success-foreground",
      rejected: "bg-danger-soft text-danger-foreground",
      archived: "bg-surface-muted text-text-muted",
    },
  },
  defaultVariants: {
    status: "draft",
  },
});

export type ContentStatus = NonNullable<
  VariantProps<typeof contentStatusBadgeVariants>["status"]
>;

const CONTENT_LABELS: Record<ContentStatus, string> = {
  draft: "Bản nháp",
  in_review: "Đang duyệt",
  approved: "Đã duyệt",
  published: "Đã xuất bản",
  rejected: "Bị từ chối",
  archived: "Lưu trữ",
};

export type ContentStatusBadgeProps = Omit<
  React.ComponentProps<typeof Badge>,
  "variant" | "children"
> & {
  status: ContentStatus;
  /** Override the default Vietnamese label. */
  children?: React.ReactNode;
};

function ContentStatusBadge({
  status,
  className,
  children,
  ...props
}: ContentStatusBadgeProps) {
  return (
    <Badge
      className={cn(contentStatusBadgeVariants({ status }), className)}
      {...props}
    >
      {children ?? CONTENT_LABELS[status]}
    </Badge>
  );
}

export { ContentStatusBadge, CONTENT_LABELS };
