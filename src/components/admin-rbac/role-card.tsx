import * as React from "react";
import { KeyRound, Users, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { AdminRole } from "@/features/admin-rbac";

export type RoleCardProps = {
  role: AdminRole;
  onClick: (role: AdminRole) => void;
};

export function RoleCard({ role, onClick }: RoleCardProps) {
  return (
    <button
      type="button"
      className="text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      onClick={() => onClick(role)}
      aria-label={`Xem chi tiết vai trò ${role.name}`}
    >
      <Card className="flex h-full flex-col gap-3 p-4 transition-colors hover:bg-surface-muted/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex size-10 shrink-0 items-center justify-center rounded-[10px]",
                role.system
                  ? "bg-surface-muted text-text-muted"
                  : "bg-primary/10 text-primary"
              )}
            >
              {role.system ? (
                <ShieldAlert className="size-5" aria-hidden />
              ) : (
                <ShieldCheck className="size-5" aria-hidden />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary leading-snug">
                {role.name}
              </p>
              <code className="text-xs text-text-muted font-mono">{role.key}</code>
            </div>
          </div>
          {role.system && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              Hệ thống
            </Badge>
          )}
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{role.description}</p>
        <div className="flex items-center gap-4 text-xs text-text-secondary mt-auto">
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-3.5" aria-hidden />
            {role.users} người dùng
          </span>
          <span className="inline-flex items-center gap-1.5">
            <KeyRound className="size-3.5" aria-hidden />
            {role.permissions.length} quyền
          </span>
        </div>
      </Card>
    </button>
  );
}
