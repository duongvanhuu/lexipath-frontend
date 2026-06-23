import * as React from "react";

import { cn } from "@/lib/utils/cn";
import { Switch } from "@/components/ui/switch";
import type { LangScheduleState } from "@/features/settings/types";

interface NotificationLangScheduleRowProps {
  flag: string;
  langName: string;
  schedule: LangScheduleState;
  onTimeChange: (t: string) => void;
  onToggle: () => void;
  isLast?: boolean;
}

function NotificationLangScheduleRow({
  flag,
  langName,
  schedule,
  onTimeChange,
  onToggle,
  isLast = false,
}: NotificationLangScheduleRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3.5 px-4.5 py-3.5",
        !isLast && "border-b border-border"
      )}
    >
      <span className="text-lg" aria-hidden="true">
        {flag}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary">{langName}</p>
        <p className="mt-0.5 text-xs text-text-secondary">
          {schedule.enabled
            ? `Nhắc lúc ${schedule.time} mỗi ngày`
            : "Đã tắt"}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        {schedule.enabled && (
          <input
            type="time"
            value={schedule.time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="h-8.5 rounded-[9px] border border-border bg-card px-2.5 text-sm text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            aria-label={`Giờ nhắc cho ${langName}`}
          />
        )}
        <Switch
          checked={schedule.enabled}
          onCheckedChange={onToggle}
          size="sm"
          aria-label={`Bật nhắc nhở cho ${langName}`}
        />
      </div>
    </div>
  );
}

export { NotificationLangScheduleRow };
