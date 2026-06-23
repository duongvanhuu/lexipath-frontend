import * as React from "react";
import { SearchX } from "lucide-react";

export type DictionaryEmptyStateProps = {
  query?: string;
};

function DictionaryEmptyState({ query }: DictionaryEmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-text-muted">
        <SearchX size={26} />
      </div>
      <p className="text-sm font-semibold text-text-secondary">
        Không tìm thấy kết quả
      </p>
      <p className="mt-1.5 text-[13px] text-text-muted leading-relaxed">
        {query ? (
          <>
            Không có kết quả cho <strong>&ldquo;{query}&rdquo;</strong>.
            <br />
          </>
        ) : null}
        Thử chế độ tìm khác hoặc kiểm tra chính tả.
      </p>
    </div>
  );
}

export { DictionaryEmptyState };
