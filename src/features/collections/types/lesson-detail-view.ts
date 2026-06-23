import type { SkillLaneData } from "@/components/lexipath";

export type LessonDetailViewStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "locked"
  | "premium";

export type VocabScriptDisplay = {
  primary: string;
  secondary?: string;
  phonetic?: string;
  scriptType?:
    | "kanji"
    | "hiragana"
    | "katakana"
    | "hanzi"
    | "pinyin"
    | "latin";
};

export type LessonVocabPreviewItem = {
  id: string;
  primaryText: string;
  meaning: string;
  status?: "new" | "learning" | "reviewing" | "weak" | "mastered";
  script?: VocabScriptDisplay;
  href: string;
};

export type LessonDetailView = {
  id: string;
  collectionId: string;
  sortOrder: number;
  title: string;
  description: string;
  status: LessonDetailViewStatus;
  itemCount: number;
  completedCount: number;
  estimatedMinutes: number;
  accuracy?: number;
  topics: string[];
  sessionHref: string;
  skillLanes: SkillLaneData[];
  vocabPreviewItems: LessonVocabPreviewItem[];
};
