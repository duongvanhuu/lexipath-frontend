export interface VocabularyItem {
  id: string;
  word: string;
  partOfSpeech?: string;
  phoneticText?: string;
  audioUrl?: string;
  meaning?: string;
  learningStatus?: "new" | "learning" | "review" | "mastered";
}

export interface VocabularySense {
  id: string;
  definition: string;
  partOfSpeech?: string;
  examples?: VocabularyExample[];
  collocations?: string[];
}

export interface VocabularyExample {
  id: string;
  sourceText: string;
  translatedText?: string;
}

export interface RelatedItem {
  id: string;
  word: string;
  partOfSpeech?: string;
  relationship?: string;
}
