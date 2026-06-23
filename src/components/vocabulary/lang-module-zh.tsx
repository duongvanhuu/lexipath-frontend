import * as React from "react";
import { Music, Shapes, Layers } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { LangModuleZh as LangModuleZhData } from "@/features/vocabulary/vocab-detail.types";

const TONE_STYLES: Record<
  number,
  { bg: string; text: string; label: string }
> = {
  1: { bg: "bg-skill-meaning-soft", text: "text-skill-meaning-foreground", label: "Thanh 1 — ngang" },
  2: { bg: "bg-skill-listening-soft", text: "text-skill-listening-foreground", label: "Thanh 2 — sắc" },
  3: { bg: "bg-warning-soft", text: "text-warning-foreground", label: "Thanh 3 — hỏi" },
  4: { bg: "bg-danger-soft", text: "text-danger-foreground", label: "Thanh 4 — nặng" },
};

function ModuleCard({
  icon,
  title,
  children,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-card border border-border bg-card p-5", className)}>
      <div className="mb-3.5 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-text-muted">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

export type LangModuleZhProps = {
  module: LangModuleZhData;
};

function LangModuleZh({ module }: LangModuleZhProps) {
  const { chars, toneNum, pinyinFull, measureWords } = module;
  const toneStyle = TONE_STYLES[toneNum];

  return (
    <React.Fragment>
      <ModuleCard icon={<Layers className="size-3.5" />} title="Thành phần Hán tự">
        <div className="flex flex-wrap gap-2.5">
          {chars.map((c) => (
            <div
              key={c.char}
              className="flex min-w-[72px] flex-col items-center rounded-xl border border-border bg-surface-muted px-4 py-3 text-center"
            >
              <span className="text-[30px] font-bold leading-none text-text-primary">
                {c.char}
              </span>
              <span className="mt-1.5 text-xs font-medium text-primary">
                {c.pinyin}
              </span>
              <span className="mt-0.5 text-[10.5px] text-text-muted">{c.meaning}</span>
              {c.traditional && c.traditional !== c.char && (
                <span className="mt-1 text-[10px] text-text-muted">
                  繁: {c.traditional}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {chars.map((c) => (
            <React.Fragment key={c.char + "-meta"}>
              {c.hsk !== undefined && (
                <span className="rounded-md bg-success-soft px-2 py-0.5 text-xs font-semibold text-success-foreground">
                  HSK {c.hsk}
                </span>
              )}
              {c.strokes !== undefined && (
                <span className="rounded-md bg-surface-muted px-2 py-0.5 text-xs text-text-muted">
                  {c.strokes} nét
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </ModuleCard>

      <ModuleCard icon={<Music className="size-3.5" />} title="Thanh điệu & Pinyin">
        <div className="flex items-center gap-3 rounded-xl bg-surface-muted px-4 py-3">
          <span className="text-2xl font-bold text-text-primary">{pinyinFull}</span>
          {toneStyle && (
            <span
              className={cn(
                "rounded-pill px-3 py-1 text-xs font-semibold",
                toneStyle.bg,
                toneStyle.text
              )}
            >
              {toneNum}声 · {toneStyle.label}
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-text-secondary">
          <strong className="text-text-primary">Pinyin với dấu:</strong>{" "}
          {pinyinFull}
        </p>
      </ModuleCard>

      {measureWords.length > 0 && (
        <ModuleCard icon={<Shapes className="size-3.5" />} title="Lượng từ phổ biến">
          <div className="flex flex-col gap-2">
            {measureWords.map((mw) => (
              <div
                key={mw.char}
                className="flex items-center gap-3 rounded-xl bg-surface-muted px-3 py-2.5"
              >
                <span className="min-w-[32px] text-2xl font-bold text-text-primary">
                  {mw.char}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary">
                    {mw.char} ({mw.pinyin})
                  </p>
                  <p className="text-xs text-text-muted">{mw.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </ModuleCard>
      )}
    </React.Fragment>
  );
}

export { LangModuleZh };
