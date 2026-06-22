import type { MarketingSkillTone } from "../types/marketing.types";

/**
 * Tailwind class maps for the five skill lanes, used by the marketing skill
 * previews. The keys mirror the `--skill-*` tokens in `globals.css`. Soft chips
 * reuse the canonical `skillBadgeVariants`; these add the solid fill + dot the
 * badge cva does not expose. Literal class strings keep the Tailwind JIT happy.
 */
export const skillFillClass: Record<MarketingSkillTone, string> = {
  meaning: "bg-skill-meaning",
  listening: "bg-skill-listening",
  spelling: "bg-skill-spelling",
  usage: "bg-skill-usage",
  collocation: "bg-skill-collocation",
};
