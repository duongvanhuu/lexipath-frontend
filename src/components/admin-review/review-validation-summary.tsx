import { Check, X, AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { ValidationCheck } from "@/features/admin-review";

interface ReviewValidationSummaryProps {
  checks: ValidationCheck[];
  className?: string;
}

export function ReviewValidationSummary({
  checks,
  className,
}: ReviewValidationSummaryProps) {
  const errors = checks.filter((c) => !c.ok && c.level === "error");
  const warnings = checks.filter((c) => !c.ok && c.level === "warning");

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">Tóm tắt xác thực</CardTitle>
          <div className="flex gap-1.5">
            {errors.length > 0 && (
              <Badge className="bg-danger-soft text-danger-foreground">
                {errors.length} lỗi
              </Badge>
            )}
            {warnings.length > 0 && (
              <Badge className="bg-warning-soft text-warning-foreground">
                {warnings.length} cảnh báo
              </Badge>
            )}
            {errors.length === 0 && warnings.length === 0 && (
              <Badge className="bg-success-soft text-success-foreground">Đạt</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-4">
        {checks.map((check, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span
              className={cn(
                "inline-flex size-[18px] shrink-0 items-center justify-center rounded-full",
                check.ok
                  ? "bg-success-soft text-success-foreground"
                  : check.level === "error"
                    ? "bg-danger-soft text-danger-foreground"
                    : "bg-warning-soft text-warning-foreground",
              )}
            >
              {check.ok ? (
                <Check className="size-2.5" aria-hidden />
              ) : check.level === "error" ? (
                <X className="size-2.5" aria-hidden />
              ) : (
                <AlertTriangle className="size-2.5" aria-hidden />
              )}
            </span>
            <span
              className={cn(
                "flex-1 text-sm",
                check.ok ? "text-text-secondary" : "text-text-primary",
              )}
            >
              {check.label}
            </span>
            {!check.ok && (
              <span
                className={cn(
                  "text-[9px] font-bold uppercase tracking-wide",
                  check.level === "error"
                    ? "text-danger-foreground"
                    : "text-warning-foreground",
                )}
              >
                {check.level === "error" ? "Bắt buộc" : "Khuyến nghị"}
              </span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
