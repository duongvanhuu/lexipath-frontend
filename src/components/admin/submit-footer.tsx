"use client"

import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface SubmitFooterProps {
  submitLabel: string
  onCancel?: () => void
  cancelLabel?: string
  isSubmitting?: boolean
}

export function SubmitFooter({
  submitLabel,
  onCancel,
  cancelLabel = "Hủy",
  isSubmitting = false,
}: SubmitFooterProps) {
  return (
    <>
      <Separator className="mt-6" />
      <div className="flex items-center justify-end gap-2 pt-4">
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : null}
          {isSubmitting ? "Đang lưu..." : submitLabel}
        </Button>
      </div>
    </>
  )
}
