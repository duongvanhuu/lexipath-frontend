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
  VocabEnglishFields,
  VocabItemType,
  VocabValidationIssue,
} from "@/features/admin-vocab/types/vocab-item.types";
import { VOCAB_CEFR } from "@/features/admin-vocab/types/vocab-item.types";

const REGISTER_OPTIONS = [
  { v: "formal", label: "Trang trọng" },
  { v: "neutral", label: "Trung lập" },
  { v: "informal", label: "Thông thường" },
  { v: "slang", label: "Tiếng lóng" },
  { v: "literary", label: "Văn học" },
  { v: "technical", label: "Kỹ thuật" },
];

type VocabEnSectionProps = {
  fields: VocabEnglishFields;
  itemType: VocabItemType;
  issues: VocabValidationIssue[];
  onChange: <K extends keyof VocabEnglishFields>(key: K, value: VocabEnglishFields[K]) => void;
  className?: string;
};

function ipaError(issues: VocabValidationIssue[]): string | undefined {
  return issues.find(
    (i) => i.tab === "basic" && i.severity === "error" && i.message.includes("IPA"),
  )?.message;
}

function phrasalStructError(issues: VocabValidationIssue[]): string | undefined {
  return issues.find(
    (i) => i.tab === "basic" && i.severity === "error" && i.message.includes("phrasalStruct"),
  )?.message;
}

export function VocabEnSection({
  fields,
  itemType,
  issues,
  onChange,
  className,
}: VocabEnSectionProps) {
  const showPhrasal = itemType === "phrasal-verb";
  const showIdiom = itemType === "idiom";
  const ipaErr = ipaError(issues);
  const phrasalErr = phrasalStructError(issues);

  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="shrink-0 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Tiếng Anh
        </span>
        <Separator className="flex-1" />
      </div>

      {/* IPA */}
      <div className="space-y-1.5">
        <Label htmlFor="en-ipa">
          Phiên âm IPA
          <span className="ml-1 text-xs font-normal text-muted-foreground">(tùy chọn)</span>
        </Label>
        <Input
          id="en-ipa"
          value={fields.ipa}
          onChange={(e) => onChange("ipa", e.target.value)}
          placeholder="/ˌɛf.ɪˈmɛr.əl/"
          aria-invalid={ipaErr !== undefined}
          aria-describedby={ipaErr !== undefined ? "en-ipa-error" : undefined}
          className={cn("font-mono", ipaErr !== undefined && "border-destructive")}
        />
        <p className="text-xs text-muted-foreground">
          Nhập trong dấu gạch chéo, ví dụ <code className="font-mono">/wɜːrd/</code>
        </p>
        {ipaErr !== undefined && (
          <p id="en-ipa-error" role="alert" className="text-xs text-destructive">
            {ipaErr}
          </p>
        )}
      </div>

      {/* CEFR + Register */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="en-cefr">Bậc CEFR</Label>
          <Select value={fields.cefr} onValueChange={(v) => onChange("cefr", v)}>
            <SelectTrigger id="en-cefr">
              <SelectValue placeholder="Chọn bậc..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">— Không chọn —</SelectItem>
              {VOCAB_CEFR.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="en-register">Phong cách ngôn ngữ</Label>
          <Select value={fields.register} onValueChange={(v) => onChange("register", v)}>
            <SelectTrigger id="en-register">
              <SelectValue placeholder="Chọn phong cách..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">— Không chọn —</SelectItem>
              {REGISTER_OPTIONS.map((r) => (
                <SelectItem key={r.v} value={r.v}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Domain */}
      <div className="space-y-1.5">
        <Label htmlFor="en-domain">
          Lĩnh vực / chủ đề
          <span className="ml-1 text-xs font-normal text-muted-foreground">(tùy chọn)</span>
        </Label>
        <Input
          id="en-domain"
          value={fields.domain}
          onChange={(e) => onChange("domain", e.target.value)}
          placeholder="Ví dụ: y học, pháp lý, công nghệ..."
        />
      </div>

      {/* Phrasal verb structure — conditional */}
      {showPhrasal && (
        <div className="space-y-1.5">
          <Label htmlFor="en-phrasalStruct">
            Cấu trúc động từ cụm <span aria-hidden="true" className="text-destructive">*</span>
          </Label>
          <Input
            id="en-phrasalStruct"
            value={fields.phrasalStruct}
            onChange={(e) => onChange("phrasalStruct", e.target.value)}
            placeholder="Ví dụ: give + up"
            aria-invalid={phrasalErr !== undefined}
            aria-describedby={phrasalErr !== undefined ? "en-phrasalStruct-error" : undefined}
            className={cn(phrasalErr !== undefined && "border-destructive")}
          />
          {phrasalErr !== undefined && (
            <p id="en-phrasalStruct-error" role="alert" className="text-xs text-destructive">
              {phrasalErr}
            </p>
          )}
        </div>
      )}

      {/* Idiom note — conditional */}
      {showIdiom && (
        <div className="space-y-1.5">
          <Label htmlFor="en-idiomNote">
            Ghi chú thành ngữ
            <span className="ml-1 text-xs font-normal text-muted-foreground">(tùy chọn)</span>
          </Label>
          <Input
            id="en-idiomNote"
            value={fields.idiomNote}
            onChange={(e) => onChange("idiomNote", e.target.value)}
            placeholder="Giải thích nguồn gốc hoặc ngữ cảnh..."
          />
        </div>
      )}
    </div>
  );
}
