import * as React from "react";
import { AlarmClock, ChevronRight, Lock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

import {
  LANG_META,
  getPathForLang,
  type OnboardingPathItem,
} from "../constants/onboarding-content";
import type { LanguageCode } from "../types/auth.types";

export type OnboardingLearningPathProps = {
  lang?: LanguageCode;
  goalId?: string;
  className?: string;
};

const STATE_NODE: Record<
  OnboardingPathItem["state"],
  { dot: string; icon?: React.ReactNode }
> = {
  current: {
    dot: "bg-primary text-primary-foreground ring-4 ring-primary/20",
    icon: <span className="block size-1.5 rounded-full bg-current" aria-hidden />,
  },
  available: {
    dot: "border-2 border-primary/60 bg-card text-primary",
    icon: <ChevronRight className="size-3" aria-hidden />,
  },
  due: {
    dot: "bg-golden-soft text-golden-foreground",
    icon: <AlarmClock className="size-3" aria-hidden />,
  },
  locked: {
    dot: "border-2 border-border bg-card text-text-muted",
    icon: <Lock className="size-3" aria-hidden />,
  },
};

/**
 * OnboardingLearningPath — companion panel content showing the learning path
 * the chosen language + goal will place the learner on. Updates live as the
 * user makes selections. Presentational only (Server Component compatible).
 */
function OnboardingLearningPath({
  lang,
  goalId,
  className,
}: OnboardingLearningPathProps) {
  if (!lang) {
    return (
      <Card className={cn("gap-4 p-5 shadow-card", className)}>
        <p className="py-4 text-center text-sm text-text-muted">
          Chọn ngôn ngữ để xem lộ trình gợi ý.
        </p>
      </Card>
    );
  }

  const meta = LANG_META[lang];
  const items = getPathForLang(lang, goalId);

  return (
    <Card className={cn("gap-4 p-5 shadow-card", className)}>
      <div className="flex items-center gap-2">
        <span className="text-base leading-none">{meta.flag}</span>
        <span className="text-[11px] font-bold uppercase tracking-wide text-primary">
          {meta.name} · Lộ trình gợi ý
        </span>
      </div>

      <ol className="flex flex-col">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const stateStyle = STATE_NODE[item.state];
          const railActive =
            item.state === "current" || item.state === "available";

          return (
            <li key={item.id} className="flex gap-2.5">
              <div className="flex shrink-0 flex-col items-center">
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full",
                    stateStyle.dot,
                  )}
                >
                  {stateStyle.icon}
                </span>
                {!isLast ? (
                  <span
                    className={cn(
                      "my-1 min-h-3 w-0.5 flex-1 rounded-full",
                      railActive ? "bg-primary/40" : "bg-border",
                    )}
                  />
                ) : null}
              </div>

              <div
                className={cn(
                  "min-w-0 flex-1 pt-0.5",
                  !isLast && "pb-3",
                )}
              >
                <span
                  className={cn(
                    "block text-sm",
                    item.state === "current"
                      ? "font-semibold text-primary"
                      : item.state === "locked"
                        ? "font-medium text-text-muted"
                        : "font-medium text-text-primary",
                  )}
                >
                  {item.title}
                </span>
                <span className="mt-0.5 block text-xs text-text-muted">
                  {item.desc}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

export { OnboardingLearningPath };
