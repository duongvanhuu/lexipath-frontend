import type { ExerciseQuestionType } from "@/components/learning/types";

export type SessionExercise = {
  id: string;
  type: ExerciseQuestionType;
  word: string;
  reading?: string;
  ipa?: string;
  meaning: string;
  example?: string;
  exampleTranslation?: string;
  pos?: string;
  lang?: string;
  // choice / audio
  choices?: string[];
  correctChoiceIndex?: number;
  // fill_blank
  sentenceBefore?: string;
  sentenceAfter?: string;
  // spelling / fill_blank shared
  correctAnswer?: string;
  // spelling / audio prompt
  prompt?: string;
  hint?: string;
  // collocation
  baseWord?: string;
  collocationOptions?: string[];
  correctCollocationIndex?: number;
  // feedback
  explanation?: string;
  xpReward?: number;
};

export type SessionMeta = {
  sessionId: string;
  lessonTitle: string;
  collectionTitle?: string;
  lang?: string;
  returnHref?: string;
};

export type SessionPhase = "playing" | "summary";

export type SessionExerciseResult = {
  exerciseId: string;
  type: SessionExercise["type"];
  correct: boolean;
};

export type SessionSkillBreakdownItem = {
  skill: "meaning" | "listening" | "spelling" | "usage" | "collocation";
  label: string;
  correct: number;
  total: number;
};
