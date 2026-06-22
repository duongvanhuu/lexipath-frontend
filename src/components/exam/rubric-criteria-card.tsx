"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";

import type { RubricCriteria, RubricLevel } from "./types";

export interface RubricCriteriaCardProps {
  criteria: RubricCriteria;
  onChange: (criteria: RubricCriteria) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

function LevelRow({
  level,
  onUpdate,
  onRemove,
}: {
  level: RubricLevel;
  onUpdate: (updated: RubricLevel) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto] items-end gap-2">
      <div className="flex flex-col gap-1">
        <Label htmlFor={`level-label-${level.id}`} className="text-xs">
          Nhãn
        </Label>
        <Input
          id={`level-label-${level.id}`}
          value={level.label}
          onChange={(e) => onUpdate({ ...level, label: e.target.value })}
          placeholder="Xuất sắc..."
          className="h-7 w-24 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor={`level-desc-${level.id}`} className="text-xs">
          Mô tả tiêu chí
        </Label>
        <Input
          id={`level-desc-${level.id}`}
          value={level.description ?? ""}
          onChange={(e) => {
            const description = e.target.value;
            if (description) {
              onUpdate({ ...level, description });
            } else {
              const { description: _removed, ...rest } = level;
              onUpdate(rest);
            }
          }}
          placeholder="Mô tả mức độ đạt..."
          className="h-7 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor={`level-pts-${level.id}`} className="text-xs">
          Điểm
        </Label>
        <Input
          id={`level-pts-${level.id}`}
          type="number"
          min={0}
          value={level.points}
          onChange={(e) =>
            onUpdate({ ...level, points: parseFloat(e.target.value) || 0 })
          }
          className="h-7 w-16 text-sm"
        />
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="mt-5 size-7 p-0 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(level.id)}
        aria-label={`Xóa mức ${level.label}`}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}

function RubricCriteriaCard({
  criteria,
  onChange,
  onRemove,
  className,
}: RubricCriteriaCardProps) {
  function updateLevel(updated: RubricLevel) {
    onChange({
      ...criteria,
      levels: criteria.levels.map((l) =>
        l.id === updated.id ? updated : l
      ),
    });
  }

  function removeLevel(id: string) {
    onChange({
      ...criteria,
      levels: criteria.levels.filter((l) => l.id !== id),
    });
  }

  function addLevel() {
    const newLevel: RubricLevel = {
      id: crypto.randomUUID(),
      label: `Mức ${criteria.levels.length + 1}`,
      points: 0,
    };
    onChange({ ...criteria, levels: [...criteria.levels, newLevel] });
  }

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`criteria-title-${criteria.id}`}>
                Tên tiêu chí
              </Label>
              <Input
                id={`criteria-title-${criteria.id}`}
                value={criteria.title}
                onChange={(e) =>
                  onChange({ ...criteria, title: e.target.value })
                }
                placeholder="Tên tiêu chí đánh giá..."
              />
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`criteria-desc-${criteria.id}`}>
                  Mô tả
                </Label>
                <Textarea
                  id={`criteria-desc-${criteria.id}`}
                  value={criteria.description ?? ""}
                  onChange={(e) => {
                    const description = e.target.value;
                    if (description) {
                      onChange({ ...criteria, description });
                    } else {
                      const { description: _removed, ...rest } = criteria;
                      onChange(rest);
                    }
                  }}
                  placeholder="Mô tả tiêu chí..."
                  rows={2}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`criteria-maxpts-${criteria.id}`}>
                  Điểm tối đa
                </Label>
                <Input
                  id={`criteria-maxpts-${criteria.id}`}
                  type="number"
                  min={0}
                  value={criteria.maxPoints}
                  onChange={(e) =>
                    onChange({
                      ...criteria,
                      maxPoints: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-20"
                />
              </div>
            </div>
          </div>
          {onRemove ? (
            <Button
              variant="ghost"
              size="sm"
              className="size-7 shrink-0 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(criteria.id)}
              aria-label={`Xóa tiêu chí ${criteria.title}`}
            >
              <Trash2 className="size-3.5" />
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-3">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Các mức đánh giá
        </p>
        <div className="flex flex-col gap-3">
          {criteria.levels.map((level) => (
            <LevelRow
              key={level.id}
              level={level}
              onUpdate={updateLevel}
              onRemove={removeLevel}
            />
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addLevel}
            className="mt-1 w-full"
          >
            <Plus className="size-3.5" />
            Thêm mức đánh giá
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { RubricCriteriaCard };
