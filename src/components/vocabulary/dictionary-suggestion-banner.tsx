import * as React from "react";
import { Lightbulb } from "lucide-react";
import type { DictionaryEntry } from "@/features/dictionary";

export type DictionarySuggestionBannerProps = {
  suggestion: DictionaryEntry;
  onApply: (word: string) => void;
};

function DictionarySuggestionBanner({
  suggestion,
  onApply,
}: DictionarySuggestionBannerProps) {
  return (
    <div className="mb-4 flex items-center gap-2.5 rounded-[13px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-text-secondary">
      <Lightbulb size={16} className="flex-shrink-0 text-amber-500" />
      <span>
        Không có kết quả khớp. Có phải bạn muốn tìm{" "}
        <button
          type="button"
          onClick={() => onApply(suggestion.word)}
          className="font-bold text-secondary hover:underline"
        >
          {suggestion.word}
        </button>
        {suggestion.meaning && <span> — {suggestion.meaning}</span>}?
      </span>
    </div>
  );
}

export { DictionarySuggestionBanner };
