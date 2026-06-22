export { LexiCard, type LexiCardProps } from "./lexi-card";
export { MetricCard, type MetricCardProps, type MetricTrend } from "./metric-card";
export {
  InteractiveCard,
  type InteractiveCardProps,
} from "./interactive-card";
export { InsightCard, type InsightCardProps } from "./insight-card";
export { cardToneVariants, type LexiCardTone } from "./card-variants";

// Re-export the shadcn Card structural parts for composing inside LexiCard.
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
