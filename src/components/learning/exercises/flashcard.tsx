"use client";

import * as React from "react";
import { Turtle, Volume2 } from "lucide-react";

import { IconButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";

function speakWord(word: string, lang: string, slow: boolean) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = lang;
    u.rate = slow ? 0.45 : 0.95;
    window.speechSynthesis.speak(u);
  } catch {
    // TTS unavailable
  }
}

export type FlashcardProps = {
  word: string;
  reading?: string;
  ipa?: string;
  meaning: string;
  example?: string;
  exampleTranslation?: string;
  pos?: string;
  lang?: string;
  isFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  onPlayAudio?: () => void;
  audioLabel?: string;
  isAudioPlaying?: boolean;
  className?: string;
};

function Flashcard({
  word,
  reading,
  ipa,
  meaning,
  example,
  exampleTranslation,
  pos,
  lang = "ja-JP",
  isFlipped: controlledFlipped,
  onFlip,
  onPlayAudio,
  audioLabel = "Nghe phát âm",
  className,
}: FlashcardProps) {
  const [internalFlipped, setInternalFlipped] = React.useState(false);
  const isFlipped =
    controlledFlipped !== undefined ? controlledFlipped : internalFlipped;

  function handleFlip() {
    const next = !isFlipped;
    if (onFlip) {
      onFlip(next);
    } else {
      setInternalFlipped(next);
    }
  }

  function handleAudio(slow: boolean) {
    if (onPlayAudio) {
      onPlayAudio();
    } else {
      speakWord(word, lang, slow);
    }
  }

  const highlightedExample = React.useMemo(() => {
    if (!example || !word) return example;
    const parts = example.split(word);
    if (parts.length < 2) return example;
    return (
      <>
        {parts[0]}
        <strong className="border-b-2 border-primary pb-px text-primary">
          {word}
        </strong>
        {parts.slice(1).join(word)}
      </>
    );
  }, [example, word]);

  return (
    <div
      className={cn(
        "flex w-full max-w-lg flex-col items-center gap-4",
        className
      )}
    >
      {/* Audio controls */}
      <div className="flex gap-3">
        <IconButton
          variant="ghost"
          label={audioLabel}
          className="size-12 rounded-full border border-border bg-card shadow-sm text-primary"
          onClick={() => handleAudio(false)}
        >
          <Volume2 className="size-5" />
        </IconButton>
        <IconButton
          variant="ghost"
          label="Nghe chậm"
          className="size-12 rounded-full border border-border bg-card shadow-sm text-golden-foreground"
          onClick={() => handleAudio(true)}
        >
          <Turtle className="size-5" />
        </IconButton>
      </div>

      {/* Card */}
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={isFlipped ? "Ẩn nghĩa" : "Xem nghĩa"}
        onClick={handleFlip}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleFlip();
          }
        }}
        className="relative h-[360px] w-full cursor-pointer select-none overflow-hidden rounded-card border border-border bg-card shadow-sm"
      >
        {/* Front */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center transition-all duration-300",
            isFlipped
              ? "pointer-events-none -translate-y-2 opacity-0"
              : "translate-y-0 opacity-100"
          )}
        >
          <div className="flex h-32 w-48 shrink-0 items-center justify-center rounded-md bg-muted text-text-muted" />
          <div className="text-2xl leading-snug text-text-primary">
            {highlightedExample ?? word}
          </div>
          {exampleTranslation ? (
            <div className="text-sm text-text-secondary">
              {exampleTranslation}
            </div>
          ) : null}
          <div className="absolute bottom-4 text-xs text-text-muted">
            Nhấn vào thẻ để xem nghĩa
          </div>
        </div>

        {/* Back */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center transition-all duration-300",
            isFlipped
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          )}
        >
          <div className="text-5xl font-bold tracking-tight text-text-primary">
            {word}
          </div>
          <div className="text-xl font-medium text-text-secondary">
            {reading}
            {ipa ? (
              <span className="ml-2 text-base text-text-muted">{ipa}</span>
            ) : null}
          </div>
          {pos ? (
            <div className="text-xs uppercase tracking-wide text-text-muted">
              {pos}
            </div>
          ) : null}
          <div className="text-3xl font-semibold text-text-primary">
            {meaning}
          </div>
          {example ? (
            <div className="mt-2 max-w-sm text-base leading-relaxed text-text-secondary">
              {example}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export { Flashcard };
