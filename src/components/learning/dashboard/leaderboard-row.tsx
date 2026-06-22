import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/cn";

import type { LeaderboardEntry } from "./types";

export type LeaderboardRowProps = {
  entry: LeaderboardEntry;
  className?: string;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const RANK_STYLES: Record<number, string> = {
  1: "text-golden-foreground font-bold",
  2: "text-text-secondary font-semibold",
  3: "text-text-secondary font-semibold",
};

function LeaderboardRow({ entry, className }: LeaderboardRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2",
        entry.isCurrentUser && "bg-primary-soft",
        className
      )}
    >
      {/* Rank */}
      <span
        className={cn(
          "w-6 shrink-0 text-center text-sm",
          RANK_STYLES[entry.rank] ?? "text-text-muted text-xs"
        )}
      >
        {entry.rank}
      </span>

      {/* Avatar */}
      <Avatar className="size-8 shrink-0">
        {entry.avatarUrl ? (
          <AvatarImage src={entry.avatarUrl} alt={entry.displayName} />
        ) : null}
        <AvatarFallback className="text-xs">
          {getInitials(entry.displayName)}
        </AvatarFallback>
      </Avatar>

      {/* Name */}
      <span
        className={cn(
          "flex-1 truncate text-sm",
          entry.isCurrentUser
            ? "font-semibold text-primary-soft-foreground"
            : "text-text-primary"
        )}
      >
        {entry.displayName}
        {entry.isCurrentUser ? (
          <span className="ml-1.5 text-xs font-normal opacity-70">(bạn)</span>
        ) : null}
      </span>

      {/* XP */}
      <span
        className={cn(
          "shrink-0 text-sm font-medium",
          entry.isCurrentUser ? "text-primary-soft-foreground" : "text-text-secondary"
        )}
      >
        {entry.xp.toLocaleString()} XP
      </span>
    </div>
  );
}

export { LeaderboardRow };
