"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";
import type {
  VocabItemType,
  VocabJapaneseFields,
  VocabValidationIssue,
} from "@/features/admin-vocab/types/vocab-item.types";

type VocabJaSectionProps = {
  fields: VocabJapaneseFields;
  itemType: VocabItemType;
  issues: VocabValidationIssue[];
  onChange: <K extends keyof VocabJapaneseFields>(key: K, value: VocabJapaneseFields[K]) => void;
  className?: string;
};

function readingError(issues: VocabValidationIssue[]): string | undefined {
  return issues.find(
    (i) =>
      i.tab === "basic" &&
      i.severity === "error" &&
      (i.message.includes("hiragana") || i.message.includes("romaji")),
  )?.message;
}

export function VocabJaSection({
  fields,
  itemType,
  issues,
  onChange,
  className,
}: VocabJaSectionProps) {
  const isKanji = itemType === "kanji";
  const isGrammar = itemType === "grammar";
  const readingErr = isKanji ? readingError(issues) : undefined;

  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="shrink-0 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          日本語
        </span>
        <Separator className="flex-1" />
      </div>

      {/* Kanji + Hiragana */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ja-kanji">
            <span className="font-sans">漢字</span>
            <span className="ml-1.5">(Kanji)</span>
            <span className="ml-1 text-xs font-normal text-muted-foreground">(tùy chọn)</span>
          </Label>
          <Input
            id="ja-kanji"
            value={fields.kanji}
            onChange={(e) => onChange("kanji", e.target.value)}
            placeholder="食べる"
            className="font-sans"
            lang="ja"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ja-hiragana">
            <span className="font-sans">ひらがな</span>
            <span className="ml-1.5">(Hiragana)</span>
            {isKanji && <span aria-hidden="true" className="ml-1 text-destructive">*</span>}
          </Label>
          <Input
            id="ja-hiragana"
            value={fields.hiragana}
            onChange={(e) => onChange("hiragana", e.target.value)}
            placeholder="たべる"
            aria-invalid={readingErr !== undefined}
            className={cn("font-sans", readingErr !== undefined && "border-destructive")}
            lang="ja"
          />
        </div>
      </div>

      {/* Katakana + Romaji */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ja-katakana">
            <span className="font-sans">カタカナ</span>
            <span className="ml-1.5">(Katakana)</span>
            <span className="ml-1 text-xs font-normal text-muted-foreground">(tùy chọn)</span>
          </Label>
          <Input
            id="ja-katakana"
            value={fields.katakana}
            onChange={(e) => onChange("katakana", e.target.value)}
            placeholder="タベル"
            className="font-sans"
            lang="ja"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ja-romaji">
            Romaji {isKanji && <span aria-hidden="true" className="text-destructive">*</span>}
          </Label>
          <Input
            id="ja-romaji"
            value={fields.romaji}
            onChange={(e) => onChange("romaji", e.target.value)}
            placeholder="taberu"
            aria-invalid={readingErr !== undefined && fields.hiragana === ""}
          />
        </div>
      </div>

      {/* Reading error */}
      {readingErr !== undefined && (
        <p role="alert" className="text-xs text-destructive">
          {readingErr}
        </p>
      )}

      {/* Pitch accent */}
      <div className="space-y-1.5">
        <Label htmlFor="ja-pitchAccent">
          Cao độ (Pitch accent)
          <span className="ml-1 text-xs font-normal text-muted-foreground">(tùy chọn)</span>
        </Label>
        <Input
          id="ja-pitchAccent"
          value={fields.pitchAccent}
          onChange={(e) => onChange("pitchAccent", e.target.value)}
          placeholder="Ví dụ: 0 (heiban), 1 (atamadaka)..."
        />
      </div>

      {/* Grammar point — conditional */}
      {isGrammar && (
        <div className="space-y-1.5">
          <Label htmlFor="ja-grammarPoint">Điểm ngữ pháp</Label>
          <Input
            id="ja-grammarPoint"
            value={fields.grammarPoint}
            onChange={(e) => onChange("grammarPoint", e.target.value)}
            placeholder="Ví dụ: 〜ている (trạng thái đang diễn ra)"
            lang="ja"
          />
        </div>
      )}
    </div>
  );
}
