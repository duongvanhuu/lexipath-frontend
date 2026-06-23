"use client";

import * as React from "react";

import type {
  ExerciseAnswerState,
  FeedbackState,
} from "@/components/learning/types";
import type {
  SessionExercise,
  SessionExerciseResult,
  SessionSkillBreakdownItem,
  SessionPhase,
} from "../types/session.types";

type SessionSkill = SessionSkillBreakdownItem["skill"];

const SESSION_EXERCISE_TYPE_TO_SKILL = {
  flashcard:   "meaning",
  choice:      "meaning",
  audio:       "listening",
  fill_blank:  "usage",
  spelling:    "spelling",
  collocation: "collocation",
} as const;

const SESSION_SKILL_LABELS: Record<SessionSkill, string> = {
  meaning:     "Ý nghĩa",
  listening:   "Nghe",
  spelling:    "Chính tả",
  usage:       "Ứng dụng",
  collocation: "Collocation",
};

const SESSION_SKILL_ORDER: readonly SessionSkill[] = [
  "meaning", "listening", "spelling", "usage", "collocation",
];

function toAnswerState(f: FeedbackState): ExerciseAnswerState {
  if (f === "correct") return "correct";
  if (f === "incorrect") return "incorrect";
  if (f === "partial") return "partial";
  return "idle";
}

function checkAnswer(
  exercise: SessionExercise,
  opts: { choice?: number; text?: string; colIdx?: number }
): FeedbackState {
  switch (exercise.type) {
    case "flashcard":
      return "correct";
    case "choice":
    case "audio":
      return opts.choice === exercise.correctChoiceIndex ? "correct" : "incorrect";
    case "fill_blank":
    case "spelling":
      return (opts.text ?? "").toLowerCase().trim() ===
        (exercise.correctAnswer ?? "").toLowerCase().trim()
        ? "correct"
        : "incorrect";
    case "collocation":
      return opts.colIdx === exercise.correctCollocationIndex
        ? "correct"
        : "incorrect";
    default:
      return "correct";
  }
}

export interface SessionPlayerReturn {
  current: SessionExercise | undefined;
  currentIndex: number;
  totalCount: number;
  phase: SessionPhase;
  answerState: ExerciseAnswerState;
  selectedChoiceIndex: number | null;
  textInput: string;
  collocationSelectedIndex: number | null;
  flashcardFlipped: boolean;
  feedbackState: FeedbackState | null;
  correctCount: number;
  incorrectCount: number;
  exitDialogOpen: boolean;
  progressPercent: number;
  totalXp: number;
  exerciseResults: SessionExerciseResult[];
  skillBreakdown: SessionSkillBreakdownItem[];
  selectAndSubmit: (choiceIndex: number) => void;
  selectAndSubmitCollocation: (colIdx: number) => void;
  setTextInput: (value: string) => void;
  flipFlashcard: (flipped: boolean) => void;
  submit: () => void;
  advance: () => void;
  openExitDialog: () => void;
  closeExitDialog: () => void;
  getDurationLabel: () => string;
}

