"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Circle,
  Lock,
  Star,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SkillBadge } from "@/components/shared/badges/skill-badge";
import { cn } from "@/lib/utils/cn";

import type { CheckpointState, SkillBranch } from "../types";

/* -------------------------------------------------------------------------- */
/* Word state icon map                                                         */
/* -------------------------------------------------------------------------- */

const STATE_ICONS: Record<CheckpointState, React.ReactElement> = {
  current: <ChevronRight className="size-3.5 shrink-0" aria-hidden />,
  due: <Circle className="size-3.5 shrink-0" aria-hidden />,
  weak: <AlertTriangle className="size-3.5 shrink-0" aria-hidden />,
  premium: <Star className="size-3.5 shrink-0" aria-hidden />,
  completed: <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />,
  locked: <Lock className="size-3.5 shrink-0" aria-hidden />,
  available: <Circle className="size-3.5 shrink-0" aria-hidden />,
};

/* -------------------------------------------------------------------------- */
/* SkillBranchPanel                                                            */
/* -------------------------------------------------------------------------- */

export type SkillBranchPanelProps = {
  branches: SkillBranch[];
  className?: string;
};

/**
 * SkillBranchPanel — collapsible accordion panel for each skill branch,
 * listing words with their checkpoint state icon. Uses shadcn Accordion.
 * "use client" is required for the Accordion interactive collapse/expand state.
 */
function SkillBranchPanel({ branches, className }: SkillBranchPanelProps) {
  return (
    <Accordion
      type="multiple"
      className={cn("flex flex-col gap-1", className)}
    >
      {branches.map((branch) => (
        <AccordionItem
          key={branch.skill}
          value={branch.skill}
          className="rounded-card border border-border bg-card"
        >
          <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
            <div className="flex items-center gap-2">
              <SkillBadge skill={branch.skill} />
              <span className="text-xs text-text-muted">
                {branch.items.length} từ
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3">
            <ol className="flex flex-col gap-1">
              {branch.items.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                    item.state === "completed"
                      ? "text-text-muted"
                      : item.state === "weak"
                        ? "text-danger-foreground"
                        : "text-text-primary"
                  )}
                >
                  <span className="text-text-muted">
                    {STATE_ICONS[item.state]}
                  </span>
                  <span className="font-medium">{item.word}</span>
                </li>
              ))}
            </ol>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export { SkillBranchPanel };
