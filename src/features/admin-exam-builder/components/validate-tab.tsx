import { AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { ExamTest, TestSection, ValidationError } from "../types/exam-builder.types";

interface ValidateTabProps {
  test: ExamTest;
  structure: TestSection[];
  errors: ValidationError[];
}

export function ValidateTab({ test, structure, errors }: ValidateTabProps) {
  const totalQ = structure.reduce(
    (a, s) => a + s.parts.reduce((b, p) => b + p.questionIds.length, 0),
    0,
  );
  const dSum = structure.reduce((a, s) => a + (s.durationMin ?? 0), 0);
  const qMatch = !test.questionTotal || totalQ === test.questionTotal;
  const dMatch = dSum === test.durationMin;

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">
          Kết quả kiểm tra
        </p>
        <span className="text-xs text-text-muted">{totalQ} câu · {dSum} phút</span>
      </div>

      {errors.length === 0 ? (
        <div className="flex items-center gap-2.5 rounded-xl bg-success-soft px-4 py-3.5 font-semibold text-success-foreground">
          <CheckCircle className="size-5 shrink-0" aria-hidden />
          Đề thi hợp lệ — sẵn sàng xuất bản.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {errors.map((e, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-2.5 rounded-xl border px-3.5 py-2.5",
                e.sev === "error"
                  ? "border-danger bg-danger-soft"
                  : "border-warning bg-warning-soft",
              )}
            >
              {e.sev === "error" ? (
                <XCircle className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
              ) : (
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-foreground" aria-hidden />
              )}
              <span className="text-sm leading-relaxed text-text-secondary">{e.msg}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border p-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-text-muted">
            Số câu hỏi
          </p>
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-2xl font-extrabold",
              qMatch ? "text-success-foreground" : "text-danger",
            )}>
              {totalQ}
            </span>
            {test.questionTotal ? (
              <span className="text-sm text-text-muted">/ {test.questionTotal} mục tiêu</span>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-border p-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-text-muted">
            Thời lượng
          </p>
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-2xl font-extrabold",
              dMatch ? "text-success-foreground" : "text-warning-foreground",
            )}>
              {dSum}
            </span>
            <span className="text-sm text-text-muted">/ {test.durationMin} phút khai báo</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
