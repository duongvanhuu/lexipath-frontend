import * as React from "react";
import { Lock } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { CollectionRoadmapNode } from "@/features/collections/types/collection-list.types";

export type CollectionMiniRoadmapProps = {
  nodes: CollectionRoadmapNode[];
  maxVisible?: number;
  className?: string;
};

function getRoadmapSlice(nodes: CollectionRoadmapNode[], n: number): CollectionRoadmapNode[] {
  if (nodes.length === 0) return [];
  const currentIdx = nodes.findIndex((node) => node.state === "current");
  const pivot = currentIdx === -1 ? 0 : currentIdx;
  const start = Math.max(0, Math.min(pivot - 2, nodes.length - n));
  return nodes.slice(start, start + n);
}

function RoadmapNode({ node }: { node: CollectionRoadmapNode }) {
  const { state } = node;

  return (
    <div
      className={cn(
        "relative flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
        state === "completed" && "bg-primary text-primary-foreground",
        state === "current" &&
          "bg-primary text-primary-foreground shadow-[0_0_0_4px_oklch(from_var(--primary)_l_c_h_/_0.2)]",
        state === "available" &&
          "border-2 border-primary bg-card text-primary",
        state === "locked" &&
          "border border-border bg-surface-muted text-text-muted"
      )}
      role="listitem"
      aria-label={
        node.title +
        " — " +
        (state === "completed"
          ? "Hoàn thành"
          : state === "current"
          ? "Đang học"
          : state === "available"
          ? "Sẵn sàng"
          : "Bị khóa")
      }
    >
      {state === "completed" && "✓"}
      {state === "current" && "●"}
      {state === "available" && ""}
      {state === "locked" && <Lock className="size-3" aria-hidden />}
    </div>
  );
}

function RoadmapRail({
  prev,
  next,
}: {
  prev: CollectionRoadmapNode;
  next: CollectionRoadmapNode;
}) {
  const isFilled =
    prev.state === "completed" &&
    (next.state === "completed" || next.state === "current");
  const isDashed = next.state === "locked" || next.state === "available";

  if (isFilled) {
    return <div className="h-0.5 min-w-3 flex-1 max-w-12 bg-primary" aria-hidden />;
  }
  if (isDashed) {
    return (
      <div
        className="h-0.5 min-w-3 flex-1 max-w-12"
        style={{
          background:
            "repeating-linear-gradient(90deg,var(--border) 0,var(--border) 4px,transparent 4px,transparent 8px)",
        }}
        aria-hidden
      />
    );
  }
  return <div className="h-0.5 min-w-3 flex-1 max-w-12 bg-border" aria-hidden />;
}

function CollectionMiniRoadmap({
  nodes,
  maxVisible = 5,
  className,
}: CollectionMiniRoadmapProps) {
  const slice = getRoadmapSlice(nodes, maxVisible);
  if (slice.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {/* Node + rail row */}
      <div
        className="flex items-center"
        role="list"
        aria-label="Lộ trình bài học"
      >
        {slice.map((node, i) => (
          <React.Fragment key={node.id}>
            {i > 0 && <RoadmapRail prev={slice[i - 1]!} next={node} />}
            <RoadmapNode node={node} />
          </React.Fragment>
        ))}
      </div>

      {/* Label row */}
      <div className="flex items-start">
        {slice.map((node, i) => (
          <React.Fragment key={`lbl-${node.id}`}>
            {i > 0 && <div className="min-w-3 flex-1 max-w-12" aria-hidden />}
            <div
              className={cn(
                "w-7 overflow-hidden text-center text-[10px] leading-tight",
                node.state === "current" && "font-bold text-primary",
                node.state === "locked" && "text-text-muted",
                (node.state === "completed" || node.state === "available") &&
                  "text-text-secondary"
              )}
            >
              {node.title.length > 5 ? node.title.slice(0, 4) + "…" : node.title}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export { CollectionMiniRoadmap };
