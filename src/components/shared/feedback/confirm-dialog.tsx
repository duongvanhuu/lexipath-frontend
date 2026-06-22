import * as React from "react";

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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type ConfirmDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the dialog (uncontrolled usage). */
  trigger?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  /** Optional leading icon shown in the header media slot. */
  icon?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  /** Use the destructive treatment for irreversible actions. */
  tone?: "default" | "danger";
  /** Disable the confirm button (e.g. while a mutation is in flight). */
  loading?: boolean;
};

/**
 * ConfirmDialog — a confirmation built on the shadcn `AlertDialog`. Use for
 * deliberate, interrupting decisions (delete, publish, leave). For irreversible
 * actions pass `tone="danger"`.
 */
function ConfirmDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  icon,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  onConfirm,
  tone = "default",
  loading = false,
}: ConfirmDialogProps) {
  const rootProps: React.ComponentProps<typeof AlertDialog> = {};
  if (open !== undefined) rootProps.open = open;
  if (onOpenChange) rootProps.onOpenChange = onOpenChange;

  return (
    <AlertDialog {...rootProps}>
      {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          {icon ? <AlertDialogMedia>{icon}</AlertDialogMedia> : null}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant={tone === "danger" ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={loading}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ConfirmDialog };
