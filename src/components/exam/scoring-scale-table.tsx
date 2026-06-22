"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

import type { ScoringScale } from "./types";

export interface ScoringScaleTableProps {
  scales: ScoringScale[];
  onChange: (scales: ScoringScale[]) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  className?: string;
}

function ScoringScaleTable({
  scales,
  onChange,
  onAdd,
  onRemove,
  className,
}: ScoringScaleTableProps) {
  function updateScale(id: string, patch: Partial<ScoringScale>) {
    onChange(scales.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nhãn</TableHead>
              <TableHead>Điểm tối thiểu</TableHead>
              <TableHead>Điểm tối đa</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {scales.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-6 text-center text-sm text-muted-foreground"
                >
                  Chưa có thang điểm nào. Nhấn thêm để tạo.
                </TableCell>
              </TableRow>
            ) : (
              scales.map((scale) => (
                <TableRow key={scale.id}>
                  <TableCell>
                    <Input
                      value={scale.label}
                      onChange={(e) =>
                        updateScale(scale.id, { label: e.target.value })
                      }
                      className="h-7 min-w-20 text-sm"
                      aria-label="Nhãn thang điểm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={scale.minScore}
                      onChange={(e) =>
                        updateScale(scale.id, {
                          minScore: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="h-7 w-20 text-sm"
                      aria-label="Điểm tối thiểu"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={scale.maxScore}
                      onChange={(e) =>
                        updateScale(scale.id, {
                          maxScore: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="h-7 w-20 text-sm"
                      aria-label="Điểm tối đa"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={scale.description ?? ""}
                      onChange={(e) => {
                        const description = e.target.value;
                        if (description) {
                          updateScale(scale.id, { description });
                        } else {
                          // Remove the description key entirely when cleared
                          onChange(
                            scales.map((x) => {
                              if (x.id !== scale.id) return x;
                              const { description: _d, ...rest } = x;
                              return rest;
                            })
                          );
                        }
                      }}
                      className="h-7 text-sm"
                      aria-label="Mô tả thang điểm"
                      placeholder="Mô tả mức độ..."
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-7 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemove(scale.id)}
                      aria-label={`Xóa thang điểm ${scale.label}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Button variant="outline" size="sm" onClick={onAdd} className="self-start">
        <Plus className="size-3.5" />
        Thêm thang điểm
      </Button>
    </div>
  );
}

export { ScoringScaleTable };
