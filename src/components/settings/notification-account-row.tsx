"use client";

import * as React from "react";
import { Mail, Bell } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Switch } from "@/components/ui/switch";
import type { AccountNotifState } from "@/features/settings/types";

interface NotificationAccountRowProps {
  icon: React.ReactNode;
  checkedIconClass?: string;
  label: string;
  desc: string;
  state: AccountNotifState;
  onChange: (updater: (s: AccountNotifState) => AccountNotifState) => void;
  isLast?: boolean;
}

function NotificationAccountRow({
  icon,
  checkedIconClass,
  label,
  desc,
  state,
  onChange,
  isLast = false,
}: NotificationAccountRowProps) {
  return (
    <div className={cn(!isLast && "border-b border-border")}>
      <div className="flex items-center gap-3.5 px-4.5 py-3.5">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-[9px] transition-colors",
            state.enabled
              ? cn("bg-primary-soft", checkedIconClass ?? "text-primary-soft-foreground")
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
          checked={state.enabled}
          onCheckedChange={() =>
            onChange((s) => ({ ...s, enabled: !s.enabled }))
          }
          size="sm"
          aria-label={label}
        />
      </div>

      {state.enabled && (
        <div className="flex items-center gap-5 pb-3 pl-16 pr-4.5">
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              className="size-3.5 cursor-pointer accent-primary"
              checked={state.email}
              onChange={() =>
                onChange((s) => ({ ...s, email: !s.email }))
              }
            />
            <Mail className="size-3.5 text-text-secondary" />
            <span className="text-xs text-text-secondary">Email</span>
          </label>
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              className="size-3.5 cursor-pointer accent-primary"
              checked={state.push}
              onChange={() =>
                onChange((s) => ({ ...s, push: !s.push }))
              }
            />
            <Bell className="size-3.5 text-text-secondary" />
            <span className="text-xs text-text-secondary">Thông báo đẩy</span>
          </label>
        </div>
      )}
    </div>
  );
}

export { NotificationAccountRow };
