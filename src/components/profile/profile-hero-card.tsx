"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { Camera, Pencil, Eye, Phone, Globe, CheckCircle, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EntitlementBadge } from "@/components/shared/badges";
import { cn } from "@/lib/utils/cn";
import type { UserProfile } from "@/features/profile/types";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function planToTier(
  plan: UserProfile["plan"]
): "free" | "pro" | "premium" | "locked" {
  if (plan === "pro") return "pro";
  if (plan === "team") return "premium";
  return "free";
}

export type ProfileHeroCardProps = {
  user: UserProfile;
  onEditClick: () => void;
};

function ProfileHeroCard({ user, onEditClick }: ProfileHeroCardProps) {
  const initials = getInitials(user.name);
  const tier = planToTier(user.plan);

  return (
    <div className="rounded-card bg-card p-6 ring-1 ring-foreground/10">
      {/* Top section: avatar + info */}
      <div className="flex flex-wrap items-start gap-4">
        {/* Avatar with camera overlay */}
        <div className="relative shrink-0">
          <Avatar
            className="size-20 text-2xl"
            aria-label={`Ảnh đại diện của ${user.name}`}
          >
            {user.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={user.name} />
            ) : null}
            <AvatarFallback className="text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            aria-label="Thay đổi ảnh đại diện"
            className={cn(
              "absolute bottom-0 right-0 flex size-[26px] items-center justify-center rounded-full bg-primary text-primary-foreground",
              "ring-2 ring-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            onClick={onEditClick}
          >
            <Camera className="size-3" aria-hidden />
          </button>
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {/* Name */}
          <h1 className="text-xl font-extrabold text-text-primary leading-tight">
            {user.name}
          </h1>

          {/* Email + verified badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-text-secondary">{user.email}</span>
            <Badge
              className={cn(
                "gap-1",
                user.emailVerified
                  ? "bg-success-soft text-success-foreground"
                  : "bg-warning-soft text-warning-foreground"
              )}
            >
              {user.emailVerified ? (
                <CheckCircle className="size-3" aria-hidden />
              ) : (
                <AlertCircle className="size-3" aria-hidden />
              )}
              {user.emailVerified ? "Đã xác minh" : "Chưa xác minh"}
            </Badge>
          </div>

          {/* Phone + timezone */}
          <div className="flex flex-wrap items-center gap-3">
            {user.phone ? (
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Phone className="size-3" aria-hidden />
                {user.phone}
              </span>
            ) : null}
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Globe className="size-3" aria-hidden />
              {user.timezone}
            </span>
          </div>

          {/* Plan badge + edit button */}
          <div className="mt-1 flex flex-wrap items-center justify-end gap-2">
            <EntitlementBadge tier={tier} />
            <Button
              variant="outline"
              size="sm"
              onClick={onEditClick}
              aria-label="Chỉnh sửa hồ sơ"
            >
              <Pencil className="size-3.5" aria-hidden />
              Chỉnh sửa
            </Button>
          </div>
        </div>
      </div>

      {/* Divider + public profile link */}
      <Separator className="my-4" />
      <div className="flex justify-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href={"/profile" as Route}>
            <Eye className="size-3.5" aria-hidden />
            Xem hồ sơ công khai
          </Link>
        </Button>
      </div>
    </div>
  );
}

export { ProfileHeroCard };
