import * as React from "react";

import { cn } from "@/lib/utils/cn";
import { Switch } from "@/components/ui/switch";

interface NotificationToggleRowProps {
  icon: React.ReactNode;
  checkedIconClass?: string;
  checkedBgClass?: string;
  label: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
  isLast?: boolean;
}

function NotificationToggleRow({
  icon,
  checkedIconClass,
  checkedBgClass,
  label,
  desc,
  checked,
  onChange,
  isLast = false,
}: NotificationToggleRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3.5 px-4.5 py-3.5",
        !isLast && "border-b border-border"
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-[9px] transition-colors",
          checked
            ? cn(checkedBgClass ?? "bg-primary-soft", checkedIconClass ?? "text-primary-soft-foreground")
            : "bg-surface-muted text-text-muted"
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="mt-0.5 text-xs text-text-secondary">{desc}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        size="sm"
        aria-label={label}
      />
    </div>
  );
}

export { NotificationToggleRow };
