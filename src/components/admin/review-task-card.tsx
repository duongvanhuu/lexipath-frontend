import { User, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { statusBadgeVariants } from "@/lib/styles/variants";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  ContentStatusBadge,
  type ContentStatus,
} from "@/components/shared/badges/content-status-badge";
import { cn } from "@/lib/utils/cn";

import type { ReviewTask } from "./types";

export interface ReviewTaskCardProps {
  task: ReviewTask;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onViewDetail?: (id: string) => void;
}

function mapToContentStatus(
  status: ReviewTask["status"],
): ContentStatus {
  switch (status) {
    case "pending":
      return "in_review";
    case "in_review":
      return "in_review";
    case "approved":
      return "approved";
    case "rejected":
      return "rejected";
  }
}

function PriorityBadge({ priority }: { priority: ReviewTask["priority"] }) {
  if (!priority) return null;

  if (priority === "low") {
    return (
      <Badge className="bg-muted text-muted-foreground">Low</Badge>
    );
  }

  if (priority === "medium") {
    return (
      <Badge className={statusBadgeVariants({ status: "warning" })}>
        Medium
      </Badge>
    );
  }

  return (
    <Badge variant="destructive">High</Badge>
  );
}

export function ReviewTaskCard({
  task,
  onApprove,
  onReject,
  onViewDetail,
}: ReviewTaskCardProps) {
  const contentStatus = mapToContentStatus(task.status);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium leading-snug">
            {task.title}
          </CardTitle>
          <div className="flex shrink-0 items-center gap-1.5">
            {task.priority && <PriorityBadge priority={task.priority} />}
            <ContentStatusBadge status={contentStatus} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pb-3">
        {task.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {task.description}
          </p>
        )}

        <div className={cn("flex flex-wrap items-center gap-3", !task.description && "mt-0")}>
          {task.assigneeName && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="size-3 shrink-0" aria-hidden />
              {task.assigneeName}
            </span>
          )}
          {task.updatedAtLabel && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3 shrink-0" aria-hidden />
              {task.updatedAtLabel}
            </span>
          )}
        </div>
      </CardContent>

      {(onViewDetail ?? onReject ?? onApprove) && (
        <CardFooter className="justify-end gap-2 pt-0">
          {onViewDetail && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetail(task.id)}
            >
              View Detail
            </Button>
          )}
          {onReject && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onReject(task.id)}
            >
              Reject
            </Button>
          )}
          {onApprove && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onApprove(task.id)}
            >
              Approve
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
