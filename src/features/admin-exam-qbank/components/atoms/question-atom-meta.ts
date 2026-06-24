/**
 * Shared metadata for question atom components.
 * Centralises per-type Tailwind class strings and icon names so both
 * QuestionTypeChip and QuestionGradeChip share the same source of truth
 * without importing the hex-based QB_TYPE_REGISTRY for styling purposes.
 */

import type { QuestionType, Difficulty } from "../../types/question-bank.types";

// ─── Icons (lucide-react import names) ───────────────────────────────────────
export const QUESTION_TYPE_ICON: Record<QuestionType, string> = {
  mcq:      "CircleDot",
  multi:    "CheckSquare",
  fill:     "PencilLine",
  matching: "Shuffle",
  tfng:     "Scale",
  ynng:     "CheckCheck",
  ordering: "ListOrdered",
  short:    "Type",
  writing:  "FileText",
  speaking: "Mic",
};

// ─── Labels ───────────────────────────────────────────────────────────────────
export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  mcq:      "MCQ",
  multi:    "Nhiều đáp án",
  fill:     "Điền chỗ trống",
  matching: "Ghép đôi",
  tfng:     "T/F/NG",
  ynng:     "Y/N/NG",
  ordering: "Sắp xếp",
  short:    "Trả lời ngắn",
  writing:  "Writing",
  speaking: "Speaking",
};

// ─── Tailwind color classes (bg + text, no inline styles) ────────────────────
export const QUESTION_TYPE_CLASSES: Record<QuestionType, string> = {
  mcq:      "bg-blue-100 text-blue-700",
  multi:    "bg-cyan-100 text-cyan-700",
  fill:     "bg-violet-100 text-violet-700",
  matching: "bg-pink-100 text-pink-700",
  tfng:     "bg-emerald-100 text-emerald-700",
  ynng:     "bg-green-100 text-green-700",
  ordering: "bg-amber-100 text-amber-700",
  short:    "bg-sky-100 text-sky-700",
  writing:  "bg-purple-100 text-purple-700",
  speaking: "bg-rose-100 text-rose-700",
};

// ─── Auto-graded set ──────────────────────────────────────────────────────────
export const AUTO_GRADED_TYPES = new Set<QuestionType>([
  "mcq", "multi", "fill", "matching", "tfng", "ynng", "ordering", "short",
]);

export function isAutoGraded(type: QuestionType): boolean {
  return AUTO_GRADED_TYPES.has(type);
}

// ─── Difficulty labels ────────────────────────────────────────────────────────
export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy:   "Dễ",
  medium: "Vừa",
  hard:   "Khó",
};
