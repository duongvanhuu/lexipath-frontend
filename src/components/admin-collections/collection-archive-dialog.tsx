import * as React from "react";
import { Archive } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface ArchiveTarget {
  type: "collection" | "lesson";
  id: string;
  name: string;
}

export interface CollectionArchiveDialogProps {
  open: boolean;
  target: ArchiveTarget | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function CollectionArchiveDialog({
  open,
  target,
  onClose,
  onConfirm,
}: CollectionArchiveDialogProps) {
  const kind = target?.type === "lesson" ? "bài học" : "bộ sưu tập";

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Lưu trữ {kind}?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>&ldquo;{target?.name}&rdquo;</strong> sẽ bị ẩn khỏi học viên.
            Bạn có thể khôi phục sau.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            className="gap-1.5"
          >
            <Archive className="size-4" aria-hidden />
            Xác nhận lưu trữ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
