"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

import { FocusLearningShell } from "@/components/layouts";
import { ExitSessionDialog } from "@/components/learning/session/exit-session-dialog";
import { LearningSessionSummary } from "@/components/learning/session/learning-session-summary";
import { ExerciseRenderer } from "@/components/learning/session/exercise-renderer";
import { useSessionPlayer } from "@/features/learning/hooks/use-session-player";
import type { SessionExercise, SessionMeta } from "@/features/learning/types/session.types";

type SessionPlayerClientProps = {
  exercises: SessionExercise[];
  meta: SessionMeta;
};

export function SessionPlayerClient({
  exercises,
  meta,
}: SessionPlayerClientProps) {
  const router = useRouter();
  const player = useSessionPlayer(exercises);

  // Stable ref so keyboard handler never goes stale
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

      // Enter always advances when feedback is visible
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
            // Submit (records correct) + advance in one batch — no intermediate feedback step
            p.submit();
            p.advance();
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

      // fill_blank / spelling: Enter submits
      if (e.key === "Enter" && !inInput && p.answerState === "selected") {
        e.preventDefault();
        p.submit();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function handleExit() {
    const returnHref = (meta.returnHref ?? "/dashboard") as Route;
    router.push(returnHref);
  }

  const metaSlot = (
    <span className="text-xs tabular-nums text-text-muted">
      {player.currentIndex + 1}/{player.totalCount}
    </span>
  );

  return (
    <FocusLearningShell
      onClose={player.openExitDialog}
      closeLabel="Thoát buổi học"
      title={meta.lessonTitle}
      progress={
        player.phase === "summary" ? 100 : player.progressPercent
      }
      meta={player.phase === "playing" ? metaSlot : undefined}
    >
      {player.phase === "playing" && player.current ? (
        <ExerciseRenderer
          key={player.current.id}
          exercise={player.current}
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
        <LearningSessionSummary
          lessonTitle={meta.lessonTitle}
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
