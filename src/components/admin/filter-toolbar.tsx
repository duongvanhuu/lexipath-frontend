"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { AdminFilterState, AdminFilterField } from "./types";

export interface FilterToolbarProps {
  filters: AdminFilterState;
  fields: AdminFilterField[];
  onFilterChange: (filters: AdminFilterState) => void;
  onClear?: () => void;
  resultCount?: number;
  className?: string;
}

export function FilterToolbar({
  filters,
  fields,
  onFilterChange,
  onClear,
  resultCount,
  className,
}: FilterToolbarProps) {
  const hasAnyFilter = Object.values(filters).some(
    (v) => v !== undefined && v !== "" && v !== "all",
  );

  function handleFieldChange(fieldId: string, value: string) {
    onFilterChange({ ...filters, [fieldId]: value || undefined });
  }

  return (
    <div className={cn("flex flex-wrap gap-3 items-center", className)}>
      {fields.map((field) => {
        if (field.type === "search") {
          return (
            <div key={field.id} className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                aria-label={field.label}
                placeholder={field.placeholder ?? `Search…`}
                value={filters[field.id] ?? ""}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                className="pl-8 h-9 min-w-[200px]"
              />
            </div>
          );
        }

        if (field.type === "select") {
          return (
            <Select
              key={field.id}
              value={filters[field.id] ?? "all"}
              onValueChange={(value) =>
                handleFieldChange(field.id, value === "all" ? "" : value)
              }
            >
              <SelectTrigger
                aria-label={field.label}
                className="h-9 min-w-[140px]"
              >
                <SelectValue placeholder={field.placeholder ?? field.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {field.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        return null;
      })}

      {onClear && hasAnyFilter && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      )}

      {resultCount !== undefined && (
        <Badge variant="secondary" className="ml-auto">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </Badge>
      )}
    </div>
  );
}
