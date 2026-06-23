export type VocabLearningStatus = "new" | "learning" | "review" | "mastered";

export interface VocabDetailExample {
  id: string;
  source: string;
  translation?: string;
}

export interface VocabDetailSense {
  id: string;
  pos: string;
  meaning: string;
  meaningVi?: string;
  status: VocabLearningStatus;
  examples?: VocabDetailExample[];
}

export interface VocabSkillRow {
  key: string;
  label: string;
  icon: string;
  pct: number;
}

export interface VocabRelatedGroup {
  key: string;
  label: string;
  icon: string;
  items: Array<{ word: string; reading?: string | null; meaning?: string | null }>;
}

export interface VocabUsageNote {
  label: string;
  value: string;
}

/* ── JA module ── */
export interface KanjiDetail {
  char: string;
  reading: string;
  meaning: string;
  on?: string;
  kun?: string;
  strokes?: number;
  jlpt?: string;
}

export interface VerbForm {
  label: string;
  value: string;
}

export interface LangModuleJa {
  type: "ja";
  kanji: KanjiDetail[];
  verbForms?: VerbForm[];
}

/* ── EN module ── */
export interface DialectPronunciation {
  flag: string;
  label: string;
  ipa: string;
  ttsLang: string;
}

export interface LangModuleEn {
  type: "en";
  dialects: DialectPronunciation[];
  collocations: string[];
  wordFamily: Array<{ pos: string; word: string }>;
}

/* ── ZH module ── */
export interface HanziDetail {
  char: string;
  pinyin: string;
  tone: number;
  traditional: string;
  meaning: string;
  strokes?: number;
  hsk?: number;
}

export interface MeasureWord {
  char: string;
  pinyin: string;
  usage: string;
}

export interface LangModuleZh {
  type: "zh";
  chars: HanziDetail[];
  toneNum: number;
  pinyinFull: string;
  measureWords: MeasureWord[];
}

export type LangModule = LangModuleJa | LangModuleEn | LangModuleZh;

/* ── Full detail item ── */
export interface VocabDetailItem {
  id: string;
  word: string;
  langCode: "ja" | "en" | "zh";
  reading?: string;
  ipa?: string;
  audioUrl?: string;
  learningStatus: VocabLearningStatus;
  saved: boolean;
  senses: VocabDetailSense[];
  usageNotes: VocabUsageNote[];
  skillRows: VocabSkillRow[];
  overallProgress: { mastered: number; total: number };
  nextReview: {
    label: string;
    sublabel: string;
    tone: "danger" | "primary" | "golden" | "neutral";
  };
  relatedGroups: VocabRelatedGroup[];
  langModule: LangModule;
}
