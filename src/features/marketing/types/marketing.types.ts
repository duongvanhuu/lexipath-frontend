import type { ReactNode } from "react";
import type { Route } from "next";

import type { SkillLane } from "@/lib/styles/variants";

/**
 * Marketing / landing UI types. These are presentational view models for the
 * public pages — they are NOT backend DTOs. Pricing is hard-coded content for
 * now; when it moves behind an API, add `features/marketing/api/*` + a mapper
 * (see the migration map note on `PricingPlanCard`).
 */

/** A skill lane reused from the LexiPath identity palette. */
export type MarketingSkillTone = SkillLane;

export type EyebrowTone = "primary" | "golden" | "neutral";

/** Top-nav link on the public header. */
export type MarketingNavItem = {
  id: string;
  label: string;
  href: Route;
};

export type FooterLink = {
  label: string;
  href: Route;
};

export type FooterColumn = {
  heading: string;
  links: FooterLink[];
};

/** A single bar in the {@link DiagnosisCard} skill breakdown. */
export type DiagnosisSkill = {
  label: string;
  /** 0–100. */
  pct: number;
  tone?: MarketingSkillTone;
};

/** A node in {@link LearningLoopFlow}. */
export type LearningLoopStep = {
  label: string;
  icon: ReactNode;
  /** A LexiPath token color, e.g. `var(--primary)` / `var(--golden)`. */
  tone?: "primary" | "golden" | "success" | "spelling";
};

/** A column in {@link ExamToSrsFlow}. */
export type ExamToSrsStep = {
  label: string;
  sub: string;
  icon: ReactNode;
  tone: "primary" | "danger" | "golden" | "success";
};

/** A word chip in the {@link GoldenTimeQueuePreview}. */
export type GoldenTimeQueueWord = {
  word: string;
  meaning?: string;
  skillLabel: string;
  skillTone: MarketingSkillTone;
};

/** A supported target language card. */
export type LanguageSupport = {
  language: string;
  flag?: ReactNode;
  scripts: string[];
  features: string[];
};

export type PricingPlan = {
  name: string;
  /** Display price, e.g. "79.000đ". Ignored when `isFree`. */
  price?: string;
  period?: string;
  features: string[];
  ctaLabel: string;
  ctaHref: Route;
  isPopular?: boolean;
  isFree?: boolean;
};

export type FaqItem = {
  question: string;
  answer: string;
};
