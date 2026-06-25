"use client";

import * as React from "react";
import { Search, UserCog } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layouts/page-header";
import { EmptyState } from "@/components/shared/feedback/empty-state";
import { AssignRoleDrawer } from "@/components/admin-rbac/assign-role-drawer";
import { cn } from "@/lib/utils/cn";
import type { AdminRole, RbacUser } from "@/features/admin-rbac";

export type UsersClientProps = {
  users: RbacUser[];
  roles: AdminRole[];
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function UsersClient({ users, roles }: UsersClientProps) {
  const [search, setSearch] = React.useState("");
  const [drawerUser, setDrawerUser] = React.useState<RbacUser | null>(null);

  const roleMap = React.useMemo(
    () => Object.fromEntries(roles.map((r) => [r.id, r])),
    [roles]
  );

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Người dùng quản trị"
        description="Quản lý vai trò cho từng người dùng quản trị."
      />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          aria-label="Tìm kiếm người dùng"
          placeholder="Tìm theo tên hoặc email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-9"
        />
      </div>

      {/* User list */}
      <Card className="overflow-hidden p-0">
        {filtered.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="Không tìm thấy người dùng"
              description="Thử tìm với từ khóa khác."
            />
          </div>
        ) : (
          <ul role="list">
            {filtered.map((u, i) => (
              <li
                key={u.id}
                className={cn(
                  "flex flex-wrap items-center gap-4 px-4 py-3.5 sm:flex-nowrap",
                  i < filtered.length - 1 && "border-b"
                )}
              >
                <Avatar className="size-9 shrink-0">
                  <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                    {getInitials(u.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary leading-snug">
                    {u.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {u.email} · {u.lastActive}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:justify-end sm:max-w-xs">
                  {u.roles.length > 0 ? (
                    u.roles.map((rid) => {
                      const role = roleMap[rid];
                      return (
                        <Badge
                          key={rid}
                          variant={role?.system ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {role?.name ?? rid}
                        </Badge>
                      );
                    })
                  ) : (
                    <span className="text-xs text-text-muted">Chưa có vai trò</span>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => setDrawerUser(u)}
                >
                  <UserCog className="size-4" aria-hidden />
                  Quản lý
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <AssignRoleDrawer
        user={drawerUser}
        roles={roles}
        onClose={() => setDrawerUser(null)}
      />
    </div>
  );
}
