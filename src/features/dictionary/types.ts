export type DictLang = "ja" | "en" | "zh";

export type DictEntryType =
  | "words"
  | "kanji"
  | "grammar"
  | "phrases"
  | "phrasal"
  | "idioms"
  | "colloc"
  | "hanzi"
  | "measure"
  | "pattern";

export interface DictionaryEntry {
  id: string;
  word: string;
  /** Reading: kana for JA, pinyin for ZH, IPA for EN */
  reading?: string;
  /** IPA for EN (separate from reading) */
  ipa?: string;
  meaning: string;
  pos?: string;
  lang: DictLang;
  type: DictEntryType;
  /** Is this word already in the learner's notebook */
  inNotebook?: boolean;
}

export type SearchMode =
  | "any"
  | "kanji"
  | "kana"
  | "romaji"
  | "word"
  | "ipa"
  | "simp"
  | "trad"
  | "pinyin"
  | "vi";

export interface SearchModeOption {
  id: SearchMode;
  label: string;
  placeholder: string;
}

export interface VocabGroup {
  id: DictEntryType;
  label: string;
  icon: string;
}

export type MatchTier = "exact" | "norm" | "related";

export interface DictionarySearchResult {
  entry: DictionaryEntry;
  tier: MatchTier;
}

export interface TieredResults {
  exact: DictionaryEntry[];
  norm: DictionaryEntry[];
  related: DictionaryEntry[];
}
