"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils/cn";
import type {
  VocabEditorTabId,
  VocabEnglishFields,
  VocabItemType,
  VocabJapaneseFields,
  VocabChineseFields,
  VocabLang,
} from "@/features/admin-vocab";
import {
  useVocabEditorForm,
} from "@/features/admin-vocab";
import { VocabAiDisclosure } from "./vocab-ai-disclosure";
import { VocabValidationBanner } from "./vocab-validation-banner";
import { VocabEditorTabBar } from "./vocab-editor-tab-bar";
import { VocabStickyBar } from "./vocab-sticky-bar";
import { VocabBasicFields } from "./vocab-basic-fields";
import { VocabEnSection } from "./vocab-en-section";
import { VocabJaSection } from "./vocab-ja-section";
import { VocabZhSection } from "./vocab-zh-section";

// ---------------------------------------------------------------------------
// Placeholder for tabs not yet implemented (Tasks 12–14)
// ---------------------------------------------------------------------------

function TabPlaceholder({ tabId }: { tabId: VocabEditorTabId }) {
  return (
    <div className="flex h-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
      Tab &ldquo;{tabId}&rdquo; — chưa triển khai
    </div>
  );
}

// ---------------------------------------------------------------------------
// Basic tab — combines common fields + language section
// ---------------------------------------------------------------------------

type BasicTabProps = {
  form: ReturnType<typeof useVocabEditorForm>["form"];
  issues: ReturnType<typeof useVocabEditorForm>["issues"];
  setField: ReturnType<typeof useVocabEditorForm>["setField"];
  updateForm: ReturnType<typeof useVocabEditorForm>["updateForm"];
};

function BasicTab({ form, issues, setField, updateForm }: BasicTabProps) {
  const handleEnChange = useCallback(
    <K extends keyof VocabEnglishFields>(key: K, value: VocabEnglishFields[K]) => {
      updateForm((prev) => ({ ...prev, en: { ...prev.en, [key]: value } }));
    },
    [updateForm],
  );

  const handleJaChange = useCallback(
    <K extends keyof VocabJapaneseFields>(key: K, value: VocabJapaneseFields[K]) => {
      updateForm((prev) => ({ ...prev, ja: { ...prev.ja, [key]: value } }));
    },
    [updateForm],
  );

  const handleZhChange = useCallback(
    <K extends keyof VocabChineseFields>(key: K, value: VocabChineseFields[K]) => {
      updateForm((prev) => ({ ...prev, zh: { ...prev.zh, [key]: value } }));
    },
    [updateForm],
  );

  return (
    <div className="space-y-6 pb-4">
      <VocabBasicFields
        fields={{
          lang: form.lang,
          itemType: form.itemType,
          headword: form.headword,
          pos: form.pos,
          profLevel: form.profLevel,
          difficulty: form.difficulty,
          frequencyRank: form.frequencyRank,
          isCommon: form.isCommon,
          isAiGenerated: form.isAiGenerated,
        }}
        issues={issues}
        onHeadwordChange={(v) => setField("headword", v)}
        onItemTypeChange={(v) => setField("itemType", v as VocabItemType)}
        onPosChange={(v) => setField("pos", v)}
        onProfLevelChange={(v) => setField("profLevel", v)}
        onDifficultyChange={(v) => setField("difficulty", v)}
        onFrequencyRankChange={(v) => setField("frequencyRank", v)}
        onIsCommonChange={(v) => setField("isCommon", v)}
        onIsAiGeneratedChange={(v) => setField("isAiGenerated", v)}
      />

      {form.lang === "en" && (
        <VocabEnSection
          fields={form.en}
          itemType={form.itemType}
          issues={issues}
          onChange={handleEnChange}
        />
      )}

      {form.lang === "ja" && (
        <VocabJaSection
          fields={form.ja}
          itemType={form.itemType}
          issues={issues}
          onChange={handleJaChange}
        />
      )}

      {form.lang === "zh" && (
        <VocabZhSection
          fields={form.zh}
          itemType={form.itemType}
          issues={issues}
          onChange={handleZhChange}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------

type VocabEditorShellProps = {
  mode: "create" | "edit";
  initialLang: VocabLang;
  vocabItemId?: string;
  className?: string;
};

export function VocabEditorShell({
  mode: _mode,
  initialLang,
  vocabItemId: _vocabItemId,
  className,
}: VocabEditorShellProps) {
  const [activeTab, setActiveTab] = useState<VocabEditorTabId>("basic");

  const {
    form,
    issues,
    hardErrorCount,
    isDirty,
    lastSaved,
    setField,
    updateForm,
    saveDraft,
    sendReview,
    publish,
  } = useVocabEditorForm({ initialLang });

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Banners — stack at top, above tab bar */}
      <div className="space-y-2 px-4 pt-4 md:px-6">
        {form.isAiGenerated && <VocabAiDisclosure />}
        <VocabValidationBanner issues={issues} onSelectTab={setActiveTab} />
      </div>

      {/* Tab bar */}
      <VocabEditorTabBar
        value={activeTab}
        issues={issues}
        onChange={setActiveTab}
        className="mt-3"
      />

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
        <div
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTab === "basic" ? (
            <BasicTab
              form={form}
              issues={issues}
              setField={setField}
              updateForm={updateForm}
            />
          ) : (
            <TabPlaceholder tabId={activeTab} />
          )}
        </div>
      </div>

      {/* Sticky action bar */}
      <VocabStickyBar
        status={form.status}
        isDirty={isDirty}
        lastSaved={lastSaved}
        hardErrorCount={hardErrorCount}
        onSaveDraft={saveDraft}
        onSendReview={sendReview}
        onPublish={publish}
      />
    </div>
  );
}
