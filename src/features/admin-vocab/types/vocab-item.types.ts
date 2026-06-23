// src/features/admin-vocab/types/vocab-item.types.ts

export type VocabLang = "en" | "ja" | "zh";

export type VocabStatus =
  | "draft"
  | "in_review"
  | "reviewed"
  | "published"
  | "rejected"
  | "archived";

export type VocabStripFilter = VocabStatus | "all" | "ai_generated";

export type VocabItemType =
  | "word"
  | "phrase"
  | "idiom"
  | "phrasal-verb"
  | "collocation"
  | "kanji"
  | "hanzi"
  | "chengyu"
  | "grammar"
  | "sentence-pattern"
  | "measure-word";

export type VocabEditorTabId =
  | "basic"
  | "scripts"
  | "phonetics"
  | "audio"
  | "senses"
  | "translations"
  | "examples"
  | "relations"
  | "tags"
  | "sources"
  | "preview"
  | "versions"
  | "review"
  | "publish";

export interface VocabItem {
  id: string;
  lang: VocabLang;
  itemType: VocabItemType;
  canonicalForm: string;
  pronunciation?: string;
  pos?: string;
  level?: string;
  status: VocabStatus;
  source?: string;
  reviewer?: string;
  updatedAt: string;
  hasAudio: boolean;
  hasExample: boolean;
  isAiGenerated: boolean;
  isValid: boolean;
  senses: Array<{ pos: string; def: string }>;
  issues: string[];
}

export interface VocabValidationIssue {
  tab: VocabEditorTabId;
  severity: "error" | "warning";
  message: string;
}

export interface VocabScript {
  id: string | number;
  scriptType: string;
  value: string;
  normalizedValue: string;
  isPrimary: boolean;
  isSearchable: boolean;
  sortOrder: number;
}

export interface VocabPhonetic {
  id: string | number;
  system: string;
  dialect: string;
  value: string;
  toneNumber: string;
  toneMark: string;
  pitchPattern: string;
  pitchNumber: string;
  isPrimary: boolean;
}

export interface VocabAudio {
  id: string | number;
  audioType: string;
  dialect: string;
  voiceGender: string;
  url: string;
  duration: string;
  isTts: boolean;
  isPrimary: boolean;
}

export interface VocabSense {
  id: string | number;
  pos: string;
  meaning: string;
  example: string;
  exampleTrans: string;
}

export interface VocabTranslation {
  id: string | number;
  targetLang: string;
  translation: string;
  shortDefinition: string;
  explanation: string;
  usageNote: string;
}

export interface VocabExample {
  id: string | number;
  source: string;
  target: string;
  highlightStart: string;
  highlightEnd: string;
  difficulty: string;
  audioUrl: string;
  sourceRef: string;
}

export interface VocabRelations {
  synonyms: string[];
  antonyms: string[];
  confusables: string[];
  collocations: string[];
  wordFamily: string[];
  relatedGrammar: string[];
}

export interface VocabSourceRef {
  id: string | number;
  sourceId: string;
  pageRef: string;
  url: string;
  note: string;
}

export interface VocabEnglishFields {
  ipa: string;
  audioUS: string;
  audioUK: string;
  wordStress: string;
  syllables: string;
  cefr: string;
  register: string;
  domain: string;
  phrasalStruct: string;
  idiomNote: string;
  collocations: string;
  wordFamily: string;
  synonyms: string;
  antonyms: string;
  confusables: string;
}

export interface VocabJapaneseFields {
  kanji: string;
  hiragana: string;
  katakana: string;
  furigana: string;
  romaji: string;
  pitchAccent: string;
  kanjiDetail: string;
  verbForms: string;
  grammarPoint: string;
}

export interface VocabChineseFields {
  simplified: string;
  traditional: string;
  pinyinToneMarks: string;
  pinyinToneNumbers: string;
  audio: string;
  tone: string;
  hskLevel: string;
  radical: string;
  strokeCount: string;
  components: string;
  polyphone: string;
  measureWord: string;
  grammarNote: string;
}

export interface VocabEditorForm {
  lang: VocabLang;
  itemType: VocabItemType;
  headword: string;
  pos: string;
  profLevel: string;
  difficulty: "1" | "2" | "3" | "4" | "5";
  status: VocabStatus;
  tags: string[];
  frequencyRank: string;
  isCommon: boolean;
  isAiGenerated: boolean;
  scripts: VocabScript[];
  phonetics: VocabPhonetic[];
  audio: VocabAudio[];
  senses: VocabSense[];
  translations: VocabTranslation[];
  examples: VocabExample[];
  relations: VocabRelations;
  tagIds: string[];
  sourceRefs: VocabSourceRef[];
  en: VocabEnglishFields;
  ja: VocabJapaneseFields;
  zh: VocabChineseFields;
}

// Constants
export const VOCAB_ITEM_TYPES: Record<VocabLang, { v: VocabItemType; label: string }[]> = {
  en: [
    { v: "word", label: "Từ" },
    { v: "phrase", label: "Cụm từ" },
    { v: "idiom", label: "Thành ngữ" },
    { v: "phrasal-verb", label: "Động từ cụm" },
    { v: "collocation", label: "Kết hợp từ" },
    { v: "grammar", label: "Ngữ pháp" },
    { v: "sentence-pattern", label: "Mẫu câu" },
  ],
  ja: [
    { v: "word", label: "Từ" },
    { v: "kanji", label: "Kanji" },
    { v: "phrase", label: "Cụm từ" },
    { v: "grammar", label: "Ngữ pháp" },
    { v: "idiom", label: "Thành ngữ" },
  ],
  zh: [
    { v: "word", label: "Từ" },
    { v: "phrase", label: "Cụm từ" },
    { v: "grammar", label: "Ngữ pháp" },
    { v: "chengyu", label: "Thành ngữ" },
    { v: "measure-word", label: "Lượng từ" },
  ],
};

export const VOCAB_POS: Record<VocabLang, string[]> = {
  en: ["Noun", "Verb", "Adjective", "Adverb", "Preposition", "Conjunction", "Interjection"],
  ja: ["Danh từ", "Động từ", "Tính từ-い", "Tính từ-な", "Trợ từ", "Trạng từ", "Liên từ"],
  zh: ["Danh từ", "Động từ", "Tính từ", "Trạng từ", "Lượng từ", "Đại từ", "Trợ từ", "Liên từ"],
};

export const VOCAB_CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export const VOCAB_JLPT = ["N5", "N4", "N3", "N2", "N1"] as const;
export const VOCAB_HSK = ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6", "HSK7-9"] as const;
export const VOCAB_SOURCES = ["OAL", "CAMB", "MW", "JISHO", "PLECO", "MANUAL"] as const;

export const VOCAB_STATUS_LABELS: Record<VocabStatus, string> = {
  draft: "Nháp",
  in_review: "Đang duyệt",
  reviewed: "Đã duyệt",
  published: "Đã xuất bản",
  rejected: "Từ chối",
  archived: "Lưu trữ",
};
