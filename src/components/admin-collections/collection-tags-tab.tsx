"use client";

import * as React from "react";
import { Plus, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CollectionFormRow } from "./collection-form-row";
import { TAGS_POOL } from "@/features/admin-collections/types";
import { cn } from "@/lib/utils/cn";

export interface CollectionTagsTabProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function CollectionTagsTab({ tags, onChange }: CollectionTagsTabProps) {
  const [query, setQuery] = React.useState("");

  const suggestions = TAGS_POOL.filter(
    (t) =>
      !tags.includes(t.name) &&
      (!query || t.name.toLowerCase().includes(query.toLowerCase())),
  );

  const addTag = (name: string) => {
    if (!tags.includes(name)) onChange([...tags, name]);
    setQuery("");
  };

  const removeTag = (name: string) => onChange(tags.filter((t) => t !== name));

  const canCreate =
    query.trim().length > 0 &&
    !TAGS_POOL.find((t) => t.name.toLowerCase() === query.toLowerCase()) &&
    !tags.find((t) => t.toLowerCase() === query.toLowerCase());

  return (
    <div className="max-w-2xl space-y-4">
      <Card>
        <CardContent className="pt-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-text-secondary border-b border-border pb-2">
            Tags hiện tại ({tags.length})
          </p>
          {tags.length === 0 ? (
            <p className="py-5 text-center text-sm text-text-muted">Chưa có tag nào.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-text-secondary"
                >
                  {tag}
                  <button
                    type="button"
                    aria-label={`Xóa tag ${tag}`}
                    onClick={() => removeTag(tag)}
                    className="flex items-center text-text-muted hover:text-destructive focus-visible:outline-none"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-text-secondary border-b border-border pb-2">
            Thêm tag
          </p>
          <CollectionFormRow label="Tìm tag">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
              <Input
                value={query}
                placeholder="Tìm tag…"
                className="h-9 pl-8"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </CollectionFormRow>

          <div className="flex flex-wrap gap-2">
            {suggestions.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => addTag(t.name)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1",
                  "text-xs text-text-secondary transition-colors",
                  "hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <Plus className="size-3" />
                {t.name}
              </button>
            ))}

            {canCreate && (
              <button
                type="button"
                onClick={() => addTag(query.trim())}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border border-primary px-3 py-1",
                  "text-xs text-primary transition-colors",
                  "hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <Plus className="size-3" />
                Tạo &ldquo;{query}&rdquo;
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
