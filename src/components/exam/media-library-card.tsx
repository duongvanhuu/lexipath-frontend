"use client";

import * as React from "react";
import {
  Music,
  Image as ImageIcon,
  Video,
  FileText,
  Trash2,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

import type { MediaItem } from "./types";

export interface MediaLibraryCardProps {
  item: MediaItem;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  selected?: boolean;
  className?: string;
}

const MEDIA_ICONS: Record<MediaItem["type"], React.ElementType> = {
  audio: Music,
  image: ImageIcon,
  video: Video,
  document: FileText,
};

const MEDIA_LABELS: Record<MediaItem["type"], string> = {
  audio: "Âm thanh",
  image: "Hình ảnh",
  video: "Video",
  document: "Tài liệu",
};

const MEDIA_ICON_CLASSES: Record<MediaItem["type"], string> = {
  audio: "bg-primary/10 text-primary",
  image: "bg-success-soft text-success-foreground",
  video: "bg-warning-soft text-warning-foreground",
  document: "bg-muted text-muted-foreground",
};

function MediaLibraryCard({
  item,
  onSelect,
  onDelete,
  selected,
  className,
}: MediaLibraryCardProps) {
  const Icon = MEDIA_ICONS[item.type];

  return (
    <Card
      className={cn(
        "relative cursor-default transition-all",
        selected && "ring-2 ring-primary ring-offset-2",
        onSelect && "cursor-pointer hover:ring-1 hover:ring-primary/50",
        className
      )}
      onClick={onSelect ? () => onSelect(item.id) : undefined}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(item.id);
              }
            }
          : undefined
      }
      aria-pressed={onSelect ? selected : undefined}
    >
      <CardContent className="flex items-center gap-3 py-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            MEDIA_ICON_CLASSES[item.type]
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="truncate text-sm font-medium">
            {item.title ?? "Không có tên"}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px]">
              {MEDIA_LABELS[item.type]}
            </Badge>
            {item.sizeLabel ? (
              <span className="text-xs text-muted-foreground">
                {item.sizeLabel}
              </span>
            ) : null}
            {item.uploadedAtLabel ? (
              <span className="text-xs text-muted-foreground">
                {item.uploadedAtLabel}
              </span>
            ) : null}
          </div>
        </div>

        {onDelete ? (
          <Button
            variant="ghost"
            size="sm"
            className="size-7 shrink-0 p-0 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            aria-label={`Xóa ${item.title ?? "file"}`}
          >
            <Trash2 className="size-3.5" />
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { MediaLibraryCard };
