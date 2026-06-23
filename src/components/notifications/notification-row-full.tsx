"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { AppNotification } from "@/features/notifications/types";
import { NotificationTypeIcon } from "./notification-type-icon";

/* ── Helpers ───────────────────────────────────────────────────── */

function relTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHour = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today.getTime() - 86_400_000);
  const sentDay = new Date(date);
  sentDay.setHours(0, 0, 0, 0);

  if (sentDay.getTime() === yesterday.getTime()) return "Hôm qua";
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return `${Math.floor(diffDay / 7)} tuần trước`;
}

const LANG_FLAG: Record<"en" | "ja" | "zh", string> = {
  en: "🇬🇧",
  ja: "🇯🇵",
  zh: "🇨🇳",
};

/* ── Component ─────────────────────────────────────────────────── */

interface NotificationRowFullProps {
  notif: AppNotification;
  onOpen: (n: AppNotification) => void;
  onMarkRead: (id: string) => void;
}

function NotificationRowFull({
  notif,
  onOpen,
  onMarkRead,
}: NotificationRowFullProps) {
  const isUnread = notif.openedAt === null;

  return (
    <div
      role="article"
      aria-label={notif.title}
      className={cn(
        "flex items-start gap-3.5 px-5 py-4 border-b border-border last:border-0 transition-colors",
        isUnread
          ? "bg-[color-mix(in_srgb,var(--primary)_4%,transparent)] hover:bg-surface-muted"
          : "hover:bg-surface-muted"
      )}
    >
      {/* Type icon */}
      <NotificationTypeIcon type={notif.type} size={18} className="mt-0.5" />

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Title row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {isUnread ? (
            <span
              className="size-2 shrink-0 rounded-full bg-primary"
              aria-hidden
            />
          ) : null}
          <span
            className={cn(
              "text-sm text-text-primary",
              isUnread ? "font-bold" : "font-medium"
            )}
          >
            {notif.title}
          </span>
          {isUnread ? (
            <Badge
              className="ml-0.5 h-4 rounded-full bg-primary-soft px-1.5 text-[10px] font-semibold text-primary-soft-foreground border-transparent"
            >
              Chưa đọc
            </Badge>
          ) : null}
          <span className="ml-auto shrink-0 text-xs text-text-muted">
            {relTime(notif.sentAt)}
          </span>
        </div>

        {/* Body */}
        <p className="mt-1 mb-2.5 text-sm text-text-secondary leading-relaxed">
          {notif.body}
        </p>

        {/* Actions row */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={() => onOpen(notif)}
          >
            {notif.action}
            <ArrowRight className="size-3.5" aria-hidden />
          </Button>

          {isUnread ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-text-muted hover:text-text-secondary"
              onClick={() => onMarkRead(notif.id)}
            >
              Đánh dấu đã đọc
            </Button>
          ) : null}

          {notif.lang !== null ? (
            <span className="ml-auto text-base" aria-label={`Ngôn ngữ: ${notif.lang}`}>
              {LANG_FLAG[notif.lang]}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export { NotificationRowFull };
