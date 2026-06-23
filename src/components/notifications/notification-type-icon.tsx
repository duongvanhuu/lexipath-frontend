import * as React from "react";
import {
  AlarmClock,
  CheckCircle2,
  CreditCard,
  FileText,
  Flame,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { NotifType } from "@/features/notifications/types";

interface NotificationTypeIconProps {
  type: NotifType;
  size?: number;
  className?: string;
}

const TYPE_CONFIG: Record<
  NotifType,
  {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number }>;
    chipClass: string;
    iconClass: string;
  }
> = {
  golden_time: {
    icon: AlarmClock,
    chipClass: "bg-golden-soft",
    iconClass: "text-golden-foreground",
  },
  streak: {
    icon: Flame,
    chipClass: "bg-warning-soft",
    iconClass: "text-warning-foreground",
  },
  daily_goal: {
    icon: CheckCircle2,
    chipClass: "bg-primary-soft",
    iconClass: "text-primary-soft-foreground",
  },
  new_content: {
    icon: Sparkles,
    chipClass: "bg-primary-soft",
    iconClass: "text-primary-soft-foreground",
  },
  payment: {
    icon: CreditCard,
    chipClass: "bg-success-soft",
    iconClass: "text-success-foreground",
  },
  security: {
    icon: ShieldAlert,
    chipClass: "bg-warning-soft",
    iconClass: "text-warning-foreground",
  },
  exam: {
    icon: FileText,
    chipClass: "bg-primary-soft",
    iconClass: "text-primary-soft-foreground",
  },
};

function NotificationTypeIcon({
  type,
  size = 18,
  className,
}: NotificationTypeIconProps) {
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[10px]",
        config.chipClass,
        className
      )}
      style={{ width: 36, height: 36 }}
      aria-hidden
    >
      <Icon size={size} className={config.iconClass} />
    </span>
  );
}

export { NotificationTypeIcon };
