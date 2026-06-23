import * as React from "react";
import { GitBranch, Layers } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { LangModuleJa as LangModuleJaData } from "@/features/vocabulary/vocab-detail.types";

/* -------------------------------------------------------------------------- */
/* Section card wrapper                                                        */
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
/* LangModuleJa                                                                */
/* -------------------------------------------------------------------------- */

export type LangModuleJaProps = {
  module: LangModuleJaData;
};

function LangModuleJa({ module }: LangModuleJaProps) {
  const { kanji, verbForms } = module;

  return (
    <React.Fragment>
      {kanji.length > 0 && (
        <ModuleCard icon={<Layers className="size-3.5" />} title="Chi tiết Kanji">
          <div className="mb-3 grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-2.5">
            {kanji.map((k) => (
              <div
                key={k.char}
                className="flex flex-col items-center rounded-xl border border-border bg-surface-muted px-2 py-3 text-center"
              >
                <span className="text-[30px] font-bold leading-none text-text-primary">
                  {k.char}
                </span>
                <span className="mt-1 text-[11px] text-primary">{k.reading}</span>
                <span className="mt-0.5 text-[10.5px] text-text-muted">{k.meaning}</span>
              </div>
            ))}
          </div>
          {kanji.length > 0 && (
            <div className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Furigana:</span>{" "}
              <span className="text-base font-medium">
                {kanji.map((k) => k.char).join("")}【{kanji.map((k) => k.reading).join("")}】
              </span>
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {kanji.map((k) => (
              <React.Fragment key={k.char + "-detail"}>
                {k.on && (
                  <span className="rounded-md bg-surface-muted px-2 py-0.5 text-xs text-text-secondary">
                    音: <strong className="text-text-primary">{k.on}</strong>
                  </span>
                )}
                {k.kun && (
                  <span className="rounded-md bg-surface-muted px-2 py-0.5 text-xs text-text-secondary">
                    訓: <strong className="text-text-primary">{k.kun}</strong>
                  </span>
                )}
                {k.jlpt && (
                  <span className="rounded-md bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary-soft-foreground">
                    {k.jlpt}
                  </span>
                )}
                {k.strokes !== undefined && (
                  <span className="rounded-md bg-surface-muted px-2 py-0.5 text-xs text-text-muted">
                    {k.strokes} nét
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </ModuleCard>
      )}

      {verbForms && verbForms.length > 0 && (
        <ModuleCard icon={<GitBranch className="size-3.5" />} title="Biến thể động từ">
          <div className="divide-y divide-border">
            {verbForms.map((f) => (
              <div key={f.label} className="flex items-baseline gap-2.5 py-2">
                <span className="min-w-[120px] shrink-0 text-xs font-medium text-text-muted">
                  {f.label}
                </span>
                <span className="text-[17px] font-semibold text-text-primary">
                  {f.value}
                </span>
              </div>
            ))}
          </div>
        </ModuleCard>
      )}
    </React.Fragment>
  );
}

export { LangModuleJa };
