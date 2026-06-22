"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, Globe, LogOut } from "lucide-react";

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

import type { LanguageOption } from "./learner-chrome";

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
