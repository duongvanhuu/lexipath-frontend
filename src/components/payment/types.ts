export interface Plan {
  id: string;
  name: string;
  priceLabel: string;
  billingCycleLabel?: string;
  description?: string;
  features: string[];
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
