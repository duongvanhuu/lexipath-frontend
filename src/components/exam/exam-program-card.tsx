"use client";

import * as React from "react";
import { BookOpen } from "lucide-react";

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
import { cn } from "@/lib/utils/cn";

import type { ExamProgram } from "./types";

export interface ExamProgramCardProps {
  program: ExamProgram;
  onManage?: (id: string) => void;
  onViewTests?: (id: string) => void;
  className?: string;
}

function ExamProgramCard({
  program,
  onManage,
  onViewTests,
  className,
}: ExamProgramCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="size-4" aria-hidden />
            </span>
            <CardTitle>{program.title}</CardTitle>
          </div>
          {program.examCount !== undefined ? (
            <Badge variant="secondary" className="shrink-0">
              {program.examCount} đề thi
            </Badge>
          ) : null}
        </div>
        {program.description ? (
          <CardDescription className="line-clamp-2 mt-1">
            {program.description}
          </CardDescription>
        ) : null}
      </CardHeader>

      {program.coverLabel ? (
        <CardContent>
          <span className="text-xs text-muted-foreground">
            {program.coverLabel}
          </span>
        </CardContent>
      ) : null}

      <CardFooter className="mt-auto gap-2">
        {onViewTests ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewTests(program.id)}
          >
            Xem đề thi
          </Button>
        ) : null}
        {onManage ? (
          <Button size="sm" onClick={() => onManage(program.id)}>
            Quản lý
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}

export { ExamProgramCard };
