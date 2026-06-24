"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import type {
  VocabChineseFields,
  VocabItemType,
  VocabValidationIssue,
} from "@/features/admin-vocab/types/vocab-item.types";
import { VOCAB_HSK } from "@/features/admin-vocab/types/vocab-item.types";

const TONE_OPTIONS = [
  { v: "1", label: "Thanh 1 (ˉ) — ngang" },
  { v: "2", label: "Thanh 2 (ˊ) — huyền" },
  { v: "3", label: "Thanh 3 (ˇ) — hỏi" },
  { v: "4", label: "Thanh 4 (ˋ) — nặng" },
  { v: "5", label: "Thanh 5 — nhẹ" },
];

type VocabZhSectionProps = {
  fields: VocabChineseFields;
  itemType: VocabItemType;
  issues: VocabValidationIssue[];
  onChange: <K extends keyof VocabChineseFields>(key: K, value: VocabChineseFields[K]) => void;
  className?: string;
};

function scriptError(issues: VocabValidationIssue[]): string | undefined {
  return issues.find(
    (i) =>
      i.tab === "basic" &&
      i.severity === "error" &&
      (i.message.includes("simplified") || i.message.includes("traditional") ||
        i.message.includes("giản thể") || i.message.includes("phồn thể")),
  )?.message;
}

function toneError(issues: VocabValidationIssue[]): string | undefined {
  return issues.find(
    (i) => i.tab === "basic" && i.severity === "error" && i.message.includes("tone"),
  )?.message;
}

export function VocabZhSection({
  fields,
  itemType,
  issues,
  onChange,
  className,
}: VocabZhSectionProps) {
  const isMeasureWord = itemType === "measure-word";
  const isGrammar = itemType === "grammar";
  const scriptErr = scriptError(issues);
  const toneErr = toneError(issues);

  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="shrink-0 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          中文
        </span>
        <Separator className="flex-1" />
      </div>

      {/* Simplified + Traditional */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="zh-simplified">
            <span className="font-sans">简体</span>
            <span className="ml-1.5">(Giản thể)</span>
            <span aria-hidden="true" className="ml-1 text-destructive">*</span>
          </Label>
          <Input
            id="zh-simplified"
            value={fields.simplified}
            onChange={(e) => onChange("simplified", e.target.value)}
            placeholder="学习"
            className={cn("font-sans", scriptErr !== undefined && "border-destructive")}
            aria-invalid={scriptErr !== undefined}
            lang="zh-Hans"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="zh-traditional">
            <span className="font-sans">繁體</span>
            <span className="ml-1.5">(Phồn thể)</span>
            <span aria-hidden="true" className="ml-1 text-destructive">*</span>
          </Label>
          <Input
            id="zh-traditional"
            value={fields.traditional}
            onChange={(e) => onChange("traditional", e.target.value)}
            placeholder="學習"
            className={cn("font-sans", scriptErr !== undefined && "border-destructive")}
            aria-invalid={scriptErr !== undefined}
            lang="zh-Hant"
          />
        </div>
      </div>

      {scriptErr !== undefined && (
        <p role="alert" className="text-xs text-destructive">
          {scriptErr}
        </p>
      )}

      <p className="text-xs text-muted-foreground -mt-3">
        Nhập ít nhất một trong hai dạng chữ.
      </p>

      {/* Pinyin + Tone */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="zh-pinyin">
            Pinyin (dấu thanh)
            <span className="ml-1 text-xs font-normal text-muted-foreground">(tùy chọn)</span>
          </Label>
          <Input
            id="zh-pinyin"
            value={fields.pinyinToneMarks}
            onChange={(e) => onChange("pinyinToneMarks", e.target.value)}
            placeholder="xuéxí"
            lang="zh"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="zh-tone">Thanh điệu</Label>
          <Select
            value={fields.tone}
            onValueChange={(v) => onChange("tone", v)}
          >
            <SelectTrigger
              id="zh-tone"
              className={cn(toneErr !== undefined && "border-destructive")}
              aria-invalid={toneErr !== undefined}
            >
              <SelectValue placeholder="Chọn thanh điệu..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">— Không chọn —</SelectItem>
              {TONE_OPTIONS.map((t) => (
                <SelectItem key={t.v} value={t.v}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {toneErr !== undefined && (
            <p role="alert" className="text-xs text-destructive">
              {toneErr}
            </p>
          )}
        </div>
      </div>

      {/* HSK level */}
      <div className="space-y-1.5">
        <Label htmlFor="zh-hsk">Bậc HSK</Label>
        <Select value={fields.hskLevel} onValueChange={(v) => onChange("hskLevel", v)}>
          <SelectTrigger id="zh-hsk">
            <SelectValue placeholder="Chọn bậc HSK..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">— Không chọn —</SelectItem>
            {VOCAB_HSK.map((h) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Measure word — conditional */}
      {isMeasureWord && (
        <div className="space-y-1.5">
          <Label htmlFor="zh-measureWord">
            <span className="font-sans">量词</span>
            <span className="ml-1.5">(Lượng từ)</span>
          </Label>
          <Input
            id="zh-measureWord"
            value={fields.measureWord}
            onChange={(e) => onChange("measureWord", e.target.value)}
            placeholder="Ví dụ: 本 (cuốn sách)"
            className="font-sans"
            lang="zh"
          />
        </div>
      )}

      {/* Grammar note — conditional */}
      {isGrammar && (
        <div className="space-y-1.5">
          <Label htmlFor="zh-grammarNote">Ghi chú ngữ pháp</Label>
          <Input
            id="zh-grammarNote"
            value={fields.grammarNote}
            onChange={(e) => onChange("grammarNote", e.target.value)}
            placeholder="Mô tả điểm ngữ pháp..."
          />
        </div>
      )}
    </div>
  );
}
