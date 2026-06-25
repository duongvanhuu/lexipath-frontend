export type ScoreStatus = "draft" | "review" | "published";
export type RoundingMode = "none" | "nearest" | "half-up" | "floor";
export type ScaleType = "band" | "total" | "rubric";

export interface ScoringProgram {
  id: string;
  name: string;
  color: string;
}

export interface ScoreScale {
  id: string;
  name: string;
  programId: string;
  type: ScaleType;
  minRaw: number;
  maxRaw: number;
  minScaled: number;
  maxScaled: number;
  step: number;
  roundingRuleId: string;
  passMark: number;
  status: ScoreStatus;
  convCount: number;
  updatedAt: string;
  desc: string;
}

export interface ScoreConversion {
  id: string;
  rawMin: number;
  rawMax: number;
  scaled: number;
}

export interface RoundingRule {
  id: string;
  name: string;
  mode: RoundingMode;
  precision: number;
  desc: string;
  usedBy: number;
}

export interface Rubric {
  id: string;
  name: string;
  programId: string;
  scaleMax: number;
  status: ScoreStatus;
  criteriaCount: number;
  usedBy: number;
  updatedAt: string;
  desc: string;
}

export interface CriterionLevel {
  band: string;
  desc: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  weight: number;
  levels: CriterionLevel[];
}

export interface ScoringMock {
  programs: ScoringProgram[];
  scoreScales: ScoreScale[];
  conversions: Record<string, ScoreConversion[]>;
  roundingRules: RoundingRule[];
  rubrics: Rubric[];
  rubricCriteria: Record<string, RubricCriterion[]>;
}
