"use client";

import * as React from "react";
import { ArrowLeft, Save, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/shared/feedback/toast";
import type { AdminRole, AdminPermission } from "@/features/admin-rbac";
import { cn } from "@/lib/utils/cn";

export type RoleDetailViewProps = {
  role: AdminRole;
  allPermissions: AdminPermission[];
  onBack: () => void;
  onAssignUser?: () => void;
};

function groupPermissions(permissions: AdminPermission[]) {
  const groups: Record<string, AdminPermission[]> = {};
  permissions.forEach((p) => {
    (groups[p.group] = groups[p.group] ?? []).push(p);
  });
  return groups;
}

export function RoleDetailView({
  role,
  allPermissions,
  onBack,
  onAssignUser,
}: RoleDetailViewProps) {
  const [granted, setGranted] = React.useState<Set<string>>(
    new Set(role.permissions)
  );

  const groups = groupPermissions(allPermissions);

  function toggle(key: string) {
    if (role.system) return;
    setGranted((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function handleSave() {
    toast.success("Đã lưu thay đổi vai trò");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Tất cả vai trò
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            {role.name}
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">{role.description}</p>
        </div>
        {role.system ? (
          <Badge variant="secondary" className="shrink-0">
            Vai trò hệ thống · chỉ đọc
          </Badge>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            {onAssignUser && (
              <Button variant="outline" size="sm" onClick={onAssignUser}>
                <UserPlus className="size-4" aria-hidden />
                Gán người dùng
              </Button>
            )}
            <Button size="sm" onClick={handleSave}>
              <Save className="size-4" aria-hidden />
              Lưu
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Người dùng", value: role.users },
          { label: "Quyền được cấp", value: granted.size },
          { label: "Loại", value: role.system ? "Hệ thống" : "Tùy chỉnh" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xl font-semibold text-text-primary">{s.value}</p>
              <p className="mt-0.5 text-xs text-text-secondary">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key */}
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <span>Định danh:</span>
        <code className="rounded-md bg-surface-muted px-2 py-0.5 text-xs font-mono text-text-primary">
          {role.key}
        </code>
      </div>

      {/* Permission groups */}
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-text-primary">
          Quyền hạn ({granted.size}/{allPermissions.length})
        </p>
        {Object.entries(groups).map(([group, perms]) => (
          <Card key={group} className="overflow-hidden p-0">
            <div className="border-b px-4 py-2.5 bg-surface-muted/50">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                {group}
              </p>
            </div>
            <div>
              {perms.map((p, i) => (
                <div
                  key={p.id}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3",
                    i < perms.length - 1 && "border-b"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <Label
                      htmlFor={`perm-${p.id}`}
                      className={cn(
                        "text-sm font-medium cursor-pointer",
                        role.system && "cursor-default"
                      )}
                    >
                      {p.label}
                    </Label>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {p.desc} ·{" "}
                      <code className="font-mono text-xs">{p.key}</code>
                    </p>
                  </div>
                  <Switch
                    id={`perm-${p.id}`}
                    checked={granted.has(p.key)}
                    onCheckedChange={() => toggle(p.key)}
                    disabled={role.system}
                    aria-label={p.label}
                  />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
