export type SubscriptionPlanStatus = "active" | "draft";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "cancelled"
  | "expired";

export type OrderStatus = "success" | "pending" | "failed" | "refunded";

export type WebhookStatus = "processed" | "received" | "failed";

export type RefundStatus = "processed" | "requested" | "approved" | "rejected";

export interface SubscriptionPlan {
  id: string;
  code: string;
  name: string;
  price: string;
  interval: string;
  status: SubscriptionPlanStatus;
  subscribers: number;
  features: string[];
}

export interface Subscription {
  id: string;
  user: string;
  email: string;
  plan: string;
  tier: string;
  status: SubscriptionStatus;
  started: string;
  renews: string;
  amount: string;
  method: string;
}

export interface Entitlement {
  feature: string;
  source: "plan" | "grant";
  expires: string;
}

export interface PaymentOrder {
  id: string;
  code: string;
  user: string;
  email: string;
  item: string;
  amount: string;
  status: OrderStatus;
  method: string;
  created: string;
}

export interface PaymentTransaction {
  id: string;
  code: string;
  type: string;
  gateway: string;
  gatewayRef: string;
  amount: string;
  status: OrderStatus;
  at: string;
}

export interface WebhookEvent {
  id: string;
  event: string;
  provider: string;
  status: WebhookStatus;
  received: string;
  attempts: number;
  ref: string;
}

export interface RefundRecord {
  id: string;
  code: string;
  user: string;
  email: string;
  order: string;
  amount: string;
  reason: string;
  status: RefundStatus;
  requested: string;
  by: string;
}
