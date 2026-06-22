import * as React from "react";
import { BookOpen } from "lucide-react";

import { EmptyState } from "@/components/shared/feedback/empty-state";
import { cn } from "@/lib/utils/cn";

export interface ComingSoonExamPlayerStateProps {
  title?: string;
  description?: string;
  className?: string;
}

function ComingSoonExamPlayerState({
  title = "Exam Player đang được xây dựng",
  description = "Tính năng làm bài thi trực tuyến sẽ ra mắt sớm. Bạn có thể tiếp tục xây dựng ngân hàng câu hỏi và cấu trúc đề thi trong thời gian này.",
  className,
}: ComingSoonExamPlayerStateProps) {
  return (
    <EmptyState
      icon={<BookOpen />}
      title={title}
      description={description}
      className={cn("rounded-card border border-dashed border-border", className)}
    />
  );
}

export { ComingSoonExamPlayerState };