export function useSessionPlayer(
  exercises: SessionExercise[]
): SessionPlayerReturn {
  const [startEpoch] = React.useState<number>(() => Date.now());
  const startTime = React.useRef(startEpoch);

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<SessionPhase>("playing");
  const [answerState, setAnswerState] =
    React.useState<ExerciseAnswerState>("idle");
  const [selectedChoiceIndex, setSelectedChoiceIndex] = React.useState<
    number | null
  >(null);
  const [textInput, setTextInputState] = React.useState("");
  const [collocationSelectedIndex, setCollocationSelectedIndex] =
    React.useState<number | null>(null);
  const [flashcardFlipped, setFlashcardFlipped] = React.useState(false);
  const [feedbackState, setFeedbackState] =
    React.useState<FeedbackState | null>(null);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [incorrectCount, setIncorrectCount] = React.useState(0);
  const [exitDialogOpen, setExitDialogOpen] = React.useState(false);
  const [exerciseResults, setExerciseResults] = React.useState<SessionExerciseResult[]>([]);

  const current = exercises[currentIndex];
  const totalCount = exercises.length;
  const progressPercent =
    totalCount > 0 ? Math.round((currentIndex / totalCount) * 100) : 0;
  const totalXp = exercises.reduce((sum, ex) => sum + (ex.xpReward ?? 10), 0);
  const isLocked =
    answerState !== "idle" && answerState !== "selected";

  const skillBreakdown = React.useMemo<SessionSkillBreakdownItem[]>(() => {
    const map = new Map<SessionSkill, { correct: number; total: number }>();
    for (const r of exerciseResults) {
      const skill = SESSION_EXERCISE_TYPE_TO_SKILL[r.type];
      const entry = map.get(skill) ?? { correct: 0, total: 0 };
      map.set(skill, {
        correct: entry.correct + (r.correct ? 1 : 0),
        total: entry.total + 1,
      });
    }
    return SESSION_SKILL_ORDER
      .filter((skill) => map.has(skill))
      .map((skill) => ({
        skill,
        label: SESSION_SKILL_LABELS[skill],
        ...map.get(skill)!,
      }));
  }, [exerciseResults]);

  function applyResult(result: FeedbackState) {
    setFeedbackState(result);
    setAnswerState(toAnswerState(result));
    if (result === "correct") setCorrectCount((c) => c + 1);
    else if (result === "incorrect") setIncorrectCount((c) => c + 1);

    if (!current) return;
    const exerciseId = current.id;
    const type = current.type;
    const isCorrect = result === "correct";
    setExerciseResults((prev) => {
      if (prev.some((r) => r.exerciseId === exerciseId)) return prev;
      return [...prev, { exerciseId, type, correct: isCorrect }];
    });
  }

  function selectAndSubmit(choiceIndex: number) {
    if (!current || isLocked) return;
    setSelectedChoiceIndex(choiceIndex);
    applyResult(checkAnswer(current, { choice: choiceIndex }));
  }

  function selectAndSubmitCollocation(colIdx: number) {
    if (!current || isLocked) return;
    setCollocationSelectedIndex(colIdx);
    applyResult(checkAnswer(current, { colIdx }));
  }

  function setTextInput(value: string) {
    if (isLocked) return;
    setTextInputState(value);
    setAnswerState(value.trim() ? "selected" : "idle");
  }

  function flipFlashcard(flipped: boolean) {
    setFlashcardFlipped(flipped);
  }

  function submit() {
    if (!current || isLocked) return;
    if (current.type === "flashcard") {
      applyResult("correct");
      return;
    }
    if (answerState !== "selected") return;
    applyResult(checkAnswer(current, { text: textInput }));
  }

  function advance() {
    const next = currentIndex + 1;
    if (next >= exercises.length) {
      setPhase("summary");
    } else {
      setCurrentIndex(next);
    }
    setAnswerState("idle");
    setSelectedChoiceIndex(null);
    setTextInputState("");
    setCollocationSelectedIndex(null);
    setFlashcardFlipped(false);
    setFeedbackState(null);
  }

  function getDurationLabel(): string {
    const ms = Date.now() - startTime.current;
    const secs = Math.floor(ms / 1000);
    if (secs < 60) return `${secs}s`;
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  }

  return {
    current,
    currentIndex,
    totalCount,
    phase,
    answerState,
    selectedChoiceIndex,
    textInput,
    collocationSelectedIndex,
    flashcardFlipped,
    feedbackState,
    correctCount,
    incorrectCount,
    exitDialogOpen,
    progressPercent,
    totalXp,
    exerciseResults,
    skillBreakdown,
    selectAndSubmit,
    selectAndSubmitCollocation,
    setTextInput,
    flipFlashcard,
    submit,
    advance,
    openExitDialog: () => setExitDialogOpen(true),
    closeExitDialog: () => setExitDialogOpen(false),
    getDurationLabel,
  };
}
