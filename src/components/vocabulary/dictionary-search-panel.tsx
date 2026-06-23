"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type { DictLang, SearchMode, SearchModeOption } from "@/features/dictionary";

export type DictionarySearchPanelProps = {
  lang: DictLang;
  modes: SearchModeOption[];
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
  query: string;
  onQueryChange: (query: string) => void;
};

function DictionarySearchPanel({
  modes,
  mode,
  onModeChange,
  query,
  onQueryChange,
}: DictionarySearchPanelProps) {
  const currentMode = modes.find((m) => m.id === mode) ?? modes[0] ?? modes.at(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      onQueryChange("");
      inputRef.current?.blur();
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm mb-4">
      {/* Mode pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onModeChange(m.id)}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs font-medium border transition-all whitespace-nowrap",
              mode === m.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-text-secondary hover:border-primary/50 hover:text-text-primary"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          size={16}
        />
        <Input
          ref={inputRef}
          placeholder={currentMode?.placeholder ?? ""}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-9"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              onQueryChange("");
              inputRef.current?.focus();
            }}
            aria-label="Xóa tìm kiếm"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-text-muted hover:text-text-primary p-0.5"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export { DictionarySearchPanel };
