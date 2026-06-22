import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CreateEditFormProps {
  mode: "create" | "edit";
  title?: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  children: React.ReactNode;
  submitLabel?: string;
}

export function CreateEditForm({
  mode,
  title,
  onSubmit,
  onCancel,
  isSubmitting = false,
  children,
  submitLabel,
}: CreateEditFormProps) {
  const defaultSubmitLabel = mode === "create" ? "Create" : "Save changes";
  const resolvedSubmitLabel = submitLabel ?? defaultSubmitLabel;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(e);
  }

  return (
    <form onSubmit={handleSubmit}>
      {title && (
        <h2 className="text-base font-semibold mb-4">{title}</h2>
      )}

      <div className="space-y-4">{children}</div>

      <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isSubmitting ? "Saving..." : resolvedSubmitLabel}
        </Button>
      </div>
    </form>
  );
}
