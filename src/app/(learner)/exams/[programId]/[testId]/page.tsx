import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EXAM_PROGRAMS, EXAM_TESTS, EXAM_BLUEPRINTS } from "@/features/exam";
import { ExamTestDetailView } from "./exam-test-detail-view";

interface Props {
  params: Promise<{ programId: string; testId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { testId } = await params;
  const test = EXAM_TESTS.find((t) => t.id === testId);
  if (!test) return { title: "Chi tiết đề thi" };
  const program = EXAM_PROGRAMS.find((p) => p.id === test.programId);
  return {
    title: `${test.title} — ${program?.name ?? "Kho đề"}`,
    description: test.desc,
  };
}

export default async function ExamTestDetailPage({ params }: Props) {
  const { programId, testId } = await params;
  const test = EXAM_TESTS.find((t) => t.id === testId && t.programId === programId);
  if (!test) notFound();

  const program = EXAM_PROGRAMS.find((p) => p.id === programId);
  if (!program) notFound();

  const blueprint = EXAM_BLUEPRINTS[testId] ?? null;

  return (
    <ExamTestDetailView test={test} program={program} blueprint={blueprint} />
  );
}
