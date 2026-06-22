import * as React from "react";
import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";
import { buttonToneVariants } from "@/lib/styles/variants";
import { EmptyState } from "@/components/shared/feedback/empty-state";

import type { ContinueLearningData } from "./types";

export type ContinueLearningCardProps = {
  data?: ContinueLearningData;
  className?: string;
};

function ContinueLearningCard({ data, className }: ContinueLearningCardProps) {
  return (
    <Card className={cn("rounded-card shadow-card", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-text-primary">
          Tiếp tục học
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!data ? (
          <EmptyState
            icon={<BookOpen />}
            title="Chưa có bài học nào"
            description="Bắt đầu một bài học để tiếp tục hành trình của bạn."
            align="center"
            className="min-h-0 py-4"
          />
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-text-muted">{data.collectionName}</span>
              <span className="text-base font-semibold text-text-primary">
                {data.lessonTitle}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <Progress
                value={data.progressPercent}
                aria-label={`${data.progressPercent}% hoàn thành`}
                className="h-1.5"
              />
              <span className="text-xs text-text-muted">
                {data.progressPercent}% hoàn thành
              </span>
            </div>
            <Button
              asChild
              size="sm"
              className={cn(buttonToneVariants({ tone: "nextStep" }), "w-full")}
            >
              <a href={data.href}>Tiếp tục</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { ContinueLearningCard };
