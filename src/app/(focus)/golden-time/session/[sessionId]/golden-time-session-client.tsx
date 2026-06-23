"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Zap } from "lucide-react";

import { FocusLearningShell } from "@/components/layouts";
import { ExitSessionDialog } from "@/components/learning/session/exit-session-dialog";
import { GoldenTimeSessionSummary } from "@/components/learning/session/golden-time-session-summary";
import { GoldenTimeExerciseRenderer } from "@/components/learning/session/golden-time-exercise-renderer";
import { useSessionPlayer } from "@/features/learning/hooks/use-session-player";
import type { GoldenTimeExercise } from "@/features/golden-time/session/golden-time-session.types";
import type { GoldenTimeSessionMeta } from "@/features/golden-time/session/golden-time-session.types";

type GoldenTimeSessionClientProps = {
  exercises: GoldenTimeExercise[];
  meta: GoldenTimeSessionMeta;
};

export function GoldenTimeSessionClient({
  exercises,
  meta,
}: GoldenTimeSessionClientProps) {
  const router = useRouter();
  const player = useSessionPlayer(exercises);

  const playerRef = React.useRef(player);
  React.useEffect(() => {
    playerRef.current = player;
  });

  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const p = playerRef.current;
      if (p.exitDialogOpen) return;
      if (p.phase === "summary") return;

      const target = e.target as HTMLElement;
      const inInput =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement;

      if (p.feedbackState !== null) {
        if (e.key === "Enter") {
          e.preventDefault();
          p.advance();
        }
        return;
      }

      const { current } = p;
      if (!current) return;

      if (current.type === "flashcard") {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          if (!p.flashcardFlipped) {
            p.flipFlashcard(true);
          } else {
            p.submit();
          }
        }
        return;
      }

      if (current.type === "choice" || current.type === "audio") {
        if (inInput) return;
        const idx = parseInt(e.key, 10) - 1;
        if (!isNaN(idx) && idx >= 0 && idx < (current.choices?.length ?? 0)) {
          e.preventDefault();
          p.selectAndSubmit(idx);
        }
        return;
      }

      if (current.type === "collocation") {
        if (inInput) return;
        const idx = parseInt(e.key, 10) - 1;
        if (
          !isNaN(idx) &&
          idx >= 0 &&
          idx < (current.collocationOptions?.length ?? 0)
        ) {
          e.preventDefault();
          p.selectAndSubmitCollocation(idx);
        }
        return;
      }

      if (e.key === "Enter" && !inInput && p.answerState === "selected") {
        e.preventDefault();
        p.submit();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function handleExit() {
    const returnHref = (meta.returnHref ?? "/golden-time") as Route;
    router.push(returnHref);
  }

  const goldenBadge = (
    <span
      aria-hidden
      className="inline-flex items-center justify-center rounded-full bg-golden p-1"
    >
      <Zap className="size-3 text-white" />
    </span>
  );

  const metaSlot = (
    <span className="text-xs tabular-nums text-text-muted">
      {player.currentIndex + 1}/{player.totalCount}
    </span>
  );

  const currentExercise = player.current as GoldenTimeExercise | undefined;

  return (
    <FocusLearningShell
      onClose={player.openExitDialog}
      closeLabel="Thoát Golden Time"
      pathIndicator={goldenBadge}
      title={meta.lessonTitle}
      progress={player.phase === "summary" ? 100 : player.progressPercent}
      meta={player.phase === "playing" ? metaSlot : undefined}
    >
      {player.phase === "playing" && currentExercise ? (
        <GoldenTimeExerciseRenderer
          key={currentExercise.id}
          exercise={currentExercise}
          answerState={player.answerState}
          feedbackState={player.feedbackState}
          selectedChoiceIndex={player.selectedChoiceIndex}
          textInput={player.textInput}
          collocationSelectedIndex={player.collocationSelectedIndex}
          flashcardFlipped={player.flashcardFlipped}
          onSelectAndSubmit={player.selectAndSubmit}
          onSelectAndSubmitCollocation={player.selectAndSubmitCollocation}
          onSetTextInput={player.setTextInput}
          onFlipFlashcard={player.flipFlashcard}
          onSubmit={player.submit}
          onContinue={player.advance}
        />
      ) : null}

      {player.phase === "summary" ? (
        <GoldenTimeSessionSummary
          correctCount={player.correctCount}
          incorrectCount={player.incorrectCount}
          totalXp={player.totalXp}
          durationLabel={player.getDurationLabel()}
          skillBreakdown={player.skillBreakdown}
          onHome={handleExit}
        />
      ) : null}

      <ExitSessionDialog
        open={player.exitDialogOpen}
        onOpenChange={(open) => {
          if (!open) player.closeExitDialog();
        }}
        onExit={handleExit}
        progress={player.progressPercent}
      />
    </FocusLearningShell>
  );
}
