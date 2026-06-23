import type { SkillKey } from "@/components/lexipath";

export interface NotebookItem {
  id: string;
  word: string;
  reading?: string;
  meaning?: string;
  status?: "new" | "learning" | "review" | "mastered" | "locked" | "forgetting";
  statusLabel?: string;
  addedAt?: string;
  /** Language code for CJK font sizing */
  lang?: "ja" | "en" | "zh";
  /** Urgency level for the colored dot on the left edge */
  urgency?: "overdue" | "due";
  /** Short review tag, e.g. "Ôn ngay" or "Hôm nay 18:00" */
  reviewLabel?: string;
  /** Weak skill name, e.g. "Cách dùng" */
  weakSkillLabel?: string;
}

export interface NotebookTab {
  id: string;
  label: string;
  count?: number;
}

export interface DictionaryResult {
  id: string;
  word: string;
  reading?: string;
  partOfSpeech?: string;
  meaning: string;
}

export interface WordSense {
  pos?: string;
  gloss: string;
  example?: string;
  exampleTranslation?: string;
}

export interface WordSkillStat {
  skill: SkillKey;
  label: string;
  accuracy: number;
  attempts?: number;
}

export interface WordRelation {
  id: string;
  word: string;
  reading?: string;
}

export interface WordRelationGroup {
  id: string;
  label: string;
  type: "synonym" | "antonym" | "confusable" | "collocation" | "grammar";
  relations: WordRelation[];
}

export interface WordMastery {
  wordId: string;
  masteryPercent: number;
  weakSkills: SkillKey[];
}

export interface NextReview {
  label?: string;
  when: string;
}
