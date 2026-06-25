export type BlueprintStatus = "draft" | "published" | "review";
export type ScoreType = "auto" | "rubric" | "band" | "total";
export type SkillType =
  | "listening"
  | "reading"
  | "writing"
  | "speaking"
  | "vocabulary"
  | "grammar"
  | "language";
export type MediaType = "none" | "audio" | "passage" | "image";

export interface ValidationError {
  type: string;
  severity: "error" | "warning";
  sectionId?: string;
  partId?: string;
  message: string;
}

export interface Blueprint {
  id: string;
  programId: string;
  typeId: string;
  code: string;
  name: string;
  status: BlueprintStatus;
  version: number;
  durationTotal: number;
  questionTotal: number;
  sectionCount: number;
  passMark: string;
  scoreType: ScoreType;
  updatedAt: string;
  validationErrors: string[];
}

export interface BlueprintPart {
  id: string;
  order: number;
  name: string;
  desc: string;
  taskType: string;
  qCount: number;
  mediaType: MediaType;
  mediaRequired: boolean;
}

export interface BlueprintSection {
  id: string;
  order: number;
  name: string;
  skill: string;
  durationMin: number;
  questionTotal: number;
  scoreType: ScoreType;
  maxScore: number;
  parts: BlueprintPart[];
}

export interface ExamTaskType {
  id: string;
  code: string;
  name: string;
  icon: string;
  desc: string;
}
