"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { VocabLang } from "@/features/admin-vocab/types/vocab-item.types";

type VocabLangPickerProps = {
  value?: VocabLang | null;
  onSelect: (lang: VocabLang) => void;
  className?: string;
};

type LangConfig = {
  value: VocabLang;
  flag: string;
  name: string;
  code: string;
  description: string;
  features: string[];
};

const LANGS: LangConfig[] = [
  {
    value: "en",
    flag: "🇬🇧",
    name: "Tiếng Anh",
    code: "EN",
    description: "Từ vựng tiếng Anh với IPA, CEFR và ngữ pháp nâng cao.",
    features: [
      "Phiên âm IPA",
      "Cấp độ CEFR (A1–C2)",
      "Collocation & word family",
      "Đồng nghĩa / trái nghĩa",
    ],
  },
  {
    value: "ja",
    flag: "🇯🇵",
    name: "Tiếng Nhật",
    code: "JA",
    description: "Từ vựng tiếng Nhật với kanji, kana, furigana và pitch accent.",
    features: [
      "Kanji + kana",
      "Furigana",
      "Pitch accent",
      "Dạng động từ & điểm ngữ pháp",
    ],
  },
  {
    value: "zh",
    flag: "🇨🇳",
    name: "Tiếng Trung",
    code: "ZH",
    description: "Từ vựng tiếng Trung với chữ giản/phồn thể, pinyin và thanh điệu.",
    features: [
      "Chữ giản thể / phồn thể",
      "Pinyin + thanh điệu",
      "Bộ thủ & số nét",
      "Lượng từ",
    ],
  },
];

export function VocabLangPicker({ value, onSelect, className }: VocabLangPickerProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-3", className)}>
      {LANGS.map((lang) => {
        const isSelected = value === lang.value;
        return (
          <button
            key={lang.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(lang.value)}
            className={cn(
              "flex flex-col gap-3 rounded-xl border bg-card p-5 text-left transition-all",
              "hover:border-primary/60 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isSelected
                ? "border-primary ring-2 ring-primary/30"
                : "border-border",
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-2">
              <span className="text-3xl leading-none" aria-hidden="true">
                {lang.flag}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground">
                  {lang.code}
                </span>
                <span className="text-base font-semibold text-foreground">
                  {lang.name}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground">{lang.description}</p>

            {/* Features */}
            <ul className="flex-1 space-y-1.5">
              {lang.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <span aria-hidden="true" className="mt-0.5 text-primary">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Select button */}
            <Button
              size="sm"
              variant={isSelected ? "default" : "outline"}
              className="mt-1 w-full"
              tabIndex={-1}
              aria-hidden="true"
            >
              {isSelected ? "Đã chọn" : "Chọn"}
            </Button>
          </button>
        );
      })}
    </div>
  );
}
