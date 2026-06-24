"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import type {
  VocabEditorForm,
  VocabItemType,
  VocabLang,
  VocabValidationIssue,
} from "@/features/admin-vocab/types/vocab-item.types";
import {
  VOCAB_CEFR,
  VOCAB_HSK,
  VOCAB_ITEM_TYPES,
  VOCAB_JLPT,
  VOCAB_POS,
} from "@/features/admin-vocab/types/vocab-item.types";

type BasicFields = Pick<
  VocabEditorForm,
  | "lang"
  | "itemType"
  | "headword"
  | "pos"
  | "profLevel"
  | "difficulty"
  | "frequencyRank"
  | "isCommon"
  | "isAiGenerated"
>;

type VocabBasicFieldsProps = {
  fields: BasicFields;
  issues: VocabValidationIssue[];
  onHeadwordChange: (v: string) => void;
  onItemTypeChange: (v: VocabItemType) => void;
  onPosChange: (v: string) => void;
  onProfLevelChange: (v: string) => void;
  onDifficultyChange: (v: VocabEditorForm["difficulty"]) => void;
  onFrequencyRankChange: (v: string) => void;
  onIsCommonChange: (v: boolean) => void;
  onIsAiGeneratedChange: (v: boolean) => void;
  className?: string;
};

const DIFFICULTY_OPTIONS = [
  { v: "1", label: "1 — Rất dễ" },
  { v: "2", label: "2 — Dễ" },
  { v: "3", label: "3 — Trung bình" },
  { v: "4", label: "4 — Khó" },
  { v: "5", label: "5 — Rất khó" },
] as const;

function profLevelOptions(lang: VocabLang): readonly string[] {
  if (lang === "en") return VOCAB_CEFR;
  if (lang === "ja") return VOCAB_JLPT;
  return VOCAB_HSK;
}

function profLevelLabel(lang: VocabLang): string {
  if (lang === "en") return "Bậc CEFR";
  if (lang === "ja") return "Bậc JLPT";
  return "Bậc HSK";
}

function fieldError(issues: VocabValidationIssue[], message: string): string | undefined {
  return issues.find((i) => i.severity === "error" && i.message.toLowerCase().includes(message))
    ?.message;
}

export function VocabBasicFields({
  fields,
  issues,
  onHeadwordChange,
  onItemTypeChange,
  onPosChange,
  onProfLevelChange,
  onDifficultyChange,
  onFrequencyRankChange,
  onIsCommonChange,
  onIsAiGeneratedChange,
  className,
}: VocabBasicFieldsProps) {
  const basicIssues = issues.filter((i) => i.tab === "basic");
  const headwordError = fieldError(basicIssues, "từ đầu mục");
  const itemTypeOptions = VOCAB_ITEM_TYPES[fields.lang];
  const posOptions = VOCAB_POS[fields.lang];
  const levelOptions = profLevelOptions(fields.lang);

  return (
    <div className={cn("space-y-5", className)}>
      {/* Headword */}
      <div className="space-y-1.5">
        <Label htmlFor="headword">
          Từ đầu mục <span aria-hidden="true" className="text-destructive">*</span>
        </Label>
        <Input
          id="headword"
          value={fields.headword}
          onChange={(e) => onHeadwordChange(e.target.value)}
          placeholder="Nhập từ hoặc cụm từ..."
          aria-invalid={headwordError !== undefined}
          aria-describedby={headwordError !== undefined ? "headword-error" : undefined}
          className={cn(headwordError !== undefined && "border-destructive")}
        />
        {headwordError !== undefined && (
          <p id="headword-error" role="alert" className="text-xs text-destructive">
            {headwordError}
          </p>
        )}
      </div>

      {/* Item type + POS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="itemType">Loại từ vựng</Label>
          <Select
            value={fields.itemType}
            onValueChange={(v) => onItemTypeChange(v as VocabItemType)}
          >
            <SelectTrigger id="itemType">
              <SelectValue placeholder="Chọn loại..." />
            </SelectTrigger>
            <SelectContent>
              {itemTypeOptions.map((opt) => (
                <SelectItem key={opt.v} value={opt.v}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pos">Từ loại (POS)</Label>
          <Select
            value={fields.pos}
            onValueChange={onPosChange}
          >
            <SelectTrigger id="pos">
              <SelectValue placeholder="Chọn từ loại..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">— Không chọn —</SelectItem>
              {posOptions.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Proficiency level + Difficulty */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="profLevel">{profLevelLabel(fields.lang)}</Label>
          <Select value={fields.profLevel} onValueChange={onProfLevelChange}>
            <SelectTrigger id="profLevel">
              <SelectValue placeholder="Chọn bậc..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">— Không chọn —</SelectItem>
              {levelOptions.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="difficulty">Độ khó</Label>
          <Select
            value={fields.difficulty}
            onValueChange={(v) => onDifficultyChange(v as VocabEditorForm["difficulty"])}
          >
            <SelectTrigger id="difficulty">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTY_OPTIONS.map((d) => (
                <SelectItem key={d.v} value={d.v}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Frequency rank */}
      <div className="space-y-1.5">
        <Label htmlFor="frequencyRank">
          Thứ hạng tần suất
          <span className="ml-1 text-xs font-normal text-muted-foreground">(tùy chọn)</span>
        </Label>
        <Input
          id="frequencyRank"
          type="number"
          min={1}
          value={fields.frequencyRank}
          onChange={(e) => onFrequencyRankChange(e.target.value)}
          placeholder="Ví dụ: 500"
          className="max-w-[200px]"
        />
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-6 pt-1">
        <label className="flex cursor-pointer items-center gap-2">
          <Checkbox
            id="isCommon"
            checked={fields.isCommon}
            onCheckedChange={(checked) => onIsCommonChange(checked === true)}
          />
          <span className="text-sm">Từ thông dụng</span>
        </label>

        <label className="flex cursor-pointer items-center gap-2">
          <Checkbox
            id="isAiGenerated"
            checked={fields.isAiGenerated}
            onCheckedChange={(checked) => onIsAiGeneratedChange(checked === true)}
          />
          <span className="text-sm">Nội dung AI tạo</span>
        </label>
      </div>
    </div>
  );
}
