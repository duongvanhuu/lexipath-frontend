"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export interface CollectionStickyBarProps {
  visible: boolean;
  saving?: boolean;
  onDiscard: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  publishLabel?: string;
  className?: string;
}

export function CollectionStickyBar({
  visible,
  saving,
  onDiscard,
  onSaveDraft,
  onPublish,
  publishLabel = "Xuất bản",
  className,
}: CollectionStickyBarProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-card shadow-[0_-2px_8px_rgba(16,24,40,0.06)]",
        "flex items-center justify-between px-4 py-2.5 sm:px-6 lg:left-60",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span className="flex items-center gap-2 text-sm text-text-secondary">
        <span className="size-2 rounded-full bg-warning inline-block" aria-hidden />
        Có thay đổi chưa lưu
      </span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={saving}
          onClick={onDiscard}
        >
          Bỏ thay đổi
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={saving}
          onClick={onSaveDraft}
        >
          Lưu nháp
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          disabled={saving}
          onClick={onPublish}
        >
          {publishLabel}
        </Button>
      </div>
    </div>
  );
}
