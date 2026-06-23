"use client";

import * as React from "react";
import { Bell, BellOff, BellRing, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import type { BrowserPermState } from "@/features/settings/types";

interface BrowserPermissionBannerProps {
  permState: BrowserPermState;
  onGrant: () => void;
  onDismiss: () => void;
}

function BrowserPermissionBanner({
  permState,
  onGrant,
  onDismiss,
}: BrowserPermissionBannerProps) {
  if (permState === "granted") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-[14px] px-4.5 py-3.5 mt-5 mb-5",
          "bg-success-soft"
        )}
      >
        <CheckCircle2 className="size-4.5 shrink-0 text-primary" />
        <p className="text-sm text-primary">
          Đã cấp quyền thông báo đẩy cho LexiPath.
        </p>
      </div>
    );
  }

  if (permState === "denied") {
    return (
      <div
        className={cn(
          "flex items-start gap-3 rounded-[14px] px-4.5 py-3.5 mt-5 mb-5",
          "bg-warning-soft"
        )}
      >
        <BellOff className="mt-0.5 size-4.5 shrink-0 text-[#92400E]" />
        <div>
          <p className="text-sm font-medium text-[#92400E]">
            Thông báo đẩy đang bị chặn
          </p>
          <p className="mt-0.5 text-xs text-warning-foreground">
            Để bật lại, vào <strong>Cài đặt trình duyệt</strong> → Quyền trang
            web → Thông báo → tìm LexiPath và chọn{" "}
            <strong>Cho phép</strong>.
          </p>
        </div>
      </div>
    );
  }

  // default state
  return (
    <div
      className={cn(
        "rounded-[14px] px-4.5 py-3.5 mt-5 mb-5",
        "bg-surface-muted"
      )}
    >
      <div className="flex items-start gap-3">
        <Bell className="mt-0.5 size-4.5 shrink-0 text-text-secondary" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-primary">
            Trình duyệt chưa cấp quyền thông báo
          </p>
          <p className="mt-0.5 text-xs text-text-secondary">
            Cấp quyền để nhận nhắc nhở học tập, cảnh báo streak và thông báo
            bảo mật ngay trên trình duyệt.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={onGrant}>
              <BellRing className="size-3.5" />
              Cấp quyền thông báo
            </Button>
            <Button size="sm" variant="ghost" onClick={onDismiss}>
              Bỏ qua
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { BrowserPermissionBanner };
