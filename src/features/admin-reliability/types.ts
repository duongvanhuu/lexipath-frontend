export type IdempotencyStatus = "completed" | "in_progress" | "failed";
export type OutboxStatus = "published" | "pending" | "failed";
export type IntegrationEventStatus = "processed" | "duplicate";

export interface IdempotencyRecord {
  id: string;
  key: string;
  scope: string;
  operation: string;
  status: IdempotencyStatus;
  created: string;
  expires: string;
  hash: string;
}

export interface OutboxEvent {
  id: string;
  aggregate: string;
  aggregateId: string;
  event: string;
  status: OutboxStatus;
  attempts: number;
  created: string;
  lastError: string | null;
  payload?: string;
}

export interface IntegrationEvent {
  id: string;
  eventId: string;
  source: string;
  event: string;
  consumer: string;
  status: IntegrationEventStatus;
  processedAt: string;
}
