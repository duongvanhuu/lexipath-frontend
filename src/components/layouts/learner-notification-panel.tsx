"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  AlarmClock,
  ArrowRight,
  Bell,
  CheckCircle2,
  CreditCard,
  FileText,
  Flame,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";

import type { NotificationItem, NotificationItemType } from "./learner-chrome";

/* ── Mock data ── */

function buildMockNotifications(): NotificationItem[] {
  const now = new Date();
  const m = (n: number) => new Date(+now - n * 60000);
  return [
    {
      id: "n1",
      type: "golden_time",
      title: "Đến giờ ôn tập",
      body: "5 từ đang chờ trong Golden Time.",
      sentAt: m(2),
      readAt: null,
      lang: "ja",
      dest: "/golden-time",
    },
    {
      id: "n2",
      type: "streak",
      title: "Giữ streak hôm nay",
      body: "Học 10 phút để giữ chuỗi 12 ngày.",
      sentAt: m(15),
      readAt: null,
      dest: "/dashboard",
    },
    {
      id: "n3",
      type: "daily_goal",
      title: "Từ yếu cần xem lại",
      body: "Bạn có 3 từ sai nhiều trong bài luyện gần nhất.",
      sentAt: m(60),
      readAt: null,
      dest: "/notebook",
    },
    {
      id: "n4",
      type: "new_content",
      title: "Bộ từ vựng TOEIC mới",
      body: "Bộ từ TOEIC 600+ vừa có bài học mới. Xem ngay!",
      sentAt: m(360),
      readAt: new Date(+now - 300 * 60000),
      lang: "en",
      dest: "/collections",
    },
    {
      id: "n5",
      type: "payment",
      title: "Thanh toán thành công",
      body: "Thanh toán gói Pro đã thành công. Cảm ơn bạn!",
      sentAt: m(1440),
      readAt: new Date(+now - 1200 * 60000),
      dest: "/subscription",
    },
  ];
}

export const MOCK_NOTIFICATIONS = buildMockNotifications();

/* ── Helpers ── */

function relTime(date: Date): string {
  const m = Math.floor((Date.now() - date.getTime()) / 60000);
  if (m < 1) return "Vừa xong";
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Hôm qua";
  return `${d} ngày trước`;
}

const TYPE_ICON: Record<NotificationItemType, React.ReactNode> = {
  golden_time: <AlarmClock className="size-[15px]" />,
  streak: <Flame className="size-[15px]" />,
  daily_goal: <CheckCircle2 className="size-[15px]" />,
  new_content: <Sparkles className="size-[15px]" />,
  payment: <CreditCard className="size-[15px]" />,
  security: <ShieldAlert className="size-[15px]" />,
  exam: <FileText className="size-[15px]" />,
};

const TYPE_COLOR: Record<
  NotificationItemType,
  { bg: string; fg: string }
> = {
  golden_time: { bg: "bg-golden-soft", fg: "text-golden-foreground" },
  streak: { bg: "bg-golden-soft", fg: "text-golden-foreground" },
  daily_goal: { bg: "bg-success-soft", fg: "text-primary" },
  new_content: { bg: "bg-primary-soft", fg: "text-primary-soft-foreground" },
  payment: { bg: "bg-success-soft", fg: "text-primary" },
  security: { bg: "bg-warning-soft", fg: "text-warning-foreground" },
  exam: { bg: "bg-surface-muted", fg: "text-text-muted" },
};

function NotifIcon({ type }: { type: NotificationItemType }) {
  const c = TYPE_COLOR[type];
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-[10px]",
        c.bg,
        c.fg
      )}
      aria-hidden
    >
      {TYPE_ICON[type]}
    </span>
  );
}

function NotifRow({
  notif,
  onOpen,
}: {
  notif: NotificationItem;
  onOpen: (notif: NotificationItem) => void;
}) {
  const isUnread = !notif.readAt;
  return (
    <button
      type="button"
      onClick={() => onOpen(notif)}
      className={cn(
        "flex w-full items-start gap-3 border-b border-border/50 px-4 py-3 text-left transition-colors last:border-b-0",
        isUnread ? "bg-primary/[0.04] hover:bg-primary/[0.07]" : "hover:bg-surface-muted"
      )}
    >
      <NotifIcon type={notif.type} />

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-1.5">
          <span
            className={cn(
              "max-w-[176px] truncate text-xs",
              isUnread ? "font-bold text-foreground" : "font-medium text-foreground"
            )}
          >
            {notif.title}
          </span>
          {isUnread && (
            <span
              aria-label="Chưa đọc"
              className="size-[7px] shrink-0 rounded-full bg-primary"
            />
          )}
        </div>
        <div className="line-clamp-1 max-w-[222px] text-[11px] text-text-secondary">
          {notif.body}
        </div>
        <div className="mt-1 text-[11px] text-text-muted">
          {relTime(notif.sentAt)}
        </div>
      </div>
    </button>
  );
}

/* ── Main panel component ── */

export function LearnerNotificationPanel({
  notifications,
  onClose,
}: {
  notifications?: NotificationItem[];
  onClose: () => void;
}) {
  const [items, setItems] = React.useState<NotificationItem[]>(
    () => notifications ?? MOCK_NOTIFICATIONS
  );

  const unread = items.filter((n) => !n.readAt);

  const markAllRead = () => {
    const now = new Date();
    setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? now })));
  };

  const handleOpen = (notif: NotificationItem) => {
    setItems((prev) =>
      prev.map((n) =>
        n.id === notif.id ? { ...n, readAt: n.readAt ?? new Date() } : n
      )
    );
    onClose();
  };

  return (
    <div
      className="absolute right-0 top-[calc(100%+8px)] z-50 w-[352px] max-w-[calc(100vw-16px)] overflow-hidden rounded-card border border-border bg-card shadow-lg"
      role="dialog"
      aria-label="Thông báo gần đây"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-text-muted" aria-hidden />
          <span className="text-sm font-bold">Thông báo</span>
          {unread.length > 0 && (
            <span
              aria-live="polite"
              aria-label={`${unread.length} thông báo chưa đọc`}
              className="inline-flex min-w-[20px] items-center justify-center rounded-pill bg-danger px-1.5 py-px text-[11px] font-bold text-white"
            >
              {unread.length}
            </span>
          )}
        </div>
        {unread.length > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            Đánh dấu đã đọc
          </button>
        )}
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="py-8 text-center text-sm text-text-muted">
          Không có thông báo mới
        </div>
      ) : (
        <div role="list">
          {items.slice(0, 5).map((n) => (
            <NotifRow key={n.id} notif={n} onOpen={handleOpen} />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-border px-4 py-2.5">
        <Link
          href={"/notifications" as Route}
          onClick={onClose}
          className="flex w-full items-center justify-center gap-1.5 rounded-button py-2 text-sm font-semibold text-primary transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          Xem tất cả thông báo
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
