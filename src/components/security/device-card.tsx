"use client";

import * as React from "react";
import {
  HelpCircle,
  Monitor,
  ShieldCheck,
  ShieldOff,
  Smartphone,
  Tablet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils/cn";
import type { SecurityDevice } from "@/features/security/types";

export interface DeviceCardProps {
  session: SecurityDevice;
  onRevoke?: (id: string) => void;
  onToggleTrusted?: (id: string) => void;
}

const DEVICE_ICONS = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
  unknown: HelpCircle,
} as const;

function DeviceCard({ session, onRevoke, onToggleTrusted }: DeviceCardProps) {
  const {
    id,
    deviceName,
    deviceType = "unknown",
    browserLabel,
    locationLabel,
    lastActiveLabel,
    current = false,
    ipAddress,
    trusted,
  } = session;

  const DeviceIcon = DEVICE_ICONS[deviceType];

  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-card"
      aria-label={`${deviceName}${current ? " (thiết bị hiện tại)" : ""}`}
    >
      {/* Device info */}
      <div
        className={cn(
          "flex items-start gap-3 px-4 py-3",
          current && "bg-primary-soft/20"
        )}
      >
        <div
          className={cn(
            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
            current
              ? "bg-primary-soft text-primary-soft-foreground"
              : "bg-surface-muted text-text-secondary"
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
            {current && (
              <Badge className="bg-primary-soft text-primary-soft-foreground text-xs">
                Thiết bị hiện tại
              </Badge>
            )}
          </div>
          {browserLabel && (
            <p className="text-xs text-text-secondary">{browserLabel}</p>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-text-muted">
            {locationLabel && <span>{locationLabel}</span>}
            {ipAddress && <span>{ipAddress}</span>}
            {lastActiveLabel && <span>{lastActiveLabel}</span>}
          </div>
        </div>

        {!current && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRevoke?.(id)}
            aria-label={`Thu hồi phiên trên ${deviceName}`}
            className="shrink-0 text-danger-foreground hover:bg-danger-soft hover:text-danger-foreground"
          >
            Thu hồi
          </Button>
        )}
      </div>

      {/* Trusted device toggle */}
      <div className="flex items-center gap-2.5 border-t border-border bg-surface-muted px-4 py-2.5">
        {trusted ? (
          <ShieldCheck
            className="size-3.5 shrink-0 text-primary-soft-foreground"
            aria-hidden
          />
        ) : (
          <ShieldOff
            className="size-3.5 shrink-0 text-text-muted"
            aria-hidden
          />
        )}
        <span className="flex-1 text-xs text-text-secondary">
          {trusted
            ? "Thiết bị tin cậy — đã xác minh danh tính"
            : "Chưa tin cậy — yêu cầu xác minh danh tính khi đăng nhập"}
        </span>
        <Switch
          checked={trusted}
          onCheckedChange={() => onToggleTrusted?.(id)}
          size="sm"
          aria-label={
            trusted
              ? `Bỏ tin cậy ${deviceName}`
              : `Đánh dấu ${deviceName} là thiết bị tin cậy`
          }
        />
      </div>
    </div>
  );
}

export { DeviceCard };
