"use client";

import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { DictionaryResult } from "./types";

export type DictionarySearchCommandProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  results: DictionaryResult[];
  loading?: boolean;
  onSelect?: (item: DictionaryResult) => void;
};

function DictionarySearchCommand({
  open,
  onOpenChange,
  query,
  onQueryChange,
  results,
  loading = false,
  onSelect,
}: DictionarySearchCommandProps) {
  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Tìm từ"
      description="Tìm từ, kanji hoặc hanzi trong từ điển"
    >
      <CommandInput
        placeholder="Tìm từ, kanji, hanzi…"
        value={query}
        onValueChange={onQueryChange}
      />
      <CommandList>
        {loading ? (
          <div className="px-4 py-3 text-center text-sm text-text-muted">
            Đang tìm...
          </div>
        ) : (
          <>
            <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
            {results.length > 0 ? (
              <CommandGroup heading="Kết quả">
                {results.map((r) => (
                  <CommandItem
                    key={r.id}
                    value={r.word}
                    onSelect={() => onSelect?.(r)}
                    className="gap-2"
                  >
                    <span className="text-sm font-semibold text-text-primary">
                      {r.word}
                    </span>
                    {r.reading ? (
                      <span className="text-xs text-text-muted">
                        {r.reading}
                      </span>
                    ) : null}
                    {r.partOfSpeech ? (
                      <span className="text-xs italic text-text-muted">
                        {r.partOfSpeech}
                      </span>
                    ) : null}
                    <span className="ml-auto text-xs text-text-secondary">
                      {r.meaning}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

export { DictionarySearchCommand };
