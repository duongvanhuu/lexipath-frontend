import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EXAM_PROGRAMS } from "@/features/exam";
import { ExamProgramView } from "./exam-program-view";

interface Props {
  params: Promise<{ programId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { programId } = await params;
  const program = EXAM_PROGRAMS.find((p) => p.id === programId);
  if (!program) return { title: "Chương trình thi" };
  return {
    title: `${program.name} — Kho đề`,
    description: program.desc,
  };
}

export default async function ExamProgramPage({ params }: Props) {
  const { programId } = await params;
  const program = EXAM_PROGRAMS.find((p) => p.id === programId);
  if (!program) notFound();

  return <ExamProgramView program={program} />;
}
