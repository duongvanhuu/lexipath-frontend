export interface PlanFeatureItem {
  label: string;
  included: boolean;
}

export interface Plan {
  id: string;
  name: string;
  priceLabel: string;
  billingCycleLabel?: string;
  description?: string;
  /** Simple included-only list (legacy). Use `featureList` for included+excluded rows. */
  features: string[];
  /** When provided, renders included (✓) and excluded (✗) rows. Takes precedence over `features`. */
  featureList?: PlanFeatureItem[];
  highlighted?: boolean;
  ctaLabel?: string;
  badge?: string;
}

export interface FeatureUsage {
  id: string;
  label: string;
  usedCount: number;
  limitCount: number;
  unit?: string;
  overage?: boolean;
}

export interface PaymentTransaction {
  id: string;
  amountLabel: string;
  status: "paid" | "pending" | "failed" | "refunded";
  description?: string;
  createdAtLabel: string;
  invoiceUrl?: string;
}
