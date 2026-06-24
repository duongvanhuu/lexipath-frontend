"use client";

import { cn } from "@/lib/utils/cn";
import type { VocabEditorTabId, VocabValidationIssue } from "@/features/admin-vocab/types/vocab-item.types";
import { VOCAB_EDITOR_TABS } from "./vocab-editor-tabs";

type VocabEditorTabBarProps = {
  value: VocabEditorTabId;
  issues: VocabValidationIssue[];
  onChange: (tab: VocabEditorTabId) => void;
  className?: string;
};

export function VocabEditorTabBar({ value, issues, onChange, className }: VocabEditorTabBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Editor tabs"
      className={cn(
        "flex overflow-x-auto border-b shrink-0 scrollbar-none",
        className,
      )}
    >
      {VOCAB_EDITOR_TABS.map((tab) => {
        const tabIssues = issues.filter((i) => i.tab === tab.id);
        const hasError = tabIssues.some((i) => i.severity === "error");
        const hasWarning = !hasError && tabIssues.some((i) => i.severity === "warning");
        const isActive = value === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2.5 text-sm transition-colors shrink-0",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              isActive
                ? "border-b-2 border-primary text-foreground font-medium -mb-px"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            {hasError && (
              <>
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0"
                />
                <span className="sr-only">Có lỗi</span>
              </>
            )}
            {hasWarning && (
              <>
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"
                />
                <span className="sr-only">Có cảnh báo</span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
