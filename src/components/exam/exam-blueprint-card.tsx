"use client";

import * as React from "react";
import { Clock, FileText, Layers } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";

import type { ExamBlueprint } from "./types";

export interface ExamBlueprintCardProps {
  blueprint: ExamBlueprint;
  onEdit?: (id: string) => void;
  onUse?: (id: string) => void;
  className?: string;
}

function ExamBlueprintCard({
  blueprint,
  onEdit,
  onUse,
  className,
}: ExamBlueprintCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <div className="flex items-start gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Layers className="size-4" aria-hidden />
          </span>
          <div className="flex flex-col gap-0.5">
            <CardTitle>{blueprint.title}</CardTitle>
            {blueprint.description ? (
              <CardDescription className="line-clamp-2">
                {blueprint.description}
              </CardDescription>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
          {blueprint.totalQuestions !== undefined ? (
            <span className="flex items-center gap-1">
              <FileText className="size-3.5" aria-hidden />
              {blueprint.totalQuestions} câu hỏi
            </span>
          ) : null}
          {blueprint.totalDurationMinutes !== undefined ? (
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden />
              {blueprint.totalDurationMinutes} phút
            </span>
          ) : null}
        </div>
      </CardHeader>

      {blueprint.sections.length > 0 ? (
        <>
          <Separator />
          <CardContent className="pt-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Các phần thi
            </p>
            <ul className="flex flex-col gap-2">
              {blueprint.sections.map((section) => (
                <li
                  key={section.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-foreground">{section.title}</span>
                  <div className="flex items-center gap-2">
                    {section.timeLimit ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" aria-hidden />
                        {section.timeLimit}m
                      </span>
                    ) : null}
                    {section.questionCount !== undefined ? (
                      <Badge variant="secondary" className="text-[10px]">
                        {section.questionCount} câu
                      </Badge>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </>
      ) : null}

      <CardFooter className="mt-auto gap-2">
        {onEdit ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(blueprint.id)}
          >
            Chỉnh sửa
          </Button>
        ) : null}
        {onUse ? (
          <Button size="sm" onClick={() => onUse(blueprint.id)}>
            Dùng blueprint
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}

export { ExamBlueprintCard };
