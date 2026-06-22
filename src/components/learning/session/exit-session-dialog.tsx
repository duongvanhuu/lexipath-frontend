"use client";

import * as React from "react";

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
import { Progress } from "@/components/ui/progress";

export type ExitSessionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExit: () => void;
  progress?: number;
};

function ExitSessionDialog({
  open,
  onOpenChange,
  onExit,
  progress,
}: ExitSessionDialogProps) {
  const hasProgress = typeof progress === "number";
  const pct = hasProgress ? Math.max(0, Math.min(100, progress)) : 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm text-center">
        <AlertDialogHeader className="items-center">
          <AlertDialogTitle>Thoát buổi học?</AlertDialogTitle>
          <AlertDialogDescription>
            Tiến độ của bạn sẽ được lưu lại. Bạn có thể quay lại bất cứ lúc nào.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {hasProgress ? (
          <div className="space-y-1.5">
            <Progress value={pct} aria-label="Tiến độ" className="h-1.5" />
            <p className="text-xs text-text-muted">Đã hoàn thành {pct}%</p>
          </div>
        ) : null}
        <AlertDialogFooter className="justify-center sm:justify-center">
          <AlertDialogCancel>Tiếp tục học</AlertDialogCancel>
          <AlertDialogAction
            className="border-transparent bg-danger text-white hover:bg-danger/90"
            onClick={onExit}
          >
            Thoát
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ExitSessionDialog };
