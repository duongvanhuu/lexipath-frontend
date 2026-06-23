import type { Metadata } from "next";

import { getMockSession } from "@/features/learning/data/session.mock";
import { SessionPlayerClient } from "./session-player-client";

type PageProps = {
  params: Promise<{ sessionId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sessionId } = await params;
  const { meta } = getMockSession(sessionId);
  return {
    title: meta.lessonTitle,
  };
}

export default async function SessionPage({ params }: PageProps) {
  const { sessionId } = await params;
  const { exercises, meta } = getMockSession(sessionId);

  return <SessionPlayerClient exercises={exercises} meta={meta} />;
}
