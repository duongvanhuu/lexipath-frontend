"use client";

import * as React from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils/cn";

import type { ExamTest, ExamSection } from "./types";

export interface TestBuilderCanvasProps {
  test: Partial<ExamTest>;
  sections: ExamSection[];
  onUpdateTest: (patch: Partial<ExamTest>) => void;
  onUpdateSections: (sections: ExamSection[]) => void;
  /** Pass <ExamSectionPartBuilder /> here to avoid circular imports. */
  sectionBuilder?: React.ReactNode;
  className?: string;
}

function SettingsTab({
  test,
  onUpdateTest,
}: {
  test: Partial<ExamTest>;
  onUpdateTest: (patch: Partial<ExamTest>) => void;
}) {
  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="test-title">Tên đề thi</Label>
        <Input
          id="test-title"
          value={test.title ?? ""}
          onChange={(e) => onUpdateTest({ title: e.target.value })}
          placeholder="Nhập tên đề thi..."
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="test-duration">Thời gian làm bài (phút)</Label>
        <Input
          id="test-duration"
          type="number"
          min={1}
          value={test.durationMinutes ?? ""}
          onChange={(e) => {
            const patch: Partial<ExamTest> = {};
            if (e.target.value) {
              patch.durationMinutes = parseInt(e.target.value, 10);
            }
            onUpdateTest(patch);
          }}
          placeholder="Ví dụ: 90"
          className="w-32"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="test-status">Trạng thái</Label>
        <Input
          id="test-status"
          value={test.status ?? ""}
          onChange={(e) => onUpdateTest({ status: e.target.value })}
          placeholder="draft / published..."
          className="w-48"
        />
      </div>
    </div>
  );
}

function TestBuilderCanvas({
  test,
  sections,
  onUpdateTest,
  onUpdateSections,
  sectionBuilder,
  className,
}: TestBuilderCanvasProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>
          {test.title ? test.title : "Đề thi mới"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="structure">
          <TabsList>
            <TabsTrigger value="structure">Cấu trúc</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="pt-3">
            {sectionBuilder ?? (
              <p className="py-4 text-sm text-muted-foreground">
                Truyền <code>sectionBuilder</code> prop để hiển thị trình xây
                dựng cấu trúc.
              </p>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab test={test} onUpdateTest={onUpdateTest} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export { TestBuilderCanvas };
