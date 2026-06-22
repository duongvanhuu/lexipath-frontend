import type { SkillKey } from "@/components/lexipath";

export interface NotebookItem {
  id: string;
  word: string;
  reading?: string;
  meaning?: string;
  status?: "new" | "learning" | "review" | "mastered" | "locked";
  statusLabel?: string;
  addedAt?: string;
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
