import * as React from "react";
import { Book, Flag, Link, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { LangModuleEn as LangModuleEnData } from "@/features/vocabulary/vocab-detail.types";

/* -------------------------------------------------------------------------- */
/* ModuleCard                                                                  */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* LangModuleEn                                                                */
/* -------------------------------------------------------------------------- */

export type LangModuleEnProps = {
  module: LangModuleEnData;
  /** Called when user taps the dialect audio button. */
  onPlayDialect?: (word: string, ttsLang: string) => void;
};

function LangModuleEn({ module, onPlayDialect }: LangModuleEnProps) {
  const { dialects, collocations, wordFamily } = module;

  return (
    <React.Fragment>
      <ModuleCard icon={<Flag className="size-3.5" />} title="Phát âm theo phương ngữ">
        <div className="flex flex-col gap-2">
          {dialects.map((d) => (
            <div key={d.label} className="flex items-center gap-2.5">
              <span className="text-lg leading-none">{d.flag}</span>
              <span className="min-w-[72px] text-xs text-text-secondary">{d.label}</span>
              <span className="flex-1 text-sm italic text-text-muted">{d.ipa}</span>
              {onPlayDialect ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-text-secondary hover:text-text-primary"
                  onClick={() => onPlayDialect(d.ipa, d.ttsLang)}
                  aria-label={`Nghe phát âm ${d.label}`}
                >
                  <Volume2 className="size-3.5" aria-hidden />
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      </ModuleCard>

      <ModuleCard icon={<Link className="size-3.5" />} title="Collocations thường gặp">
        <div className="flex flex-wrap gap-1.5">
          {collocations.map((c) => (
            <span
              key={c}
              className="rounded-lg bg-primary-soft px-3 py-1 text-sm font-medium text-primary-soft-foreground"
            >
              {c}
            </span>
          ))}
        </div>
      </ModuleCard>

      <ModuleCard icon={<Book className="size-3.5" />} title="Word family">
        <div className="divide-y divide-border">
          {wordFamily.map((wf) => (
            <div key={wf.word} className="flex items-baseline gap-2.5 py-2">
              <span className="min-w-[80px] shrink-0 text-xs font-semibold text-text-muted">
                {wf.pos}
              </span>
              <span className="text-[15px] font-semibold text-text-primary">
                {wf.word}
              </span>
            </div>
          ))}
        </div>
      </ModuleCard>
    </React.Fragment>
  );
}

export { LangModuleEn };
