import type * as React from "react";

export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "fill_blank"
  | "listening"
  | "reading"
  | "writing"
  | "speaking";

export type QuestionStatus = "draft" | "review" | "approved" | "archived";

export interface ExamProgram {
  id: string;
  title: string;
  description?: string;
  examCount?: number;
  coverLabel?: string;
}

export interface ExamTest {
  id: string;
  title: string;
  durationMinutes?: number;
  questionCount?: number;
  status?: string;
  sectionCount?: number;
}

export interface ExamAccessRule {
  id: string;
  ruleType: "public" | "invite" | "prerequisite" | "paid";
  label: string;
  description?: string;
  active: boolean;
}

export interface ExamBlueprint {
  id: string;
  title: string;
  description?: string;
  totalQuestions?: number;
  totalDurationMinutes?: number;
  sections: ExamBlueprintSection[];
}

export interface ExamBlueprintSection {
  id: string;
  title: string;
  partCount?: number;
  questionCount?: number;
  timeLimit?: number;
}

export interface ExamSection {
  id: string;
  title: string;
  parts: ExamSectionPart[];
}

export interface ExamSectionPart {
  id: string;
  title: string;
  questionCount: number;
  questionType?: QuestionType;
  instructions?: string;
}

export interface ExamQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  status?: QuestionStatus;
  points?: number;
  tags?: string[];
}

export type AnswerOption = {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
};

export interface QuestionAnswerKey {
  questionId: string;
  type: QuestionType;
  options?: AnswerOption[];
  correctAnswer?: string;
  acceptedAnswers?: string[];
}

export interface PassageParagraph {
  id: string;
  order: number;
  text: string;
  notes?: string;
}

export interface TranscriptSegment {
  id: string;
  order: number;
  speakerLabel?: string;
  text: string;
  timeLabel?: string;
}

export interface MediaItem {
  id: string;
  title?: string;
  type: "audio" | "image" | "video" | "document";
  url?: string;
  sizeLabel?: string;
  uploadedAtLabel?: string;
}

export interface ScoringScale {
  id: string;
  label: string;
  minScore: number;
  maxScore: number;
  description?: string;
}

export interface RubricCriteria {
  id: string;
  title: string;
  description?: string;
  maxPoints: number;
  levels: RubricLevel[];
}

export interface RubricLevel {
  id: string;
  label: string;
  points: number;
  description?: string;
}
