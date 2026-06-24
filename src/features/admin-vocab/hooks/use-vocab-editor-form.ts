import { useState, useMemo } from "react";
import type {
  VocabEditorForm,
  VocabLang,
  VocabValidationIssue,
  VocabItem,
} from "@/features/admin-vocab/types/vocab-item.types";
import { validateVocabForm } from "@/features/admin-vocab/validation/validate-vocab-form";

// ---------------------------------------------------------------------------
// Default form factory
// ---------------------------------------------------------------------------

export function createDefaultVocabEditorForm(lang: VocabLang): VocabEditorForm {
  return {
    lang,
    itemType: "word",
    headword: "",
    pos: "",
    profLevel: "",
    difficulty: "3",
    status: "draft",
    tags: [],
    frequencyRank: "",
    isCommon: false,
    isAiGenerated: false,
    scripts: [],
    phonetics: [],
    audio: [],
    senses: [],
    translations: [],
    examples: [],
    relations: {
      synonyms: [],
      antonyms: [],
      confusables: [],
      collocations: [],
      wordFamily: [],
      relatedGrammar: [],
    },
    tagIds: [],
    sourceRefs: [],
    en: {
      ipa: "",
      audioUS: "",
      audioUK: "",
      wordStress: "",
      syllables: "",
      cefr: "",
      register: "",
      domain: "",
      phrasalStruct: "",
      idiomNote: "",
      collocations: "",
      wordFamily: "",
      synonyms: "",
      antonyms: "",
      confusables: "",
    },
    ja: {
      kanji: "",
      hiragana: "",
      katakana: "",
      furigana: "",
      romaji: "",
      pitchAccent: "",
      kanjiDetail: "",
      verbForms: "",
      grammarPoint: "",
    },
    zh: {
      simplified: "",
      traditional: "",
      pinyinToneMarks: "",
      pinyinToneNumbers: "",
      audio: "",
      tone: "",
      hskLevel: "",
      radical: "",
      strokeCount: "",
      components: "",
      polyphone: "",
      measureWord: "",
      grammarNote: "",
    },
  };
}

// ---------------------------------------------------------------------------
// Mapper: VocabItem → VocabEditorForm
// ---------------------------------------------------------------------------

export function createVocabEditorFormFromItem(item: VocabItem): VocabEditorForm {
  const blankEn: VocabEditorForm["en"] = {
    ipa: "",
    audioUS: "",
    audioUK: "",
    wordStress: "",
    syllables: "",
    cefr: item.lang === "en" ? (item.level ?? "") : "",
    register: "",
    domain: "",
    phrasalStruct: "",
    idiomNote: "",
    collocations: "",
    wordFamily: "",
    synonyms: "",
    antonyms: "",
    confusables: "",
  };

  const blankJa: VocabEditorForm["ja"] = {
    kanji: "",
    hiragana: "",
    katakana: "",
    furigana: "",
    romaji: "",
    pitchAccent: "",
    kanjiDetail: "",
    verbForms: "",
    grammarPoint: "",
  };

  const blankZh: VocabEditorForm["zh"] = {
    simplified: "",
    traditional: "",
    pinyinToneMarks: "",
    pinyinToneNumbers: "",
    audio: "",
    tone: "",
    hskLevel: item.lang === "zh" ? (item.level ?? "") : "",
    radical: "",
    strokeCount: "",
    components: "",
    polyphone: "",
    measureWord: "",
    grammarNote: "",
  };

  const en: VocabEditorForm["en"] =
    item.lang === "en"
      ? { ...blankEn, ipa: item.pronunciation ?? "" }
      : blankEn;

  const ja: VocabEditorForm["ja"] =
    item.lang === "ja"
      ? {
          ...blankJa,
          kanji: item.canonicalForm,
          hiragana: item.pronunciation ?? "",
        }
      : blankJa;

  const zh: VocabEditorForm["zh"] =
    item.lang === "zh"
      ? {
          ...blankZh,
          simplified: item.canonicalForm,
          pinyinToneMarks: item.pronunciation ?? "",
          hskLevel: item.level ?? "",
        }
      : blankZh;

  return {
    lang: item.lang,
    itemType: item.itemType,
    headword: item.canonicalForm,
    pos: item.pos ?? "",
    profLevel: item.level ?? "",
    difficulty: "3",
    status: item.status,
    tags: [],
    frequencyRank: "",
    isCommon: false,
    isAiGenerated: item.isAiGenerated,
    scripts: [],
    phonetics: [],
    audio: [],
    senses: item.senses.map((s, index) => ({
      id: `sense-${String(index + 1)}`,
      pos: s.pos,
      meaning: s.def,
      example: "",
      exampleTrans: "",
    })),
    translations: [],
    examples: [],
    relations: {
      synonyms: [],
      antonyms: [],
      confusables: [],
      collocations: [],
      wordFamily: [],
      relatedGrammar: [],
    },
    tagIds: [],
    sourceRefs: item.source
      ? [
          {
            id: "src-1",
            sourceId: item.source,
            pageRef: "",
            url: "",
            note: "",
          },
        ]
      : [],
    en,
    ja,
    zh,
  };
}

