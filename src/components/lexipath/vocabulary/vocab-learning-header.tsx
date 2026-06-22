"use client";

import * as React from "react";
import { Volume2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

/* -------------------------------------------------------------------------- */
/* VocabLearningHeader                                                         */
/* -------------------------------------------------------------------------- */

export type VocabLearningHeaderProps = {
  word: string;
  partOfSpeech?: string;
  phoneticText?: string;
  audioUrl?: string;
  onPlayAudio?: () => void;
  className?: string;
};

/**
 * VocabLearningHeader — bold vocabulary word display with part-of-speech
 * badge, phonetic text, and optional audio playback button.
 *
 * "use client" is required because the audio button binds an onClick handler
 * (onPlayAudio) that a parent Client Component provides.
 */
function VocabLearningHeader({
  word,
  partOfSpeech,
  phoneticText,
  onPlayAudio,
  className,
}: VocabLearningHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Word + audio */}
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-text-primary">{word}</h1>
        {onPlayAudio ? (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-9 shrink-0 text-text-secondary hover:text-text-primary"
            onClick={onPlayAudio}
            aria-label="Nghe phát âm"
          >
            <Volume2 className="size-5" aria-hidden />
          </Button>
        ) : null}
      </div>

      {/* Metadata row */}
      <div className="flex flex-wrap items-center gap-2">
        {partOfSpeech ? (
          <Badge
            variant="secondary"
            className="rounded-pill bg-surface-muted text-text-secondary"
          >
            {partOfSpeech}
          </Badge>
        ) : null}
        {phoneticText ? (
          <span className="font-mono text-sm text-text-muted">
            /{phoneticText}/
          </span>
        ) : null}
      </div>
    </div>
  );
}

export { VocabLearningHeader };
