import * as React from "react";
import { Target, Trophy, Users } from "lucide-react";

import { cn } from "@/lib/utils/cn";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type LearningPromiseData = {
  forWho: string[];
  willLearn: string[];
  willAchieve: string[];
};

export type CollectionLearningPromiseProps = {
  promise: LearningPromiseData;
  className?: string;
};

/* -------------------------------------------------------------------------- */
/* Column config                                                                */
/* -------------------------------------------------------------------------- */

const COLUMNS = [
  {
    key: "forWho" as const,
    Icon: Users,
    bgClass: "bg-primary-soft",
    fgClass: "text-primary",
    title: "Dành cho ai",
  },
  {
    key: "willLearn" as const,
    Icon: Target,
    bgClass: "bg-warning-soft",
    fgClass: "text-warning-foreground",
    title: "Sẽ học được gì",
  },
  {
    key: "willAchieve" as const,
    Icon: Trophy,
    bgClass: "bg-success-soft",
    fgClass: "text-success-foreground",
    title: "Kết quả sau khi hoàn thành",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* CollectionLearningPromise                                                    */
/* -------------------------------------------------------------------------- */

function CollectionLearningPromise({
  promise,
  className,
}: CollectionLearningPromiseProps) {
  return (
    <section
      aria-labelledby="learning-promise-heading"
      className={cn("flex flex-col gap-4", className)}
    >
      <h2
        id="learning-promise-heading"
        className="text-lg font-semibold tracking-tight text-text-primary"
      >
        Bộ học này dành cho bạn
      </h2>

      <div className="rounded-card border border-border bg-card p-5 sm:p-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.key}>
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-lg",
                    col.bgClass,
                    col.fgClass
                  )}
                >
                  <col.Icon className="size-3.5" aria-hidden />
                </span>
                <span className="text-sm font-semibold text-text-primary">
                  {col.title}
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {promise[col.key].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs leading-relaxed text-text-secondary"
                  >
                    <span
                      className="mt-1.5 size-1 shrink-0 rounded-full bg-border"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { CollectionLearningPromise };
