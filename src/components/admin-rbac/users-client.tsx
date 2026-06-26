"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Search, UserCog } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layouts/page-header";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AssignRoleDrawer } from "@/components/admin-rbac/assign-role-drawer";
import type { AdminRole, RbacUser } from "@/features/admin-rbac";

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export type UsersClientProps = {
  users: RbacUser[];
  roles: AdminRole[];
};

export function UsersClient({ users, roles }: UsersClientProps) {
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [drawerUser, setDrawerUser] = React.useState<RbacUser | null>(null);

  const roleMap = React.useMemo(
    () => Object.fromEntries(roles.map((r) => [r.id, r])),
    [roles]
  );

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchesRole =
        roleFilter === "all" || u.roles.includes(roleFilter);
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const columns = React.useMemo<ColumnDef<RbacUser>[]>(
    () => [
      {
        id: "user",
        header: "Người dùng",
        accessorKey: "name",
        enableSorting: true,
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                  {getInitials(u.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary leading-snug truncate">
                  {u.name}
                </p>
                <p className="text-xs text-text-muted truncate">{u.email}</p>
              </div>
            </div>
          );
        },
      },
      {
        id: "roles",
        header: "Vai trò",
        cell: ({ row }) => {
          const u = row.original;
          if (u.roles.length === 0) {
            return (
              <span className="text-xs text-text-muted">Chưa có vai trò</span>
            );
          }
          return (
            <div className="flex flex-wrap gap-1">
              {u.roles.map((rid) => {
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
              })}
            </div>
          );
        },
      },
      {
        id: "lastActive",
        header: "Hoạt động gần đây",
        accessorKey: "lastActive",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary">
            {row.original.lastActive}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDrawerUser(row.original);
            }}
          >
            <UserCog className="size-4" aria-hidden />
            Quản lý
          </Button>
        ),
      },
    ],
    [roleMap]
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Người dùng quản trị"
        description="Quản lý vai trò cho từng người dùng quản trị."
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            aria-label="Tìm kiếm người dùng"
            placeholder="Tìm theo tên hoặc email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-9 w-[200px]" aria-label="Lọc theo vai trò">
            <SelectValue placeholder="Tất cả vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AdminDataTable
        data={filtered}
        columns={columns}
        emptyTitle="Không tìm thấy người dùng"
        emptyDescription="Thử tìm với từ khóa hoặc vai trò khác."
        onRowClick={(user) => setDrawerUser(user)}
      />

      <AssignRoleDrawer
        user={drawerUser}
        roles={roles}
        onClose={() => setDrawerUser(null)}
      />
    </div>
  );
}
