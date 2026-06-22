import * as React from "react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";

import type { CollectionSummary } from "./types";

export type CollectionCardProps = {
  collection: CollectionSummary;
  href?: string;
  className?: string;
};

function CollectionCoverArea({
  coverImageUrl,
  title,
}: {
  coverImageUrl?: string;
  title: string;
}) {
  if (coverImageUrl) {
    return (
      <div className="relative h-36 w-full overflow-hidden">
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-36 w-full items-center justify-center bg-gradient-to-br from-primary-soft to-primary/10"
      aria-hidden
    >
      <BookOpen className="size-10 text-primary/40" />
    </div>
  );
}

function CollectionCardInner({ collection }: { collection: CollectionSummary }) {
  const pct = Math.min(100, Math.max(0, collection.progressPercent));

  return (
    <>
      <CollectionCoverArea
        {...(collection.coverImageUrl !== undefined
          ? { coverImageUrl: collection.coverImageUrl }
          : {})}
        title={collection.title}
      />

      <CardHeader>
        <CardTitle>{collection.title}</CardTitle>
        {collection.description ? (
          <CardDescription className="line-clamp-2">
            {collection.description}
          </CardDescription>
        ) : null}
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{collection.totalItems} từ</span>
          <span>
            {collection.masteredItems}/{collection.totalItems} đã thành thạo
          </span>
        </div>
        <Progress value={pct} aria-label={`Tiến độ ${pct}%`} className="h-1.5" />
        <span className="text-xs font-medium text-primary">{pct}% hoàn thành</span>
      </CardContent>
    </>
  );
}

function CollectionCard({ collection, href, className }: CollectionCardProps) {
  if (href) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <Link href={href as Route} className="flex flex-col">
          <CollectionCardInner collection={collection} />
        </Link>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CollectionCardInner collection={collection} />
    </Card>
  );
}

export { CollectionCard };
