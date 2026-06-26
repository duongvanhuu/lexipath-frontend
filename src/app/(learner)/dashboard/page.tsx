import * as React from "react";
import type { Metadata } from "next";

import { HomeHero } from "@/features/learner-home/components/home-hero";
import { HomeJourneyRail } from "@/features/learner-home/components/home-journey-rail";
import { HomeGoldenSummary } from "@/features/learner-home/components/home-golden-summary";
import { HomeSkillLanes } from "@/features/learner-home/components/home-skill-lanes";
import { HomeCollectionCard } from "@/features/learner-home/components/home-collection-card";
import { HomeWeeklyActivity } from "@/features/learner-home/components/home-weekly-activity";
import {
  MOCK_HOME_COLLECTION,
  MOCK_HOME_GOLDEN,
  MOCK_HOME_HERO,
  MOCK_HOME_JOURNEY,
  MOCK_HOME_SKILLS,
  MOCK_HOME_WEEK,
} from "@/features/learner-home";

export const metadata: Metadata = {
  title: "Trang chủ",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* 1. Hero: Greeting card + context-aware primary CTA */}
      <HomeHero {...MOCK_HOME_HERO} />

      {/* 2. Today Path — 4-node journey rail */}
      <HomeJourneyRail {...MOCK_HOME_JOURNEY} />

      {/* 3. Two-col: Golden Time summary (info) + Skill lanes */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[5fr_6fr]">
        <HomeGoldenSummary {...MOCK_HOME_GOLDEN} />
        <HomeSkillLanes skills={MOCK_HOME_SKILLS} />
      </div>

      {/* 4. Current collection */}
      <HomeCollectionCard collection={MOCK_HOME_COLLECTION} />

      {/* 5. Weekly activity — compact, secondary */}
      <HomeWeeklyActivity {...MOCK_HOME_WEEK} />
    </div>
  );
}