// ---------------------------------------------------------------------------
// Hook options & return type
// ---------------------------------------------------------------------------

export type UseVocabEditorFormOptions = {
  initialLang?: VocabLang;
  initialValues?: VocabEditorForm;
};

export type UseVocabEditorFormReturn = {
  form: VocabEditorForm;
  issues: VocabValidationIssue[];
  hardErrorCount: number;
  warningCount: number;
  isDirty: boolean;
  lastSaved: string | null;
  setField: <K extends keyof VocabEditorForm>(
    key: K,
    value: VocabEditorForm[K],
  ) => void;
  updateForm: (updater: (current: VocabEditorForm) => VocabEditorForm) => void;
  resetForm: (next?: VocabEditorForm) => void;
  saveDraft: () => void;
  sendReview: () => void;
  publish: () => void;
  // Array helpers for upcoming tab tasks
  updateArrayItem: <K extends ArrayKeys>(
    key: K,
    id: string | number,
    patch: Partial<ArrayItem<VocabEditorForm[K]>>,
  ) => void;
  addArrayItem: <K extends ArrayKeys>(
    key: K,
    item: ArrayItem<VocabEditorForm[K]>,
  ) => void;
  removeArrayItem: <K extends ArrayKeys>(
    key: K,
    id: string | number,
  ) => void;
};

// ---------------------------------------------------------------------------
// Array key helpers
// ---------------------------------------------------------------------------

type ArrayKeys = {
  [K in keyof VocabEditorForm]: VocabEditorForm[K] extends Array<infer _I>
    ? K
    : never;
}[keyof VocabEditorForm];

type ArrayItem<T> = T extends Array<infer I> ? I : never;

type ItemWithId = { id: string | number };

// ---------------------------------------------------------------------------
// Hook implementation
// ---------------------------------------------------------------------------

export function useVocabEditorForm(
  options?: UseVocabEditorFormOptions,
): UseVocabEditorFormReturn {
  const initialLang: VocabLang = options?.initialLang ?? "en";

  const [form, setForm] = useState<VocabEditorForm>(() => {
    if (options?.initialValues !== undefined) {
      return options.initialValues;
    }
    return createDefaultVocabEditorForm(initialLang);
  });

  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const issues = useMemo(() => validateVocabForm(form), [form]);

  const hardErrorCount = useMemo(
    () => issues.filter((i) => i.severity === "error").length,
    [issues],
  );

  const warningCount = useMemo(
    () => issues.filter((i) => i.severity === "warning").length,
    [issues],
  );

  function setField<K extends keyof VocabEditorForm>(
    key: K,
    value: VocabEditorForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  }

  function updateForm(updater: (current: VocabEditorForm) => VocabEditorForm) {
    setForm((prev) => updater(prev));
    setIsDirty(true);
  }

  function resetForm(next?: VocabEditorForm) {
    setForm(next ?? createDefaultVocabEditorForm(form.lang));
    setIsDirty(false);
    setLastSaved(null);
  }

  function saveDraft() {
    setLastSaved(new Date().toISOString());
    setIsDirty(false);
  }

  function sendReview() {
    setForm((prev) => ({ ...prev, status: "in_review" }));
    setIsDirty(false);
  }

  function publish() {
    if (hardErrorCount > 0) return;
    setForm((prev) => ({ ...prev, status: "published" }));
    setLastSaved(new Date().toISOString());
    setIsDirty(false);
  }

  // Array helpers
  function updateArrayItem<K extends ArrayKeys>(
    key: K,
    id: string | number,
    patch: Partial<ArrayItem<VocabEditorForm[K]>>,
  ) {
    setForm((prev) => {
      const arr = prev[key] as ItemWithId[];
      const updated = arr.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      );
      return { ...prev, [key]: updated };
    });
    setIsDirty(true);
  }

  function addArrayItem<K extends ArrayKeys>(
    key: K,
    item: ArrayItem<VocabEditorForm[K]>,
  ) {
    setForm((prev) => {
      const arr = prev[key] as ArrayItem<VocabEditorForm[K]>[];
      return { ...prev, [key]: [...arr, item] };
    });
    setIsDirty(true);
  }

  function removeArrayItem<K extends ArrayKeys>(
    key: K,
    id: string | number,
  ) {
    setForm((prev) => {
      const arr = prev[key] as ItemWithId[];
      return { ...prev, [key]: arr.filter((item) => item.id !== id) };
    });
    setIsDirty(true);
  }

  return {
    form,
    issues,
    hardErrorCount,
    warningCount,
    isDirty,
    lastSaved,
    setField,
    updateForm,
    resetForm,
    saveDraft,
    sendReview,
    publish,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
  };
}
