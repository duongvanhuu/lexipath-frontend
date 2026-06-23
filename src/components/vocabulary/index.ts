// Types
export type {
  VocabularyItem,
  VocabularySense,
  VocabularyExample,
  RelatedItem,
} from "./types";

// Components
export { VocabItemCard, type VocabItemCardProps } from "./vocab-item-card";
export { VocabItemRow, type VocabItemRowProps } from "./vocab-item-row";
export {
  PhoneticAudioRow,
  type PhoneticAudioRowProps,
} from "./phonetic-audio-row";
export { SenseCard, type SenseCardProps } from "./sense-card";
export { MeaningCard, type MeaningCardProps } from "./meaning-card";
export {
  ExampleSentenceCard,
  type ExampleSentenceCardProps,
} from "./example-sentence-card";
export {
  RelatedItemsList,
  type RelatedItemsListProps,
} from "./related-items-list";
export {
  VocabItemDetailPanel,
  type VocabItemDetailPanelProps,
  type VocabItemDetailPanelItem,
} from "./vocab-item-detail-panel";

// Language modules (vocab detail)
export { LangModuleJa, type LangModuleJaProps } from "./lang-module-ja";
export { LangModuleEn, type LangModuleEnProps } from "./lang-module-en";
export { LangModuleZh, type LangModuleZhProps } from "./lang-module-zh";

// Dictionary search UI
export {
  DictionarySearchPanel,
  type DictionarySearchPanelProps,
} from "./dictionary-search-panel";
export {
  DictionaryResultCard,
  type DictionaryResultCardProps,
} from "./dictionary-result-card";
export {
  DictionaryResultList,
  type DictionaryResultListProps,
} from "./dictionary-result-list";
export {
  DictionaryBeforeSearch,
  type DictionaryBeforeSearchProps,
} from "./dictionary-before-search";
export {
  DictionaryEmptyState,
  type DictionaryEmptyStateProps,
} from "./dictionary-empty-state";
export {
  DictionarySuggestionBanner,
  type DictionarySuggestionBannerProps,
} from "./dictionary-suggestion-banner";
