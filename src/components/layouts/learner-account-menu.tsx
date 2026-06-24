"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  Bell,
  ChevronDown,
  CreditCard,
  Globe,
  LogOut,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

import {
  getInitials,
  type ShellAction,
  type UserSummary,
} from "@/components/shared/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cn";

import type { LanguageOption, NotificationItem, UserStats } from "./learner-chrome";
import {
  LearnerNotificationPanel,
  MOCK_NOTIFICATIONS,
} from "./learner-notification-panel";

/* ── Simple legacy language menu (used by mobile nav + fallback) ── */

export function LanguageMenu({
  languages,
  activeLanguage,
  onLanguageChange,
}: {
  languages?: LanguageOption[] | undefined;
  activeLanguage?: string | undefined;
  onLanguageChange?: ((code: string) => void) | undefined;
}) {
  if (!languages || languages.length === 0) return null;
  const active = languages.find((language) => language.code === activeLanguage);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Ngôn ngữ">
          <Globe data-icon="inline-start" />
          {active?.label ?? activeLanguage ?? "Ngôn ngữ"}
          <ChevronDown data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onSelect={() => onLanguageChange?.(language.code)}
            >
              {language.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ── Stat chip inside user menu header ── */

function StatChip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold",
        className
      )}
    >
      {children}
    </span>
  );
}

/* ── Default account actions when none provided ── */

const DEFAULT_ACCOUNT_ACTIONS: ShellAction[] = [
  {
    id: "profile",
    label: "Hồ sơ",
    href: "/profile" as Route,
    icon: <User className="size-4" aria-hidden />,
  },
  {
    id: "settings",
    label: "Cài đặt",
    href: "/settings" as Route,
    icon: <Settings className="size-4" aria-hidden />,
  },
  {
    id: "subscription",
    label: "Gói đăng ký",
    href: "/subscription" as Route,
    icon: <CreditCard className="size-4" aria-hidden />,
  },
];

/* ── LearnerUserMenu ── */

type PanelState = "closed" | "user" | "notifications";

