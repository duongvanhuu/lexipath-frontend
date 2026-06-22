"use client";

import * as React from "react";
import { Clock, FileText, MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";

import type { ExamTest } from "./types";

export interface ExamTestCardProps {
  test: ExamTest;
  onEdit?: (id: string) => void;
  onPreview?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

function ExamTestCard({
  test,
  onEdit,
  onPreview,
  onDelete,
  className,
}: ExamTestCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2">{test.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="size-7 shrink-0 p-0"
                aria-label="Thao tác đề thi"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onPreview ? (
                <DropdownMenuItem onClick={() => onPreview(test.id)}>
                  <Eye className="size-4" />
                  Xem trước
                </DropdownMenuItem>
              ) : null}
              {onEdit ? (
                <DropdownMenuItem onClick={() => onEdit(test.id)}>
                  <Pencil className="size-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
              ) : null}
              {onDelete ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(test.id)}
                  >
                    <Trash2 className="size-4" />
                    Xóa đề thi
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {test.status ? (
          <Badge variant="outline" className="w-fit">
            {test.status}
          </Badge>
        ) : null}
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
            <>
              <Separator orientation="vertical" className="h-3" />
              <span>{test.sectionCount} phần</span>
            </>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="mt-auto gap-2">
        {onPreview ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreview(test.id)}
          >
            <Eye className="size-3.5" />
            Xem trước
          </Button>
        ) : null}
        {onEdit ? (
          <Button size="sm" onClick={() => onEdit(test.id)}>
            <Pencil className="size-3.5" />
            Chỉnh sửa
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}

export { ExamTestCard };
