"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { VocabEditorTabId, VocabValidationIssue } from "@/features/admin-vocab/types/vocab-item.types";
import { VOCAB_EDITOR_TABS } from "./vocab-editor-tabs";

type VocabValidationBannerProps = {
  issues: VocabValidationIssue[];
  onSelectTab?: (tab: VocabEditorTabId) => void;
  className?: string;
};

function getTabLabel(tabId: VocabEditorTabId): string {
  const found = VOCAB_EDITOR_TABS.find((t) => t.id === tabId);
  return found !== undefined ? found.label : tabId;
}

export function VocabValidationBanner({ issues, onSelectTab, className }: VocabValidationBannerProps) {
  const [expanded, setExpanded] = useState(false);

  if (issues.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800",
          className,
        )}
      >
        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
        <span>Không có lỗi kiểm tra.</span>
      </div>
    );
  }

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const hasErrors = errors.length > 0;

  const sortedIssues = [...errors, ...warnings];

  return (
    <div
      className={cn(
        "rounded-lg border text-xs",
        hasErrors
          ? "border-destructive/30 bg-destructive/5"
          : "border-amber-200 bg-amber-50",
        className,
      )}
    >
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {hasErrors ? (
          <XCircle className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
        ) : (
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
        )}
        <span
          className={cn(
            "flex-1 font-medium",
            hasErrors ? "text-destructive" : "text-amber-800",
          )}
        >
          {errors.length > 0 && `${errors.length} lỗi`}
          {errors.length > 0 && warnings.length > 0 && " · "}
          {warnings.length > 0 && `${warnings.length} cảnh báo`}
        </span>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
        )}
      </button>

      {expanded && (
        <ul className="border-t px-3 py-2 space-y-1.5">
          {sortedIssues.map((issue, idx) => (
            <li key={idx} className="flex items-start gap-2">
              {issue.severity === "error" ? (
                <XCircle
                  className="h-3.5 w-3.5 shrink-0 mt-0.5 text-destructive"
                  aria-hidden="true"
                />
              ) : (
                <AlertTriangle
                  className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600"
                  aria-hidden="true"
                />
              )}
              <span
                className={
                  issue.severity === "error" ? "text-destructive" : "text-amber-800"
                }
              >
                {onSelectTab !== undefined ? (
                  <button
                    type="button"
                    className="underline underline-offset-2 hover:no-underline mr-1 font-medium"
                    onClick={() => onSelectTab(issue.tab)}
                  >
                    [{getTabLabel(issue.tab)}]
                  </button>
                ) : (
                  <span className="mr-1 font-medium">[{getTabLabel(issue.tab)}]</span>
                )}
                {issue.message}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
