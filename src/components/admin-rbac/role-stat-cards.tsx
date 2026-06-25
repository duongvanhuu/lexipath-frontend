import * as React from "react";
import { KeyRound, Lock, Shield, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

type StatItem = {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  colorClass: string;
};

export type RoleStatCardsProps = {
  totalRoles: number;
  totalPermissions: number;
  usersWithRoles: number;
  systemRoles: number;
};

export function RoleStatCards({
  totalRoles,
  totalPermissions,
  usersWithRoles,
  systemRoles,
}: RoleStatCardsProps) {
  const items: StatItem[] = [
    {
      label: "Tổng vai trò",
      value: totalRoles,
      icon: <Shield className="size-5" aria-hidden />,
      colorClass: "text-primary",
    },
    {
      label: "Quyền hệ thống",
      value: totalPermissions,
      icon: <KeyRound className="size-5" aria-hidden />,
      colorClass: "text-secondary",
    },
    {
      label: "Người dùng có vai trò",
      value: usersWithRoles,
      icon: <Users className="size-5" aria-hidden />,
      colorClass: "text-warning",
    },
    {
      label: "Vai trò hệ thống",
      value: systemRoles,
      icon: <Lock className="size-5" aria-hidden />,
      colorClass: "text-text-muted",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex items-center gap-3 pt-4 pb-4">
            <span
              className={cn(
                "inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-muted",
                item.colorClass
              )}
            >
              {item.icon}
            </span>
            <div>
              <p className="text-2xl font-semibold leading-none text-text-primary">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-text-secondary">{item.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
