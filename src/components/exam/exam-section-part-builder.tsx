"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";

import type { ExamSection, ExamSectionPart, QuestionType } from "./types";

export interface ExamSectionPartBuilderProps {
  sections: ExamSection[];
  onAddSection: () => void;
  onRemoveSection: (id: string) => void;
  onAddPart: (sectionId: string) => void;
  onRemovePart: (sectionId: string, partId: string) => void;
  onUpdatePart: (sectionId: string, part: ExamSectionPart) => void;
  className?: string;
}

const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: "single_choice", label: "Trắc nghiệm 1 đáp án" },
  { value: "multiple_choice", label: "Trắc nghiệm nhiều đáp án" },
  { value: "fill_blank", label: "Điền vào chỗ trống" },
  { value: "listening", label: "Nghe hiểu" },
  { value: "reading", label: "Đọc hiểu" },
  { value: "writing", label: "Viết" },
  { value: "speaking", label: "Nói" },
];

interface PartRowProps {
  sectionId: string;
  part: ExamSectionPart;
  onUpdate: (sectionId: string, part: ExamSectionPart) => void;
  onRemove: (sectionId: string, partId: string) => void;
}

function PartRow({ sectionId, part, onUpdate, onRemove }: PartRowProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] items-end gap-2 py-2">
      <div className="flex flex-col gap-1">
        <Label htmlFor={`part-title-${part.id}`} className="text-xs">
          Tên phần
        </Label>
        <Input
          id={`part-title-${part.id}`}
          value={part.title}
          onChange={(e) =>
            onUpdate(sectionId, { ...part, title: e.target.value })
          }
          placeholder="Tên phần thi..."
          className="h-8 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor={`part-type-${part.id}`} className="text-xs">
          Loại câu hỏi
        </Label>
        <Select
          value={part.questionType ?? ""}
          onValueChange={(v) =>
            onUpdate(sectionId, { ...part, questionType: v as QuestionType })
          }
        >
          <SelectTrigger
            id={`part-type-${part.id}`}
            className="h-8 text-sm"
            aria-label="Loại câu hỏi"
          >
            <SelectValue placeholder="Loại..." />
          </SelectTrigger>
          <SelectContent>
            {QUESTION_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor={`part-count-${part.id}`} className="text-xs">
          Số câu
        </Label>
        <Input
          id={`part-count-${part.id}`}
          type="number"
          min={0}
          value={part.questionCount}
          onChange={(e) =>
            onUpdate(sectionId, {
              ...part,
              questionCount: Math.max(0, parseInt(e.target.value, 10) || 0),
            })
          }
          className="h-8 w-16 text-sm"
        />
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="mt-5 size-8 shrink-0 p-0 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(sectionId, part.id)}
        aria-label={`Xóa phần ${part.title}`}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}

function ExamSectionPartBuilder({
  sections,
  onAddSection,
  onRemoveSection,
  onAddPart,
  onRemovePart,
  onUpdatePart,
  className,
}: ExamSectionPartBuilderProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {sections.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Chưa có phần thi nào. Thêm phần thi để bắt đầu xây dựng đề.
        </p>
      ) : (
        <Accordion type="multiple" defaultValue={sections.map((s) => s.id)}>
          {sections.map((section) => (
            <AccordionItem key={section.id} value={section.id}>
              <div className="flex items-center gap-2">
                <AccordionTrigger className="flex-1 text-sm font-medium">
                  {section.title || "Phần không tên"}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    ({section.parts.length} phần thi nhỏ)
                  </span>
                </AccordionTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-7 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSection(section.id);
                  }}
                  aria-label={`Xóa phần lớn ${section.title}`}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <AccordionContent>
                <div className="flex flex-col">
                  {section.parts.map((part, idx) => (
                    <React.Fragment key={part.id}>
                      {idx > 0 ? <Separator /> : null}
                      <PartRow
                        sectionId={section.id}
                        part={part}
                        onUpdate={onUpdatePart}
                        onRemove={onRemovePart}
                      />
                    </React.Fragment>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => onAddPart(section.id)}
                  >
                    <Plus className="size-3.5" />
                    Thêm phần nhỏ
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <Button variant="outline" onClick={onAddSection} className="w-full">
        <Plus className="size-4" />
        Thêm phần thi
      </Button>
    </div>
  );
}

export { ExamSectionPartBuilder };
