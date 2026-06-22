/**
 * Marketing feature barrel — public landing components, types, and content.
 * Components are presentational (mostly Server Components); the interactive
 * bits (header sheet nav, FAQ accordion) live behind shadcn/Radix client
 * primitives.
 */

/* Layout / chrome */
export { LexiLogo, type LexiLogoProps } from "./components/lexi-logo";
export { PublicHeader, type PublicHeaderProps } from "./components/public-header";
export { PublicFooter, type PublicFooterProps } from "./components/public-footer";
export {
  MarketingSection,
  type MarketingSectionProps,
  type MarketingSectionTone,
} from "./components/marketing-section";
export {
  MarketingSectionHeader,
  type MarketingSectionHeaderProps,
} from "./components/marketing-section-header";
export {
  MarketingEyebrowBadge,
  type MarketingEyebrowBadgeProps,
} from "./components/marketing-eyebrow-badge";

/* Hero */
export { LandingHero, type LandingHeroProps } from "./components/landing-hero";
export {
  HeroProductMockup,
  type HeroProductMockupProps,
} from "./components/hero-product-mockup";
export {
  FloatingMetricCard,
  type FloatingMetricCardProps,
} from "./components/floating-metric-card";

/* Content cards */
export { ProblemCard, type ProblemCardProps } from "./components/problem-card";
export {
  SolutionStepCard,
  type SolutionStepCardProps,
} from "./components/solution-step-card";
export {
  TrustPillarCard,
  type TrustPillarCardProps,
} from "./components/trust-pillar-card";
export { DiagnosisCard, type DiagnosisCardProps } from "./components/diagnosis-card";
export {
  LanguageSupportCard,
  type LanguageSupportCardProps,
} from "./components/language-support-card";
export {
  ExamQuestionPreviewCard,
  type ExamQuestionPreviewCardProps,
} from "./components/exam-question-preview-card";

/* LexiPath identity — Golden Time & loops */
export {
  GoldenTimeExplainer,
  type GoldenTimeExplainerProps,
} from "./components/golden-time-explainer";
export {
  GoldenTimeQueuePreview,
  type GoldenTimeQueuePreviewProps,
} from "./components/golden-time-queue-preview";
export {
  GoldenTimeReasonCallout,
  type GoldenTimeReasonCalloutProps,
} from "./components/golden-time-reason-callout";
export {
  GoldenTimeWordCard,
  type GoldenTimeWordCardProps,
} from "./components/golden-time-word-card";
export {
  LearningLoopFlow,
  type LearningLoopFlowProps,
} from "./components/learning-loop-flow";
export {
  ExamToSrsFlow,
  type ExamToSrsFlowProps,
} from "./components/exam-to-srs-flow";

/* Pricing & FAQ & CTA */
export {
  PricingPlanCard,
  type PricingPlanCardProps,
} from "./components/pricing-plan-card";
export { FAQAccordion, type FAQAccordionProps } from "./components/faq-accordion";
export { FinalCTABand, type FinalCTABandProps } from "./components/final-cta-band";

/* Types */
export type {
  MarketingSkillTone,
  EyebrowTone,
  MarketingNavItem,
  FooterLink,
  FooterColumn,
  DiagnosisSkill,
  LearningLoopStep,
  ExamToSrsStep,
  GoldenTimeQueueWord,
  LanguageSupport,
  PricingPlan,
  FaqItem,
} from "./types/marketing.types";
