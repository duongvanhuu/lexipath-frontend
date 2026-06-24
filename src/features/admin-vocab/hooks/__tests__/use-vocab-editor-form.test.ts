import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  useVocabEditorForm,
  createDefaultVocabEditorForm,
  createVocabEditorFormFromItem,
} from "../use-vocab-editor-form";
import type { VocabEditorForm } from "@/features/admin-vocab/types/vocab-item.types";
import { VOCAB_ITEMS_MOCK } from "../../mock/vocab-items.mock";

// ---------------------------------------------------------------------------
// Local helper: a form with no hard validation errors (warnings are OK)
// Mirrors the createValidEnForm() from validation tests.
// ---------------------------------------------------------------------------

function createValidTestForm(overrides?: Partial<VocabEditorForm>): VocabEditorForm {
  const base: VocabEditorForm = {
    lang: "en",
    itemType: "word",
    headword: "test",
    pos: "Noun",
    profLevel: "B1",
    difficulty: "3",
    status: "draft",
    tags: [],
    frequencyRank: "",
    isCommon: false,
    isAiGenerated: false,
    scripts: [],
    phonetics: [],
    audio: [],
    senses: [{ id: "s1", pos: "Noun", meaning: "a check", example: "", exampleTrans: "" }],
    translations: [
      {
        id: "t1",
        targetLang: "vi",
        translation: "kiểm tra",
        shortDefinition: "",
        explanation: "",
        usageNote: "",
      },
    ],
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

  if (!overrides) return base;
  return { ...base, ...overrides };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useVocabEditorForm", () => {
  // 1. Default EN form
  it("default EN form has lang === 'en', status === 'draft', isDirty === false, lastSaved === null", () => {
    const { result } = renderHook(() => useVocabEditorForm());
    expect(result.current.form.lang).toBe("en");
    expect(result.current.form.status).toBe("draft");
    expect(result.current.isDirty).toBe(false);
    expect(result.current.lastSaved).toBeNull();
  });

  // 2. Default JA form
  it("default JA form has lang === 'ja', itemType === 'word'", () => {
    const { result } = renderHook(() =>
      useVocabEditorForm({ initialLang: "ja" }),
    );
    expect(result.current.form.lang).toBe("ja");
    expect(result.current.form.itemType).toBe("word");
  });

  // 3. Default ZH form
  it("default ZH form has lang === 'zh', itemType === 'word'", () => {
    const { result } = renderHook(() =>
      useVocabEditorForm({ initialLang: "zh" }),
    );
    expect(result.current.form.lang).toBe("zh");
    expect(result.current.form.itemType).toBe("word");
  });

  // 4. initialValues override
  it("uses initialValues as initial state when provided", () => {
    const initial = createValidTestForm({ headword: "ephemeral", lang: "en" });
    const { result } = renderHook(() =>
      useVocabEditorForm({ initialValues: initial }),
    );
    expect(result.current.form.headword).toBe("ephemeral");
    expect(result.current.form.lang).toBe("en");
  });

  // 5. setField marks isDirty
  it("setField marks isDirty = true", () => {
    const { result } = renderHook(() => useVocabEditorForm());
    expect(result.current.isDirty).toBe(false);
    act(() => {
      result.current.setField("headword", "new word");
    });
    expect(result.current.isDirty).toBe(true);
    expect(result.current.form.headword).toBe("new word");
  });

  // 6. updateForm marks isDirty
  it("updateForm marks isDirty = true", () => {
    const { result } = renderHook(() => useVocabEditorForm());
    expect(result.current.isDirty).toBe(false);
    act(() => {
      result.current.updateForm((f) => ({ ...f, pos: "Noun" }));
    });
    expect(result.current.isDirty).toBe(true);
    expect(result.current.form.pos).toBe("Noun");
  });

  // 7. resetForm() resets dirty and lastSaved
  it("resetForm() resets isDirty to false and lastSaved to null", () => {
    const { result } = renderHook(() => useVocabEditorForm());
    act(() => {
      result.current.setField("headword", "dirty");
    });
    expect(result.current.isDirty).toBe(true);
    act(() => {
      result.current.saveDraft();
    });
    expect(result.current.lastSaved).not.toBeNull();
    act(() => {
      result.current.resetForm();
    });
    expect(result.current.isDirty).toBe(false);
    expect(result.current.lastSaved).toBeNull();
  });

  // 8. resetForm(next) sets form to next
  it("resetForm(next) sets form to the provided next value", () => {
    const { result } = renderHook(() => useVocabEditorForm());
    const nextForm = createValidTestForm({ headword: "override" });
    act(() => {
      result.current.resetForm(nextForm);
    });
    expect(result.current.form.headword).toBe("override");
    expect(result.current.isDirty).toBe(false);
    expect(result.current.lastSaved).toBeNull();
  });

  // 9. saveDraft() sets lastSaved and clears isDirty
  it("saveDraft() sets lastSaved to non-null string and isDirty to false", () => {
    const { result } = renderHook(() => useVocabEditorForm());
    act(() => {
      result.current.setField("headword", "word");
    });
    expect(result.current.isDirty).toBe(true);
    act(() => {
      result.current.saveDraft();
    });
    expect(typeof result.current.lastSaved).toBe("string");
    expect(result.current.lastSaved).not.toBeNull();
    expect(result.current.isDirty).toBe(false);
  });

  // 10. sendReview() sets form.status to 'in_review'
  it("sendReview() sets form.status to 'in_review'", () => {
    const { result } = renderHook(() => useVocabEditorForm());
    expect(result.current.form.status).toBe("draft");
    act(() => {
      result.current.sendReview();
    });
    expect(result.current.form.status).toBe("in_review");
  });

  // 11. publish() blocked when form has hard errors
  it("publish() is a no-op when hardErrorCount > 0", () => {
    // Default form has hard errors (empty headword, no senses, no VI translation)
    const { result } = renderHook(() => useVocabEditorForm());
    expect(result.current.hardErrorCount).toBeGreaterThan(0);
    const statusBefore = result.current.form.status;
    act(() => {
      result.current.publish();
    });
    expect(result.current.form.status).toBe(statusBefore);
    expect(result.current.lastSaved).toBeNull();
    expect(result.current.isDirty).toBe(false); // wasn't dirty before
  });

  // 12. publish() succeeds when no hard errors
  it("publish() sets status to 'published', lastSaved non-null, isDirty false when no hard errors", () => {
    const validForm = createValidTestForm();
    const { result } = renderHook(() =>
      useVocabEditorForm({ initialValues: validForm }),
    );
    // Confirm no hard errors
    expect(result.current.hardErrorCount).toBe(0);
    act(() => {
      result.current.publish();
    });
    expect(result.current.form.status).toBe("published");
    expect(result.current.lastSaved).not.toBeNull();
    expect(result.current.isDirty).toBe(false);
  });

  // 13. issues are non-empty on default form
  it("issues are non-empty on default (blank) form", () => {
    const { result } = renderHook(() => useVocabEditorForm());
    expect(result.current.issues.length).toBeGreaterThan(0);
  });

  // 14. hardErrorCount > 0 on default form
  it("hardErrorCount > 0 on default form", () => {
    const { result } = renderHook(() => useVocabEditorForm());
    expect(result.current.hardErrorCount).toBeGreaterThan(0);
  });

  // ---------------------------------------------------------------------------
  // sendReview() detail: isDirty = false
  // ---------------------------------------------------------------------------
  it("sendReview() sets isDirty to false", () => {
    const { result } = renderHook(() => useVocabEditorForm());
    act(() => {
      result.current.setField("headword", "something");
    });
    expect(result.current.isDirty).toBe(true);
    act(() => {
      result.current.sendReview();
    });
    expect(result.current.isDirty).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// createDefaultVocabEditorForm
// ---------------------------------------------------------------------------

describe("createDefaultVocabEditorForm", () => {
  it("returns a form with the specified lang", () => {
    const form = createDefaultVocabEditorForm("ja");
    expect(form.lang).toBe("ja");
  });

  it("returns a form with status 'draft'", () => {
    const form = createDefaultVocabEditorForm("en");
    expect(form.status).toBe("draft");
  });

  it("returns a form with empty headword", () => {
    const form = createDefaultVocabEditorForm("zh");
    expect(form.headword).toBe("");
  });
});

// ---------------------------------------------------------------------------
// createVocabEditorFormFromItem — mapper tests
// ---------------------------------------------------------------------------

describe("createVocabEditorFormFromItem", () => {
  const enItem = VOCAB_ITEMS_MOCK[0]; // vi-001: ephemeral, en, published

  // 15. maps canonicalForm → headword
  it("maps canonicalForm to headword", () => {
    if (!enItem) throw new Error("Mock item vi-001 missing");
    const form = createVocabEditorFormFromItem(enItem);
    expect(form.headword).toBe(enItem.canonicalForm);
  });

  // 16. maps status correctly
  it("maps status correctly", () => {
    if (!enItem) throw new Error("Mock item vi-001 missing");
    const form = createVocabEditorFormFromItem(enItem);
    expect(form.status).toBe(enItem.status);
  });

  // 17. maps lang correctly
  it("maps lang correctly", () => {
    if (!enItem) throw new Error("Mock item vi-001 missing");
    const form = createVocabEditorFormFromItem(enItem);
    expect(form.lang).toBe(enItem.lang);
  });

  // 18. maps senses correctly (length matches)
  it("maps senses with correct length", () => {
    if (!enItem) throw new Error("Mock item vi-001 missing");
    const form = createVocabEditorFormFromItem(enItem);
    expect(form.senses.length).toBe(enItem.senses.length);
  });

  it("maps sense.def to sense.meaning", () => {
    if (!enItem) throw new Error("Mock item vi-001 missing");
    const form = createVocabEditorFormFromItem(enItem);
    const firstSense = form.senses[0];
    const firstItemSense = enItem.senses[0];
    if (!firstSense || !firstItemSense) throw new Error("Missing sense");
    expect(firstSense.meaning).toBe(firstItemSense.def);
  });

  it("maps EN pronunciation to en.ipa", () => {
    if (!enItem) throw new Error("Mock item vi-001 missing");
    const form = createVocabEditorFormFromItem(enItem);
    expect(form.en.ipa).toBe(enItem.pronunciation);
  });

  it("maps JA item: canonicalForm to ja.kanji", () => {
    const jaItem = VOCAB_ITEMS_MOCK[3]; // vi-004: 食べる, ja
    if (!jaItem) throw new Error("Mock item vi-004 missing");
    const form = createVocabEditorFormFromItem(jaItem);
    expect(form.lang).toBe("ja");
    expect(form.ja.kanji).toBe(jaItem.canonicalForm);
    expect(form.ja.hiragana).toBe(jaItem.pronunciation);
  });

  it("maps ZH item: canonicalForm to zh.simplified", () => {
    const zhItem = VOCAB_ITEMS_MOCK[6]; // vi-007: 学习, zh
    if (!zhItem) throw new Error("Mock item vi-007 missing");
    const form = createVocabEditorFormFromItem(zhItem);
    expect(form.lang).toBe("zh");
    expect(form.zh.simplified).toBe(zhItem.canonicalForm);
    expect(form.zh.pinyinToneMarks).toBe(zhItem.pronunciation);
  });

  it("maps source to sourceRefs when source is present", () => {
    if (!enItem) throw new Error("Mock item vi-001 missing");
    const form = createVocabEditorFormFromItem(enItem);
    expect(form.sourceRefs.length).toBe(1);
    const ref = form.sourceRefs[0];
    if (!ref) throw new Error("Missing sourceRef");
    expect(ref.sourceId).toBe(enItem.source);
  });

  it("maps isAiGenerated correctly", () => {
    const aiItem = VOCAB_ITEMS_MOCK[2]; // vi-003: break a leg, isAiGenerated: true
    if (!aiItem) throw new Error("Mock item vi-003 missing");
    const form = createVocabEditorFormFromItem(aiItem);
    expect(form.isAiGenerated).toBe(true);
  });
});
