import * as React from "react";

import {
  VocabLearningHeader,
  SkillLaneGroup,
  type SkillLaneData,
} from "@/components/lexipath";
import { cn } from "@/lib/utils/cn";

import { PhoneticAudioRow } from "./phonetic-audio-row";
import { RelatedItemsList } from "./related-items-list";
import { SenseCard } from "./sense-card";
import type { RelatedItem, VocabularyItem, VocabularySense } from "./types";

/* -------------------------------------------------------------------------- */
/* Section                                                                     */
/* -------------------------------------------------------------------------- */

type SectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

function Section({ title, children, className }: SectionProps) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* VocabItemDetailPanel                                                        */
/* -------------------------------------------------------------------------- */

export type VocabItemDetailPanelItem = VocabularyItem & {
  senses: VocabularySense[];
  relatedItems?: RelatedItem[];
};

export type VocabItemDetailPanelProps = {
  item: VocabItemDetailPanelItem;
  onPlayAudio?: () => void;
  skillLanes?: SkillLaneData[];
  className?: string;
};

/**
 * VocabItemDetailPanel — full-detail content panel for a vocabulary word.
 *
 * Stays a Server Component; the client boundary is pushed down to
 * PhoneticAudioRow (which owns audio onClick) and VocabLearningHeader.
 */
function VocabItemDetailPanel({
  item,
  onPlayAudio,
  skillLanes,
  className,
}: VocabItemDetailPanelProps) {
  const { word, partOfSpeech, phoneticText, audioUrl, senses, relatedItems } =
    item;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Phonetics + audio — client boundary here */}
      <PhoneticAudioRow
        {...(phoneticText !== undefined ? { phoneticText } : {})}
        {...(audioUrl !== undefined ? { audioUrl } : {})}
        {...(onPlayAudio !== undefined ? { onPlayAudio } : {})}
      />

      {/* Word header with PoS */}
      <VocabLearningHeader
        word={word}
        {...(partOfSpeech !== undefined ? { partOfSpeech } : {})}
        {...(onPlayAudio !== undefined ? { onPlayAudio } : {})}
      />

      {/* Senses */}
      {senses.length > 0 ? (
        <Section title="Các nghĩa">
          <div className="flex flex-col gap-3">
            {senses.map((sense, idx) => (
              <SenseCard key={sense.id} sense={sense} index={idx} />
            ))}
          </div>
        </Section>
      ) : null}

      {/* Skill lanes */}
      {skillLanes && skillLanes.length > 0 ? (
        <Section title="Kỹ năng">
          <SkillLaneGroup lanes={skillLanes} />
        </Section>
      ) : null}

      {/* Related items */}
      {relatedItems && relatedItems.length > 0 ? (
        <Section title="Từ liên quan">
          <RelatedItemsList items={relatedItems} />
        </Section>
      ) : null}
    </div>
  );
}

export { VocabItemDetailPanel };
