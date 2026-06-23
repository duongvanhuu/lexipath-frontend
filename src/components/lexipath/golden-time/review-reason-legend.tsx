import * as React from "react";
import { AlertCircle, Calendar, TrendingDown, XCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

/* -------------------------------------------------------------------------- */
/* Reason config                                                               */
/* -------------------------------------------------------------------------- */

const LEGEND_ITEMS = [
  {
    icon: Calendar,
    label: "Đến hạn",
    desc: "Thời điểm ôn theo lịch SRS",
    chipClass: "bg-primary-soft text-primary-soft-foreground",
    iconClass: "text-primary-foreground",
  },
  {
    icon: AlertCircle,
    label: "Quá hạn",
    desc: "Đã qua thời điểm ôn tốt nhất",
    chipClass: "bg-danger-soft text-danger-foreground",
    iconClass: "text-danger-foreground",
  },
  {
    icon: TrendingDown,
    label: "Điểm yếu",
    desc: "Kỹ năng cần luyện thêm",
    chipClass: "bg-warning-soft text-warning-foreground",
    iconClass: "text-warning-foreground",
  },
  {
    icon: XCircle,
    label: "Sai câu thi",
    desc: "Từ trả lời sai trong bài kiểm tra",
    chipClass: "bg-golden-soft text-golden-foreground",
    iconClass: "text-golden-foreground",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* ReviewReasonLegend                                                          */
/* -------------------------------------------------------------------------- */

export type ReviewReasonLegendProps = {
  className?: string;
};

/**
 * ReviewReasonLegend — explains the four review reasons that appear on queue
 * items: due, overdue, weak skill, and exam mistake.
 */
function ReviewReasonLegend({ className }: ReviewReasonLegendProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-text-primary">
          Vì sao cần ôn?
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        {LEGEND_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-semibold",
                  item.chipClass
                )}
              >
                <Icon className={cn("size-3 shrink-0", item.iconClass)} aria-hidden />
                {item.label}
              </span>
              <span className="text-xs text-text-secondary">{item.desc}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export { ReviewReasonLegend };
