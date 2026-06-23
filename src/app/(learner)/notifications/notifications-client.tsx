"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BellOff,
  BellRing,
  CheckCircle2,
  Inbox,
  Settings,
  WifiOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import {
  NotificationFilterTabs,
  NotificationLoadingSkeleton,
  NotificationRowFull,
} from "@/components/notifications";
import { MOCK_NOTIFICATIONS } from "@/features/notifications";
import type {
  AppNotification,
  NotifFilterTab,
  NotifType,
} from "@/features/notifications";

/* ── Helpers ───────────────────────────────────────────────────── */

function timeGroup(date: Date): string {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today.getTime() - 86_400_000);
  const weekAgo = new Date(today.getTime() - 7 * 86_400_000);

  const sentDay = new Date(date);
  sentDay.setHours(0, 0, 0, 0);

  if (sentDay.getTime() === today.getTime()) return "Hôm nay";
  if (sentDay.getTime() === yesterday.getTime()) return "Hôm qua";
  if (sentDay >= weekAgo) return "Tuần này";
  return "Trước đó";
}

const GROUP_ORDER = ["Hôm nay", "Hôm qua", "Tuần này", "Trước đó"];

function filterItems(
  items: AppNotification[],
  tab: NotifFilterTab
): AppNotification[] {
  const LEARNING_TYPES: NotifType[] = ["daily_goal", "new_content"];

  switch (tab) {
    case "all":
      return items;
    case "unread":
      return items.filter((n) => n.openedAt === null);
    case "learning":
      return items.filter((n) => LEARNING_TYPES.includes(n.type));
    case "golden_time":
      return items.filter((n) => n.type === "golden_time");
    case "streak":
      return items.filter((n) => n.type === "streak");
    case "payment":
      return items.filter((n) => n.type === "payment");
    case "security":
      return items.filter((n) => n.type === "security");
    case "system":
      return items.filter((n) => n.type === "exam");
    default:
      return items;
  }
}

/* ── Tab config ────────────────────────────────────────────────── */

const BASE_TABS: { id: NotifFilterTab; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "unread", label: "Chưa đọc" },
  { id: "learning", label: "Học tập" },
  { id: "golden_time", label: "Golden Time" },
  { id: "streak", label: "Streak" },
  { id: "payment", label: "Thanh toán" },
  { id: "security", label: "Bảo mật" },
  { id: "system", label: "Hệ thống" },
];

/* ── Component ─────────────────────────────────────────────────── */

