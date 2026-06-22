"use client";

import * as React from "react";
import { Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

/* -------------------------------------------------------------------------- */
/* PhoneticAudioRow                                                            */
/* -------------------------------------------------------------------------- */

export type PhoneticAudioRowProps = {
  phoneticText?: string;
  audioUrl?: string;
  onPlayAudio?: () => void;
  lang?: string;
  className?: string;
};

/**
 * PhoneticAudioRow — phonetic transcription + audio playback button.
 *
 * "use client" is required because:
 * - onPlayAudio binds an onClick event handler.
 * - When only audioUrl is provided (no onPlayAudio), we fall back to
 *   `new Audio(audioUrl).play()` which requires browser APIs.
 */
function PhoneticAudioRow({
  phoneticText,
  audioUrl,
  onPlayAudio,
  lang,
  className,
}: PhoneticAudioRowProps) {
  const handlePlay = React.useCallback(() => {
    if (onPlayAudio) {
      onPlayAudio();
      return;
    }
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(() => {
        // Silently ignore auto-play policy errors.
      });
    }
  }, [onPlayAudio, audioUrl]);

  const hasAudio = Boolean(onPlayAudio ?? audioUrl);

  if (!phoneticText && !hasAudio) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {phoneticText ? (
        <span
          className="font-mono text-sm text-text-muted"
          lang={lang}
          aria-label={`Phiên âm: ${phoneticText}`}
        >
          /{phoneticText}/
        </span>
      ) : null}

      {hasAudio ? (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-7 shrink-0 text-text-secondary hover:text-text-primary"
          onClick={handlePlay}
          aria-label="Nghe phát âm"
        >
          <Volume2 className="size-4" aria-hidden />
        </Button>
      ) : null}
    </div>
  );
}

export { PhoneticAudioRow };
