import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type VocabAiDisclosureProps = {
  visible?: boolean;
  className?: string;
};

export function VocabAiDisclosure({ visible, className }: VocabAiDisclosureProps) {
  if (visible === false) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900",
        className,
      )}
    >
      <AlertTriangle
        className="h-4 w-4 shrink-0 mt-0.5 text-amber-600"
        aria-hidden="true"
      />
      <p>
        Mục từ này có nội dung do AI tạo. Vui lòng kiểm tra nghĩa, ví dụ, phát âm và nguồn trước khi gửi duyệt hoặc xuất bản.
      </p>
    </div>
  );
}