export function NotificationsClient() {
  const router = useRouter();

  const [items, setItems] = React.useState<AppNotification[]>(
    MOCK_NOTIFICATIONS
  );
  const [tab, setTab] = React.useState<NotifFilterTab>("all");
  const [loading, setLoading] = React.useState(true);
  const [hasError] = React.useState(false);

  /* Simulate 1.2s load on mount */
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  /* Derived counts */
  const unreadCount = React.useMemo(
    () => items.filter((n) => n.openedAt === null).length,
    [items]
  );

  const tabs = React.useMemo(
    () =>
      BASE_TABS.map((t) => ({
        ...t,
        count: filterItems(items, t.id).length,
      })),
    [items]
  );

  const filtered = React.useMemo(
    () => filterItems(items, tab),
    [items, tab]
  );

  /* Group notifications */
  const grouped = React.useMemo(() => {
    const map = new Map<string, AppNotification[]>();
    for (const group of GROUP_ORDER) {
      map.set(group, []);
    }
    for (const notif of filtered) {
      const g = timeGroup(notif.sentAt);
      const arr = map.get(g);
      if (arr) arr.push(notif);
    }
    // Remove empty groups
    for (const [key, arr] of map.entries()) {
      if (arr.length === 0) map.delete(key);
    }
    return map;
  }, [filtered]);

  /* Handlers */
  function markRead(id: string) {
    setItems((prev) =>
      prev.map((n) =>
        n.id === id && n.openedAt === null
          ? { ...n, openedAt: new Date() }
          : n
      )
    );
  }

  function markAllRead() {
    const now = new Date();
    setItems((prev) =>
      prev.map((n) => (n.openedAt === null ? { ...n, openedAt: now } : n))
    );
  }

  function handleOpen(notif: AppNotification) {
    markRead(notif.id);
    router.push(notif.dest as never);
  }

  /* ── Render helpers ─────────────────────────────────────────── */

  function renderContent() {
    if (loading) {
      return <NotificationLoadingSkeleton />;
    }

    if (hasError) {
      return (
        <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-danger-soft">
            <WifiOff className="size-5 text-danger-foreground" aria-hidden />
          </span>
          <p className="text-sm font-medium text-text-primary">
            Không thể tải thông báo
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </Button>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-surface-muted">
            <BellOff className="size-5 text-text-muted" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-medium text-text-primary">
              Bạn chưa có thông báo
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              Nhắc học, Golden Time và cập nhật tài khoản sẽ xuất hiện tại đây.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings">Cài đặt thông báo</Link>
          </Button>
        </div>
      );
    }

    if (tab === "unread" && unreadCount === 0 && !loading) {
      return (
        <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-success-soft">
            <CheckCircle2
              className="size-5 text-success-foreground"
              aria-hidden
            />
          </span>
          <div>
            <p className="text-sm font-medium text-text-primary">
              Không có thông báo chưa đọc
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              Bạn đã đọc tất cả thông báo. Tốt lắm!
            </p>
          </div>
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-surface-muted">
            <Inbox className="size-5 text-text-muted" aria-hidden />
          </span>
          <p className="text-sm text-text-secondary">
            Không có thông báo trong danh mục này
          </p>
        </div>
      );
    }

    return (
      <div role="feed" aria-label="Danh sách thông báo">
        {GROUP_ORDER.filter((g) => grouped.has(g)).map((group) => {
          const groupItems = grouped.get(group)!;
          return (
            <div key={group}>
              {/* Group header */}
              <div className="px-5 pt-3.5 pb-2 text-xs font-semibold uppercase tracking-widest text-text-muted">
                {group}
              </div>
              {/* Rows */}
              {groupItems.map((notif) => (
                <NotificationRowFull
                  key={notif.id}
                  notif={notif}
                  onOpen={handleOpen}
                  onMarkRead={markRead}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  /* ── Main render ────────────────────────────────────────────── */

  return (
    <div className="mx-auto max-w-[680px] px-4 py-6 sm:px-6">
      {/* Page header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Thông báo
          </h1>
          {!loading && unreadCount > 0 ? (
            <span className="inline-flex min-w-6 h-6 items-center justify-center rounded-pill bg-destructive px-1.5 text-xs font-semibold text-white">
              {unreadCount}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {!loading && unreadCount > 0 ? (
            <Button
              variant="outline"
              size="sm"
              className="h-[34px] text-xs"
              onClick={markAllRead}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          ) : null}
          <Button variant="outline" size="sm" className="h-[34px] text-xs" asChild>
            <Link href="/settings" aria-label="Cài đặt thông báo">
              <Settings className="size-3.5" aria-hidden />
              Cài đặt
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-5">
        <NotificationFilterTabs
          tabs={tabs}
          active={tab}
          onChange={setTab}
        />
      </div>

      {/* Content card */}
      <div className="rounded-card border border-border bg-card overflow-hidden">
        {renderContent()}
      </div>

      {/* Settings footer */}
      <div className="mt-5 flex items-center gap-3.5 rounded-[12px] border border-border bg-card px-[18px] py-[14px]">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-surface-muted">
          <BellRing className="size-4 text-text-muted" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text-primary">
            Cài đặt thông báo
          </p>
          <p className="text-xs text-text-secondary">
            Tùy chỉnh loại thông báo và thời gian nhắc nhở
          </p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 text-xs" asChild>
          <Link href="/settings">Cài đặt</Link>
        </Button>
      </div>
    </div>
  );
}
