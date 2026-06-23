import type { Metadata } from "next";

import { getMockGoldenTimeSession } from "@/features/golden-time/session/golden-time-session.mock";
import { GoldenTimeSessionClient } from "./golden-time-session-client";

type PageProps = {
  params: Promise<{ sessionId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sessionId } = await params;
  const { meta } = getMockGoldenTimeSession(sessionId);
  return {
    title: `${meta.lessonTitle} · ${meta.queueCount} từ`,
  };
}

export default async function GoldenTimeSessionPage({ params }: PageProps) {
  const { sessionId } = await params;
  const { exercises, meta } = getMockGoldenTimeSession(sessionId);

  return <GoldenTimeSessionClient exercises={exercises} meta={meta} />;
}
