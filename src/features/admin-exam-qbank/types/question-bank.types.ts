// ─── Primitive enums ───────────────────────────────────────────────────────
// UI status — "review" means "Chờ duyệt".
// If backend uses "in_review", the future DTO mapper converts to "review".
export type QuestionStatus = "draft" | "review" | "published";

// Short UI keys. DB uses longer canonical codes — see QUESTION_TYPE_TO_DB_CODE.
export type QuestionType =
  | "mcq" | "multi" | "fill" | "matching"
  | "tfng" | "ynng" | "ordering" | "short"
  | "writing" | "speaking";

// Simplified 3-label difficulty. DB stores 1–5 — see DIFFICULTY_TO_DB_VALUE.
export type Difficulty = "easy" | "medium" | "hard";

// Admin screen skill labels. DB may use finer-grained codes; mapper converts.
export type Skill =
  | "listening" | "reading" | "writing" | "speaking"
  | "grammar" | "vocab";

// ─── UI↔DB mapping constants ──────────────────────────────────────────────
export const QUESTION_TYPE_TO_DB_CODE = {
  mcq:      "mcq",
  multi:    "multi_select",
  fill:     "fill_blank",
  matching: "matching",
  tfng:     "true_false_not_given",
  ynng:     "yes_no_not_given",
  ordering: "ordering",
  short:    "short_answer",
  writing:  "writing",
  speaking: "speaking",
} as const;

export const DB_CODE_TO_QUESTION_TYPE: Record<string, QuestionType> = {
  mcq:                   "mcq",
  multi_select:          "multi",
  fill_blank:            "fill",
  matching:              "matching",
  true_false_not_given:  "tfng",
  yes_no_not_given:      "ynng",
  ordering:              "ordering",
  short_answer:          "short",
  writing:               "writing",
  speaking:              "speaking",
};

// DB stores difficulty as 1–5 integer.
export const DIFFICULTY_TO_DB_VALUE: Record<Difficulty, number> = {
  easy:   1,
  medium: 3,
  hard:   5,
};

export const DB_VALUE_TO_DIFFICULTY: Record<number, Difficulty> = {
  1: "easy", 2: "easy",
  3: "medium", 4: "hard",
  5: "hard",
};

// ─── Sub-types ────────────────────────────────────────────────────────────
// correct is a UI/editor convenience field.
// Backend stores correct answers via answer-key records;
// future mapper splits choices and answer keys into separate DTO payloads.
export interface QuestionChoice {
  key: string;   // "A" | "B" | "C" | "D" | "E" | "F"
  text: string;
  correct: boolean;
}

export interface QuestionBlank {
  pos: number;
  accepted: string[];
  caseSensitive: boolean;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface OrderItem {
  text: string;
  correctPos: number;
}

export interface AnswerKey {
  value: string;
}

// ─── Core entities ────────────────────────────────────────────────────────
export interface Question {
  id: string;
  type: QuestionType;
  skill: Skill;
  programId: string;
  difficulty: Difficulty;
  points: number;
  status: QuestionStatus;
  stem: string;
  explanation: string;
  groupId: string | null;
  tagIds: string[];
  sourceId: string;
  vocabIds: string[];
  updatedAt: string;
  // type-specific — always present for the relevant type, absent for others
  choices?: QuestionChoice[];       // mcq, multi
  blanks?: QuestionBlank[];         // fill
  pairs?: MatchingPair[];           // matching
  orderItems?: OrderItem[];         // ordering
  judgeAnswer?: string;             // tfng ("true"|"false"|"ng"), ynng ("yes"|"no"|"ng")
  answerKeys?: AnswerKey[];         // short, tfng, ynng
  maxWords?: number;                // short
  rubricId?: string;                // writing, speaking
  minWords?: number;                // writing
  suggestedTime?: number;           // writing, speaking (minutes)
  prepTime?: number;                // speaking (minutes)
}

export interface QuestionGroup {
  id: string;
  code: string;
  title: string;
  stimulusType: "passage" | "audio" | "standalone";
  skill: Skill;
  programId: string;
  mediaId: string | null;
  instructions: string;
  stimulus: string;
  questionIds: string[];
  status: QuestionStatus;
  updatedAt: string;
}

export interface QuestionTag {
  id: string;
  label: string;
  usage: number;
}

export interface QuestionSource {
  id: string;
  name: string;
  type: "licensed" | "original" | "adapted";
  ref: string;
}

export interface ExamProgram {
  id: string;
  code: string;
  name: string;
  color: string;
}

export interface ExamRubric {
  id: string;
  name: string;
  programId: string;
  scaleMax: number;
  status: QuestionStatus;
}

// Slim vocab type used only in LinkVocabDialog
export interface QuestionVocabItem {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  lang: string;
}

// ─── UI registries (used by atom components) ─────────────────────────────
export interface QuestionTypeInfo {
  id: QuestionType;
  name: string;
  short: string;
  icon: string;        // lucide icon name
  color: string;       // hex
  auto: boolean;       // true = auto-graded, false = rubric-graded
  desc: string;
}

export interface QuestionDiffInfo {
  label: string;
  color: string;
}

export interface QuestionSkillInfo {
  id: Skill;
  name: string;
  icon: string;
}

// ─── Mock data bundle ─────────────────────────────────────────────────────
export interface QuestionBankMock {
  questions: Question[];
  groups: QuestionGroup[];
  tags: QuestionTag[];
  sources: QuestionSource[];
  programs: ExamProgram[];
  rubrics: ExamRubric[];
  vocabItems: QuestionVocabItem[];
  typeRegistry: Record<QuestionType, QuestionTypeInfo>;
  diffRegistry: Record<Difficulty, QuestionDiffInfo>;
  skillRegistry: QuestionSkillInfo[];
}
