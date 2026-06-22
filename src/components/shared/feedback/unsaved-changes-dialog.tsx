import * as React from "react";
import { TriangleAlert } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type UnsavedChangesDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Leave without saving. */
  onDiscard: () => void;
  /** Persist the pending changes. */
  onSave: () => void;
  /** Dismiss and keep editing. */
  onCancel?: () => void;
  /** Disable actions while saving. */
  saving?: boolean;
  title?: string;
  description?: string;
};

/**
 * UnsavedChangesDialog — guards navigation away from a dirty form. Offers three
 * paths: discard (destructive), keep editing (cancel), or save.
 */
function UnsavedChangesDialog({
  open,
  onOpenChange,
  onDiscard,
  onSave,
  onCancel,
  saving = false,
  title = "Thay đổi chưa lưu",
  description = "Bạn có thay đổi chưa được lưu. Bạn muốn lưu trước khi rời đi không?",
}: UnsavedChangesDialogProps) {
  const rootProps: React.ComponentProps<typeof AlertDialog> = {};
  if (open !== undefined) rootProps.open = open;
  if (onOpenChange) rootProps.onOpenChange = onOpenChange;

  return (
    <AlertDialog {...rootProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-warning-soft text-warning-foreground">
            <TriangleAlert aria-hidden />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            variant="destructive"
            onClick={onDiscard}
            disabled={saving}
          >
            Bỏ thay đổi
          </AlertDialogAction>
          <AlertDialogCancel onClick={onCancel}>
            Tiếp tục chỉnh sửa
          </AlertDialogCancel>
          <AlertDialogAction onClick={onSave} disabled={saving}>
            Lưu thay đổi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { UnsavedChangesDialog };
