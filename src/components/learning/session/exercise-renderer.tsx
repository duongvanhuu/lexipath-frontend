"use client";

import * as React from "react";

import { Flashcard } from "@/components/learning/exercises/flashcard";
import { ChoiceOption } from "@/components/learning/exercises/choice-option";
import { AudioQuestionCard } from "@/components/learning/exercises/audio-question-card";
import { FillBlankCard } from "@/components/learning/exercises/fill-blank-card";
import { SpellingInputCard } from "@/components/learning/exercises/spelling-input-card";
import { CollocationPracticeCard } from "@/components/learning/exercises/collocation-practice-card";
import { FeedbackCard } from "@/components/learning/exercises/feedback-card";
import { LexiButton } from "@/components/shared";
import { cn } from "@/lib/utils/cn";
import type {
  ExerciseAnswerState,
  FeedbackState,
} from "@/components/learning/types";
import type { SessionExercise } from "@/features/learning/types/session.types";

const CHOICE_KEYS = ["A", "B", "C", "D"] as const;

function speakWord(word: string, lang: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(word);
  u.lang = lang;
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

export type ExerciseRendererProps = {
  exercise: SessionExercise;
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

function ExerciseRenderer({
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
}: ExerciseRendererProps) {
  const isAnswered = feedbackState !== null;
  const lang = exercise.lang ?? "en-US";
  const [audioPlaying, setAudioPlaying] = React.useState(false);

  React.useEffect(() => {
    if (exercise.type !== "audio") return;
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

  const feedbackExplanation = exercise.explanation;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {exercise.type === "flashcard" && (
        <>
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
        </>
      )}

      {exercise.type === "choice" && (
        <>
          <div className="rounded-card border border-border bg-card px-6 py-5 text-center">
            {exercise.prompt ? (
              <p className="mb-3 text-sm text-text-secondary">{exercise.prompt}</p>
            ) : null}
            <div className="text-3xl font-bold tracking-tight text-text-primary">
              {exercise.word}
            </div>
            {exercise.ipa ? (
              <div className="mt-1 text-sm text-text-muted">{exercise.ipa}</div>
            ) : null}
          </div>
          <ChoiceList
            choices={exercise.choices ?? []}
            selectedChoiceIndex={selectedChoiceIndex}
            correctChoiceIndex={exercise.correctChoiceIndex}
            isAnswered={isAnswered}
            onSelect={onSelectAndSubmit}
          />
          {isAnswered ? (
            <Feedback
              feedbackState={feedbackState}
              explanation={feedbackExplanation}
              onContinue={onContinue}
            />
          ) : null}
        </>
      )}

      {exercise.type === "audio" && (
        <>
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
        </>
      )}

      {exercise.type === "fill_blank" && (
        <>
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
        </>
      )}

      {exercise.type === "spelling" && (
        <>
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
        </>
      )}

      {exercise.type === "collocation" && (
        <>
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
        </>
      )}
    </div>
  );
}

export { ExerciseRenderer };
