import type { Metadata } from "next";
import { SCORING_MOCK } from "@/features/admin-exam-scoring";
import { ScoringClient } from "@/features/admin-exam-scoring";

export const metadata: Metadata = { title: "Thang điểm & Rubric" };

export default function AdminScoringPage() {
  return <ScoringClient mock={SCORING_MOCK} />;
}
