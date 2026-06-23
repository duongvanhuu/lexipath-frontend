import type { VocabEditorForm, VocabValidationIssue } from "@/features/admin-vocab";

export function validateVocabForm(form: VocabEditorForm): VocabValidationIssue[] {
  const issues: VocabValidationIssue[] = [];

  function error(tab: VocabValidationIssue["tab"], message: string) {
    issues.push({ tab, severity: "error", message });
  }
  function warn(tab: VocabValidationIssue["tab"], message: string) {
    issues.push({ tab, severity: "warning", message });
  }

  // --- Hard errors: Basic ---

  if (form.headword.trim() === "") {
    error("basic", "Từ chính không được để trống");
  }

  if (!form.lang || !form.itemType) {
    error("basic", "Ngôn ngữ và loại mục từ là bắt buộc");
  }

  // EN-specific
  if (form.lang === "en") {
    if (form.en.ipa.trim() !== "" && !/^\/.*\/$/.test(form.en.ipa.trim())) {
      error("basic", "IPA phải có định dạng /…/");
    }
    if (form.itemType === "phrasal-verb" && form.en.phrasalStruct.trim() === "") {
      error("basic", "Động từ cụm phải có cấu trúc cụm từ");
    }
  }

  // ZH-specific
  if (form.lang === "zh") {
    if (form.zh.simplified.trim() === "" && form.zh.traditional.trim() === "") {
      error("basic", "Phải có ít nhất Giản thể hoặc Phồn thể");
    }
    if (form.zh.pinyinToneMarks.trim() !== "" && form.zh.tone.trim() === "") {
      error("basic", "Có pinyin thì phải chọn thanh điệu");
    }
  }

  // JA-specific
  if (form.lang === "ja" && form.itemType === "kanji") {
    if (form.ja.hiragana.trim() === "" && form.ja.romaji.trim() === "") {
      error("basic", "Kanji phải có hiragana hoặc romaji");
    }
  }

  // --- Hard errors: Senses ---

  if (form.senses.every((s) => s.meaning.trim() === "")) {
    error("senses", "Phải có ít nhất một nghĩa không trống");
  }

  // --- Hard errors: Translations ---

  const hasViTrans = form.translations.some(
    (t) =>
      t.targetLang === "vi" &&
      (t.translation.trim() !== "" || t.shortDefinition.trim() !== ""),
  );
  if (!hasViTrans) {
    error("translations", "Phải có bản dịch tiếng Việt");
  }

  // --- Hard errors: Review (AI-generated) ---

  if (
    form.isAiGenerated &&
    form.status !== "reviewed" &&
    form.status !== "published"
  ) {
    error("review", "Mục từ AI cần được duyệt trước khi xuất bản");
  }

  // --- Soft warnings ---

  if (form.phonetics.every((p) => p.value.trim() === "")) {
    warn("phonetics", "Nên thêm ít nhất một phiên âm");
  }

  if (form.audio.every((a) => a.url.trim() === "")) {
    warn("audio", "Nên thêm ít nhất một file âm thanh");
  }

  if (form.examples.every((e) => e.source.trim() === "")) {
    warn("examples", "Nên thêm ít nhất một câu ví dụ");
  }

  return issues;
}
