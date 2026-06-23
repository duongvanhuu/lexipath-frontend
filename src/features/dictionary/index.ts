export type {
  DictLang,
  DictEntryType,
  DictionaryEntry,
  SearchMode,
  SearchModeOption,
  VocabGroup,
  MatchTier,
  TieredResults,
} from "./types";

export {
  SEARCH_MODES,
  VOCAB_GROUPS,
  POPULAR_WORDS,
  LANG_LABELS,
} from "./constants";

export { DICT_ENTRIES } from "./mock-data";

export {
  normalize,
  levenshtein,
  matchEntry,
  getMatchTier,
  buildTieredResults,
  findTypoSuggestion,
  groupByType,
  filterByLang,
} from "./search";
