"use client";

import * as React from "react";
import { Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/shared/feedback/toast";
import { cn } from "@/lib/utils/cn";
import type { AdminPermission, AdminRole } from "@/features/admin-rbac";

function groupPermissions(permissions: AdminPermission[]) {
  const groups: Record<string, AdminPermission[]> = {};
  permissions.forEach((p) => {
    (groups[p.group] = groups[p.group] ?? []).push(p);
  });
  return groups;
}

export type PermissionMatrixProps = {
  permissions: AdminPermission[];
  roles: AdminRole[];
};

export function PermissionMatrix({ permissions, roles }: PermissionMatrixProps) {
  const groups = groupPermissions(permissions);

  function handleExport() {
    toast.success("Đã xuất ma trận quyền (CSV)");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          Tổng quan quyền hạn theo vai trò — bảng role_permissions.
        </p>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="size-4" aria-hidden />
          Xuất CSV
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-surface-muted border-b">
              <th className="sticky left-0 z-10 bg-surface-muted min-w-60 px-4 py-3 text-left font-semibold text-text-secondary">
                Quyền
              </th>
              {roles.map((r) => (
                <th
                  key={r.id}
                  className="min-w-24 px-3 py-3 text-center font-semibold text-text-secondary"
                >
                  <p className="text-xs font-semibold text-text-primary">{r.name}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{r.users} người</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(groups).map(([group, perms]) => (
              <React.Fragment key={group}>
                <tr>
                  <td
                    colSpan={roles.length + 1}
                    className="sticky left-0 bg-surface-muted/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted"
                  >
                    {group}
                  </td>
                </tr>
                {perms.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-surface-muted/30">
                    <td className="sticky left-0 z-10 bg-background px-4 py-3">
                      <p className="font-medium text-text-primary">{p.label}</p>
                      <code className="text-xs text-text-muted font-mono">{p.key}</code>
                    </td>
                    {roles.map((r) => (
                      <td key={r.id} className="px-3 py-3 text-center">
                        {r.permissions.includes(p.key) ? (
                          <span className={cn("inline-flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary")}>
                            <Check className="size-3.5" aria-hidden />
                          </span>
                        ) : (
                          <span className="text-border">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
