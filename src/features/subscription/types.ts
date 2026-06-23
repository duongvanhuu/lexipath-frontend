import type { PaymentStatus } from "@/components/shared/badges/payment-status-badge";

export type SubscriptionPlanId = "free" | "pro";

export interface SubscriptionPlanFeature {
  label: string;
  included: boolean;
}

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  monthly: number;
  yearly: number;
  description: string;
  featureList: SubscriptionPlanFeature[];
  highlighted?: boolean;
}

export type SubscriptionFeatureType = "quota" | "locked" | "available";

export interface SubscriptionFeatureBase {
  id: string;
  label: string;
  icon: string;
  type: SubscriptionFeatureType;
}

export interface SubscriptionFeatureQuota extends SubscriptionFeatureBase {
  type: "quota";
  used: number;
  limit: number;
}

export interface SubscriptionFeatureLocked extends SubscriptionFeatureBase {
  type: "locked";
  lockedNote?: string;
}

export interface SubscriptionFeatureAvailable extends SubscriptionFeatureBase {
  type: "available";
  availNote?: string;
}

export type SubscriptionFeature =
  | SubscriptionFeatureQuota
  | SubscriptionFeatureLocked
  | SubscriptionFeatureAvailable;

export type SubscriptionPaymentStatus = Extract<
  PaymentStatus,
  "success" | "failed" | "pending" | "refunded" | "refund_pending" | "cancelled"
>;

export interface SubscriptionPayment {
  id: string;
  order: string;
  plan: string;
  amount: string;
  provider: string;
  status: SubscriptionPaymentStatus;
  created: string;
}

export interface CurrentSubscription {
  plan: SubscriptionPlanId;
  startDate?: string;
  renewalDate?: string;
  billingLabel?: string;
}
