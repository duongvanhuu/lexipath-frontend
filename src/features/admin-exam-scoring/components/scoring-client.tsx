"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layouts/page-header";
import type { ScoreScale, Rubric, ScoringMock } from "../types/scoring.types";
import { ScoreScaleList } from "./score-scale-list";
import { ScoreScaleDetail } from "./score-scale-detail";
import { RubricList } from "./rubric-list";
import { RubricDetail } from "./rubric-detail";

type ActiveTab = "scales" | "rubrics";

interface ScoringClientProps {
  mock: ScoringMock;
}

export function ScoringClient({ mock }: ScoringClientProps) {
  const [tab, setTab] = React.useState<ActiveTab>("scales");
  const [selectedScale, setSelectedScale] = React.useState<ScoreScale | null>(null);
  const [selectedRubric, setSelectedRubric] = React.useState<Rubric | null>(null);

  if (selectedScale) {
    return (
      <ScoreScaleDetail
        scale={selectedScale}
        initialConversions={mock.conversions[selectedScale.id] ?? []}
        roundingRules={mock.roundingRules}
        programs={mock.programs}
        onBack={() => setSelectedScale(null)}
      />
    );
  }

  if (selectedRubric) {
    return (
      <RubricDetail
        rubric={selectedRubric}
        initialCriteria={mock.rubricCriteria[selectedRubric.id] ?? []}
        programs={mock.programs}
        onBack={() => setSelectedRubric(null)}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Thang điểm & Rubric"
        description="Cấu hình quy đổi điểm tự động và rubric chấm tay."
      />
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as ActiveTab)}
        className="mt-5"
      >
        <TabsList variant="line">
          <TabsTrigger value="scales">Thang điểm</TabsTrigger>
          <TabsTrigger value="rubrics">Rubric</TabsTrigger>
        </TabsList>
        <div className="mt-5">
          <TabsContent value="scales">
            <ScoreScaleList
              scales={mock.scoreScales}
              programs={mock.programs}
              onOpen={setSelectedScale}
            />
          </TabsContent>
          <TabsContent value="rubrics">
            <RubricList
              rubrics={mock.rubrics}
              programs={mock.programs}
              onOpen={setSelectedRubric}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
