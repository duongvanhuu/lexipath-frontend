"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailDrawer } from "@/components/admin/detail-drawer";
import { toast } from "@/components/shared/feedback/toast";
import { cn } from "@/lib/utils/cn";
import type { AdminRole, RbacUser } from "@/features/admin-rbac";

export type AssignRoleDrawerProps = {
  user: RbacUser | null;
  roles: AdminRole[];
  onClose: () => void;
};

type AssignRoleInnerProps = {
  user: RbacUser;
  roles: AdminRole[];
  onClose: () => void;
};

function AssignRoleInner({ user, roles, onClose }: AssignRoleInnerProps) {
  const [draft, setDraft] = React.useState<string[]>(user.roles);

  function toggle(id: string) {
    setDraft((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleSave() {
    toast.success(`Đã cập nhật vai trò cho ${user.name}`);
    onClose();
  }

  return (
    <DetailDrawer
      open
      onOpenChange={(open) => { if (!open) onClose(); }}
      title={`Gán vai trò — ${user.name}`}
      description={user.email}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu thay đổi</Button>
        </div>
      }
    >
      <div className="flex flex-col gap-2 py-2">
        {roles.map((r) => {
          const on = draft.includes(r.id);
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => toggle(r.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                on
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:bg-surface-muted/50"
              )}
            >
              <span
                className={cn(
                  "inline-flex size-5 shrink-0 items-center justify-center rounded-md border-2",
                  on
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-transparent"
                )}
              >
                {on && <Check className="size-3" aria-hidden />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">{r.name}</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {r.permissions.length} quyền · {r.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </DetailDrawer>
  );
}

export function AssignRoleDrawer({ user, roles, onClose }: AssignRoleDrawerProps) {
  if (!user) return null;
  return <AssignRoleInner key={user.id} user={user} roles={roles} onClose={onClose} />;
}
