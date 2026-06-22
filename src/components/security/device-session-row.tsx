import * as React from "react";
import { Monitor, Smartphone, Tablet, HelpCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { DeviceSession } from "./types";

export interface DeviceSessionRowProps {
  session: DeviceSession;
  onRevoke?: (id: string) => void;
}

const DEVICE_ICONS = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
  unknown: HelpCircle,
} as const;

function DeviceSessionRow({ session, onRevoke }: DeviceSessionRowProps) {
  const {
    id,
    deviceName,
    deviceType = "unknown",
    browserLabel,
    locationLabel,
    lastActiveLabel,
    current = false,
    ipAddress,
  } = session;

  const DeviceIcon = DEVICE_ICONS[deviceType];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors",
        current && "border-primary/30 bg-primary-soft/30"
      )}
      aria-label={`${deviceName}${current ? " (thiết bị hiện tại)" : ""}`}
    >
      <div
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
          current ? "bg-primary-soft text-primary-soft-foreground" : "bg-surface-muted text-text-secondary"
        )}
        aria-hidden
      >
        <DeviceIcon className="size-4" />
      </div>

      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">
            {deviceName}
          </span>
          {current ? (
            <Badge className="bg-primary-soft text-primary-soft-foreground text-xs">
              Thiết bị hiện tại
            </Badge>
          ) : null}
        </div>

        {browserLabel ? (
          <p className="text-xs text-text-secondary">{browserLabel}</p>
        ) : null}

        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-text-muted">
          {locationLabel ? <span>{locationLabel}</span> : null}
          {ipAddress ? <span>{ipAddress}</span> : null}
          {lastActiveLabel ? (
            <span>Hoạt động: {lastActiveLabel}</span>
          ) : null}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        disabled={current}
        aria-label={
          current
            ? "Không thể thu hồi thiết bị hiện tại"
            : `Thu hồi phiên trên ${deviceName}`
        }
        onClick={() => onRevoke?.(id)}
        className="shrink-0 text-danger-foreground hover:bg-danger-soft hover:text-danger-foreground disabled:opacity-40"
      >
        Thu hồi
      </Button>
    </div>
  );
}

export { DeviceSessionRow };
