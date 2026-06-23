import { describe, it, expect } from "vitest";
import { validateVocabForm } from "../validate-vocab-form";
import type { VocabEditorForm } from "@/features/admin-vocab";

/**
 * A valid EN form with all required fields filled.
 * validateVocabForm(createValidEnForm()) must return zero errors (warnings are OK).
 */
function createValidEnForm(overrides?: Partial<VocabEditorForm>): VocabEditorForm {
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

describe("validateVocabForm", () => {
  // -----------------------------------------------------------------------
  // Fixture sanity
  // -----------------------------------------------------------------------

  it("createValidEnForm() returns zero errors (warnings are OK)", () => {
    const issues = validateVocabForm(createValidEnForm());
    const errors = issues.filter((i) => i.severity === "error");
    expect(errors).toHaveLength(0);
  });

  // -----------------------------------------------------------------------
  // Hard errors: Basic — headword
  // -----------------------------------------------------------------------

  it("errors when headword is empty string", () => {
    const issues = validateVocabForm(createValidEnForm({ headword: "" }));
    expect(issues.some((i) => i.tab === "basic" && i.severity === "error")).toBe(true);
  });

  it("errors when headword is only whitespace (trim test)", () => {
    const issues = validateVocabForm(createValidEnForm({ headword: "   " }));
    expect(issues.some((i) => i.tab === "basic" && i.severity === "error")).toBe(true);
  });

  // -----------------------------------------------------------------------
  // Hard errors: Senses
  // -----------------------------------------------------------------------

  it("errors when senses array is empty", () => {
    const issues = validateVocabForm(createValidEnForm({ senses: [] }));
    expect(issues.some((i) => i.tab === "senses" && i.severity === "error")).toBe(true);
  });

  it("errors when every sense has only whitespace meaning", () => {
    const issues = validateVocabForm(
      createValidEnForm({
        senses: [{ id: "s1", pos: "Noun", meaning: "   ", example: "", exampleTrans: "" }],
      }),
    );
    expect(issues.some((i) => i.tab === "senses" && i.severity === "error")).toBe(true);
  });

  // -----------------------------------------------------------------------
  // Hard errors: Translations (VI)
  // -----------------------------------------------------------------------

  it("errors when translations array is empty (no VI translation)", () => {
    const issues = validateVocabForm(createValidEnForm({ translations: [] }));
    expect(issues.some((i) => i.tab === "translations" && i.severity === "error")).toBe(true);
  });

  it("errors when translations exist but none target 'vi'", () => {
    const issues = validateVocabForm(
      createValidEnForm({
        translations: [
          {
            id: "t1",
            targetLang: "ja",
            translation: "テスト",
            shortDefinition: "",
            explanation: "",
            usageNote: "",
          },
        ],
      }),
    );
    expect(issues.some((i) => i.tab === "translations" && i.severity === "error")).toBe(true);
  });

  // -----------------------------------------------------------------------
  // Hard errors: Review (AI-generated)
  // -----------------------------------------------------------------------

  it("errors when AI generated + status draft", () => {
    const issues = validateVocabForm(
      createValidEnForm({ isAiGenerated: true, status: "draft" }),
    );
    expect(issues.some((i) => i.tab === "review" && i.severity === "error")).toBe(true);
  });

  it("no review error when AI generated + status reviewed", () => {
    const issues = validateVocabForm(
      createValidEnForm({ isAiGenerated: true, status: "reviewed" }),
    );
    expect(issues.some((i) => i.tab === "review")).toBe(false);
  });

  it("no review error when AI generated + status published", () => {
    const issues = validateVocabForm(
      createValidEnForm({ isAiGenerated: true, status: "published" }),
    );
    expect(issues.some((i) => i.tab === "review")).toBe(false);
  });

  // -----------------------------------------------------------------------
  // Hard errors: EN IPA format
  // -----------------------------------------------------------------------

  it("errors for EN IPA without slashes (e.g. ɪˈfem.ər.əl)", () => {
    const issues = validateVocabForm(
      createValidEnForm({ en: { ...createValidEnForm().en, ipa: "ɪˈfem.ər.əl" } }),
    );
    expect(issues.some((i) => i.tab === "basic" && i.severity === "error")).toBe(true);
  });

  it("no IPA error for valid EN IPA /ɪˈfem.ər.əl/", () => {
    const issues = validateVocabForm(
      createValidEnForm({ en: { ...createValidEnForm().en, ipa: "/ɪˈfem.ər.əl/" } }),
    );
    const ipaErrors = issues.filter(
      (i) => i.tab === "basic" && i.severity === "error" && i.message.includes("IPA"),
    );
    expect(ipaErrors).toHaveLength(0);
  });

  // -----------------------------------------------------------------------
  // Hard errors: EN phrasal-verb no phrasalStruct
  // -----------------------------------------------------------------------

  it("errors for EN phrasal-verb with empty phrasalStruct", () => {
    const issues = validateVocabForm(
      createValidEnForm({ itemType: "phrasal-verb" }),
    );
    expect(issues.some((i) => i.tab === "basic" && i.severity === "error")).toBe(true);
  });

  it("no phrasalStruct error for EN phrasal-verb when phrasalStruct is filled", () => {
    const issues = validateVocabForm(
      createValidEnForm({
        itemType: "phrasal-verb",
        en: { ...createValidEnForm().en, phrasalStruct: "V + up" },
      }),
    );
    const phrasalErrors = issues.filter(
      (i) => i.tab === "basic" && i.severity === "error" && i.message.includes("cụm"),
    );
    expect(phrasalErrors).toHaveLength(0);
  });

  // -----------------------------------------------------------------------
  // Hard errors: ZH no script
  // -----------------------------------------------------------------------

  it("errors for ZH with empty simplified AND empty traditional", () => {
    const issues = validateVocabForm(
      createValidEnForm({
        lang: "zh",
        zh: { ...createValidEnForm().zh, simplified: "", traditional: "" },
      }),
    );
    expect(issues.some((i) => i.tab === "basic" && i.severity === "error")).toBe(true);
  });

  // -----------------------------------------------------------------------
  // Hard errors: ZH tone mismatch
  // -----------------------------------------------------------------------

  it("errors for ZH when pinyinToneMarks is set but tone is empty", () => {
    const issues = validateVocabForm(
      createValidEnForm({
        lang: "zh",
        zh: {
          ...createValidEnForm().zh,
          simplified: "测",
          traditional: "",
          pinyinToneMarks: "cè",
          tone: "",
        },
      }),
    );
    expect(issues.some((i) => i.tab === "basic" && i.severity === "error")).toBe(true);
  });

  // -----------------------------------------------------------------------
  // Hard errors: JA kanji no reading
  // -----------------------------------------------------------------------

  it("errors for JA kanji with empty hiragana AND empty romaji", () => {
    const issues = validateVocabForm(
      createValidEnForm({
        lang: "ja",
        itemType: "kanji",
        ja: { ...createValidEnForm().ja, hiragana: "", romaji: "" },
      }),
    );
    expect(issues.some((i) => i.tab === "basic" && i.severity === "error")).toBe(true);
  });

  // -----------------------------------------------------------------------
  // Soft warnings
  // -----------------------------------------------------------------------

  it("warns when phonetics array is empty (no phonetics)", () => {
    const issues = validateVocabForm(createValidEnForm({ phonetics: [] }));
    expect(issues.some((i) => i.tab === "phonetics" && i.severity === "warning")).toBe(true);
  });

  it("warns when all phonetics have empty value", () => {
    const issues = validateVocabForm(
      createValidEnForm({
        phonetics: [
          {
            id: "p1",
            system: "IPA",
            dialect: "",
            value: "   ",
            toneNumber: "",
            toneMark: "",
            pitchPattern: "",
            pitchNumber: "",
            isPrimary: true,
          },
        ],
      }),
    );
    expect(issues.some((i) => i.tab === "phonetics" && i.severity === "warning")).toBe(true);
  });

  it("warns when audio array is empty", () => {
    const issues = validateVocabForm(createValidEnForm({ audio: [] }));
    expect(issues.some((i) => i.tab === "audio" && i.severity === "warning")).toBe(true);
  });

  it("warns when examples array is empty", () => {
    const issues = validateVocabForm(createValidEnForm({ examples: [] }));
    expect(issues.some((i) => i.tab === "examples" && i.severity === "warning")).toBe(true);
  });

  // -----------------------------------------------------------------------
  // Shape: all issues have valid VocabEditorTabId values
  // -----------------------------------------------------------------------

  it("all issues have valid VocabEditorTabId tab values", () => {
    const validTabs = new Set<string>([
      "basic",
      "scripts",
      "phonetics",
      "audio",
      "senses",
      "translations",
      "examples",
      "relations",
      "tags",
      "sources",
      "preview",
      "versions",
      "review",
      "publish",
    ]);

    // Run a form that triggers multiple issues
    const issues = validateVocabForm(
      createValidEnForm({
        headword: "",
        senses: [],
        translations: [],
        isAiGenerated: true,
        status: "draft",
      }),
    );

    // Must have at least some issues
    expect(issues.length).toBeGreaterThan(0);

    for (const issue of issues) {
      expect(validTabs.has(issue.tab)).toBe(true);
      expect(["error", "warning"]).toContain(issue.severity);
      expect(typeof issue.message).toBe("string");
      expect(issue.message.length).toBeGreaterThan(0);
    }
  });
});
