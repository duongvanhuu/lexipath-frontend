import * as React from "react";
import { Clock, FileText, LayoutList } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";

import type { ExamTest, ExamSection } from "./types";

export interface ExamTestDetailPreviewProps {
  test: ExamTest;
  sections?: ExamSection[];
  className?: string;
}

function ExamTestDetailPreview({
  test,
  sections,
  className,
}: ExamTestDetailPreviewProps) {
  return (
    <Card className={cn("flex flex-col gap-0", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{test.title}</CardTitle>
          {test.status ? (
            <Badge variant="outline" className="shrink-0">
              {test.status}
            </Badge>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
          {test.durationMinutes !== undefined ? (
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden />
              {test.durationMinutes} phút
            </span>
          ) : null}
          {test.questionCount !== undefined ? (
            <span className="flex items-center gap-1">
              <FileText className="size-3.5" aria-hidden />
              {test.questionCount} câu hỏi
            </span>
          ) : null}
          {test.sectionCount !== undefined ? (
            <span className="flex items-center gap-1">
              <LayoutList className="size-3.5" aria-hidden />
              {test.sectionCount} phần
            </span>
          ) : null}
        </div>
      </CardHeader>

      {sections && sections.length > 0 ? (
        <>
          <Separator />
          <CardContent className="pt-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Cấu trúc đề thi
            </p>
            <ol className="flex flex-col gap-3">
              {sections.map((section) => (
                <li key={section.id}>
                  <p className="text-sm font-medium">{section.title}</p>
                  {section.parts.length > 0 ? (
                    <ul className="mt-1.5 flex flex-col gap-1">
                      {section.parts.map((part) => (
                        <li
                          key={part.id}
                          className="flex items-center justify-between text-xs text-muted-foreground"
                        >
                          <span>{part.title}</span>
                          <div className="flex items-center gap-2">
                            {part.questionType ? (
                              <Badge variant="outline" className="text-[10px]">
                                {part.questionType}
                              </Badge>
                            ) : null}
                            <span>{part.questionCount} câu</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ol>
          </CardContent>
        </>
      ) : null}
    </Card>
  );
}

export { ExamTestDetailPreview };
