"use client";

import * as React from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { QuestionTag, QuestionSource } from "../types/question-bank.types";

// ─── Source type labels ───────────────────────────────────────────────────────
const SOURCE_TYPE_LABEL: Record<QuestionSource["type"], string> = {
  licensed: "Bản quyền",
  original: "Gốc",
  adapted:  "Phóng tác",
};

// ─── Props ────────────────────────────────────────────────────────────────────
export interface TagSourceManagerProps {
  tags: QuestionTag[];
  sources: QuestionSource[];
  onTagsChange?: (tags: QuestionTag[]) => void;
  onSourcesChange?: (sources: QuestionSource[]) => void;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function TagSourceManager({
  tags,
  sources,
  onTagsChange,
  onSourcesChange,
  className,
}: TagSourceManagerProps) {
  const [localTags, setLocalTags] = React.useState<QuestionTag[]>(tags);
  const [localSources] = React.useState<QuestionSource[]>(sources);
  const [newTagInput, setNewTagInput] = React.useState("");

  function applyTagChange(next: QuestionTag[]) {
    setLocalTags(next);
    if (typeof onTagsChange === "function") {
      onTagsChange(next);
    }
  }

  function addTag() {
    const label = newTagInput.trim();
    if (!label) return;
    const next: QuestionTag[] = [
      ...localTags,
      { id: `tg-${Date.now()}`, label, usage: 0 },
    ];
    applyTagChange(next);
    setNewTagInput("");
  }

  function deleteTag(id: string) {
    applyTagChange(localTags.filter((t) => t.id !== id));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }

  // onSourcesChange is wired up for future use — currently sources are read-only
  void onSourcesChange;

  return (
    <div className={cn("grid grid-cols-1 gap-6 md:grid-cols-2", className)}>
      {/* Tags card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Add-new row */}
          <div className="flex gap-2">
            <Input
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Nhãn mới…"
              className="h-8 text-sm"
            />
            <Button size="sm" onClick={addTag}>
              Thêm
            </Button>
          </div>

          {/* Tag list */}
          {localTags.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có tag.</p>
          ) : (
            <div className="space-y-1.5">
              {localTags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-2 rounded-md border border-border px-3 py-2"
                >
                  <Badge variant="secondary" className="shrink-0">
                    {tag.label}
                  </Badge>
                  <span className="flex-1 text-xs text-muted-foreground">
                    ({tag.usage})
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Xóa tag ${tag.label}`}
                    onClick={() => deleteTag(tag.id)}
                    className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sources card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm font-semibold">Nguồn nội dung</CardTitle>
            <Button
              size="sm"
              disabled
              aria-label="Thêm nguồn (chưa hỗ trợ)"
            >
              <Plus className="mr-1.5 size-3.5" aria-hidden />
              Thêm nguồn
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {localSources.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có nguồn nội dung.</p>
          ) : (
            localSources.map((source) => (
              <div
                key={source.id}
                className="rounded-md border border-border px-3 py-2"
              >
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold">{source.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {SOURCE_TYPE_LABEL[source.type]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{source.ref}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
