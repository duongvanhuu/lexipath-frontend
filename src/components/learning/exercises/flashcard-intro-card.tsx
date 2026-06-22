import * as React from "react";
import { Play } from "lucide-react";

import { IconButton, LexiButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";

export type FlashcardIntroCardProps = {
  word: string;
  reading?: string;
  partOfSpeech?: string;
  meaning: string;
  example?: string;
  exampleTranslation?: string;
  onPlayAudio?: () => void;
  onContinue?: () => void;
  className?: string;
};

function FlashcardIntroCard({
  word,
  reading,
  partOfSpeech,
  meaning,
  example,
  exampleTranslation,
  onPlayAudio,
  onContinue,
  className,
}: FlashcardIntroCardProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-sm flex-col items-center gap-4 rounded-card border border-border bg-card px-8 py-8 text-center",
        className
      )}
    >
      <div className="text-5xl font-bold tracking-tight text-text-primary">
        {word}
      </div>
      {reading ? (
        <div className="text-lg text-text-secondary">{reading}</div>
      ) : null}
      {partOfSpeech ? (
        <div className="text-xs italic text-text-muted">{partOfSpeech}</div>
      ) : null}
      {onPlayAudio ? (
        <IconButton
          variant="ghost"
          label="Nghe phát âm"
          className="size-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
          onClick={onPlayAudio}
        >
          <Play className="size-4" />
        </IconButton>
      ) : null}
      <div className="text-xl font-semibold text-text-primary">{meaning}</div>
      {example ? (
        <div className="w-full rounded-md bg-muted px-4 py-3 text-left">
          <p className="text-sm leading-relaxed text-text-primary">{example}</p>
          {exampleTranslation ? (
            <p className="mt-1 text-xs text-text-muted">
              {exampleTranslation}
            </p>
          ) : null}
        </div>
      ) : null}
      {onContinue ? (
        <LexiButton variant="primary" onClick={onContinue} className="w-full">
          Tiếp tục
        </LexiButton>
      ) : null}
    </div>
  );
}

export { FlashcardIntroCard };
