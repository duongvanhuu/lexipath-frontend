"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ValidationError } from "../types/blueprints.types";

interface BlueprintValidationTabProps {
  errors: ValidationError[];
  onGoToSection: (sectionId: string) => void;
}

export function BlueprintValidationTab({
  errors,
  onGoToSection,
}: BlueprintValidationTabProps) {
  if (errors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-green-200 bg-green-50 p-10 text-center mt-1">
        <CheckCircle2 className="size-9 text-green-500 mb-3" aria-hidden />
        <p className="font-bold text-green-800 mb-1">Blueprint hợp lệ</p>
        <p className="text-sm text-green-700">
          Không tìm thấy vấn đề nào. Bạn có thể xuất bản blueprint này.
        </p>
      </div>
    );
  }

  const errorCount = errors.filter((e) => e.severity === "error").length;
  const warnCount = errors.filter((e) => e.severity === "warning").length;

  return (
    <div className="mt-1">
      <div className="flex flex-wrap gap-2.5 mb-4">
        {errorCount > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-red-100 bg-red-50">
            <AlertCircle className="size-4 text-red-600" aria-hidden />
            <strong className="text-red-600">{errorCount}</strong>
            <span className="text-sm text-red-600">Lỗi nghiêm trọng</span>
          </div>
        )}
        {warnCount > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-amber-100 bg-amber-50">
            <AlertTriangle className="size-4 text-amber-600" aria-hidden />
            <strong className="text-amber-600">{warnCount}</strong>
            <span className="text-sm text-amber-600">Cảnh báo</span>
          </div>
        )}
      </div>

      <ul role="list" className="space-y-2">
        {errors.map((err, i) => {
          const isError = err.severity === "error";
          return (
            <li
              key={i}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
                isError ? "border-red-100 bg-red-50/50" : "border-amber-100 bg-amber-50/50"
              }`}
            >
              {isError ? (
                <AlertCircle className="size-4 text-red-600 mt-0.5 shrink-0" aria-hidden />
              ) : (
                <AlertTriangle className="size-4 text-amber-600 mt-0.5 shrink-0" aria-hidden />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary font-medium">{err.message}</p>
                <code className="text-[10px] text-text-muted mt-0.5 block">{err.type}</code>
              </div>
              {err.sectionId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onGoToSection(err.sectionId!)}
                  className="shrink-0 h-7 text-xs"
                >
                  Đến phần
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
