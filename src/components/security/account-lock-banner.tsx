"use client";

import * as React from "react";
import { ShieldAlert, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { AccountLockInfo } from "./types";

export interface AccountLockBannerProps {
  info: AccountLockInfo;
  onContactSupport?: () => void;
  onDismiss?: () => void;
  className?: string;
}

function AccountLockBanner({
  info,
  onContactSupport,
  onDismiss,
  className,
}: AccountLockBannerProps) {
  const { reason, lockedAtLabel, unlockAtLabel, contactSupport = true } = info;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex items-start gap-3 rounded-lg border border-danger/30 bg-danger-soft p-4",
        className
      )}
    >
      <ShieldAlert
        className="mt-0.5 size-5 shrink-0 text-danger"
        aria-hidden
      />

      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-semibold text-danger-foreground">
          Tài khoản bị khóa
        </p>

        {reason ? (
          <p className="text-sm text-danger-foreground/80">{reason}</p>
        ) : null}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-danger-foreground/70">
          {lockedAtLabel ? (
            <span>
              <span className="font-medium">Bị khóa lúc:</span> {lockedAtLabel}
            </span>
          ) : null}
          {unlockAtLabel ? (
            <span>
              <span className="font-medium">Mở khóa sau:</span> {unlockAtLabel}
            </span>
          ) : null}
        </div>

        {contactSupport ? (
          <div className="pt-1">
            <Button
              variant="destructive"
              size="sm"
              onClick={onContactSupport}
              aria-label="Liên hệ hỗ trợ để mở khóa tài khoản"
            >
              Liên hệ hỗ trợ
            </Button>
          </div>
        ) : null}
      </div>

      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Đóng thông báo"
          className="shrink-0 rounded p-0.5 text-danger transition-colors hover:bg-danger/20 hover:text-danger-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
        >
          <X className="size-4" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

export { AccountLockBanner };
