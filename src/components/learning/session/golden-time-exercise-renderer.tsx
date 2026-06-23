"use client";

import * as React from "react";

import { Flashcard } from "@/components/learning/exercises/flashcard";
import { ChoiceOption } from "@/components/learning/exercises/choice-option";
import { AudioQuestionCard } from "@/components/learning/exercises/audio-question-card";
import { FillBlankCard } from "@/components/learning/exercises/fill-blank-card";
import { SpellingInputCard } from "@/components/learning/exercises/spelling-input-card";
import { CollocationPracticeCard } from "@/components/learning/exercises/collocation-practice-card";
import { FeedbackCard } from "@/components/learning/exercises/feedback-card";
import { GoldenTimeQuestionCard } from "@/components/learning/exercises/golden-time-question-card";
import { ReviewReasonChip } from "@/components/lexipath";
import { SKILL_LABELS } from "@/components/lexipath";
import { LexiButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";
import type {
  ExerciseAnswerState,
  FeedbackState,
} from "@/components/learning/types";
import type { GoldenTimeExercise } from "@/features/golden-time/session/golden-time-session.types";

const CHOICE_KEYS = ["A", "B", "C", "D"] as const;

function speakWord(word: string, lang: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(word);
  u.lang = lang;
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

/* -------------------------------------------------------------------------- */
/* Internal helpers                                                            */
/* -------------------------------------------------------------------------- */

function ChoiceList({
  choices,
  selectedChoiceIndex,
  correctChoiceIndex,
  isAnswered,
  onSelect,
}: {
  choices: string[];
  selectedChoiceIndex: number | null;
  correctChoiceIndex: number | undefined;
  isAnswered: boolean;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {choices.map((choice, i) => {
        let state: ExerciseAnswerState = "idle";
        if (isAnswered) {
          if (i === correctChoiceIndex) state = "correct";
          else if (i === selectedChoiceIndex) state = "incorrect";
          else state = "disabled";
        } else if (i === selectedChoiceIndex) {
          state = "selected";
        }
        return (
          <ChoiceOption
            key={i}
            optionKey={CHOICE_KEYS[i]!}
            state={state}
            onClick={() => onSelect(i)}
          >
            {choice}
          </ChoiceOption>
        );
      })}
    </div>
  );
}

function Feedback({
  feedbackState,
  explanation,
  onContinue,
}: {
  feedbackState: FeedbackState;
  explanation: string | undefined;
  onContinue: () => void;
}) {
  return (
    <FeedbackCard
      state={feedbackState}
      {...(explanation !== undefined ? { explanation } : {})}
      onContinue={onContinue}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Golden info bar — slim context header for non-choice exercise types        */
/* -------------------------------------------------------------------------- */

type GoldenInfoBarProps = {
  skillKey: GoldenTimeExercise["skillKey"];
  reason: GoldenTimeExercise["reason"];
  dueLabel?: string;
};

function GoldenInfoBar({ skillKey, reason, dueLabel }: GoldenInfoBarProps) {
  return (
    <div className="flex items-center justify-between rounded-md bg-golden-soft px-4 py-2.5">
      <span className="text-xs font-semibold text-golden-foreground">
        Golden Time
      </span>
      <div className="flex items-center gap-2">
        <span className="rounded-pill bg-white/50 px-2 py-0.5 text-[10px] font-medium text-text-muted">
          {SKILL_LABELS[skillKey]}
        </span>
        <ReviewReasonChip reason={reason}>{dueLabel}</ReviewReasonChip>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* GoldenTimeExerciseRenderer                                                  */
/* -------------------------------------------------------------------------- */

export type GoldenTimeExerciseRendererProps = {
  exercise: GoldenTimeExercise;
  answerState: ExerciseAnswerState;
  feedbackState: FeedbackState | null;
  selectedChoiceIndex: number | null;
  textInput: string;
  collocationSelectedIndex: number | null;
  flashcardFlipped: boolean;
  onSelectAndSubmit: (i: number) => void;
  onSelectAndSubmitCollocation: (i: number) => void;
  onSetTextInput: (v: string) => void;
  onFlipFlashcard: (flipped: boolean) => void;
  onSubmit: () => void;
  onContinue: () => void;
  className?: string;
};

function GoldenTimeExerciseRenderer({
  exercise,
  answerState,
  feedbackState,
  selectedChoiceIndex,
  textInput,
  collocationSelectedIndex,
  flashcardFlipped,
  onSelectAndSubmit,
  onSelectAndSubmitCollocation,
  onSetTextInput,
  onFlipFlashcard,
  onSubmit,
  onContinue,
  className,
}: GoldenTimeExerciseRendererProps) {
  const isAnswered = feedbackState !== null;
  const lang = exercise.lang ?? "en-US";
  const [audioPlaying, setAudioPlaying] = React.useState(false);

  React.useEffect(() => {
    if (exercise.type !== "audio" && exercise.type !== "spelling") return;
    const t = setTimeout(() => {
      speakWord(exercise.word, lang);
      setAudioPlaying(true);
      const off = setTimeout(() => setAudioPlaying(false), 1800);
      return () => clearTimeout(off);
    }, 400);
    return () => clearTimeout(t);
  }, [exercise.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAudioPlay() {
    speakWord(exercise.word, lang);
    setAudioPlaying(true);
    setTimeout(() => setAudioPlaying(false), 1800);
  }

  const skillLabel = SKILL_LABELS[exercise.skillKey];
  const phonetic = exercise.reading ?? exercise.ipa;
  const feedbackExplanation = exercise.explanation;

  /* ---- Choice: GoldenTimeQuestionCard wraps prompt + choices ------------- */

  if (exercise.type === "choice") {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <GoldenTimeQuestionCard
          word={exercise.word}
          {...(phonetic ? { reading: phonetic } : {})}
          questionType={skillLabel}
          reviewChip={
            <ReviewReasonChip reason={exercise.reason}>
              {exercise.dueLabel}
            </ReviewReasonChip>
          }
        >
          {exercise.prompt ? (
            <p className="mb-4 text-sm text-text-secondary">{exercise.prompt}</p>
          ) : null}
          <ChoiceList
            choices={exercise.choices ?? []}
            selectedChoiceIndex={selectedChoiceIndex}
            correctChoiceIndex={exercise.correctChoiceIndex}
            isAnswered={isAnswered}
            onSelect={onSelectAndSubmit}
          />
        </GoldenTimeQuestionCard>
        {isAnswered ? (
          <Feedback
            feedbackState={feedbackState}
            explanation={feedbackExplanation}
            onContinue={onContinue}
          />
        ) : null}
      </div>
    );
  }

  /* ---- Audio: info bar above (word hidden to preserve exercise intent) --- */

  if (exercise.type === "audio") {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <GoldenInfoBar
          skillKey={exercise.skillKey}
          reason={exercise.reason}
          {...(exercise.dueLabel !== undefined ? { dueLabel: exercise.dueLabel } : {})}
        />
        <AudioQuestionCard
          prompt={exercise.prompt ?? "Nghe và chọn từ bạn vừa nghe:"}
          isPlaying={audioPlaying}
          onPlay={handleAudioPlay}
        >
          <ChoiceList
            choices={exercise.choices ?? []}
            selectedChoiceIndex={selectedChoiceIndex}
            correctChoiceIndex={exercise.correctChoiceIndex}
            isAnswered={isAnswered}
            onSelect={onSelectAndSubmit}
          />
        </AudioQuestionCard>
        {isAnswered ? (
          <Feedback
            feedbackState={feedbackState}
            explanation={feedbackExplanation}
            onContinue={onContinue}
          />
        ) : null}
      </div>
    );
  }

  /* ---- Flashcard: info bar + full flashcard ------------------------------ */

  if (exercise.type === "flashcard") {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <GoldenInfoBar
          skillKey={exercise.skillKey}
          reason={exercise.reason}
          {...(exercise.dueLabel !== undefined ? { dueLabel: exercise.dueLabel } : {})}
        />
        <Flashcard
          word={exercise.word}
          meaning={exercise.meaning}
          lang={lang}
          isFlipped={flashcardFlipped}
          onFlip={onFlipFlashcard}
          {...(exercise.reading !== undefined ? { reading: exercise.reading } : {})}
          {...(exercise.ipa !== undefined ? { ipa: exercise.ipa } : {})}
          {...(exercise.pos !== undefined ? { pos: exercise.pos } : {})}
          {...(exercise.example !== undefined ? { example: exercise.example } : {})}
          {...(exercise.exampleTranslation !== undefined
            ? { exampleTranslation: exercise.exampleTranslation }
            : {})}
        />
        {flashcardFlipped && !isAnswered ? (
          <LexiButton variant="nextStep" fullWidth onClick={onSubmit}>
            Tiếp tục
          </LexiButton>
        ) : null}
        {isAnswered ? (
          <Feedback
            feedbackState={feedbackState}
            explanation={feedbackExplanation}
            onContinue={onContinue}
          />
        ) : null}
      </div>
    );
  }

  /* ---- Fill blank: info bar above (word is the answer — keep hidden) ----- */

  if (exercise.type === "fill_blank") {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <GoldenInfoBar
          skillKey={exercise.skillKey}
          reason={exercise.reason}
          {...(exercise.dueLabel !== undefined ? { dueLabel: exercise.dueLabel } : {})}
        />
        <FillBlankCard
          sentenceBefore={exercise.sentenceBefore ?? ""}
          sentenceAfter={exercise.sentenceAfter ?? ""}
          value={textInput}
          onChange={onSetTextInput}
          onSubmit={onSubmit}
          state={answerState}
          {...(exercise.correctAnswer !== undefined
            ? { correctAnswer: exercise.correctAnswer }
            : {})}
        />
        {isAnswered ? (
          <Feedback
            feedbackState={feedbackState}
            explanation={feedbackExplanation}
            onContinue={onContinue}
          />
        ) : null}
      </div>
    );
  }

  /* ---- Spelling: info bar above (word is the answer — keep hidden) ------- */

  if (exercise.type === "spelling") {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <GoldenInfoBar
          skillKey={exercise.skillKey}
          reason={exercise.reason}
          {...(exercise.dueLabel !== undefined ? { dueLabel: exercise.dueLabel } : {})}
        />
        <SpellingInputCard
          prompt={exercise.prompt ?? "Nghe phát âm và gõ lại từ:"}
          value={textInput}
          onChange={onSetTextInput}
          onSubmit={onSubmit}
          state={answerState}
          {...(exercise.hint !== undefined ? { hint: exercise.hint } : {})}
          {...(exercise.correctAnswer !== undefined
            ? { correctAnswer: exercise.correctAnswer }
            : {})}
        />
        {isAnswered ? (
          <Feedback
            feedbackState={feedbackState}
            explanation={feedbackExplanation}
            onContinue={onContinue}
          />
        ) : null}
      </div>
    );
  }

  /* ---- Collocation: info bar + collocation card -------------------------- */

  if (exercise.type === "collocation") {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <GoldenInfoBar
          skillKey={exercise.skillKey}
          reason={exercise.reason}
          {...(exercise.dueLabel !== undefined ? { dueLabel: exercise.dueLabel } : {})}
        />
        <CollocationPracticeCard
          baseWord={exercise.baseWord ?? exercise.word}
          options={exercise.collocationOptions ?? []}
          state={isAnswered ? "answered" : "idle"}
          onSelect={onSelectAndSubmitCollocation}
          {...(collocationSelectedIndex !== null
            ? { selectedIndex: collocationSelectedIndex }
            : {})}
          {...(exercise.prompt !== undefined ? { prompt: exercise.prompt } : {})}
          {...(exercise.correctCollocationIndex !== undefined
            ? { correctIndex: exercise.correctCollocationIndex }
            : {})}
        />
        {isAnswered ? (
          <Feedback
            feedbackState={feedbackState}
            explanation={feedbackExplanation}
            onContinue={onContinue}
          />
        ) : null}
      </div>
    );
  }

  return null;
}

export { GoldenTimeExerciseRenderer };
