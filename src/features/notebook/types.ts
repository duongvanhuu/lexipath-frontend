import type { SkillKey } from "@/components/lexipath";

export type VocabLang = "ja" | "en" | "zh";

export type VocabStatus =
  | "new"
  | "learning"
  | "review"
  | "mastered"
  | "forgetting";

export type ReviewUrgency = "overdue" | "due" | "ok" | "none";

export interface NotebookSkillStat {
  skill: SkillKey;
  label: string;
  accuracy: number;
}

export interface NotebookWeakSkill {
  skill: SkillKey;
  label: string;
  evidence?: string;
}

export interface NotebookRelatedWord {
  id: string;
  word: string;
  reading?: string;
  meaning?: string;
}

export interface NotebookWord {
  id: string;
  word: string;
  reading?: string;
  pos?: string;
  meaning: string;
  example?: string;
  exampleVi?: string;
  status: VocabStatus;
  lang: VocabLang;
  urgency?: ReviewUrgency;
  nextReview?: string;
  reviewReason?: string;
  weakSkill?: NotebookWeakSkill;
  phrases?: string[];
  relatedWords?: NotebookRelatedWord[];
  skills?: NotebookSkillStat[];
}
