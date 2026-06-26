"use client";

import * as React from "react";
import { Check, Plus, Volume2, BookmarkCheck } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { DictionaryEntry, MatchTier } from "@/features/dictionary";

export type DictionaryResultCardProps = {
  entry: DictionaryEntry;
  tier: MatchTier;
  saved: boolean;
  onSelect: (entry: DictionaryEntry) => void;
  onSave: (entry: DictionaryEntry) => void;
};

const LANG_CODE: Record<string, string> = {
  ja: "ja-JP",
  en: "en-US",
  zh: "zh-CN",
};

function playTTS(word: string, lang: string, e: React.MouseEvent) {
  e.stopPropagation();
  if (!("speechSynthesis" in window)) return;
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = LANG_CODE[lang] ?? "en-US";
    utterance.rate = 0.9;
    synth.speak(utterance);
  } catch {
    // silently ignore TTS errors
  }
}

function DictionaryResultCard({
  entry,
  tier,
  saved,
  onSelect,
  onSave,
}: DictionaryResultCardProps) {
  const isEN = entry.lang === "en";
  const audioOK =
    typeof window !== "undefined" && "speechSynthesis" in window;

  return (
    <article
      className={cn(
        "w-full flex items-start gap-3 rounded-2xl border p-4 transition-all",
        "hover:border-primary hover:shadow-[0_0_0_3px_oklch(from_var(--primary)_l_c_h/0.08)]",
        tier === "exact"
          ? "border-primary/40 bg-primary/[0.03]"
          : "border-border bg-card"
      )}
    >
      {/* Clickable area: word + body → onSelect */}
      <button
        type="button"
        onClick={() => onSelect(entry)}
        className="flex flex-1 items-start gap-3 text-left min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      >
        {/* Word */}
        <div className="flex-shrink-0 min-w-[52px]">
          <span
            lang={entry.lang !== "en" ? entry.lang : undefined}
            className={cn(
              "block font-bold leading-tight text-text-primary",
              isEN ? "text-lg font-sans" : "text-2xl",
              entry.lang === "ja" || entry.lang === "zh"
                ? "font-[var(--font-cjk,sans-serif)]"
                : ""
            )}
          >
            {entry.word}
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          {entry.reading && (
            <p
              lang={entry.lang !== "en" ? entry.lang : undefined}
              className={cn(
                "text-xs font-medium mb-1",
                isEN
                  ? "text-text-muted italic font-sans"
                  : "text-secondary"
              )}
            >
              {entry.reading}
            </p>
          )}
          <p className="text-sm font-semibold text-text-primary mb-2">
            {entry.meaning}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {entry.pos && (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-text-muted">
                {entry.pos}
              </span>
            )}
            {tier === "exact" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                <Check size={10} /> Khớp chính xác
              </span>
            )}
            {tier === "norm" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-info-soft px-2.5 py-0.5 text-[10px] font-semibold text-info-foreground">
                Khớp gần đúng
              </span>
            )}
            {entry.inNotebook && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-text-secondary">
                <BookmarkCheck size={10} /> Trong sổ tay
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Actions — independent buttons, not nested inside the select button */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <button
          type="button"
          aria-label={`Nghe phát âm ${entry.word}`}
          disabled={!audioOK}
          onClick={(e) => playTTS(entry.word, entry.lang, e)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-secondary transition-all",
            audioOK
              ? "hover:border-secondary hover:bg-secondary/8"
              : "opacity-40 cursor-not-allowed"
          )}
        >
          <Volume2 size={12} />
        </button>
        <button
          type="button"
          aria-label={saved ? `Đã lưu ${entry.word}` : `Lưu từ ${entry.word}`}
          onClick={() => onSave(entry)}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all whitespace-nowrap",
            saved
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card text-text-secondary hover:border-primary hover:bg-primary/10 hover:text-primary"
          )}
        >
          {saved ? <Check size={11} /> : <Plus size={11} />}
          {saved ? "Đã lưu" : "Lưu"}
        </button>
      </div>
    </article>
  );
}

export { DictionaryResultCard };