export function LearnerUserMenu({
  user,
  userStats,
  notifications,
  accountActions,
  onSignOut,
  signOutLabel = "Đăng xuất",
}: {
  user: UserSummary;
  userStats?: UserStats;
  notifications?: NotificationItem[];
  accountActions?: ShellAction[];
  onSignOut?: () => void;
  signOutLabel?: string;
}) {
  const [panel, setPanel] = React.useState<PanelState>("closed");
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const actions = accountActions ?? DEFAULT_ACCOUNT_ACTIONS;
  const notifItems = notifications ?? MOCK_NOTIFICATIONS;
  const unreadCount = notifItems.filter((n) => !n.readAt).length;

  React.useEffect(() => {
    if (panel === "closed") return;
    const onOut = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setPanel("closed");
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPanel("closed");
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onOut);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onOut);
      document.removeEventListener("keydown", onEsc);
    };
  }, [panel]);

  const toggleUser = () =>
    setPanel((p) => (p === "user" ? "closed" : "user"));

  return (
    <div className="relative" ref={wrapRef}>
      {/* Avatar trigger */}
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Tài khoản: ${user.name}`}
        aria-expanded={panel !== "closed"}
        aria-haspopup="menu"
        onClick={toggleUser}
        className="relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <Avatar>
          {user.avatarUrl ? (
            <AvatarImage src={user.avatarUrl} alt="" />
          ) : null}
          <AvatarFallback>{getInitials(user)}</AvatarFallback>
        </Avatar>
        {unreadCount > 0 && (
          <span
            aria-hidden
            className="absolute right-0.5 top-0.5 size-2 rounded-full bg-golden ring-2 ring-card"
          />
        )}
      </button>

      {/* User menu panel */}
      {panel === "user" && (
        <div
          role="menu"
          aria-label="Menu tài khoản"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-72 overflow-hidden rounded-card border border-border bg-card shadow-lg"
        >
          {/* Profile header */}
          <div className="border-b border-border/60 px-4 pb-3 pt-3.5">
            <div className="text-sm font-semibold text-foreground">
              {user.name}
            </div>
            {user.email && (
              <div className="mt-0.5 text-xs text-text-muted">{user.email}</div>
            )}
            {userStats && (
              <div className="mt-2.5 flex gap-2">
                <StatChip className="bg-golden-soft text-golden-foreground">
                  🔥 {userStats.streak} ngày
                </StatChip>
                <StatChip className="bg-success-soft text-success-foreground">
                  ⭐ {userStats.xp} XP
                </StatChip>
              </div>
            )}
          </div>

          {/* Menu items */}
          <div className="p-1.5">
            {/* Thông báo */}
            <button
              type="button"
              role="menuitem"
              onClick={() => setPanel("notifications")}
              className="flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <Bell className="size-4 text-text-muted" aria-hidden />
              <span className="flex-1 text-left">Thông báo</span>
              {unreadCount > 0 && (
                <span className="inline-flex min-w-[18px] items-center justify-center rounded-pill bg-golden-soft px-1.5 py-px text-[10px] font-bold text-golden-foreground">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Account actions */}
            {actions.map((action) =>
              action.href ? (
                <Link
                  key={action.id ?? action.label}
                  href={action.href}
                  role="menuitem"
                  onClick={() => setPanel("closed")}
                  className="flex items-center gap-3 rounded-button px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {action.icon && (
                    <span className="text-text-muted">{action.icon}</span>
                  )}
                  {action.label}
                </Link>
              ) : (
                <button
                  key={action.id ?? action.label}
                  type="button"
                  role="menuitem"
                  disabled={Boolean(action.disabled)}
                  onClick={() => {
                    action.onClick?.();
                    setPanel("closed");
                  }}
                  className="flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-muted disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {action.icon && (
                    <span className="text-text-muted">{action.icon}</span>
                  )}
                  {action.label}
                </button>
              )
            )}

            <div className="my-1 h-px bg-border/60" role="separator" />

            {/* Quản trị */}
            <Link
              href={"/admin" as Route}
              role="menuitem"
              onClick={() => setPanel("closed")}
              className="flex items-center gap-3 rounded-button px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <ShieldCheck className="size-4 text-text-muted" aria-hidden />
              Quản trị
            </Link>

            {/* Đăng xuất */}
            {onSignOut && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setPanel("closed");
                  onSignOut();
                }}
                className="flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-sm text-danger transition-colors hover:bg-danger-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <LogOut className="size-4" aria-hidden />
                {signOutLabel}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Notification panel */}
      {panel === "notifications" && (
        <LearnerNotificationPanel
          notifications={notifItems}
          onClose={() => setPanel("closed")}
        />
      )}
    </div>
  );
}

/* ── Legacy AccountMenu — kept for backward compatibility ── */

export function AccountMenu({
  user,
  accountActions = [],
  onSignOut,
  signOutLabel = "Đăng xuất",
}: {
  user: UserSummary;
  accountActions?: ShellAction[] | undefined;
  onSignOut?: (() => void) | undefined;
  signOutLabel?: string | undefined;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Tài khoản: ${user.name}`}
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Avatar>
            {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
            <AvatarFallback>{getInitials(user)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{user.name}</span>
          {user.email ? (
            <span className="text-xs font-normal text-muted-foreground">
              {user.email}
            </span>
          ) : null}
        </DropdownMenuLabel>
        {accountActions.length > 0 ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {accountActions.map((action) =>
                action.href ? (
                  <DropdownMenuItem
                    key={action.id ?? action.label}
                    disabled={Boolean(action.disabled)}
                    asChild
                  >
                    <Link href={action.href}>
                      {action.icon}
                      {action.label}
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    key={action.id ?? action.label}
                    disabled={Boolean(action.disabled)}
                    onSelect={() => action.onClick?.()}
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuGroup>
          </>
        ) : null}
        {onSignOut ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={onSignOut}>
              <LogOut />
              {signOutLabel}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
